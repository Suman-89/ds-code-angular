import {
  UserModel,
  SelectedUserModel,
} from './../../../../user-management/_models/user.model';
import { UserService } from 'src/app/core/_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  ContractProductEnum,
  ContractTypeEnum,
  ReviewTaskConstant,
  TaskInfoModel,
  TasksAutoFillTaskInfo,
} from '../../_models';
import { ToastrService } from 'ngx-toastr';
import { NameModel } from 'src/app/core/_models';
import { ProductTypeEnum } from 'src/app/core/_models';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss'],
})
export class SelectUserComponent implements OnInit {
  @Input() taskDetails: TaskInfoModel;
  @Input() opt: number;
  @Input() mentionConfig: any = {};
  @Input() commentList: any = [];
  @Input() reviewTaskConstant;
  @Input() commentSubmitHandler;
  @Input() analysingGrps: NameModel[];
  @Input() levelInfo;
  @Output() emitUser = new EventEmitter<SelectedUserModel>();
  @Output() emitReviewDetail = new EventEmitter<any>();
  @ViewChild('commentBox') commentBox;

  header: string;
  users: UserModel[] = [];
  groups = [];
  selectedEntity;

  userDropdownSettings = {
    singleSelection: true,
    closeDropDownOnSelection: true,
    idField: 'userid',
    textField: 'fullname',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };

  groupDropdownSettings = {
    singleSelection: true,
    closeDropDownOnSelection: false,
    idField: 'variable',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };
  commentBoxOpt = {
    allowFullScreen: false,
    height: 200,
  };

  constructor(
    private activeModal: NgbActiveModal,
    private userSvc: UserService,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.initFn();
  }

  initFn(): void {
    if (this.opt == 1) {
      this.header = 'Assign Task';
      this.taskDetails && this.taskDetails.groupname
        ? this.getUsersByGroupName()
        : this.getUsersFromLoggedUser();
    } else if (this.opt == 2) {
      this.header = 'Re-Assign Task';
      this.getUsersByGroupName();
    } else if (this.opt == 3) {
      this.header = 'Need Feedback from';
      this.analysingGrps
        ? (this.groups = this.analysingGrps)
        : this.getReviewGroup();
    }
  }

  getUsersFromLoggedUser() {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);
    const groupid = user.groupnames.find((u) => u !== 'guest');
    this.userSvc.getUserGroups().subscribe((u) => {
      if (u.status) {
        const grpName = u.data.find((g) => g.id === groupid).name;
        this.userSvc.getGroupUsersByGroup(grpName).subscribe((r) => {
          this.users = r.data.sort((a, b) =>
            a.fullname > b.fullname ? 1 : -1
          );
        });
      }
    });
  }
  getUsers() {
    this.userSvc.getGroupUsers().subscribe((r) => {
      this.users = r.data.sort((a, b) => (a.fullname > b.fullname ? 1 : -1));
    });
  }

  getUsersByGroupName(): void {
    let includedTypes = [
      `${ProductTypeEnum.MOBILE}`,
      `${ProductTypeEnum.IOT}`,
      `${ProductTypeEnum.SMS}`,
    ];
    let grpname =
      this.taskDetails.formKey === 'reviewProductManagement' &&
      includedTypes.includes(this.taskDetails.product)
        ? this.taskDetails.groupname + ' - ' + this.taskDetails.product
        : this.taskDetails.groupname;
    this.userSvc.getGroupUsersByGroup(grpname, true).subscribe((r) => {
      this.users = r.data.sort((a, b) => (a.fullname > b.fullname ? 1 : -1));
    });
  }

  getReviewGroup(): void {
    let arr: any[] = this.reviewTaskConstant;
    if (arr && arr.length > 0) {
      arr =
        this.taskDetails.product !== ContractProductEnum.voice
          ? arr.filter((i) => i?.variable !== 'reviewWithCommercialOps')
          : arr;
      // arr =
      //   this.taskDetails.product === ContractProductEnum.voice
      //     ? arr.filter((i) => i.variable !== 'reviewWithPm')
      //     : arr;
      this.groups = arr;
      console.log("*******************",this.groups,this.reviewTaskConstant)
      arr =
        this.taskDetails.product?.includes(ContractProductEnum.other) ||
        this.taskDetails.contractType?.includes(ContractProductEnum.other)
          ? arr.filter((i) => i?.variable !== 'reviewWithCommercialOps')
          : arr;
      arr =
        this.taskDetails.variables
          .find((a) => a.name === 'contractTypeSecondLevel')
          ?.value.includes('Payment Term') &&
        this.taskDetails.contractType.includes(ContractTypeEnum.amendment) &&
        this.taskDetails.formKey === TasksAutoFillTaskInfo.creditReviewEval
          ? arr.filter(
              (i) =>
                i?.variable !== 'reviewWithPm' &&
                i?.variable !== 'reviewWithCommercialOps'
            )
          : arr;
      arr = !this.taskDetails.product?.includes(ContractProductEnum.mobile)
        ? arr.filter((a) => a?.variable !== 'reviewWithProductManagerMobile')
        : arr;
      this.groups = arr;
    }
  }

  onSubmitted(callback) {
    if (this.opt === 3) {
      const comment = this.commentBox.getComment();
      if (comment && comment.trim().length !== 0) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(comment, 'text/html');
        if (htmlDoc?.children[0]['innerText'].trim()) {
          this.emitReviewDetail.emit({
            formKey: this.taskDetails.formKey,
            bkey: this.taskDetails.businessKey,
          });

          this.commentSubmitHandler(
            comment,
            this.taskDetails.id,
            this.taskDetails.businessKey,
            this.commentList,
            callback,
            this.levelInfo
          );
        } else {
          this.toastrSvc.warning('Comments is mandatory');
        }
      } else {
        this.toastrSvc.warning('Comments is mandatory');
      }
    } else {
      callback();
    }
  }

  save() {
    this.onSubmitted(() => {
      // if(this.opt === 3) {
      //   this.taskSvc.sendForReview(this.taskDetails.id, this.taskDetails.businessKey).subscribe(r => {
      //     if(r.status) {

      //     }
      //   }) ;
      // }
      this.emitUser.emit(this.selectedEntity);
    });
  }

  close() {
    this.activeModal.close();
  }
}

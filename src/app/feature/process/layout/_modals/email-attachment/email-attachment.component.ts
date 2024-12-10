import {
  UserModel,
  SelectedUserModel,
} from '../../../../user-management/_models/user.model';
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
import {TaskActionService} from '../../_services'

@Component({
  selector: 'app-email-attachment',
  templateUrl: './email-attachment.component.html',
  styleUrls: ['./email-attachment.component.scss'],
})
export class EmailAttachmentComponent implements OnInit {
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

  header: string = "File Attachments";
  
  fileTypes = {
    "pdf": 'fa-file-pdf-o',
    "video": 'fa-file-movie-o',
    "excel": 'fa-file-excel-o',
    "json": 'fa-file-code-o',
    "": 'fa-file-code-o',
    "mp3": 'fa fa-file-audio-o',
    "audio": 'fa fa-file-audio-o',
    "zip": "fa fa-file-zip-o",
    "rar": "fa fa-file-zip-o",
    'image':"fa-file-picture-o",
  }
 

  constructor(
    private activeModal: NgbActiveModal,
    private userSvc: UserService,
    private toastrSvc: ToastrService,
    public taskActionSvc:TaskActionService,
  ) {}

  ngOnInit(): void {
    this.initFn();
  }

  initFn(): void {
    
  }

  onFileChange(e) {

    [...e.target.files].forEach(file => {
      if (!this.taskActionSvc.emailSelectedFiles.some(i => i.name == file.name)) {
        this.taskActionSvc.emailSelectedFiles.push(file);
        this.taskActionSvc.emailSelectedFileSize += file.size;
      }
    })
    
    // console.log("SELECTED FILE  emailSelectedFiles",e.target.files,this.taskActionSvc.emailSelectedFiles)
  }

  deleteIcon(e) {
    // console.log("DELETE??", e)
    this.taskActionSvc.emailSelectedFiles = this.taskActionSvc.emailSelectedFiles.filter(file => file.name != e.name);
    this.taskActionSvc.emailSelectedFileSize = this.taskActionSvc.emailSelectedFiles.reduce((currentValue,currentItem)=>currentValue+currentItem.size,0)
  }


  

  save() {
    this.activeModal.close();
  }

  close() {
    this.taskActionSvc.emailSelectedFiles=[]
    this.activeModal.close();
  }
}

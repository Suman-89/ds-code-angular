import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GatekeeperService } from 'src/app/core/_services';
import {
  TaskInfoService,
  TaskService,
  TaskSignalService,
} from 'src/app/feature/process/layout/_services';

@Component({
  selector: 'app-vmt-documents',
  templateUrl: './vmt-documents.component.html',
  styleUrls: ['./vmt-documents.component.scss'],
})
export class VmtDocumentsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private taskInfoSvc: TaskInfoService,
    // private modalService: NgbModal,
    // private taskActionSvc: TaskActionService,
    private gatekeeperSvc: GatekeeperService,
    private taskSvc: TaskService,
    private taskSignalSvc: TaskSignalService // private gatekeeperSvc: GatekeeperService, // private userSvc: UserService, // private _zone: NgZone
  ) {}
  subscription: Subscription[] = [];
  comments = [];
  contractInfo;
  contractId;
  ready = false;
  tasks = [];
  taskId = '';
  documentMap = {};
  documentList = [];
  procForm;
  user = JSON.parse(localStorage.getItem('user'));

  ngOnInit(): void {
    this.contractId = this.route.snapshot.paramMap.get('businessKey');
    // this.getCompanyDoc();
    if (window.location !== window.parent.location) {
      this.subscribeToUserChange();
    } else this.init();
  }

  init() {
    this.getTasks();
  }

  subscribeToUserChange(): void {
    this.subscription.push(
      this.gatekeeperSvc.loggedInUserEmitter.subscribe((user) => {
        if (user) {
          this.user = user;
          this.init();
        } else {
          this.user = null;
        }
      })
    );
  }

  getTasks(): void {
    this.taskSvc.getNextTask(null, this.contractId).subscribe((a) => {
      if (a.status && a.data) {
        this.tasks = a.data.tasks;
        this.tasks.map(
          (i) => (i.readonly = !i.assignee || i.assignee !== this.user.userid)
        );

        // let userTask = this.tasks.find((i) => i.assignee !== this.user.userid);
        // this.taskId = userTask.id;

        this.taskSignalSvc.ongoingTasks.next(this.tasks);
        this.getFormVariables();
        this.getContractInfo();
      }
    });
  }

  getFormVariables(): void {
    this.taskInfoSvc.getTaskVariables(this.tasks[0].formKey).subscribe((a) => {
      this.procForm = a.data;
      this.procForm.variables.find((v) => v.name === 'effectiveDate')
        ? (this.procForm.variables.find(
            (v) => v.name === 'effectiveDate'
          ).expression = '!model.ibasisTemplate')
        : null;
      this.procForm.key === 'initiateDispute'
        ? this.hideInitiateDisputeVariables()
        : null;

      /*Below line commeneted out on 23/11/2021 as per change req. */
      // this.procForm.variables.find(v => v.name=== 'effectiveDate') ? this.procForm.variables.find(v => v.name=== 'effectiveDate').expression = '!model.ibasisTemplate' : null;
      this.tasks[0].commentMandatory = a.data.commentsneeded;
      this.tasks[0].reviewTask = a.data.isreviewtask;
      this.tasks[0].readonly =
        this.tasks[0].assignee && this.tasks[0].assignee !== this.user.userid;

      this.taskSignalSvc.selectedDocTypes.next(a.data.selecteddoctypes);
      // this.changeToolbarBtnState();
      this.taskSignalSvc.requiredVariableList.next(
        this.procForm.variables.filter((p) => p.mandetory)
      );
      this.emitTaskInfo();
      this.taskSignalSvc.procForm.next(this.procForm);
    });
  }

  hideInitiateDisputeVariables() {
    // if(this.procForm.key === 'initiateDispute') {
    this.tasks[0].variables.find((a) => a.name === 'partnerType').value ==
    'Customer'
      ? (this.procForm.variables.find(
          (v) => v.name === 'vendorDisputeType'
        ).expression = 'true')
      : (this.procForm.variables.find(
          (v) => v.name === 'customerDisputeType'
        ).expression = 'true');
    this.tasks[0].variables.find((a) => a.name === 'partnerType').value ==
    'Customer'
      ? (this.procForm.variables.find(
          (v) => v.name === 'vendorSapNumber'
        ).expression = 'true')
      : (this.procForm.variables.find(
          (v) => v.name === 'customerSapNumber'
        ).expression = 'true');
    // }
  }

  emitTaskInfo(): void {
    this.taskSignalSvc.taskInfo.next(this.tasks[0]);
    this.taskSignalSvc.taskVariables.next(this.tasks[0].variables);
  }

  getCompanyDoc(): void {
    this.taskInfoSvc
      .getFilteredDocumentList(this.contractInfo.companyCode, this.contractId)
      .subscribe((a) => {
        if (a.status) {
          if (
            this.contractInfo.completiondatetime &&
            !this.contractInfo.terminated
          ) {
            delete a.data['Final-unsigned'];
            delete a.data['Company Documents'];
            delete a.data['Other'];
          }

          this.documentMap = a.data;

          let taskDocTypes = Object.keys(a.data);
          // taskDocTypes = taskDocTypes.filter(d => d !== 'Final-unsigned') ;
          taskDocTypes.forEach(
            (i) => (this.documentList = [...this.documentList, ...a.data[i]])
          );
          // this.documentList = this.documentList.filter(d => d.foldername !== 'Final-unsigned') ;
          this.taskSignalSvc.docList.next(this.documentList);
          this.taskSignalSvc.docMap.next(a.data);
          // this.getTasks();
        }
      });
  }

  getContractInfo(): void {
    this.taskSvc.getContractById(this.contractId).subscribe((a) => {
      if (a.status) {
        this.contractInfo = a.data;
        // console.log("contractInfo",this.contractInfo.processvariables)
        this.taskSignalSvc.contractInfo.next(a.data);
        this.taskSignalSvc.businessKey.next(this.contractInfo.contractid);
        this.taskSignalSvc.taskVariables.next(this.contractInfo.variables);
        this.getCompanyDoc();
        this.ready = true;

        // if (this.contractInfo.variables.length > 0) {
        //   this.contractInfo.variables.find((i) => i.name == 'initiator').value =
        //     this.contractInfo.initiatedbyfullname;
        //   this.contractInfo.variables.find(
        //     (i) => i.name === 'partnerAddress'
        //   ) &&
        //     (this.contractInfo.variables.find(
        //       (i) => i.name === 'partnerAddress'
        //     ).value = this.contractInfo.partneraddress);
        // }
        // let vars: any = {};
        // this.contractInfo.variables.forEach((i) => (vars[i.name] = i.value));
        // this.contractInfo.companyCode = vars.companyCode;
        // this.contractInfo.casePriority = vars.casePriority;

        // this.getCompanyDoc();
        // this.getTaskComments();
        // this.contractInfo.completiondatetime && !this.contractInfo.terminated
        //   ? this.setActions(1)
        //   : this.setActions();
        // if(this.contractInfo.completiondatetime && !this.contractInfo.terminated) {
        //   this.viewTaskActInst.selectAction(this.actions2[1]) ;
        // }
      }
    });
  }
}

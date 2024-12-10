import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  TaskSignalService,
  TaskService,
  TaskInfoService,
  TaskActionService,
} from '../../_services';
import { LoggedUserModel, Roles } from 'src/app/core/_models';
import { ActivatedRoute } from '@angular/router';
import {
  TaskInfoModel,
  TaskDocumentResponseModel,
  TaskDocumentModel,
  TaskCommentModel,
} from '../../_models';
import { ContractModel } from '../../_models/contract.model';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/_services';
import { TranscriptionModel } from '../../_models/transcription.model';

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss'],
  viewProviders: [TaskSignalService],
})
export class ViewContractComponent implements OnInit, OnDestroy {
  @ViewChild('viewtaskaction') viewTaskActInst;
  loggedUser: LoggedUserModel;
  contractId: string;
  contractInfo: ContractModel;
  documentMap: TaskDocumentResponseModel;
  documentList: TaskDocumentModel[] = [];
  transcriptionList: TranscriptionModel[] = [];
  tasks: TaskInfoModel[] = [];
  actions1 = [];
  actions2 = [];
  userRoleEnum = Roles;
  editPermissions: string[] = [];
  subscription: Subscription[] = [];
  commentList: TaskCommentModel[];
  taskTitles = [];
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  isContentCreationProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_contentCreationProcess';
  candidateName = '';
  isPreScreeningProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_preScreeningProcess';
  emailTicketId;
  isEmailProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_emailProcess';
  patientName;
  doctorName;
  isRCMBillingProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_rcmBillingProcess';

  constructor(
    private route: ActivatedRoute,
    private taskSvc: TaskService,
    private taskSignalSvc: TaskSignalService,
    private taskInfoSvc: TaskInfoService,
    private toastrSvc: ToastrService,
    private taskActSvc: TaskActionService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    this.initFn();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  initFn(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    this.contractId = this.route.snapshot.paramMap.get('contractId');
    this.editPermissions = [
      this.userRoleEnum.SUPER_ADMIN,
      this.userRoleEnum.SALES_USER,
      this.userRoleEnum.LEGAL_ADMIN,
    ];
    // this.setActions();
    this.getTasks();
    this.getContractInfo();
  }

  setActions(opt?): void {
    // this.actions1 = [{ id: 'info', name: 'Info', icon: 'fa fa-info-circle' }];

    // this.actions2 = opt
    //   ? [
    //       { id: 'decision', name: 'Decision Tab', icon: 'fa fa-comments-o' },
    //       { id: 'audit', name: 'Audit Trail', icon: 'fa fa-history' },
    //       { id: 'comment', name: 'View Comments', icon: 'fa fa-commenting-o' },
    //       { id: 'document', name: 'View Documents', icon: 'fa fa-file' },
    //     ]
    //   : [
    //     { id: 'decision', name: 'Decision Tab', icon: 'fa fa-comments-o' },
    //       { id: 'audit', name: 'Audit Trail', icon: 'fa fa-history' },
    //       { id: 'document', name: 'View Documents', icon: 'fa fa-file' },
    //       { id: 'comment', name: 'View Comments', icon: 'fa fa-commenting-o' },
    //   ];

    const settings = this.sharedSvc.allProcessData.find(
      (i) =>
        i?.processkey ==
        JSON.parse(localStorage.getItem('selected-process'))?.key
    );
    // this.actions = [
    //   { id: 'transcript', name: 'Transcript', icon: 'fa fa-comments-o' },
    //   { id: 'document', name: 'Documents', icon: 'fa fa-file' },
    //   { id: 'comment', name: 'Comments', icon: 'fa fa-commenting-o' },
    //   { id: 'audit', name: 'Audit Trail', icon: 'fa fa-history' },
    //   { id: 'info', name: 'Info', icon: 'fa fa-info-circle' },
    // ];
    this.actions1 = settings?.processDef?.tabSettings?.filter(
      (i) => i.id == 'info'
    );
    this.actions2 = settings?.processDef?.tabSettings?.filter(
      (i) => i.isVisible && i.id != 'info'
    );
    console.log('TAB SETTINGAS', this.actions1, this.actions2);
  }

  getTasks(): void {
    this.taskSvc.getNextTask(null, this.contractId).subscribe((a) => {
      if (a.status && a.data) {
        this.tasks = a.data.tasks;
        this.tasks.map(
          (i) =>
            (i.readonly = !i.assignee || i.assignee !== this.loggedUser.userid)
        );
        this.taskSignalSvc.ongoingTasks.next(this.tasks);
      }
    });
  }
  getTaskTranscriptions(): void {
    this.taskInfoSvc.getTranscriptionList(this.contractId).subscribe((a) => {
      this.transcriptionList = a.data;
      console.log('Transc', a.data);
      this.transcriptionList.sort((a, b) =>
        new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1
      );
    });
  }

  getTaskTitle() {
    let processDef = this.sharedSvc.allProcessData.find(
      (i) => i.processkey == this.selectedProcess.key
    )?.processDef;
    let title = processDef.titleSettings?.find(
      (i) => i.titleId == 'contractTitle'
    );
    let text = title?.titleText;
    if (text) {
      title.titleVariables?.forEach((item) => {
        let varValue = this.contractInfo.variables.find(
          (v) => v?.name == item
        )?.value;
        if (varValue == null || varValue == undefined) {
          text = text.replaceAll('{' + item + '}', 'Empty');
        } else if (!varValue) {
          text = text.replaceAll('{' + item + '}', this.contractInfo[item]);
        } else {
          text = text.replaceAll('{' + item + '}', varValue);
        }
      });
      this.taskTitles = text.split('|').map((i) => i.trim());
    }

    console.log('************', this.taskTitles);
  }

  getContractInfo(): void {
    this.taskSvc.getContractById(this.contractId).subscribe((a) => {
      if (a.status) {
        this.contractInfo = a.data;
        this.getTaskTitle();
        this.taskInfoSvc.emailSubject = this.contractInfo?.variables?.find(
          (i) => i.name == 'emailSubject'
        )?.value;
        this.taskInfoSvc.emailRecipientId = this.contractInfo?.variables?.find(
          (i) => i.name == 'emailRecipient'
        )?.value;
        if (this.isPreScreeningProcess) {
          this.candidateName = this.contractInfo.variables.find(
            (i) => i.name == 'psCandidateName'
          )?.value;
        }
        if (this.isEmailProcess) {
          this.emailTicketId = this.contractInfo.variables.find(
            (i) => i.name == 'emailTicketId'
          )?.value;
        }
        if (this.isRCMBillingProcess) {
          this.patientName = this.contractInfo.variables.find(
            (i) => i.name == 'rcmPatientName'
          )?.value;
          this.doctorName = this.contractInfo.variables.find(
            (i) => i.name == 'rcmDoctorName'
          )?.value;
        }
        this.taskSignalSvc.contractInfo.next(a.data);
        this.taskSignalSvc.businessKey.next(this.contractInfo.contractid);
        this.taskSignalSvc.taskVariables.next(this.contractInfo.variables);
        if (this.contractInfo.variables.length > 0) {
          if (this.contractInfo.variables.find((i) => i.name == 'initiator')) {
            this.contractInfo.variables.find(
              (i) => i.name == 'initiator'
            ).value = this.contractInfo.initiatedbyfullname;
          }
          this.contractInfo.variables.find(
            (i) => i.name === 'partnerAddress'
          ) &&
            (this.contractInfo.variables.find(
              (i) => i.name === 'partnerAddress'
            ).value = this.contractInfo.partneraddress);
        }
        let vars: any = {};
        this.contractInfo.variables.forEach((i) => (vars[i.name] = i.value));

        this.contractInfo.companyCode = vars.companyCode;
        this.contractInfo.casePriority = vars.casePriority;
        this.getCompanyDoc();
        this.getTaskComments();
        this.getTaskTranscriptions();
        this.contractInfo.completiondatetime && !this.contractInfo.terminated
          ? this.setActions(1)
          : this.setActions();
        // if(this.contractInfo.completiondatetime && !this.contractInfo.terminated) {
        //   this.viewTaskActInst.selectAction(this.actions2[1]) ;
        // }
      }
    });
  }

  getFlagStyle(): any {
    return this.taskActSvc.getFlagStyle(this.contractInfo);
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
            // delete a.data['Business Case']
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
        }
      });
  }

  openEditModal(): void {}

  getTaskComments(): void {
    this.taskInfoSvc
      .getCommentList(this.contractInfo.contractid)
      .subscribe((a) => {
        this.commentList = a.data;
        this.commentList.sort((a, b) =>
          new Date(a.createdtime) < new Date(b.createdtime) ? 1 : -1
        );
      });
  }

  returnSecondLevel(type, opt) {
    return this.taskActSvc.returnSecondLevel(
      this.contractInfo.variables,
      type,
      opt
    );
  }
}

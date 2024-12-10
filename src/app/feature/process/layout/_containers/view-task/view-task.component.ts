import { TaskService } from './../../_services/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  TaskInfoService,
  TaskSignalService,
  TaskValidationService,
  TaskActionService,
  TaskFormSaveService,
} from '../../_services';
import {
  TaskInfoModel,
  TasksAutoFillTaskInfo,
  TaskTerminateRequestModel,
  TaskDocumentModel,
  ReviewTaskConstant,
  TaskCommentModel,
  DocumentCategoryEnum,
  DocumentCategoryName,
  UpdateSingleSession,
} from '../../_models';
import {
  LoggedUserModel,
  GridToolbarType,
  ToolbarButtonModel,
  Roles,
  CompanyModel,
  ProcessFormModel,
  UserGroupsEnum,
  ProcessVariableModel,
} from 'src/app/core/_models';
import { Subscription } from 'rxjs';
import {
  SharedService,
  CompanyManagementService,
  UserService,
  WhatsappService,
} from 'src/app/core/_services';
import { ToastrService } from 'ngx-toastr';
import { CreateCompanyModalComponent } from 'src/app/shared/_modals';
import { PrintProcessDocumentModalComponent } from '../../_modals/print-process-document-modal/print-process-document-modal.component';
import { filter, map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { threadId } from 'worker_threads';
import { TranscriptionModel } from '../../_models/transcription.model';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss'],
  viewProviders: [
    TaskSignalService,
    TaskValidationService,
    TaskFormSaveService,
  ],
})
export class ViewTaskComponent implements OnInit, OnDestroy {
  taskId: string;
  formValid: boolean;
  docLastUpdatedBy: string;
  dmsReviewBookmarkFormKey = TasksAutoFillTaskInfo;
  taskType: string;
  businessKey: string;
  taskDetails: TaskInfoModel = {} as TaskInfoModel;
  taskDocsList: TaskDocumentModel[] = [];
  commentList: TaskCommentModel[] = [];
  transcriptionList: TranscriptionModel[] = [];
  reviewTaskConstant = new ReviewTaskConstant().reviewGroupMap;
  taskDocTypes: string[] = [];
  toolbarButtons: ToolbarButtonModel[] = [];
  loggedUser: LoggedUserModel;
  toolbarType = GridToolbarType;
  model: any;
  savedModel: boolean = false;
  actions = [];
  userRoleEnum = Roles;
  editPermissions: string[] = [];
  subscription: Subscription[] = [];
  procForm: ProcessFormModel;
  ceList;
  feedbackVars: ProcessVariableModel[];
  candidateName = '';
  emailTicketId;
  partnerLegalName;
  emailSubject;
  emailRecipientId;
  patientName;
  doctorName;
  variables;
  vars = {};
  taskTitles = [];
  tabRoleAccess = [];
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  isContentCreationProcess =
    this.selectedProcess?.key === 'Initiation_contentCreationProcess';
  isVmtProcess = this.selectedProcess?.key === 'Initiation_vMTProcess';
  isContractProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Process_initiation_impl';
  isPreScreeningProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_preScreeningProcess';
  isEmailProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_emailProcess';
  isRCMBillingProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_rcmBillingProcess';

  @ViewChild('taskActions') taskActions;

  constructor(
    private route: ActivatedRoute,
    public taskInfoSvc: TaskInfoService,
    private taskSvc: TaskService,
    private taskSignalSvc: TaskSignalService,
    private sharedSvc: SharedService,
    private toastrSvc: ToastrService,
    public taskActionSvc: TaskActionService,
    private ngbModalSvc: NgbModal,
    private taskValidationSvc: TaskValidationService,
    private companySvc: CompanyManagementService,
    private ngxLoaderSvc: NgxUiLoaderService,
    private userSvc: UserService,
    private taskFormSavesvc: TaskFormSaveService,
    private whatsappSvc: WhatsappService
  ) {}

  ngOnInit(): void {
    this.initFn();
  }

  ngOnDestroy(): void {
    this.ngxLoaderSvc.stop();
    this.subscription.forEach((i) => i.unsubscribe());
  }

  getTaskTitle() {
    let processDef = this.sharedSvc.allProcessData.find(
      (i) => i.processkey == this.selectedProcess.key
    )?.processDef;
    let title = processDef.titleSettings?.find((i) => i.titleId == 'taskTitle');
    let text = title?.titleText;
    if (text) {
      title.titleVariables?.forEach((item) => {
        let varValue = this.taskDetails.variables.find(
          (v) => v?.name == item
        )?.value;
        if (varValue == null || varValue == undefined) {
          text = text.replaceAll('{' + item + '}', 'Empty');
        } else if (!varValue) {
          text = text.replaceAll('{' + item + '}', this.taskDetails[item]);
        } else {
          text = text.replaceAll('{' + item + '}', varValue);
        }
      });
      this.taskTitles = text.split('|').map((i) => i.trim());
    }

    console.log('************', this.taskTitles);
  }

  initFn(opt: boolean = true): void {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    this.taskId = this.route.snapshot.paramMap.get('taskId');

    this.getTaskInfo(this.taskId);
    this.getUsers();
    this.getAllGroup();

    if (opt) {
      this.setActions();
      this.setEditPermissions();
      this.subscribeToModel();
      this.subscribeToFormValidBool();
      this.subscribeToDocListChanges();
      this.subscribeToSaved();
    }
  }

  getCE() {
    if (JSON.parse(localStorage.getItem('selected-process')).label == 'Impl') {
      this.companySvc.getContractingEntities().subscribe((c) => {
        if (c.status) {
          this.ceList = c.data;
          this.checkCE();
        }
      });
    }
  }

  checkCE() {
    const ibce = this.ceList.find(
      (c) =>
        c.name.toLowerCase().trim() ==
        this.taskDetails.variables
          .find((i) => i.name == 'ibasisContractingEntity')
          .value.toLowerCase()
          .trim()
    );
    const leName = this.taskDetails.variables.find(
      (i) => i.name == 'ibasisContractingEntityLegalName'
    ).value;

    if (
      !ibce.name
        .toLowerCase()
        .trim()
        .includes(
          leName
            .toLowerCase()
            .substring(0, leName.length - 6)
            .trim()
        )
    ) {
      this.getCEbyId(ibce.id);
    }
  }

  getCEbyId(id) {
    this.companySvc.getContractingEntityByID(id).subscribe((a) => {
      if (a.status) {
        this.taskDetails.variables.find(
          (i) => i.name == 'ibasisContractingEntityAddress'
        ).value = a.data.data.principaladdress.friendlyaddress;
        this.taskDetails.variables.find(
          (i) => i.name == 'ibasisContractingEntityLegalName'
        ).value = a.data.data.entitylegalname;
        this.taskDetails.variables.find(
          (i) => i.name == 'ibasisContractingEntityType'
        ).value = a.data.data.companytype;
        this.taskDetails.variables.find(
          (i) => i.name == 'ibasisContractingEntityRegistration'
        ).value = a.data.data.registration;
        this.taskDetails.variables.find(
          (i) => i.name == 'ibasisContractingEntityCorpId'
        ).value = a.data.data.corporateidnumber;
        let obj;
        obj = {
          ibasisContractingEntityLegalName: a.data.data.entitylegalname,
          ibasisContractingEntityAddress:
            a.data.data.principaladdress.friendlyaddress,
          ibasisContractingEntityType: a.data.data.companytype,
          ibasisContractingEntityRegistration: a.data.data.registration,
          ibasisContractingEntityCorpId: a.data.data.corporateidnumber,
        };
        this.updateProcessVariables(obj);
      }
    });
  }

  getTaskInfo(id): void {
    this.taskInfoSvc.getTaskInfo(id).subscribe((a) => {
      this.taskDetails = a.data;
      this.getTaskTitle();
      this.taskInfoSvc.defaultCommentTab = this.taskDetails.defaulttab;
      console.log("TASK INFORMATION ::::: ",this.taskInfoSvc)
      this.taskInfoSvc.emailSubject = this.taskDetails?.variables?.find(
        (i) => i.name == 'emailSubject'
      )?.value;
      this.taskInfoSvc.emailRecipientId = this.taskDetails?.variables?.find(
        (i) => i.name == 'emailRecipient'
      )?.value;

      if (this.isPreScreeningProcess) {
        this.candidateName = this.taskDetails.variables.find(
          (i) => i.name == 'psCandidateName'
        )?.value;
      }
      if (this.isEmailProcess) {
        this.emailTicketId = this.taskDetails.variables.find(
          (i) => i.name == 'emailTicketId'
        )?.value;
        this.partnerLegalName = this.taskDetails.variables.find(
          (i) => i.name == 'partnerLegalName'
        )?.value;
        this.taskInfoSvc.partnerLegalNameObj = this.taskDetails.variables.find(
          (i) => i.name == 'partnerLegalName'
        );
        console.log('RECIPIENT ID ', this.taskInfoSvc);
      }
      if (this.isRCMBillingProcess) {
        this.patientName = this.taskDetails.variables.find(
          (i) => i.name == 'rcmPatientName'
        )?.value;
        this.doctorName = this.taskDetails.variables.find(
          (i) => i.name == 'rcmDoctorName'
        )?.value;
      }
      this.taskSignalSvc.ongoingTasks.next([this.taskDetails]);
      let vars: any = {};
      this.taskDetails.variables.forEach((i) => (vars[i.name] = i.value));
      this.vars = vars;
      this.businessKey = vars.businessKey;
      this.taskDetails.businessKey = this.businessKey;
      this.taskDetails.partnerLegalName = vars.partnerLegalName;
      this.taskDetails.product = vars.product;
      this.taskDetails.contractType = vars.contractType;
      this.taskDetails.casePriority = vars.casePriority;
      this.taskDetails.isThisSOF = vars.isThisSofContractSig;
      this.taskDetails.variables.find((i) => i.name == 'initiator').value =
        this.taskDetails.initiatorname;
      if (!this.taskDetails.variables.find((i) => i.name == 'initiatorname')) {
        let obj = { initiatorname: this.taskDetails.initiatorname };
        this.updateProcessVariables(obj);
      }
      if (this.taskDetails.variables.find((i) => i.name == 'initiatorname')) {
        let obj;
        obj =
          this.taskDetails.variables.find((i) => i.name == 'initiatorname')
            .value !== this.taskDetails.initiatorname
            ? { initiatorname: this.taskDetails.initiatorname }
            : {
                initiatorname: this.taskDetails.variables.find(
                  (i) => i.name == 'initiatorname'
                ).value,
              };
        this.updateProcessVariables(obj);
      }
      this.taskDetails.readonly =
        (this.taskDetails.assignee &&
          this.taskDetails.assignee.toLowerCase() !==
            this.loggedUser.userid.toLowerCase() &&
          ((this.taskDetails.groupid.toLowerCase() ===
          UserGroupsEnum.PRODUCTION_MANAGEMENT.toLowerCase()
            ? this.loggedUser.groupnames.includes('pmiot') ||
              this.loggedUser.groupnames.includes('pmmobile') ||
              this.loggedUser.groupnames.includes('pmsms') ||
              this.loggedUser.groupnames.includes('pmvoice')
            : this.loggedUser.groupnames
                .map((item) => item.toLowerCase())
                .includes(this.taskDetails.groupid.toLowerCase())) ||
            this.loggedUser.roles.includes(Roles.SUPER_ADMIN))) ||
        (this.taskDetails.reviewTask ? true : false);

      let companyId = vars.companyId;

      this.taskSignalSvc.businessKey.next(this.businessKey);
      this.taskSignalSvc.defaultTab.next(this.taskDetails.defaulttab);

      this.getToolbarButtons();
      this.getTaskComments();
      this.getTaskTranscriptions();
      this.getFormVariables();

      this.getCompanyOfacStatus(companyId);
      this.getDocumentList(vars.companyCode);
      this.getCE();
      this.setFeedbackVariables();
      if (this.procForm && this.procForm.key === 'mobileInitiateNewContract') {
        this.subscribeToFormValidBool();
      }
    });
  }

  getFormVariables(): void {
    this.taskInfoSvc
      .getTaskVariables(this.taskDetails.formKey)
      .subscribe((a) => {
        this.procForm = a.data;
        // console.log('FORM DATA ; ', this.procForm);
        this.tabRoleAccess = this.procForm?.tabRoleAccess;
        // console.log(this.tabRoleAccess);
        // console.log(this.actions);
        if (this.tabRoleAccess || this.tabRoleAccess.length !== 0) {
          let user = JSON.parse(localStorage.getItem('user'));
          let userRoles = user.roles;
          // console.log(userRoles);
          // console.log(this.tabRoleAccess);
          // console.log('user Roles', userRoles);
          // console.log('Tab Roles Aceess', this.tabRoleAccess);
          const visibleActions = this.actions.filter((action) => {
            return this.tabRoleAccess.some((formData) => {
              return (
                formData.name === action.name &&
                formData.roles &&
                formData.roles.some(
                  (role) =>
                    userRoles.includes(role?.name) && role?.isVisible === true
                )
              );
            });
          });
          // console.log('This.actions = ', this.actions);
          // console.log(visibleActions);
          this.actions = visibleActions;
          // console.log('Visible actions', visibleActions);
        }

        // this.procForm.variables.find((v) => v.name === 'effectiveDate')
        //   ? (this.procForm.variables.find(
        //       (v) => v.name === 'effectiveDate'
        //     ).expression = '!model.ibasisTemplate')
        //   : null;
        this.procForm.key === 'initiateDispute'
          ? this.hideInitiateDisputeVariables()
          : null;

        /*Below line commeneted out on 23/11/2021 as per change req. */
        // this.procForm.variables.find(v => v.name=== 'effectiveDate') ? this.procForm.variables.find(v => v.name=== 'effectiveDate').expression = '!model.ibasisTemplate' : null;
        this.taskDetails.commentMandatory = a.data.commentsneeded;
        this.taskDetails.reviewTask = a.data.isreviewtask;
        this.taskDetails.readonly =
          this.taskDetails.assignee &&
          this.taskDetails.assignee !== this.loggedUser.userid;

        this.taskSignalSvc.selectedDocTypes.next(a.data.selecteddoctypes);
        this.changeToolbarBtnState();
        this.taskSignalSvc.requiredVariableList.next(
          this.procForm.variables.filter((p) => p.mandetory)
        );
        this.emitTaskInfo();
        this.taskSignalSvc.procForm.next(this.procForm);
      });
  }

  hideInitiateDisputeVariables() {
    // if(this.procForm.key === 'initiateDispute') {
    this.taskDetails.variables.find((a) => a.name === 'partnerType').value ==
    'Customer'
      ? (this.procForm.variables.find(
          (v) => v.name === 'vendorDisputeType'
        ).expression = 'true')
      : (this.procForm.variables.find(
          (v) => v.name === 'customerDisputeType'
        ).expression = 'true');
    this.taskDetails.variables.find((a) => a.name === 'partnerType').value ==
    'Customer'
      ? (this.procForm.variables.find(
          (v) => v.name === 'vendorSapNumber'
        ).expression = 'true')
      : (this.procForm.variables.find(
          (v) => v.name === 'customerSapNumber'
        ).expression = 'true');
    // }
  }
  getCompanyOfacStatus(id: string): void {
    if (id) {
      this.companySvc.getOfacSstatus(id).subscribe((a) => {
        if (a.status) {
          const outcome = a.data.required
            ? a.data.done
              ? a.data.outcome
                ? { val: 'Ok', class: 'primary-color' }
                : { val: 'Failed', class: 'danger-color' }
              : { val: 'Pending', class: 'secondary-color' }
            : { val: null, class: 'secondary-color' };

          let ofacVar = {
            name: 'ofacStatus',
            label: 'Ofac Status',
            displaylabel: 'Company OFAC Status',
            value: outcome.val,
            datatype: 'String',
            uielementtype: 'TEXTBOX',
            valuesource: 'EMPTY',
            categoryname: null,
            class: outcome.class,
          };

          if (outcome.val === 'Failed') {
            this.toastrSvc.error('Company OFAC Check Failed');
          }

          this.taskDetails.variables.push(ofacVar);
          this.emitTaskInfo();
        }
      });
    }
  }

  getFlag(): any {
    return this.taskActionSvc.getFlagStyle(this.taskDetails);
  }

  getDocumentList(id): void {
    this.taskDocTypes = [];
    this.taskDocsList = [];
    this.taskInfoSvc
      .getFilteredDocumentList(id, this.businessKey)
      .subscribe((a) => {
        if (a.status) {
          delete a.data[DocumentCategoryName.finalUnsigned];
          if (
            this.taskDetails.isThisSOF &&
            a.data[DocumentCategoryName.inProcess] &&
            a.data[DocumentCategoryName.inProcess].length > 0
          ) {
            a.data[DocumentCategoryName.inProcess] = a.data[
              DocumentCategoryName.inProcess
            ].filter((i) => i.metadata.template[0].name === 'Mobile SOF');
          } else if (
            a.data[DocumentCategoryName.inProcess] &&
            a.data[DocumentCategoryName.inProcess].length > 0
          ) {
            a.data[DocumentCategoryName.inProcess] = a.data[
              DocumentCategoryName.inProcess
            ].filter((i) => i.metadata.template[0].name !== 'Mobile SOF');
          }
          this.taskDocTypes = Object.keys(a.data);
          this.taskDocTypes.forEach(
            (i) => (this.taskDocsList = [...this.taskDocsList, ...a.data[i]])
          );
          this.taskSignalSvc.docList.next(this.taskDocsList);
          this.taskSignalSvc.docMap.next(a.data);
        }
      });
  }

  getTaskComments(): void {
    this.taskInfoSvc.getCommentList(this.businessKey).subscribe((a) => {
      this.commentList = a.data;
      this.commentList.sort((a, b) =>
        new Date(a.createdtime) < new Date(b.createdtime) ? 1 : -1
      );
    });
  }
  getTaskTranscriptions(): void {
    this.taskInfoSvc.getTranscriptionList(this.businessKey).subscribe((a) => {
      this.transcriptionList = a.data;
      console.log('Transc', a.data);
      this.transcriptionList.sort((a, b) =>
        new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1
      );
    });
  }

  emitTaskInfo(): void {
    this.taskSignalSvc.taskInfo.next(this.taskDetails);
    this.taskSignalSvc.taskVariables.next(this.taskDetails.variables);
  }

  setActions(): void {
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
    this.actions = settings?.processDef?.tabSettings?.filter(
      (i) => i.isVisible
    );
    // console.log("TAB SETTINGAS",settings?.processDef?.tabSettings,this.actions, this.sharedSvc.allProcessData)
  }

  setEditPermissions(): void {
    this.editPermissions = [
      this.userRoleEnum.SUPER_ADMIN,
      this.userRoleEnum.SALES_USER,
      this.userRoleEnum.LEGAL_ADMIN,
    ];
  }

  subscribeToModel(): void {
    this.subscription.push(
      this.taskSignalSvc.model.subscribe((a) => {
        if (a && Object.keys(a).length > 0) {
          this.model = a;
        }
      })
    );
  }

  subscribeToSaved(): void {
    this.subscription.push(
      this.taskSignalSvc.saved.subscribe((a) => {
        this.savedModel = a;
      })
    );
  }

  subscribeToFormValidBool(): void {
    this.subscription.push(
      this.taskSignalSvc.formValid.subscribe((a) => {
        this.formValid = a;

        if (
          this.procForm &&
          this.procForm.key === 'mobileInitiateNewContract'
        ) {
          this.formValid = this.procForm.variables.find(
            (a) => a.name === 'sofrequiredchecker'
          ).value
            ? true
            : false;
        }
        this.changeToolbarBtnState();
      })
    );
  }

  subscribeToDocListChanges(): void {
    this.subscription.push(
      this.taskSignalSvc.docList.subscribe((a) => {
        if (a) {
          this.taskDocsList = a;
          this.getDocumentState();
          this.getBusinessCaseValues();
        }
      })
    );
  }

  getDocumentState(): void {
    this.taskDocsList.forEach((i) => {
      if (
        i.foldername == 'In Process' &&
        i.metadata.products[0] &&
        i.metadata.products[0].name == this.taskDetails.product &&
        i.metadata.contracttype[0] &&
        i.metadata.contracttype[0].name == this.taskDetails.contractType
      ) {
        if (i.updateuserid && this.docLastUpdatedBy !== i.updateuserid) {
          this.docLastUpdatedBy = i.updateuserid;
          let obj = {
            docLastChangedBy: i.updateuserid,
          };
          this.updateProcessVariables(obj, 0);
        }
      }
    });
  }

  getBusinessCaseValues(): void {
    if (
      this.taskDetails &&
      this.taskDetails.contractType &&
      (this.taskDetails.contractType.toLowerCase().includes('service') ||
        this.taskDetails.contractType.toLowerCase().includes('amendment'))
    ) {
      this.taskDocsList.forEach((i) => {
        if (
          i.foldername == 'Business Case' &&
          i.metadata.products[0] &&
          i.metadata.products[0].name == this.taskDetails.product &&
          i.metadata.contracttype[0] &&
          i.metadata.contracttype[0].name == this.taskDetails.contractType &&
          i.namedrangevalues
        ) {
          let model = {};
          let keys = Object.keys(i.namedrangevalues);
          if (this.procForm.key === 'mobileInitiateNewContract') {
            keys.push('sofrequiredchecker');
          }
          keys.forEach((j: string) => {
            model[j] = i.namedrangevalues[j];
            if (j === 'sofrequiredchecker') {
              let val =
                i.namedrangevalues[keys.find((k) => k === 'sofRequired')];
              model[j] = this.procForm.variables.find(
                (a) => a.name === j
              ).value = val.toString().length > 0 ? val : null;
            } else {
              model[j] =
                model[j] === 'Yes'
                  ? true
                  : model[j] === 'No'
                  ? false
                  : model[j];
            }
          });
          this.procForm.key === 'mobileInitiateNewContract'
            ? this.updateProcessVariables(model, 2, true)
            : this.updateProcessVariables(model, 2, true);
        }
      });
    }
  }

  getToolbarButtons(): void {
    let type =
      this.taskDetails.group &&
      (this.taskDetails.groupid.toLowerCase() ===
      UserGroupsEnum.PRODUCTION_MANAGEMENT.toLowerCase()
        ? this.loggedUser.groupnames
            .map((item) => item.toLowerCase())
            .includes(UserGroupsEnum.PM_IOT.toLowerCase()) ||
          this.loggedUser.groupnames
            .map((item) => item.toLowerCase())
            .includes(UserGroupsEnum.PM_MOBILE.toLowerCase()) ||
          this.loggedUser.groupnames
            .map((item) => item.toLowerCase())
            .includes(UserGroupsEnum.PM_SMS.toLowerCase()) ||
          this.loggedUser.groupnames
            .map((item) => item.toLowerCase())
            .includes(UserGroupsEnum.PM_VOICE.toLowerCase())
        : this.loggedUser.groupnames.includes(
            this.taskDetails.groupid.toLowerCase()
          ))
        ? this.toolbarType.workbasket
        : this.taskDetails.readonly
        ? this.toolbarType.readonly
        : !(this.taskDetails.groupid.toLowerCase() ===
          UserGroupsEnum.PRODUCTION_MANAGEMENT.toLowerCase()
            ? this.loggedUser.groupnames
                .map((item) => item.toLowerCase())
                .includes(UserGroupsEnum.PM_IOT.toLowerCase()) ||
              this.loggedUser.groupnames
                .map((item) => item.toLowerCase())
                .includes(UserGroupsEnum.PM_MOBILE.toLowerCase()) ||
              this.loggedUser.groupnames
                .map((item) => item.toLowerCase())
                .includes(UserGroupsEnum.PM_SMS.toLowerCase()) ||
              this.loggedUser.groupnames
                .map((item) => item.toLowerCase())
                .includes(UserGroupsEnum.PM_VOICE.toLowerCase())
            : this.loggedUser.groupnames
                .map((item) => item.toLowerCase())
                .includes(this.taskDetails.groupid.toLowerCase()))
        ? this.toolbarType.noaction
        : this.toolbarType.worklist;
    // the above chunk is to be reviewed
    this.sharedSvc.getToolbarButtons(type).subscribe((a) => {
      this.toolbarButtons = a;
      this.toolbarButtons = this.toolbarButtons?.map((item) => {
        if (
          ['terminate', 'reassign', 'claim', 'unclaim', 'assign'].includes(
            item.action
          )
        ) {
          return { ...item, disabled: false };
        } else {
          return item;
        }
      });
      console.log('toolbarButtons', this.toolbarButtons, type, a);
      this.changeToolbarBtnState();
    });
  }

  changeToolbarBtnState(): void {
    if (this.toolbarButtons && this.toolbarButtons.length > 0) {
      this.procForm?.assignable
        ? (this.toolbarButtons.find((a) => a.action === 'review').label =
            'Assign For Analysis')
        : null;
      this.toolbarButtons.forEach((i) => {
        if (i.action == 'complete') {
          i.disabled = this.formValid ? false : true;
        } else if (i.action == 'review') {
          i.dontShow = this.procForm
            ? (this.procForm.feedbackVariableMaps &&
                (this.taskDetails.reviewTask || this.procForm.reviewable)) ||
              this.procForm.assignable
              ? false
              : true
            : true;
        } else if (i.action == 'terminate') {
          i.dontShow =
            this.loggedUser.roles.includes(Roles.SUPER_ADMIN) ||
            this.loggedUser.roles.includes(Roles.LEGAL_ADMIN) ||
            this.loggedUser.userid === this.taskDetails.initiator ||
            (this.loggedUser.userid == this.taskDetails.assignee &&
              this.taskDetails.groupid.toLowerCase() ==
                UserGroupsEnum.SALES.toLowerCase())
              ? false
              : true;
        }
        // else if (i.action == 'unclaim' || i.action == 'claim') {
        //   //
        //   //change from == to !== to remove disable from return to queue in sales
        //   i.dontShow =
        //     this.taskDetails.groupid.toLowerCase() !==
        //     UserGroupsEnum.SALES.toLowerCase()
        //       ? true
        //       : false;
        // }
      });
    }
  }

  toolbarEmit(e) {
    switch (e) {
      case 'terminate':
        this.terminateTask();
        break;

      case 'unclaim':
        this.unclaimTask(this.taskId);
        break;

      case 'claim':
        this.claimTask(this.taskId);
        break;

      case 'complete':
        this.completeTask();
        break;

      case 'delegate':
        break;

      case 'assign':
        this.assignTask(1);
        break;
      case 'assignanalysis':
        this.assignTask(3);
        break;
      case 'reassign':
        this.assignTask(2);
        break;

      case 'review':
        this.assignTask(3);
        break;

      case 'print':
        this.print();
        break;

      default:
        break;
    }
  }

  assignTask(opt: number, isgrps?: boolean): void {
    if (this.procForm.assignable && opt === 3) {
      this.procForm.feedbackVariableMaps = [];
      let grps;
      grps = this.procForm.assignable
        ? this.procForm.assigngroups
        : this.procForm.reviewgroups;
      grps.forEach((r) => {
        this.procForm.feedbackVariableMaps.push(this.reviewTaskConstant[r.id]);
      });
      isgrps = true;
    }

    this.taskActionSvc.assignTask(
      this.taskId,
      opt,
      (a) => {
        if (a.status) {
          if (opt === 1) {
            this.toastrSvc.success(`Task Assigned to ${a.data[0]}`);
            this.taskActionSvc.viewMyQueue();
          } else if (opt === 2) {
            this.toastrSvc.success(`Task Reassigned to ${a.data[0]}`);
            this.taskActionSvc.viewMyQueue();
          } else if (opt === 3) {
            !this.model ? (this.model = {}) : null;
            this.model.taskDecision = 'Sent for Review';
            this.model.sendForReview = true;
            this.completeTask(true);
          }
        }
      },
      [this.taskDetails],
      this.taskDocsList,
      this.commentList,
      this.procForm.feedbackVariableMaps,
      this.procForm.assignable,
      this.taskActionSvc.setLevelInfo([this.taskDetails], this.loggedUser)
    );
  }

  getCourse() {
    return this.taskDetails.variables?.find((vari) => vari.name === 'course')
      .value;
  }
  getModule() {
    return this.taskDetails.variables?.find((vari) => vari.name === 'module')
      .value;
  }

  terminateTask(): void {
    const processInst: TaskTerminateRequestModel[] = [
      {
        processInstanceId: this.taskDetails.processInstanceId,
        businessKey: this.taskDetails.variables.find(
          (i) => i.name == 'businessKey'
        ).value,
      },
    ];

    this.taskActionSvc.terminateTask(
      processInst,
      (a) => {
        if (a.status) {
          this.toastrSvc.success('Process Terminated Successfully');
          //session api start
          if (
            JSON.parse(localStorage.getItem('selected-process')).key ===
            'Initiation_preScreeningProcess'
          ) {
            const singleUpdateSessionPayload: UpdateSingleSession = {
              key: this.taskDetails.variables
                .find((i) => i.name == 'businessKey')
                .value.split('-')[1],
              businessKey: this.taskDetails.variables.find(
                (i) => i.name == 'businessKey'
              ).value,
              data: {
                iflowStatus: 2,
              },
            };
            this.whatsappSvc
              .updateSingleSession(singleUpdateSessionPayload)
              .subscribe((res) => {});
          }
          //session api end
          this.taskActionSvc.viewMyQueue();
        }
      },
      `${this.taskDetails.partnerLegalName}, ${this.taskDetails.product}, ${this.taskDetails.contractType}`
    );
  }

  unclaimTask(taskId: string): void {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('UNCLAIMED');
    let check = 0;
    this.taskDocsList.map((t) => {
      if (t.checkoutby !== null) {
        check = check + 1;
      }
    });
    if (check === 0) {
      const taskObj = {
        id: taskId,
        name: this.taskDetails.name,
        code: this.taskDetails.businessKey,
        formKey: this.taskDetails.formKey,
        processinstanceid: this.taskDetails.processInstanceId,
      };
      this.taskSvc.unclaimTask([taskObj]).subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Task returned to queue');
          this.taskActionSvc.viewMyQueue();
        }
      });
    } else {
      this.toastrSvc.warning(
        'Please check in the documents or cancel checkout to return the task to queue'
      );
    }
  }

  claimTask(taskId: string): void {
    console.log('UNCLAIMED');
    const taskObj = {
      id: taskId,
      name: this.taskDetails.name,
      code: this.taskDetails.businessKey,
      formKey: this.taskDetails.formKey,
      processinstanceid: this.taskDetails.processInstanceId,
    };
    this.taskSvc.claimTask([taskObj]).subscribe((a) => {
      if (a.status) {
        this.toastrSvc.success('Task Claimed');
        this.taskActionSvc.viewTask(this.taskDetails.id);
        this.initFn(false);
      }
    });
  }

  async completeTask(valid: boolean = false): Promise<void> {
    let checkMandatoryComment = (bKey: string, epoch: string) =>
      this.taskInfoSvc
        .checkMandatoryComment(bKey, epoch)
        .pipe(map((i) => i.data))
        .toPromise();

    let taskPass;

    let varsNameValueMap = this.taskDetails.variables.reduce((acc, cur) => {
      acc[cur.name] = cur.value;
      return acc;
    }, {});

    let body = varsNameValueMap || {};
    this.taskSvc
      .saveVariables(this.taskDetails.businessKey, {
        ...body,
        ...this.model,
      })
      .subscribe(() => {});

    if (!valid) {
      taskPass = await this.taskValidationSvc.checkTaskValidation(
        this.taskDocsList,
        this.taskDetails,
        this.model,
        this.commentList,
        checkMandatoryComment
      );
    }

    if (valid || (taskPass.valid && taskPass.commentPass)) {
      this.ngxLoaderSvc.start();
      if (!this.savedModel) {
        this.taskSvc
          .saveTaskForm(this.taskId, this.model, this.businessKey)
          .subscribe((res) => {
            if (res.status && res.data.length == 0) {
              this.taskActions.postComment(this.callCompleteTask);
            } else if (res.status) {
              this.callCompleteTask();
            } else {
              this.toastrSvc.error(
                'Not able to save form. Please try again later'
              );
            }
          });
      } else {
        this.taskActions.postComment(this.callCompleteTask);
      }
    } else if (taskPass.valid && !taskPass.commentPass) {
      let levelInfo = this.taskActionSvc.setLevelInfo(
        [this.taskDetails],
        this.loggedUser
      );
      this.taskActionSvc.openCommentModal(
        this.taskId,
        this.taskDetails.businessKey,
        this.commentList,
        this.taskDocsList,
        () => {
          localStorage.removeItem(`comment-${this.loggedUser.userid}`);
          this.ngxLoaderSvc.start();
          this.completeTask();
        },
        levelInfo
      );
    } else if (taskPass.reviewTask) {
      this.assignTask(3);
    }
  }

  callCompleteTask = (): void => {
    if (this.checkIfVariablesExistsInForm(['sapIdCustomer', 'sapIdVendor'])) {
      this.updateSapId();
    }

    if (
      this.taskDetails.formKey.includes(
        this.dmsReviewBookmarkFormKey.metadataReview
      ) ||
      this.taskDetails.formKey.includes(
        this.dmsReviewBookmarkFormKey.bookmarkReview
      )
    ) {
      this.taskActionSvc.completeReviewTask(
        this.taskDetails,
        this.model,
        this.savedModel
      );
    } else {
      this.taskActionSvc.completeTask(
        this.taskDetails,
        this.model,
        this.savedModel
      );
    }
  };

  checkIfVariablesExistsInForm(variableList: string[]) {
    if (this.procForm?.variables?.length) {
      for (let i = 0; i < this.procForm?.variables?.length; i++) {
        let vari = this.procForm?.variables[i];
        if (variableList.includes(vari.name)) {
          return true;
        }
      }
    }
    return false;
  }

  updateSapId() {
    let sapIdCustomer;
    let sapIdVendor;
    let companyCode;

    if (this.model?.sapIdCustomer) {
      sapIdCustomer = this.model.sapIdCustomer;
    }

    if (this.model?.sapIdVendor) {
      sapIdVendor = this.model.sapIdVendor;
    }

    if (!!sapIdCustomer || !!sapIdVendor) {
      companyCode = this.taskDetails.variables.find(
        (vari) => vari.name === 'companyCode' && !!vari.value
      )?.value;

      if (companyCode && sapIdCustomer) {
        this.companySvc
          .updateSapId(sapIdCustomer, 'C', companyCode)
          .subscribe((res) => {
            if (companyCode && sapIdVendor) {
              this.companySvc
                .updateSapId(sapIdVendor, 'V', companyCode)
                .subscribe();
            }
          });
      }
    }
  }

  openEditModal(): void {
    const companyId = this.taskDetails.variables.find(
      (v) => v.name == 'companyId'
    ).value;
    const modalRef = this.ngbModalSvc.open(CreateCompanyModalComponent, {
      size: 'lg',
    });
    // modalRef.componentInstance.userRole = 'accountmanager';
    modalRef.componentInstance.companyId = companyId;
    this.subscription.push(
      modalRef.componentInstance.addCompanyEvent.subscribe((a) => {
        if (a) {
          this.getCompanyById(companyId);
        }
      })
    );
  }

  getCompanyById(id: number): void {
    this.companySvc.getCompanybyId(id).subscribe((a) => {
      if (a.status) {
        this.changeCompanyDetails(a.data);
      }
    });
  }

  changeCompanyDetails(a: CompanyModel): void {
    const partnerAddrId = this.taskDetails.variables.find(
      (v) => v.name == 'partnerAddressId'
    );
    let obj = {};

    if (partnerAddrId) {
      obj = {
        partnerLegalName: a.name,
        partnerAddress: a.addresses.find((i) => i.id === partnerAddrId.value)
          .friendlyaddress,
        selectedPartnerAddress: a.addresses.find(
          (i) => i.id === partnerAddrId.value
        ).friendlyaddress,
        country: a.addresses.find((i) => i.id === partnerAddrId.value).country,
      };
    } else {
      obj = {
        partnerLegalName: a.name,
      };
    }

    this.updateProcessVariables(obj, 1);
  }

  updateProcessVariables(
    obj: any,
    opt: number = 0,
    reload: boolean = false
  ): void {
    this.taskSvc
      .saveTaskForm(this.taskId, obj, this.businessKey)
      .subscribe((a) => {
        if (a.status) {
          if (opt == 1) {
            this.updateContract();
          } else if (opt == 2) {
            this.initFn(false);
            reload ? window.location.reload() : null;
          }
        }
      });
  }

  // updateStatusMsg(strStat) {
  //   this.taskSvc
  //     .saveStatus(
  //       this.taskDetails.formKey,
  //       this.taskDetails.businessKey,
  //       strStat
  //     )
  //     .subscribe((r) => {
  //       if (r) {
  //       }
  //     });
  // }

  updateContract(): void {
    this.taskInfoSvc
      .updateCompanyDetails(this.businessKey, this.taskId)
      .subscribe((a) => {
        if (a.status) {
          this.initFn(false);
        }
      });
  }

  print() {
    const refMod = this.ngbModalSvc.open(PrintProcessDocumentModalComponent, {
      size: 'lg',
    });
    refMod.componentInstance.docs = this.taskDocsList;
    refMod.componentInstance.partnerLegalName =
      this.taskDetails.partnerLegalName;
    refMod.componentInstance.product = this.taskDetails.product;
    refMod.componentInstance.contractType = this.taskDetails.contractType;
    refMod.componentInstance.printEmitter.subscribe((p) => {
      // this.taskSvc.processDocumentDownload(p) ;
    });
  }

  returnSecondLevel(type, opt) {
    return this.taskActionSvc.returnSecondLevel(
      this.taskDetails.variables,
      type,
      opt
    );
  }

  setFeedbackVariables() {
    this.sharedSvc.feedbackVars.subscribe((a) => {
      if (a) {
        let obj = {};
        a.forEach((v) => {
          this.taskDetails.variables.find((t) => t.name === v.name)
            ? null
            : (obj[v.name] = false);
        });
        Object.keys(obj).length > 0
          ? this.updateProcessVariables(obj, 1, true)
          : null;
      } else {
        this.getFeedbackvars();
      }
    });
  }

  getFeedbackvars() {
    this.sharedSvc.getFeedbackVars().subscribe((a) => {
      if (a.status) {
        this.sharedSvc.feedbackVars.next(
          a.data.filter((a) => a.name?.includes('reviewWith'))
        );
      }
    });
  }

  getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.sharedSvc.allUsers = a.data;
    });
  }

  getAllGroup() {
    this.userSvc.getUserGroups().subscribe((a) => {
      this.sharedSvc.allGroups = a.data?.filter(
        (group) => group.id != 'camunda-admin' && group.id != 'guest'
      );
    });
  }
}

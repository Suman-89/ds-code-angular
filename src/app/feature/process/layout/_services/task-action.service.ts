import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  TaskDocumentPreviewRequestModel,
  TaskInfoModel,
  TaskTerminateRequestModel,
  TasksAutoFillTaskInfo,
  TaskDocumentModel,
  TaskCommentModel,
  TasksModel,
  UpdateSingleSession,
} from '../_models';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectUserComponent } from '../_modals/select-user/select-user.component';
import Swal from 'sweetalert2';
import { TaskInfoService } from './task-info.service';
import {
  CommentBoxConstants,
  OFACModel,
  CasePriority,
  Roles,
  TagType,
  LoggedUserModel,
  FeedbackVariableModel,
  NameModel,
} from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { FullCommentBoxModalComponent } from 'src/app/shared/_modals/full-comment-box-modal/full-comment-box-modal.component';
import { TaskService } from './task.service';
import { UserService, WhatsappService } from 'src/app/core/_services';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TerminateReasonComponent } from '../_modals/terminate-reason/terminate-reason.component';
import { PrescreeningModalComponent } from '../_modals/prescreening-modal/prescreening-modal.component';
import { BulkMessageModalComponent } from '../_modals/bulk-message-modal/bulk-message-modal.component';
import { GroupModel } from 'src/app/feature/user-management/_models';
import { BehaviorSubject } from 'rxjs';
import htmlToFormattedText from 'html-to-formatted-text';
@Injectable({ providedIn: 'root' })
export class TaskActionService {
  taskAutofillEnum = TasksAutoFillTaskInfo;
  bpmapi = environment.bpmUrl;
  dmsUrl = environment.dmsUrl;
  user: LoggedUserModel;
  taskinfoprev: TaskInfoModel;
  fromNewProcessInitiateScreen = false;
  multiConfigMentionReady = new BehaviorSubject([]);
  emailSelectedFiles = [];
  emailSelectedFileSize = 0;
  theme = JSON.parse(localStorage.getItem('theme'));
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'))?.key;

  constructor(
    private taskSvc: TaskService,
    private router: Router,
    private ngbModalSvc: NgbModal,
    private taskInfoSvc: TaskInfoService,
    private toastrSvc: ToastrService,
    private userSvc: UserService,
    private ngxLoaderSvc: NgxUiLoaderService,
    private whatsappSvc: WhatsappService
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  assignTask(
    taskId: string,
    opt: number,
    callback,
    taskDetails?: TaskInfoModel[],
    taskDocs?: TaskDocumentModel[],
    commentList?: TaskCommentModel[],
    reviewTaskConstant?: FeedbackVariableModel[],
    isanalysis?: boolean,
    levelInfo?: any
  ): void {
    const ngbModalOpt: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static',
      size: 'md',
    };
    const refMod = this.ngbModalSvc.open(SelectUserComponent, ngbModalOpt);
    this.taskinfoprev = taskDetails ? taskDetails[0] : null;
    refMod.componentInstance.taskDetails = taskDetails ? taskDetails[0] : null;
    refMod.componentInstance.opt = opt;
    if (opt === 3) {
      refMod.componentInstance.reviewTaskConstant = reviewTaskConstant;
      refMod.componentInstance.mentionConfig =
        this.getMultiMentionConfig(taskDocs);
      refMod.componentInstance.commentList = commentList;
      refMod.componentInstance.commentSubmitHandler = this.onCommentSubmitted;
      refMod.componentInstance.emitReviewDetail.subscribe((r) => {
        this.taskSvc.saveTaskDecision(r.formKey, r.bkey).subscribe();
      });
    }
    refMod.componentInstance.emitUser.subscribe((r: any[]) => {
      refMod.close();
      this.ngxLoaderSvc.start();
      // const taskObj = [{id: taskId, name: taskDetails.name, code: taskDetails.businessKey, formKey: taskDetails.formKey }]
      const taskObj = taskDetails.map((t) => {
        return {
          id: t.id,
          name: t.name,
          code: t.businessKey,
          formKey: t.formKey,
        };
      });
      if (opt === 1) {
        this.taskSvc
          .assignTask(taskObj, r[0], taskDetails[0].processInstanceId)
          .subscribe(callback);
      } else if (opt === 2) {
        this.taskSvc
          .reassignTask(
            taskObj,
            r[0],
            taskDetails[0].businessKey,
            taskDetails[0].assignee,
            taskDetails[0].processInstanceId,
            taskDetails[0].groupid
          )
          .subscribe(callback);
      } else if (opt === 3) {
        localStorage.removeItem(`comment-${this.user.userid}`);
        let model: any = isanalysis
          ? { sendForAnalysis: true }
          : { sendForReview: true, taskDecision: 'Sent For Review' };
        // { sendForAnalysis : true }
        r.forEach((i) => (model[i.variable] = true));
        if (model.reviewWithPm) {
          model.pmGroup = `pm${taskDetails[0].product.toLowerCase()}`;
        }
        this.taskSvc.saveTaskForm(taskDetails[0].id, model).subscribe(callback);
        // this.taskSvc.sendForReview(taskId, taskDetails[0].businessKey).subscribe( c => {

        // }) ;
      }
    });
  }

  saveModelUpdateContract(
    taskDetails: TaskInfoModel,
    model: any,
    callback: Function
  ): void {
    this.taskSvc
      .saveTaskForm(taskDetails.id, model, taskDetails.businessKey)
      .subscribe((a) => {
        if (a.status) {
          this.taskInfoSvc
            .updateCompanyDetails(taskDetails.businessKey, taskDetails.id)
            .subscribe((a) => {
              if (a.status) {
                callback();
              }
            });
        }
      });
  }

  terminateTask(
    terminatePayload: TaskTerminateRequestModel[],
    callback,
    text?: string
  ): void {
    const refM = this.ngbModalSvc.open(TerminateReasonComponent, {
      size: 'md',
    });
    refM.componentInstance.name = text;
    refM.componentInstance.title = `Terminate Workflow${
      terminatePayload.length > 1 ? 's' : ''
    }?`;
    refM.componentInstance.reasonEmit.subscribe((re) => {
      terminatePayload.forEach((a) => {
        a.assignee = JSON.parse(localStorage.getItem('user')).userid;
      });
      this.taskSvc
        .terminateWorkflow(terminatePayload, re as string)
        .subscribe(callback);
      refM.close();
    });
  }

  sendBulkMessage(rows, opt): void {
    const refM = this.ngbModalSvc.open(BulkMessageModalComponent, {
      size: 'lg',
    });
    refM.componentInstance.rows = rows;
    refM.componentInstance.opt = opt;
  }

  startPrescreening(rows): void {
    const refM = this.ngbModalSvc.open(PrescreeningModalComponent, {
      size: 'md',
    });
    refM.componentInstance.rows = rows;
  }

  completeReviewTask(
    taskDetails: TaskInfoModel,
    model: any = {},
    savedModel: boolean = false
  ): void {
    let previewRequest = {} as TaskDocumentPreviewRequestModel;
    this.mapToPreviewModel(previewRequest, taskDetails, model);
    this.taskinfoprev = taskDetails;

    this.taskSvc
      .completeReviewTask(taskDetails.id, previewRequest)
      .subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success(`Task "${taskDetails.name}" Completed`);
          this.resetStatus(taskDetails);
          this.nextTask(taskDetails);
        }
      });
  }

  completeTask(
    taskInfo: TaskInfoModel,
    model: any = {},
    savedModel: boolean = false
  ): void {
    const obj = {
      businessKey: taskInfo.businessKey,
      formKey: taskInfo.formKey,
    };
    this.taskinfoprev = taskInfo;
    this.taskSvc.completeTask(taskInfo.id, obj).subscribe((a) => {
      if (a.status) {
        //session api call start
        if (
          JSON.parse(localStorage.getItem('selected-process')).key ===
          'Initiation_preScreeningProcess'
        ) {
          const singleUpdateSessionPayload: UpdateSingleSession = {
            key: taskInfo.variables
              .find((i) => i.name == 'businessKey')
              .value.split('-')[1],
            businessKey: taskInfo.variables.find((i) => i.name == 'businessKey')
              .value,
            data: {
              iflowStatus: 1,
            },
          };
          this.whatsappSvc
            .updateSingleSession(singleUpdateSessionPayload)
            .subscribe((res) => {});
        }
        //session api call end
        this.toastrSvc.success(`Task "${taskInfo.name}" Completed`);
        a.data?.tasks?.find((a) => a.groupid === taskInfo.groupid)
          ? this.resetStatus()
          : null;

        if (
          taskInfo.formKey === this.taskAutofillEnum.signatoryOfac &&
          !model.needAddtlInfo
        ) {
          let partnerId = taskInfo.variables.find(
            (i) => i.name === 'companyId'
          ).value;

          let ofacModel: OFACModel = {
            signatoryname: model.partnerSigName,
            ofacdate: model.signatoryOfacCheckDate,
            outcome: model.signatoryOfacOk ? 'PASS' : 'FAILED',
            issignatory: true,
            transactionid: model.transactionid,
          };
          this.taskInfoSvc
            .addSignatoryCheck(ofacModel, partnerId)
            .subscribe((c) => {
              if (c.status) {
                this.proceedTask(taskInfo, model);
              }
            });
        } else if (
          taskInfo.formKey === this.taskAutofillEnum.companyOfacCheck &&
          !model.needAddtlInfo
        ) {
          let partnerId = taskInfo.variables.find(
            (i) => i.name === 'companyId'
          ).value;
          const companyOfacModel: OFACModel = {
            signatoryname: '',
            ofacdate: model.companyOfacCheckDate,
            outcome: model.companyOfacOk ? 'PASS' : 'FAILED',
            issignatory: false,
            transactionid: model.transactionid,
          };
          this.taskInfoSvc
            .addCompanyOfacCheck(companyOfacModel, partnerId)
            .subscribe((c) => {
              if (c.status) {
                this.proceedTask(taskInfo, model);
              }
            });
        } else if (taskInfo.formKey === this.taskAutofillEnum.companyOfacInit) {
          const data = {
            metadata: {
              partnerLegalName: taskInfo.partnerLegalName,
              companyCode: taskInfo.variables.find(
                (t) => t.name === 'companyCode'
              ).value,
              businessKey: taskInfo.businessKey,
            },
            ofactype: model.dealInvolvesBroker,
          };
          if (
            !model.dealInvolvesBroker &&
            !model.caseInvolvesOfacSantionedCountries &&
            !model.companyOffshoreContractingEntity &&
            !model.ofacKycConcerns
          ) {
            this.proceedTask(taskInfo, model);
          } else {
            this.taskSvc.ofacQuestionarePost(data).subscribe((q) => {
              if (q.status) {
                this.proceedTask(taskInfo, model);
              }
            });
          }
        } else {
          this.proceedTask(taskInfo, model);
        }
      }
    });
  }

  mapToPreviewModel(
    previewRequest: TaskDocumentPreviewRequestModel,
    taskDetails: TaskInfoModel,
    model
  ): void {
    previewRequest.companyname = taskDetails.variables.find(
      (v) => v.name === 'partnerLegalName'
    )?.value;
    previewRequest.product = taskDetails.variables.find(
      (v) => v.name === 'product'
    )?.value;
    previewRequest.contracttype = taskDetails.variables.find(
      (v) => v.name === 'contractType'
    )?.value;
    previewRequest.businessKey = taskDetails.variables.find(
      (v) => v.name == 'businessKey'
    )?.value;
    previewRequest.companyCode = taskDetails.variables.find(
      (v) => v.name === 'companyCode'
    )?.value;
    previewRequest.initiator = taskDetails.initiator;
    // previewRequest.initiatorName = taskDetails.initiatorname;
    previewRequest.bookmark = taskDetails.formKey.includes(
      this.taskAutofillEnum.bookmarkReview
    );
    previewRequest.variables = { ...model };
    previewRequest.variables.partnerLegalName = previewRequest.companyname;
    previewRequest.variables.product = previewRequest.product;
    previewRequest.variables.contractType = previewRequest.contracttype;
    previewRequest.variables.initiatorName = taskDetails.initiatorname;
    previewRequest.variables.preferredLanguage = taskDetails.variables.find(
      (v) => v.name === 'preferredLanguage'
    )?.value;

    previewRequest.formKey = taskDetails.formKey;
    const ibasisContractingEntity = taskDetails.variables.find(
      (v) => v.name === 'ibasisContractingEntity'
    )?.value;
    previewRequest.variables.ibasisContractingEntityLegalName =
      ibasisContractingEntity;
    previewRequest.variables = {
      ...previewRequest.variables,
      ibasisContractingEntity: ibasisContractingEntity,
    };

    if (taskDetails.formKey.includes(this.taskAutofillEnum.metadataReview)) {
      previewRequest.purged = model.purgeOldDocs;
    }
  }

  getDefaultFile(list: string[]): string {
    let doc: string = list.find((a) => a === 'Business Case');
    if (!doc) {
      doc = list.find((a) => a === 'In Process' || a === 'Contract Document');
    }
    if (!doc) {
      doc = list.find((a) => a === 'Executed Contracts');
    }
    if (!doc) {
      doc = list.find((a) => a === 'Company Documents');
    }
    if (!doc) {
      doc = list.find((a) => a === 'Miscellaneous' || a === 'Other');
    }
    if (!doc) {
      doc = list.find((a) => a === 'Business Case');
    }
    if (!doc) {
      doc = list[0];
    }
    return doc;
  }

  getDocTypefromFolder(foldername: string, doc: TaskDocumentModel): string {
    switch (foldername) {
      case 'Company Documents':
        return doc.metadata.Docmeta[0].name;

      case 'OFAC Documents':
        return doc.metadata.Docmeta[0].name;

      case 'In Process':
        return doc.metadata.template[0].name;

      case 'Business Case':
        return doc.metadata.Docmeta[0].name;

      case 'Executed Contracts':
        return doc.metadata.template[0].name;

      case 'Final-unsigned':
        return doc.metadata.template[0].name;

      case 'KYC Documents':
        return doc.metadata.docType;

      case 'Miscellaneous':
        return 'NA';

      case 'Other':
        return 'NA';

      case 'Opportunity Documents':
        return 'NA';

      default:
        return doc.metadata?.Docmeta[0]?.name || '';
    }
  }

  checkConfidential(document: TaskDocumentModel, inituser?: string): boolean {
    const user = JSON.parse(localStorage.getItem('user'));

    return document.confidential
      ? user.roles.includes(Roles.SUPER_ADMIN) ||
          user.roles.includes(Roles.LEGAL_ADMIN) ||
          user.roles.includes(Roles.LEGAL_USER) ||
          user.userid === document.createduserid ||
          inituser === user.userid
      : true;
  }

  proceedTask(taskDetails: TaskInfoModel, model): void {
    let toQueue = false;
    if (
      taskDetails.formKey === this.taskAutofillEnum.sendToPartnerForReview &&
      !model.sendToLegalForReview
    ) {
      toQueue = true;
    } else if (
      taskDetails.formKey === this.taskAutofillEnum.sendToPartnerApproval ||
      taskDetails.formKey === this.taskAutofillEnum.sendToPartnerApprovalOfac ||
      taskDetails.formKey === this.taskAutofillEnum.sendToPartnerForReviewOfac
    ) {
      toQueue = true;
    } else if (
      taskDetails.formKey === this.taskAutofillEnum.prepareiBasisSig &&
      !model.sendToSales &&
      model.legalApproved
    ) {
      toQueue = true;
    } else if (
      taskDetails.formKey === this.taskAutofillEnum.sendForPartnerSig &&
      !model.sendToLegal
    ) {
      toQueue = true;
    } else if (taskDetails.formKey === this.taskAutofillEnum.sendProposal) {
      toQueue = true;
    } else if (taskDetails.formKey === this.taskAutofillEnum.sendProposal) {
      toQueue = true;
    }

    if (toQueue) {
      this.viewMyQueue();
    } else {
      this.nextTask(taskDetails);
    }
  }

  getMultiMentionConfig(docList?: TaskDocumentModel[]) {
    let multiMentionConfig = { mentions: [] };

    this.getUsers(multiMentionConfig);
    this.getAllGroup(multiMentionConfig);
    this.getDocumentList(multiMentionConfig, docList);
    return multiMentionConfig;
  }

  getUsers(multiMentionConfig): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      multiMentionConfig.mentions.push({
        items: a.data,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
      this.multiConfigMentionReady.next([
        ...this.multiConfigMentionReady.value,
        'USERS',
      ]);
    });
  }

  getAllGroup(multiMentionConfig) {
    // this.userSvc.getUserGroups().subscribe((a) => {
    //   multiMentionConfig.mentions.push({
    //     items: a.data?.filter(
    //       (group) => group.id != 'camunda-admin' && group.id != 'guest'
    //     ),
    //     triggerChar: '#',
    //     insertHtml: true,
    //     labelKey: 'name',
    //     mentionSelect: this.insertGroupTagHtml,
    //   });
    //   this.multiConfigMentionReady.next([
    //     ...this.multiConfigMentionReady.value,
    //     'GROUPS',
    //   ]);
    // });
    let groupDataByProcessName = JSON.parse(
      localStorage.getItem('selected-process')
    ).participatingGroups;
    if (groupDataByProcessName.length > 0) {
      multiMentionConfig.mentions.push({
        items: groupDataByProcessName?.filter(
          (group) => group.id != 'camunda-admin' && group.id != 'guest'
        ),
        triggerChar: '#',
        insertHtml: true,
        labelKey: 'name',
        mentionSelect: this.insertGroupTagHtml,
      });
      this.multiConfigMentionReady.next([
        ...this.multiConfigMentionReady.value,
        'GROUPS',
      ]);
    } else {
      multiMentionConfig.mentions.push({
        items: groupDataByProcessName,
        triggerChar: '#',
        insertHtml: true,
        labelKey: 'name',
        mentionSelect: this.insertGroupTagHtml,
      });
      this.multiConfigMentionReady.next([
        ...this.multiConfigMentionReady.value,
        'GROUPS',
      ]);
    }
  }

  getDocumentList(multiMentionConfig, docList?) {
    multiMentionConfig.mentions.push({
      items: docList ? docList : [],
      triggerChar: '$',
      insertHtml: true,
      labelKey: 'name',
      mentionSelect: this.insertDocTagHtml,
    });
    this.multiConfigMentionReady.next([
      ...this.multiConfigMentionReady.value,
      'DOCUMENTS',
    ]);
  }

  public insertUserTagHtml(user) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${user.userid}" data-tagtype="${TagType.USER}"
      contenteditable="false"
      >${user.fullname}</span>`;
  }

  public insertGroupTagHtml(group) {
    return `<span
      class="mention group-mention" style="color: #2aa89b"  id="${group.id}" data-tagtype="${TagType.GROUP}"
      contenteditable="false"
      >${group.name}</span>`;
  }

  public insertDocTagHtml = (doc) => {
    return `<span
      class="mention doc-mention" style="color: #0275d8"  id="${doc.name}" data-tagtype="${TagType.DOCUMENT}"
      data-version="${doc.version}" contenteditable="false"
      ><a href="${this.dmsUrl}/file/${doc.contentid}" target="_blank" style="color: ${this.theme.tertiarycolor}">${doc.name}_v${doc.version}</a></span>`;
  };

  openCommentModal(
    taskId: string,
    businessKey: string,
    comments: TaskCommentModel[],
    docList: TaskDocumentModel[],
    callback?: Function,
    levelInfo?
  ): void {
    let multiMentionConfig = this.getMultiMentionConfig(docList);

    const modalRef = this.ngbModalSvc.open(FullCommentBoxModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.mentionConfig = multiMentionConfig;
    modalRef.componentInstance.commentBoxOptions = {
      allowFullScreen: false,
      height: 300,
      plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
      toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
    };
    modalRef.componentInstance.onSubmitted.subscribe((e) => {
      this.onCommentSubmitted(
        e,
        taskId,
        businessKey,
        comments,
        callback,
        levelInfo
      );
    });
  }

  onCommentSubmitted = (
    htmlstring,
    taskId,
    businessKey,
    commentList,
    callback?: Function,
    levelInfo?: string,
    processName?: string
  ): void => {
    if (htmlstring) {
      let reqdata = {
        message: htmlstring,
        users: [],
        groups: [],
        documents: [],
      } as TaskCommentModel;
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
      if (htmlDoc?.children[0]['innerText'].trim()) {
        let mentions = htmlDoc.getElementsByClassName('mention');
        for (var i = 0; i < mentions.length; i++) {
          if (mentions[i]['dataset'].tagtype == TagType.USER) {
            reqdata.users.push(mentions[i].id);
          } else if (mentions[i]['dataset'].tagtype == TagType.GROUP) {
            reqdata.groups.push(mentions[i].id);
          } else if (mentions[i]['dataset'].tagtype == TagType.DOCUMENT) {
            let version = mentions[i]['dataset'].version;
            reqdata.documents.push({
              name: mentions[i].id,
              version,
            });
          }
        }
        reqdata.levelInfo = levelInfo;
        this.taskInfoSvc
          .postComment(reqdata, taskId, businessKey, processName)
          .subscribe((a) => {
            if (a.status) {
              //this.commentObj = {message: '', users: []} as TaskCommentModel;
              localStorage.removeItem(`comment-${this.user?.userid}`);
              commentList.unshift(a.data);
              if (callback) {
                callback();
              }
            }
          });
      }
    }
  };

  onTranscriptSubmitted = (
    htmlstring,
    businessKey,
    commentList,
    uniqueUserIdentifier,
    userFullName,
    messageSource,
    callback?: Function,
    subject?: string,
    emailReceivers?: any[],
    mobileNumber?,
    attachments?
  ): void => {
    if (htmlstring) {
      const timestamp = new Date().toISOString();
      let formData = new FormData();
      let whatsappFormData = new FormData();
      if (attachments) {
        attachments.forEach((file) => {
          formData.append('multipartFiles', file);
          whatsappFormData.append('file', file);
        });
      }
      formData.append('businessKey', businessKey);
      formData.append('messageSource', messageSource);

      let reqdata = {
        subject: subject,
        sentText: htmlstring,
        timestamp: timestamp,
        options: [],
        uniqueUserIdentifier: uniqueUserIdentifier,
        userFullName: userFullName,
        isBot: true,
        emailReceivers: emailReceivers,
      };
      formData.append('dtoStr', JSON.stringify(reqdata));

      //  return

      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
      let formattedText = htmlToFormattedText(
        htmlDoc?.children[0].innerHTML
      ).trim();
      let plainText = formattedText.replace(/\n/gm, ' ');
      let whatsappData = {
        mobileNum: mobileNumber,
        message: plainText,
        sentFrom: userFullName,
        businessKey: businessKey,
      };

      let selProcess = JSON.parse(
        localStorage.getItem('selected-process')
      )?.name;

      whatsappFormData.append('usecase', selProcess);
      whatsappFormData.append('sentFrom', userFullName);
      whatsappFormData.append('uniqueUserIdentifier', mobileNumber);
      whatsappFormData.append('message', plainText);

      if (plainText) {
        let mentions = htmlDoc.getElementsByClassName('mention');
        if (messageSource == 'whatsapp') {
          if (this.selectedProcess === 'Initiation_preScreeningProcess') {
            this.whatsappSvc
              .singleSendMessageReca(whatsappData)
              .subscribe((a) => {
                if (a.status) {
                  this.toastrSvc.success(a.message);
                  commentList.unshift(a.data);
                } else {
                  this.toastrSvc.error(a.message);
                }
              });
          }
          //  else if (
          //   this.selectedProcess === 'Initiation_surbhiTravelProcess'
          // ) {
          //   this.taskSvc.getContractById(businessKey).subscribe((data) => {
          //     if (data.status) {
          //       let initiator = data.data.processvariables.initiator;
          //       this.userSvc.getUser(initiator).subscribe((a) => {
          //         if (a.status) {
          //           let phone = a.data.phoneNumber?.replace(/\D/g, '');
          //           whatsappFormData.delete('uniqueUserIdentifier');
          //           whatsappFormData.append('uniqueUserIdentifier', phone);
          //           this.whatsappSvc
          //             .postWhatsappWithFile(whatsappFormData)
          //             .subscribe((a) => {
          //               if (a) {
          //                 this.toastrSvc.success(a.message);
          //               }
          //             });
          //         }
          //       });
          //     }
          //   });
          // }
          else {
            this.whatsappSvc
              .singleSendMessageAys(whatsappFormData)
              .subscribe((a) => {
                if (a) {
                  this.toastrSvc.success(a.message);
                }
              });
          }
        } else {
          this.taskInfoSvc.postTranscript(formData).subscribe((a) => {
            if (a.status) {
              localStorage.removeItem(`comment-${this.user?.userid}`);
              commentList.unshift(a.data);
              if (callback) {
                callback();
              }
            }
          });
        }
      }
    }
  };

  viewTask(taskId: string): void {
    this.router.navigate([`/landing/process/view-task/${taskId}`]);
  }
  //comment out to stop routing while opening compare model
  // compareTask(): void {
  //   this.router.navigate([`/landing/process/compare-task`]);
  // }

  viewMyQueue(): void {
    this.router.navigate([`/landing/process/my-queue`]);
  }

  viewMyContract(contractId: string): void {
    this.router.navigate([`/landing/process/view-contract/${contractId}`]);
  }

  // nextTask(businessKey: string, processId: string): void {
  //   this.router.navigate([
  //     `/landing/process/next/${processId}/${businessKey}/task`,
  //   ]);
  // }

  nextTask(taskDetails, fromNewProcessInitiateScreen = false): void {
    this.fromNewProcessInitiateScreen = fromNewProcessInitiateScreen;
    if (taskDetails.groupid === 'legal') {
      this.router.navigate([
        `/landing/process/next/${taskDetails.processInstanceId}/${taskDetails.businessKey}/task/${taskDetails.formKey}/${taskDetails.id}`,
      ]);
    } else {
      this.router.navigate([
        `/landing/process/next/${taskDetails.processInstanceId}/${taskDetails.businessKey}/task`,
      ]);
    }
  }

  downloadReport(taskId, actionid, viewtype, localTimeZone) {
    let key;
    switch (actionid) {
      case 'audit':
        key = 1;
        break;
      case 'info':
        key = 2;
        break;
      case 'comment':
        key = 3;
        break;
      case 'transcript':
        key = 4;
        break;
    }
    this.taskSvc
      .reportDownload(taskId, key, viewtype, localTimeZone)
      .subscribe((a) => {
        if (a.status) {
          window.open(`${this.bpmapi}report/${a.data}`);
        }
      });
  }

  processDocumentDownload(obj) {
    if (obj) {
      window.open(`${this.dmsUrl}/file/zip/` + obj);
    }
  }

  downloadZipSupportingDoc(id, businessKey) {
    this.taskSvc.reportDownloadZip(id, businessKey).subscribe((r) => {
      if (r.status) {
        window.open(`${this.bpmapi}report/${r.data}?ext=zip`);
      }
    });
  }

  getFlagStyle(taskDetails): any {
    switch (taskDetails.casePriority) {
      case CasePriority.HIGH:
        return { color: 'rgb(245, 0, 0)', border: '2px solid rgb(245, 0, 0)' };
      case CasePriority.MEDIUM:
        return { color: 'rgb(0 195 255)', border: '2px solid rgb(0 195 255)' };
      default:
        return {
          color: 'rgb(216, 216, 216)',
          border: '2px solid rgb(216, 216, 216)',
        };
    }
  }

  returnSecondLevel(variables, type, opt) {
    let sl;
    let checkvar;
    if (type === 'Amendment') {
      opt = 3;
    }
    switch (opt) {
      case 1:
        checkvar =
          variables.find((a) => a.name === 'product').value === 'IOT' &&
          variables.find((a) => a.name === 'contractTypeSecondLevel').value ===
            '' &&
          variables.find((a) => a.name === 'contractType').value ===
            'Service Contract'
            ? 'iotContractType'
            : 'contractTypeSecondLevel';

        sl = variables.find((v) => v.name === checkvar);
        return sl && sl.value.length > 0 ? `${type} (${sl.value})` : type;
      case 2:
        sl = variables.find((v) => v.name === 'productSecondLevel');
        return sl && sl.value.length > 0 ? `${type} (${sl.value})` : type;
      case 3: // Amendment Type
        let tl;
        tl = variables.find((v) => v.name === 'currencyAmendmentType')
          ? variables.find((v) => v.name === 'currencyAmendmentType').value
          : variables.find((v) => v.name === 'additionalSvcType').value;
        if (tl === undefined || tl.length === 0) {
          tl = '';
        } else {
          tl = ' - ' + tl;
        }
        sl = variables.find((v) => v.name === 'contractTypeSecondLevel');
        return sl && sl.value.length > 0 ? `${type} (${sl.value}${tl})` : type;
    }
  }

  setLevelInfo(tasks: TaskInfoModel[], loggeduser: LoggedUserModel): string {
    let task = tasks.filter((a) => a.assignee === loggeduser.userid);
    let tname = tasks.length === 1 ? ': ' + tasks[0].name : '';
    return task?.length === 1
      ? `Task-Level Comment: ${task[0].name}`
      : `Contract-Level Comment ${tname}`;
  }

  resetStatus(taskinfo?, procVarList?) {
    if (this.fromNewProcessInitiateScreen) {
      this.fromNewProcessInitiateScreen = false;
      return;
    }
    if (this.taskinfoprev) {
      let trig = 1;
      if (taskinfo) {
        trig = taskinfo.groupid !== this.taskinfoprev?.groupid ? 1 : 0;
      }
      trig === 1
        ? this.taskSvc
            .saveStatus(
              this.taskinfoprev?.formKey,
              this.taskinfoprev?.businessKey,
              ' '
            )
            .subscribe((r) => {
              if (r.status) {
                taskinfo?.id
                  ? this.taskSvc
                      .saveTaskForm(
                        taskinfo.id,
                        { status: ' ' },
                        this.taskinfoprev.businessKey
                      )
                      .subscribe((r) => {})
                  : null;
                this.taskSvc
                  .saveVariables(this.taskinfoprev.businessKey, {
                    ...procVarList,
                    status: ' ',
                  })
                  .subscribe((r) => {});
              }
            })
        : null;
    }
  }
}

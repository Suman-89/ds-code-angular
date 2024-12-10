import { Injectable } from '@angular/core';
import {
  TasksAutoFillTaskInfo,
  TaskDocumentModel,
  TaskInfoModel,
  DocumentCategoryName,
  TaskCommentModel,
} from '../_models';
import { LoggedUserModel } from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TaskValidationService {
  taskName = TasksAutoFillTaskInfo;
  documentCategoryName = DocumentCategoryName;
  firstTime = true;
  commentsCheckFn = null;

  constructor(private toastrSvc: ToastrService) {}

  async checkTaskValidation(
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    comments: TaskCommentModel[],
    commentsFn
  ) {
    const loggedUser: LoggedUserModel = JSON.parse(
      localStorage.getItem('user')
    );
    let task = { valid: false, commentPass: false, reviewTask: false };
    this.commentsCheckFn = commentsFn;

    if (taskDetails.commentMandatory) {
      task.commentPass = await this.commentAdded(
        taskDetails,
        comments,
        loggedUser
      );
    } else {
      task.commentPass = true;
    }
    if (this[taskDetails.formKey]) {
      const temp = await this[taskDetails.formKey](
        docList,
        taskDetails,
        model,
        loggedUser,
        comments
      );
      task = { ...task, ...temp };
    } else {
      task.valid = await this.defaultCondition(
        docList,
        taskDetails,
        model,
        loggedUser
      );
    }

    return task;
  }

  commentAdded = async (
    taskDetails: TaskInfoModel,
    comments: TaskCommentModel[],
    loggedUser: LoggedUserModel
  ) => {
    let epoch = new Date(taskDetails.created).getTime();
    epoch = Math.floor(epoch / 1000);

    const commentMade = await this.commentsCheckFn(
      taskDetails.businessKey,
      epoch
    );

    if (commentMade !== 0) {
      return true;
    } else {
      this.toastrSvc.warning('Comment is mandatory');
      return false;
    }
  };

  uploadPartnerSign = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUpdated = true;
    const isSOF = taskDetails.variables.filter(
      (i) => i.name === 'isThisSofContractSig'
    );

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }

      if (
        i.foldername == this.documentCategoryName.inProcess &&
        ((isSOF[0] && isSOF[0].value && i.metadata.docType === 'Mobile SOF') ||
          ((!isSOF[0] || !isSOF[0].value) &&
            i.metadata.docType !== 'Mobile SOF'))
      ) {
        if (i.updateuserid !== loggedUser.userid) {
          docUpdated = false;
        }
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUpdated) {
      this.toastrSvc.warning('Upload Signed Documents to continue');
      return { valid: false };
    } else if (!model.partnerSignedNda) {
      this.toastrSvc.warning('Partner Signature is required to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  contractSigIbasisSig = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUpdated = true;
    const isSOF = taskDetails.variables.filter(
      (i) => i.name === 'isThisSofContractSig'
    );

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }

      if (
        i.foldername == this.documentCategoryName.inProcess &&
        ((isSOF[0] && isSOF[0].value && i.metadata.docType === 'Mobile SOF') ||
          ((!isSOF[0] || !isSOF[0].value) &&
            i.metadata.docType !== 'Mobile SOF'))
      ) {
        if (i.updateuserid !== loggedUser.userid) {
          docUpdated = false;
        }
      }
    });

    // td if not not appproved then no need of check in just check doc upload
    if (model.taskDecision == 'Negotiate') {
      if (!docUpdated && !model.returnToAm) {
        this.toastrSvc.warning('Upload Signed Documents to continue');
        return { valid: false };
      }
    }

    if (model.taskDecision == 'Approve') {
      if (!docCheckedIn) {
        this.toastrSvc.warning('Please check in documents to continue');
        return { valid: false };
      } else if (!docUpdated && !model.returnToAm) {
        this.toastrSvc.warning('Upload Signed Documents to continue');
        return { valid: false };
      } else if (!model.returnToAm && !model.ibasisSignedNda) {
        this.toastrSvc.warning('iBasis Signature is required to continue');
        return { valid: false };
      } else {
        return { valid: true };
      }
    } else {
      return { valid: true };
    }
  };

  contractSigIbasisSigSOF = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUpdated = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }

      if (
        i.foldername == this.documentCategoryName.inProcess &&
        i.metadata.docType === 'Mobile SOF'
      ) {
        if (i.updateuserid !== loggedUser.userid) {
          docUpdated = false;
        }
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUpdated) {
      this.toastrSvc.warning('Upload Signed Documents to continue');
      return { valid: false };
    } else if (!model.returnToAm && !model.ibasisSignedNda) {
      this.toastrSvc.warning('iBasis Signature is required to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  attachPartnerNda = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docFound = false;
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
      if (i.foldername == this.documentCategoryName.inProcess) {
        docFound = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docFound) {
      this.toastrSvc.warning('Please upload contract document to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  partnerApproval = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUpdated = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby === loggedUser.userid) {
        docCheckedIn = false;
      }
      if (i.foldername === this.documentCategoryName.inProcess) {
        if (
          !model.partnerApprovalReceived &&
          (!i.updateuserid || i.updateuserid !== loggedUser.userid)
        ) {
          docUpdated = false;
        }
        if (model.partnerSignedNda && i.updateuserid !== loggedUser.userid) {
          docUpdated = false;
        }
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUpdated) {
      this.toastrSvc.warning('Please upload contract document to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  legalApproval = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docFound = true;
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby === loggedUser.userid) {
        docCheckedIn = false;
      }
      if (
        i.foldername === this.documentCategoryName.inProcess &&
        !model.legalApproved &&
        (!i.updateuserid || i.updateuserid !== loggedUser.userid)
      ) {
        docFound = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docFound) {
      this.toastrSvc.warning('Please upload contract document to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  commonLegalApproval = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docFound = model.taskDecision == 'Negotiate' ? false : true;
    let docCheckedIn = true;
    let checkincount = 0;
    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
      // if(i.updateuserid == loggedUser.userid && i.foldername ===  this.documentCategoryName.inProcess) {
      //  checkincount = checkincount+1
      // }
      if (
        i.foldername === this.documentCategoryName.inProcess &&
        i.updateuserid === loggedUser.userid
      ) {
        docFound = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docFound && !model.sendtocredit) {
      this.toastrSvc.warning('Please upload contract document to continue');
      return { valid: false };
    } else if (
      model.taskDecision == 'Approve' ||
      model.taskDecision == 'Negotiate' ||
      model.taskDecision == 'Reject BC'
    ) {
      return {
        valid: true,
        commentPass: await this.commentAdded(taskDetails, comments, loggedUser),
      };
    } else if (model.taskDecision == 'Review') {
      return { valid: false, commentPass: false, reviewTask: true };
    } else {
      return { valid: true };
    }
  };

  legalPartnerApproval = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docUpdated = true;
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby === loggedUser.userid) {
        docCheckedIn = false;
      }
      if (i.foldername === this.documentCategoryName.inProcess) {
        if (
          !model.commonPartnerApprovalReceived &&
          (!i.updateuserid || i.updateuserid !== loggedUser.userid)
        ) {
          docUpdated = true;
        }
        if (model.partnerSignedNda && i.updateuserid !== loggedUser.userid) {
          docUpdated = false;
        }
      }
    });
    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUpdated) {
      this.toastrSvc.warning('Please upload contract document to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  ndaSendToPartnerForReview = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (
        i.foldername === this.documentCategoryName.inProcess &&
        (!i.checkoutby || i.checkoutby !== loggedUser.userid)
      ) {
        docCheckedIn = false;
      }
    });

    if (!model.sendToPartner) {
      this.toastrSvc.warning('Document needs to be sent to continue');
      return { valid: false };
    } else if (!docCheckedIn) {
      this.toastrSvc.warning('Document needs to be checked out to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  sendToPartnerForReview = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docOnlyCheckedout = true;

    if (Object.keys(model).includes('commonSendToPartner')) {
      docList.forEach((i) => {
        if (i.foldername === this.documentCategoryName.inProcess) {
          if (
            !model.sendToLegalForReview &&
            (!i.checkoutby || i.checkoutby !== loggedUser.userid)
          ) {
            docCheckedIn = false;
          }
          if (
            model.sendToLegalForReview &&
            !!i.checkoutby &&
            i.checkoutby === loggedUser.userid
          ) {
            docOnlyCheckedout = false;
          }
        }
      });

      if (!model.commonSendToPartner && !model.sendToLegalForReview) {
        this.toastrSvc.warning('Document needs to be sent to continue');
        return { valid: false };
      } else if (!docCheckedIn) {
        this.toastrSvc.warning('Document needs to be checked out to continue');
        return { valid: false };
      } else if (!docOnlyCheckedout) {
        this.toastrSvc.warning('Document needs to be checked in to continue');
        return { valid: false };
      } else {
        return { valid: true };
      }
    } else {
      let docCheckedIn = true;
      docList.forEach((i) => {
        if (
          i.foldername === this.documentCategoryName.inProcess &&
          (!i.checkoutby || i.checkoutby !== loggedUser.userid)
        ) {
          docCheckedIn = false;
        }
      });
      if (!docCheckedIn) {
        this.toastrSvc.warning('Document needs to be checked out to continue');
        return { valid: false };
      } else {
        return { valid: true };
      }
    }
  };

  sendForPartnerSig = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let ofacStat = taskDetails.variables.find(
      (i) => i.name == 'ofacStatus'
    ).value;

    if (ofacStat && ofacStat.toLowerCase().includes('pending')) {
      this.toastrSvc.warning('Please complete company OFAC check');
      return { valid: false };
    } else if (!model.sentForPartnerSignature && !model.sendToLegal) {
      this.toastrSvc.warning('Send Document to Partner to continue');
      return { valid: false };
    } else if (model.sendToLegal) {
      let docCheckedIn = true;

      docList.forEach((i) => {
        if (i.checkoutby && i.checkoutby == loggedUser.userid) {
          docCheckedIn = false;
        }
      });

      if (docCheckedIn) {
        return { valid: true };
      } else {
        this.toastrSvc.warning('Please check in documents to continue');
        return { valid: false };
      }
    } else {
      let docCheckedIn = true;

      docList.forEach((i) => {
        if (
          i.foldername === this.documentCategoryName.inProcess &&
          (!i.checkoutby || i.checkoutby !== loggedUser.userid)
        ) {
          docCheckedIn = false;
        }
      });

      if (!docCheckedIn) {
        this.toastrSvc.warning('Document needs to be checked out to continue');
        return { valid: false };
      } else {
        return { valid: true };
      }
    }
  };

  legalReview = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let ofacStat = taskDetails.variables.find(
      (i) => i.name == 'ofacStatus'
    ).value;

    if (ofacStat && ofacStat.toLowerCase().includes('pending')) {
      this.toastrSvc.warning('Please complete company OFAC check');
      return { valid: false };
    } else if (
      !model.sendToSales ||
      model.taskDecisionNoRestart === 'Negotiate'
    ) {
      let docCheckedIn = true;

      docList.forEach((i) => {
        if (i.checkoutby && i.checkoutby == loggedUser.userid) {
          docCheckedIn = false;
        }
      });

      if (docCheckedIn) {
        return { valid: true };
      } else {
        this.toastrSvc.warning('Please check in documents to continue');
        return { valid: false };
      }
    } else {
      return { valid: true };
    }
  };

  ofacSendQuestionnaireToPartner = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    if (!model.questionnaireSentToPartner) {
      this.toastrSvc.warning('Questionnaire needs to be sent to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  submitCompanyOfac = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUpdated = false;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }

      if (
        i.foldername == this.documentCategoryName.ofac &&
        i.updateuserid == loggedUser.userid
      ) {
        docUpdated = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUpdated) {
      this.toastrSvc.warning('Upload Filled in Questionnaire to continue');
      return { valid: false };
    } else if (!model.completedQuestionnaire) {
      this.toastrSvc.warning('Questionnaire needs to be completed to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  voiceInitiateNewContract = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUploaded = false;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }

      if (
        i.foldername == this.documentCategoryName.businessCase &&
        i.createduserid == loggedUser.userid
      ) {
        docUploaded = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUploaded) {
      this.toastrSvc.warning('Please upload Business Case');
      return { valid: false };
    } else if (model.orderType == 'Expansion') {
      this.toastrSvc.warning(
        'Order Type Expansion is handled outside the system'
      );
      return { valid: true };
    } else if (model.orderType == 'Migration') {
      this.toastrSvc.warning(
        'Order Type Migration is handled outside the system'
      );
      return { valid: true };
    } else {
      return { valid: true };
    }
  };

  attachContractDocuments = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docFound = false;
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
      if (i.foldername == this.documentCategoryName.inProcess) {
        docFound = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docFound) {
      this.toastrSvc.warning('Please upload contract document to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  voiceBcMatchesCont = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!model.bcMatchesContract) {
      this.toastrSvc.warning('BC needs to match to proceed');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  iotOfferGuide = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUploaded = false;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }

      if (
        i.foldername == this.documentCategoryName.businessCase &&
        i.createduserid == loggedUser.userid
      ) {
        docUploaded = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUploaded) {
      this.toastrSvc.warning('Please upload Business Case');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  dmsAutofillMeta = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;
    let docUpdated = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }

      if (
        i.foldername == this.documentCategoryName.inProcess &&
        i.metadata.products[0] &&
        i.metadata.products[0].name == taskDetails.product &&
        i.metadata.contracttype[0] &&
        i.metadata.contracttype[0].name == taskDetails.contractType
      ) {
        if (!i.mimetype.toLowerCase().includes('pdf')) {
          docUpdated = false;
        }
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docUpdated) {
      this.toastrSvc.warning('Upload pdf version of all contract documents');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  commonBcMatchesCont = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!model.bcMatchesContract) {
      this.toastrSvc.warning('Business Case should match contract documents');
      return { valid: false };
    } else if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  uploadHistoricalContract = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!model.historicalDocumentUploaded) {
      this.toastrSvc.warning(
        'Need to upload historical documents before continuing'
      );
      return { valid: false };
    } else if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  interConnectCheckTechnicalAspects = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  taskDecisionTasksNR = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (
      model.taskDecisionNoRestart == 'Approve' ||
      model.taskDecisionNoRestart == 'Negotiate'
    ) {
      return {
        valid: true,
        commentPass: await this.commentAdded(taskDetails, comments, loggedUser),
      };
    } else {
      return { valid: true };
    }
  };

  taskDecision = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (
      model.taskDecision == 'Approve' ||
      model.taskDecision == 'Negotiate' ||
      model.taskDecision == 'Reject BC'
    ) {
      return {
        valid: true,
        commentPass: await this.commentAdded(taskDetails, comments, loggedUser),
      };
    } else if (model.taskDecision == 'Review') {
      return { valid: false, commentPass: false, reviewTask: true };
    } else {
      return { valid: true };
    }
  };

  cfoFinancialReview = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (
      model.taskDecisionCfo == 'Approve' ||
      model.taskDecisionCfo == 'Negotiate' ||
      model.taskDecisionCfo == 'Reject BC'
    ) {
      return {
        valid: true,
        commentPass: await this.commentAdded(taskDetails, comments, loggedUser),
      };
    } else if (model.taskDecisionCfo == 'Review') {
      return { valid: false, commentPass: false, reviewTask: true };
    } else {
      return { valid: true };
    }
  };

  uploadSOF = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel
  ) => {
    let docCheckedIn = true;
    let docFound = false;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
      if (
        i.foldername == this.documentCategoryName.inProcess &&
        i.metadata.docType === 'Mobile SOF'
      ) {
        docFound = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (!docFound) {
      this.toastrSvc.warning('Upload SOF to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  mobileInitiateNewContract = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel,
    comments: TaskCommentModel[]
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (
      model.caseClassification !== 'Exceptional' &&
      model.caseClassification !== 'Standard' &&
      model.caseClassification !== 'Non Standard'
    ) {
      this.toastrSvc.warning('Please enter valid Case Classification');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  voiceCompleteBC = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else {
      if (!this.firstTime) {
        this.firstTime = false;
        return { valid: true };
      } else if (this.firstTime) {
        this.toastrSvc.warning(
          'Please upload all necessary documents before proceeding'
        );
        this.firstTime = false;
        return { valid: false };
      }
    }
  };

  iotTrialPreFill = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel
  ) => {
    let docCheckedIn = true;
    let docFound = false;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
      if (i.foldername === DocumentCategoryName.businessCase) {
        docFound = true;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return { valid: false };
    } else if (model.pricingType === 'Non Standard' && !docFound) {
      this.toastrSvc.warning('Please upload Business Case to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  sendProposal = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel
  ) => {
    if (!model.sendProposal) {
      this.toastrSvc.warning('Document needs to be sent to continue');
      return { valid: false };
    } else {
      return { valid: true };
    }
  };

  defaultCondition = async (
    docList: TaskDocumentModel[],
    taskDetails: TaskInfoModel,
    model: any,
    loggedUser: LoggedUserModel
  ) => {
    let docCheckedIn = true;

    docList.forEach((i) => {
      if (i.checkoutby && i.checkoutby == loggedUser.userid) {
        docCheckedIn = false;
      }
    });

    if (!docCheckedIn) {
      this.toastrSvc.warning('Please check in documents to continue');
      return false;
    } else {
      return true;
    }
  };

  sendForPartnerSigSOF = this.sendForPartnerSig;
  uploadPartnerSignSOF = this.uploadPartnerSign;
  legalReviewSOF = this.legalReview;

  mobilePmReviewBc1 = this.taskDecisionTasksNR;
  mobilePmReviewBc2 = this.taskDecisionTasksNR;
  mobilePmReviewBc3 = this.taskDecisionTasksNR;
  mobilePmReviewBc4 = this.taskDecisionTasksNR;
  mobilePmReviewBc5 = this.taskDecisionTasksNR;
  mobilePmReviewBc6 = this.taskDecisionTasksNR;
  pmIotReview = this.taskDecisionTasksNR;
  pmIotReviewCD = this.taskDecisionTasksNR;

  voiceDealAmendInit = this.attachContractDocuments;
  otherContractLegalDraftContract = this.attachContractDocuments;

  iotFpaReview = this.taskDecision;
  iotEmtReviewDeal = this.taskDecision;
  iotEmtCfoReviewDeal = this.taskDecision;
  creditReviewEval = this.taskDecision;
  commercialOpsReviewBc = this.taskDecision;
  mobilePmManagerReviewBc = this.taskDecision;
  mobileEmtReviewBc = this.taskDecision;
  iotPmEmtReview = this.taskDecision;
  smsPmReviewBc = this.taskDecision;
  fpaFinancialReview = this.taskDecision;
  // customerApprovedProposal = this.taskDecision ;
  // sendPropopsal, customerApprovedProposal
}

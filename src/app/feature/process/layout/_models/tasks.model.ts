export interface TasksModel {
  groupid?: string;
  groupname?: string;
  initiationfields: any;
  id: string;
  formKey: string;
  name: string;
  partnerLegalName: string;
  product: string;
  contractType: string;
  initiator: string;
  businessKey: string;
  contractid: string;
  contractInitiationTime: Date;
  processDefinitionId: string;
  created: Date;
  processInstanceId: string;
  taskDefinitionKey: string;
  processvariables: any;
}

export enum TasksAutoFillTaskInfo {
  initiateNda = 'ndaform',
  initiateIOTNda = 'iotNdaform',
  signatoryOfac = 'signatoryOfacCheck',
  uploadPartnerSign = 'uploadPartnerSign',
  prepareIbasisSign = 'contractSigIbasisSig',
  bookmarkReview = 'dmsAutofillBookmark',
  metadataReview = 'dmsAutofillMeta',
  contractDoc = 'attachPartnerNda',
  partnerFeedback = 'partnerApproval',
  legalApproval = 'legalApproval',
  sendToPartnerApproval = 'ndaSendToPartnerForReview',
  sendToPartnerApprovalOfac = 'ndaSendToPartnerForReviewOfac',
  sendToPartnerForReview = 'sendToPartnerForReview',
  sendToPartnerForReviewOfac = 'sendToPartnerForReviewOfac',
  prepareiBasisSig = 'legalReview',
  sendForPartnerSig = 'sendForPartnerSig',
  companyOfacInit = 'companyOfacInit',
  companyOfacCheck = 'companyOfacCheck',
  additionalInfoPartner = 'addtlInfoForPartnerSignatory',
  billingReviewInfo = 'billingReviewInfo',
  billingReviewInfoOther = 'billingReviewInfoOther',
  commercialOpsReviewBc = 'commercialOpsReviewBc',
  creditReviewEval = 'creditReviewEval',
  interConnectCheckTechnicalAspects = 'interConnectCheckTechnicalAspects',
  commonLegalApproval = 'commonLegalApproval',
  iotFpaReview = 'iotFpaReview',
  pmIotReview = 'pmIotReview',
  iotPmEmtReview = 'iotPmEmtReview',
  iotEmtReviewDeal = 'iotEmtReviewDeal',
  iotEmtCfoReviewDeal = 'iotEmtCfoReviewDeal',
  sendProposal = 'sendProposal',
}

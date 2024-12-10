import { TypeAheadModel } from 'src/app/core/_models';

export interface TaskDocumentResponseModel {
  'In Process'?: TaskDocumentModel[];
  'Company Documents'?: TaskDocumentModel[];
  Miscellaneous?: TaskDocumentModel[];
  'Final-unsigned'?: TaskDocumentModel[];
  'Executed Contracts'?: TaskDocumentModel[];
  'Business Case'?: TaskDocumentModel[];
  'OFAC Documents'?: TaskDocumentModel[];
}

export interface TaskDocumentModel {
  id: number;
  createddate: string;
  contentid: string;
  filename: string;
  foldername: string;
  version: number;
  confidential: boolean;
  name: string;
  metadata: TaskDocumentMetadataModel;
  checkoutby: string;
  checkedoutusername: string;
  updatebyname: string;
  updateuserid: string;
  modifieddate: string;
  createdbyname: string;
  createduserid: string;
  mimetype?: string;
  namedrangevalues: Map<string, any>;
  checkedoutdate?: string;
  comment?: any;
}

export interface TaskDocumentMetadataModel {
  template: TypeAheadModel[];
  products: TypeAheadModel[];
  msaType: string;
  docType: string;
  contracttype: TypeAheadModel[];
  folderType: string;
  companyLegalName: string;
  companyFriendlyName: string;
  Docmeta: DocumentMetaModel[];
  ibasisContractingEntity: string;
}

export interface TaskDocumentPreviewRequestModel {
  companyname: string;
  product: string;
  contracttype: string;
  bookmark: boolean;
  businessKey: string;
  initiator: string;
  initiatorName: string;
  purged?: boolean;
  confidential?: boolean;
  variables: any;
  companyCode: string;
  formKey?: string;
}

export interface DocumentMetaModel {
  id: number;
  name: string;
}

export enum DocumentCategoryEnum {
  companyDocuments = 'CD',
  businessCase = 'BC',
  inprocess = 'IP',
  executedContracts = 'EC',
  miscellaneous = 'MI',
  ofac = 'OF',
  kyc = 'KYC',
  opportunityDocuments = 'OD',
}

export enum DocumentCategoryName {
  companyDocuments = 'Company Documents',
  inProcess = 'In Process',
  misc = 'Miscellaneous',
  finalUnsigned = 'Final-unsigned',
  executedCont = 'Executed Contracts',
  ofac = 'OFAC Documents',
  businessCase = 'Business Case',
  other = 'Other',
  opportunityDocuments = 'Opportunity Documents',
}

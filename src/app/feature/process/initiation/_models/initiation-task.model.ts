import { TypeAheadModel } from 'src/app/core/_models';

export interface InitiationTaskModel {
  standardContractingEntity?: any;
  amendmentType?: string;
  otherContractType?: string;
  partnerLegalName?: string;
  companyId?: number;
  companyCode?: string;
  partnerAddress?: string;
  partnerAddressId?: number;
  initiateOfac?: boolean;
  country?: string;
  countryCode?: string;
  selectedPartnerAddress?: string;
  registered?: string;
  companyFound?: boolean;
  product?: string;
  productSecondLevel?: string;
  contractType?: any;
  contractTypeSecondLevel?: string;
  ibasisContractingEntity?: string;
  ibasisContractingEntityId?: number;
  ibasisContractingEntityCode?: string;
  ibasisContractingEntityName?: string;
  ibasisContractingEntityLegalName?: string;
  ibasisContractingEntityRegistration?: string;
  ibasisContractingEntityAddress?: string;
  ibasisContractingEntityType?: string;
  ibasisContractingEntityCorpId?: string;
  msaExists?: boolean;
  dealType?: 'string';
  requestMsa?: boolean;
  ndaExists?: boolean;
  ndaOk?: boolean;
  doAmendment?: boolean;
  confidential?: boolean;
  additionalSvcType?: string;
  currencyAmendmentType?: string;
  iotContractType?: string;
  legalDecisionType?: string;
  historicalContracts?: boolean;
  additionalContReq?: boolean;
  additionalContReq2?: boolean;
  additionalContReq3?: boolean;
  currency?: string;
  casePriority?: string;
  totalContractValue?: number;
  initiationGroup?: string;
  ibasisTemplateAvailable?: boolean;
  processname?: any;
  initiator?: string;
  employeeName?: string;
}

export interface InitiationTaskCheckModel {
  partnerLegalName: string;
  product: string;
  companyCode: string;
  productSecondLevel: string;
  contractType: TypeAheadModel[];
  contractTypeSecondLevel: string;
  ibasisContractingEntity: string;
  ibasisContractingEntityLegalName: string;
  additionalSvcType: string;
  iotContractType: string;
  processName: string;
  groupId: string;
  groupIds: string[];
}

export interface InitiationTaskCheckRespModel {
  runningInstance: any;
  companyFound: boolean;
  contractType: TypeAheadModel[];
  ibasisContractingEntityAddress: string;
  ibasisContractingEntityLegalName: string;
  instanceExists: boolean;
  msaExists: boolean;
  ndaExists: boolean;
  partnerAddress: string;
  partnerLegalName: string;
  product: string;
  templateExists: boolean;
}

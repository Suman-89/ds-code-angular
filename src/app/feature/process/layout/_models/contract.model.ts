import { ProcessVariableModel } from 'src/app/core/_models';

export interface ContractModel {
  celegaladdress: string;
  celegalname: string;
  contractid: string;
  contracttype: string;
  companyCode: string;
  id: number;
  created: string;
  ibasisContractingEntityLegalName: string;
  initiatedby: string;
  initiatedbyfullname: string;
  businessKey: string;
  initiationdate: Date;
  inprogress: boolean;
  overallStats: string;
  initiationfields: any;
  partneraddress: string;
  partnerlegalname: string;
  product: string;
  variables: ProcessVariableModel[];
  terminated?: boolean;
  terminatedby?: string;
  casePriority: string;
  sortorder: number;
  elapsedtime?: string;
  elapsedhour: number;
  elapseddays: number;
  completiondatetime: Date;
  contractTypeSecondLevel: string;
  iotContractType: string;
  productSecondLevel: string;
  processvariables: any;
  processDate: string;
  rootprocessid:string
}

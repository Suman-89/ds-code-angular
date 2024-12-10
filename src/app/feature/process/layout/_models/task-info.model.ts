import { ProcessVariableModel } from 'src/app/core/_models';

export interface TaskInfoModel {
  created: Date;
  id: string;
  name: string;
  group: boolean;
  groupname: string;
  groupid: string;
  formKey?: string;
  processDefinitionId: string;
  businessKey: string;
  processInstanceId: string;
  initiatorname: string;
  product?: string;
  contractType?: string;
  casePriority?: string;
  partnerLevel?: string;
  partnerLegalName?: string;
  isThisSOF?: string;
  defaulttab: string;
  assignee: string;
  assigneeName: string;
  readonly?: boolean;
  reviewTask?: boolean;
  commentMandatory?: boolean;
  initiator: string;
  taskDefinitionKey: string;
  variables: ProcessVariableModel[];
  processvariables: any;
  
}

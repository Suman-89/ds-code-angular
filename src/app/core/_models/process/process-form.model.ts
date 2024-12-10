import { NameModel } from '../name.model';
import { ProcessVariableModel } from './process-variable.model';

export interface ProcessFormModel {
  id?: number;
  name: string;
  description: string;
  key: string;
  defaulttab?: string;
  groupname?: string;
  groupid?: string;
  variables?: ProcessVariableModel[];
  labelalignment?: number;
  reviewable?: boolean;
  reviewgroups?: NameModel[];
  commentsneeded?: boolean;
  selecteddoctypes?: ProcFormDoclistDropdownModel[];
  isreviewtask?: boolean;
  revisable?: boolean;
  rejectable?: boolean;
  revisegroups?: NameModel[];
  rejectgroups?: NameModel[];
  emailenabled?: boolean;
  formtype: string;
  workflowname: string;
  feedbackVariableMaps?: FeedbackVariableModel[];
  assignable?: boolean;
  assigngroups?: NameModel[];
  processNames?: string[];
  tabRoleAccess?:string[];
}

export interface ProcFormDoclistDropdownModel {
  id?;
  code: string;
  name: string;
  selected: boolean;
  uploadable: boolean;
}

export interface FeedbackVariableModel {
  name: string;
  variable: string;
}

import { NameModel } from '../name.model';
import { ProcessVariableModel } from './process-variable.model';

export interface AnchorFormModel {
  id?: number;
  name?: string;
  description: string;
  key?: string;
  defaulttab?: string;
  groupname?: string;
  groupid?: string;
  variables?: ProcessVariableModel[];
  labelalignment?: number;
  reviewable?: boolean;
  reviewgroups?: NameModel[];
  commentsneeded?: boolean;
  selecteddoctypes?: AnchorFormDoclistDropdownModel[];
  isreviewtask?: boolean;
  revisable?: boolean;
  rejectable?: boolean;
  revisegroups?: NameModel[];
  rejectgroups?: NameModel[];
  emailenabled?: boolean;
  formtype?: string;
  workflowname?: string;
  feedbackVariableMaps?: AnchorFeedbackVariableModel[];
  assignable?: boolean;
  assigngroups?: NameModel[];
  processNames?: string[];
 
  anchorType?: string;
  anchorTypeDisplay?: string;
  anchorConfigId?: string;
  anchorConfigDisplayName?:string;
  folderDisplayVar?: any;
  searchMetadataVars?:AnchorVariableModel[];
  workflowDisplayVar?: any;
  sections?: any;
  identifierGenParams?: any;
  basicSettingsVars?: AnchorVariableModel[];
  basicVarsDisplayType:string,
  toolTipMetaData:AnchorVariableModel[],
}

export interface AnchorVariableModel{
  variableName?: string;
  variableType?: string;
  isVisible?: boolean;
  isMandatory?: boolean;
  isReadOnly?: boolean;
  expiryTerm?: string;
}

export interface AnchorFormDoclistDropdownModel {
  id?;
  code: string;
  name: string;
  selected: boolean;
  uploadable: boolean;
}

export interface AnchorFeedbackVariableModel {
  name: string;
  variable: string;
}

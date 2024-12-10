import { ProcessVariableModel } from 'src/app/core/_models';

export interface EmailTemplateModel {
  emailProcVars: any;
  id?: string;
  code: string;
  name: string;
  subject: ContentBodyModel;
  subjectline?: string;
  textbody?: any;
  body: ContentBodyModel;
  recipientHtml: ContentBodyModel;
  recipients: string[];
  roles: string[];
  tasks: TriggerPointsModel[];
  externalEmails?: string[];
  ruleset?: RuleSetModel[];
  initiator?: boolean;
  processNames: string;
  recipientVars: string[];
}

export interface RuleSetModel {
  operand: any;
  operator: string;
  value: any;
  firstValue?: any;
  secondValue?: any;
  options?: any[];
}

export interface ContentBodyModel {
  subjectline?: any;
  textBody?: any;
  content: any;
  tagged: any;
}

export interface TriggerPointsModel {
  displabel?: string;
  name: string;
  when: any;
}

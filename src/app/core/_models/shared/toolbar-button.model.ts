export interface ToolbarButtonModel {
  label: string;
  class?: string;
  action: string;
  singleSelect?: boolean;
  disabled?: boolean;
  notFor?: string[];
  for?: string[];
  show?: boolean;
  dontShow?: boolean;
  forScreens: string;
}

export enum GridToolbarType {
  worklist = 'MYQ',
  workbasket = 'GROUPQ',
  contractlist = 'ALLTASKS',
  allProcess = 'ALLPROCESS',
  readonly = 'readonly',
  noaction = 'noaction',
  user = 'user',
  group = 'group',
  role = 'role',
  company = 'company',
  processvariable = 'process_variable',
  contentmanagement = 'email_list',
  alltasks = 'ALLTASKS',
  country = 'country',
  prescreening = 'prescreening',
  comments = 'comments',
  processdefinition = 'process_definition',
  process_form = 'process_form',
  processform = 'process_form',
  systemreports = 'system_reports',
  reports = 'reports',
  aiattributes = 'ai_attributes',
  keywords = 'keywords',
  anchor_entity = 'anchor_entity',
  LMS = 'lms',
}

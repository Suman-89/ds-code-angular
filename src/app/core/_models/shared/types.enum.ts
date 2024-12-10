export enum Roles {
  LEGAL_ADMIN = 'LEGAL_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  SALES_USER = 'SALES_USER',
  LEGAL_USER = 'LEGAL_USER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  GUEST_USER = 'GUEST_USER',
  BILLING_USER = 'BILLING_USER',
  BILLING_ADMIN = 'BILLING_ADMIN',
  COMMERCIAL_OPS_ADMIN = 'COMMERCIAL-OPS_ADMIN',
  COMMERCIAL_OPS_USER = 'COMMERCIAL-OPS_USER',
  CREDIT_ADMIN = 'CREDIT_ADMIN',
  CREDIT_USER = 'CREDIT_USER',
  FPA_USER = 'FPA_USER',
  FPA_ADMIN = 'FPA_ADMIN',
  INTERCONNECT_DESIGN_USER = 'INTERCONNECT-DESIGN_USER',
  INTERCONNECT_DESIGN_ADMIN = 'INTERCONNECT-DESIGN_ADMIN',
  PRODUCT_MANAGEMENT_USER = 'PRODUCT-MANAGEMENT_USER',
  PRODUCT_MANAGEMENT_ADMIN = 'PRODUCT-MANAGEMENT_ADMIN',
  PMIOT_USER = 'PMIOT_USER',
  PMIOT_ADMIN = 'PMIOT_ADMIN',
  PMSMS_USER = 'PMSMS_USER',
  PMSMS_ADMIN = 'PMSMS_ADMIN',
  PMMOBILE_USER = 'PMMOBILE_USER',
  PMMOBILE_ADMIN = 'PMMOBILE_ADMIN',
  PMVOICE_USER = 'PMVOICE_USER',
  PMVOICE_ADMIN = 'PMVOICE_ADMIN',
  EMTIOT_USER = 'EMTIOT_USER',
  EMTIOT_ADMIN = 'EMTIOT_ADMIN',
  EMTMOBILE_USER = 'EMTMOBILE_USER',
  EMTMOBILE_ADMIN = 'EMTMOBILE_ADMIN',
  EMTCFO_USER = 'EMTCFO_USER',
  EMTCFO_ADMIN = 'EMTCFO_ADMIN',
  PMGRMOBILE_ADMIN = 'PMGRMOBILE_ADMIN',
  PMGRMOBILE_USER = 'PMGRMOBILE_USER',
  EMTSALES_USER = 'EMTSALES_USER',
  EMTSALES_ADMIN = 'EMTSALES_ADMIN',
  DEPLOYMENT_USER = 'DEPLOYMENT_USER',
  DEPLOYMENT_ADMIN = 'DEPLOYMENT_ADMIN',
  EMPLOYEE_USER = 'EMPLOYEE_USER',
  EMPLOYEE_ADMIN = 'EMPLOYEE_ADMIN',
  MANAGER_USER = 'MANAGER_USER',
  MANAGER_ADMIN = 'MANAGER_ADMIN',
  HR_USER = 'HR_USER',
  HR_ADMIN = 'HR_ADMIN',
  EMT_HR_USER = 'EMT-HR_USER',
  EMT_HR_ADMIN = 'EMT-HR_ADMIN',
  EMT_BUSINESS_USER = 'EMT-BUSINESS_USER',
  EMT_BUSINESS_ADMIN = 'EMT-BUSINESS_ADMIN',
  FINANCE_USER = 'FINANCE_USER',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  DEV_FINANCE_USER = 'DEVFINANCE_USER',
  DEV_FINANCE_ADMIN = 'DEVFINANCE_ADMIN',
  ASSETFINANCE_USER = 'ASSETFINANCE_USER',
  ASSETFINANCE_ADMIN = 'ASSETFINANCE_ADMIN',
  CREDIT_RISK_USER = 'CREDITRISK_USER',
  CREDIT_RISK_ADMIN = 'CREDITRISK_ADMIN',
}

export enum DataTypesEnum {
  INTEGER = 1,
  STRING,
  BOOLEAN,
  DATE,
  COLLECTION,
  TIME 
}

export enum UIElementTypes {
  TEXT = 'TEXTBOX',
  NUMBER = 'NUMBER',
  DATEFIELD = 'DATEFIELD',
  TEXTAREA = 'TEXTAREA',
  DROPDOWN = 'DROPDOWN',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  EXPRESSION = 'EXPRESSION',
  TIMEFIELD = 'TIMEFIELD'
}

export enum VariableDataTypes {
  STRING = 'String',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  DATE = 'Date',
  DATETIME = 'DateTime',
  LONG = 'Long',
  COLLECTION = 'Collection',
  TIME = 'Time'
}

export enum SourceTypes {
  REFDATA = 'REFDATA',
  EMPTY = 'EMPTY',
  BUSINESSCASE = 'BUSINESSCASE',
  OTHERS = 'OTHERS',
  URL = 'URL',
}
export enum DocMIMETypes {
  PDF = 'application/pdf',
  CSV = 'application/vnd.ms-excel',
  DOC = 'application/msword',
  WORD = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  IMAGE = 'image/jpeg',
}

export enum FormLayoutTypeEnum {
  HORIZONTAL = 0,
  VERTICAL = 1,
}

export enum TagType {
  USER,
  GROUP,
  DOCUMENT,
  VARIABLE,
}

export enum UserGroupsEnum {
  BILLING = 'billing',
  CAMUNDA_ADMIN = 'camunda-admin',
  COMMERCIAL_OPS = 'commercialops',
  CREDIT = 'credit',
  DEPLOYMENT = 'deployment',
  EMTCFO = 'emtcfo',
  EMTIOT = 'emtiot',
  EMTMOBILE = 'emtmobile',
  EMTSALES = 'emtsales',
  FPA = 'fpa',
  GUEST = 'guest',
  INTERCONNECT_DESIGN = 'interconnectdesign',
  LEGAL = 'legal',
  PM_IOT = 'pmiot',
  PM_MOBILE = 'pmmobile',
  PM_SMS = 'pmsms',
  PM_VOICE = 'pmvoice',
  PRODUCTION_MANAGEMENT = 'productmanagement',
  SALES = 'sales',
  FINANCE = 'finance',
  EMT_HR = 'emthr',
  EMPLOYEE = 'employee',
  BUSINESS = 'business',
  EMT_BUSINESS = 'emtbusiness',
  FRAUD = 'fraud',
  FINANCECS = 'financecs',
  FINANCEAP = 'financeap',
  BILLINGIS = 'billingis',
  DEALMANAGEMENT = 'dealmanagement',
  DEALRATES = 'dealrates',
  RATES = 'rates',
  AM = '',
  DISPUTES = 'disputes',
  PM_MGR = 'pmgrmobile',
  REC_MANAGER = 'recruitermanager',
  REC_BUSINESS = 'recruitingbusiness',
  SELECT_ROLE = 'Empty',
  PATIENTBILLING = 'patientbilling',
  ACCOUNTS = 'accounts',
  DENIALANALYST = 'denialanalyst',
  CLAIMANALYST = 'claimanalyst',
  MEDICALCODING = 'medicalcoding',
  CLAIMAGENT = 'claimagent',
  SERVICEMANAGER = 'servicemanager',
  OPERATIONS = 'operations',
  FUNCTIONMANAGER = 'functionmanager',
  EMT = 'EMT',
  CONTENT_REQUESTER = 'contentrequester',
  CONTENT_CREATOR = 'contentcreator',
  REVIEWER = 'reviewer',
  EMAMI = 'emami',
}

export enum AddressType {
  PRINCIPAL = 'PA',
  REIGSTERED = 'RA',
}

export enum CasePriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum OperatorTypes {
  EQUALS = 'Equals',
  EQUAL = 'Equal',
  DOES_NOT_EQUALS = 'Does Not Equal',
  GREATER_THAN = 'Greater Than',
  LESS_THAN = 'Less Than',
  BETWEEN = 'Between',
  CONTAINS = 'Contains',
  DOES_NOT_CONTAIN = 'Does Not Contain',
}

export enum TemplateListErrorMsg {
  ADD_ALL_FIELDS = 'Please add all mandatory fields',
  ADD_RULE_SET = 'Please add a Rule Set',
  ADD_RECIPIENT = 'Please add at least one recipient',
  ADD_SUBJECT_LINE = 'Please Add Subject Line',
  ADD_BODY = 'Please add email body',
  ADD_TRIGGER_POINT = 'Please add a Trigger Point',
  ADD_NAME = 'Please add a Template name',
}

export enum TemplateContentType {
  subject = 'subject',
  body = 'body',
  recipients = 'recipients',
}

export enum SyncUserResponseType {
  deletedUsers = 'deletedUsers',
  failedCamundaUsers = 'failedCamundaUsers',
  newUsers = 'newUsers',
  usersfromAD = 'usersfromAD',
}

export enum ProductTypeEnum {
  IOT = 'IOT',
  MOBILE = 'Mobile',
  SMS = 'SMS',
  VOICE = 'Voice',
  OTHER = 'Other',
}

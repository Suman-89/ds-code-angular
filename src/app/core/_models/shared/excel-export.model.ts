export interface ExcelExportColumnsModel {
  datafield: string;
  label: string;
}

export interface FilterConditionsModel {
  operand: string;
  operator: string;
  value: any;
  datatype: string;
  istimeincluded?: boolean;
}
export interface ExcelExportRequestModel {
  columns: ExcelExportColumnsModel[];
  conditions: FilterConditionsModel[];
  source: string;
  searchContract?: string;
  sourceLabel?: string;
  processName?: string;
}

export interface ExcelSaveRequestModel {
  columns: ExcelExportColumnsModel[];
  conditions: FilterConditionsModel[];
  source: string;
  reportName: string;
  searchContract?: string;
  sourceLabel?: string;
}

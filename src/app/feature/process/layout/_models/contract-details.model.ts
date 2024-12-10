export interface ContractDetailsModel {
  contractid: string;
  assignedgroupname: string;
  assignedusername: string;
  taskstatus?: string;
  starttime: string;
  endtime: string;
  elapsedtime: string;
  taskname: string;
  groupassignment: boolean;
}

export interface AuditTrailMappedModel {
  key: string;
  contractTaskDtos: ContractDetailsModel[];
}
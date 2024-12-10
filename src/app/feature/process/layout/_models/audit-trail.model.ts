import { ContractDetailsModel } from './contract-details.model';

export interface AuditTrailModel  {
    processDefinitionKey: string,
    processDefinitionId: string,
    processInstanceId: string,
    name: string,
    owner: string,
    assignee: string,
    duration: number,
    startTime: string,
    endTime: string
}

export interface AuditTrailViewModel {
    fromTask: ContractDetailsModel;
    toTask: ContractDetailsModel
}
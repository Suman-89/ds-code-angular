export interface TaskTerminateRequestModel {
  processInstanceId: string;
  businessKey: string;
  assignee?: string;
}

export interface WorkflowStartResponseModel {
  businessKey: string;
  id: string;
  ofac: boolean;
  status: boolean;
  contractType: string;
}

export interface UpdateSingleSession {
  key: string;
  businessKey: string;
  data: {
    iflowStatus?: number;
    unreadMessageCount?: number;
  };
}

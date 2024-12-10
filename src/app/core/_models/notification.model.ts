export interface NotificationModel {
  id?: string;
  message: string;
  fromuser: string;
  fromuserid: string;
  taskid: string;
  businesskey: string;
  userid: string;
  seen: string;
  createdOn: string;
  type: string;
  selected?: boolean;
  product?: string;
  contracttype?: string;
  dealIdFinal?: string;
  partnerlegalname?: string;
}

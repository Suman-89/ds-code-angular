export interface UserModel {
  id: string;
  userid: string;
  fname: string;
  lname: string;
  fullname: string;
  email: string;
  suspended?: boolean;
  roles?: string[];
  groupnames?: string[];
  active: boolean;
  externaluser?: boolean;
  phoneNumber?: string;
  userProfileIconUrl?: string;
}

export interface SelectedUserModel {
  userid: string;
  fullname: string;
}

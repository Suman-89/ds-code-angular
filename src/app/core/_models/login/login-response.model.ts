export interface LoginResponseModel {
  token: string;
  refreshToken: string;
  user: LoggedUserModel;
}

export interface LoggedUserModel {
  fname: string;
  lname: string;
  userid: string;
  roles: string[];
  fullname: string;
  active: boolean;
  groupnames: string[];
  activeString?: string;
}

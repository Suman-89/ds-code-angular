import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserModel, GroupModel } from '../../feature/user-management/_models';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ResponseModel,
  LoggedUserModel,
  NotificationModel,
} from 'src/app/core/_models';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userManagementApiUrl: string = environment.userManagementApiUrl;
  bpmURL = environment.bpmUrl;

  constructor(private apiSvc: ApiService) {}

  createUser(user: UserModel): Observable<ResponseModel<UserModel>> {
    let path: string = this.userManagementApiUrl + `users/user`;
    return this.apiSvc.post(path, user);
  }
  uploadUserImage(id, formdata) {
    let path: string = this.userManagementApiUrl + `users/upload-pic/${id}`;
    return this.apiSvc.post(path, formdata);
  }
  previewUserImage(id) {
    let path: string = this.userManagementApiUrl + `users/profile-pic/${id}`;
    return this.apiSvc.getDownload(path, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getAllUsers(excludeinactive?): Observable<ResponseModel<LoggedUserModel[]>> {
    let path = excludeinactive
      ? `${this.userManagementApiUrl}users?excludeinactive=true`
      : this.userManagementApiUrl + 'users';

    return this.apiSvc.get(path);
  }

  getUser(userId: string): Observable<ResponseModel<UserModel>> {
    let path: string = this.userManagementApiUrl + `users/${userId}`;
    return this.apiSvc.get(path);
  }

  editUser(data) {
    return this.apiSvc.put(
      `${this.userManagementApiUrl}users/${data.userid}`,
      data
    );
  }

  clearAssignments(data, processname) {
    return this.apiSvc.post(
      `${this.bpmURL}tasks/reassign?processName=${processname}`,
      data
    );
  }

  getUserReassignments(userId) {
    return this.apiSvc.get(`${this.bpmURL}tasks/reassign/${userId}`);
  }

  getNotification(): Observable<ResponseModel<NotificationModel[]>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    )?.name;
    return this.apiSvc.get(
      this.bpmURL + `notifications?processName=${processName}`
    );
  }
  deleteNotification(id): Observable<ResponseModel<NotificationModel[]>> {
    return this.apiSvc.post(this.bpmURL + 'notifications/delete', id);
  }
  getNotificationCount(): Observable<ResponseModel<number>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    )?.name;
    return this.apiSvc.get(
      this.bpmURL + `notifications/count?processName=${processName}`
    );
  }
  getUserGroups(): Observable<ResponseModel<any>> {
    return this.apiSvc.get(this.bpmURL + 'metadata/users/groups/all');
  }

  getUserRoles(): Observable<ResponseModel<any>> {
    return this.apiSvc.get(this.userManagementApiUrl + 'users/roles');
  }

  getGroupUsers(): Observable<ResponseModel<UserModel[]>> {
    let path = `${this.userManagementApiUrl}users/groups/users`;
    return this.apiSvc.get(path);
  }

  getGroups(): Observable<ResponseModel<any>> {
    let path = `${this.userManagementApiUrl}users/groups`;
    return this.apiSvc.get(path);
  }
  getRoles(): Observable<ResponseModel<any>> {
    let path = `${this.userManagementApiUrl}users/roles`;
    return this.apiSvc.get(path);
  }

  getGroupUsersByGroup(
    groupName: string,
    excludeinactive?
  ): Observable<ResponseModel<UserModel[]>> {
    let path = excludeinactive
      ? `${this.bpmURL}metadata/users/groups/allusers?grpname=${groupName}&excludeinactive=true`
      : `${this.bpmURL}metadata/users/groups/allusers?grpname=${groupName}`;
    return this.apiSvc.get(path);
  }

  syncWithAD(): Observable<ResponseModel<any>> {
    return this.apiSvc.get(this.userManagementApiUrl + 'users/syncad');
  }

  setDefaultGroup() {
    const path = this.userManagementApiUrl + 'users/guestgroup';
    return this.apiSvc.put(path);
  }

  getAllCountryCodes() {
    const path = 'assets/data/countryCode.json';
    return this.apiSvc.get(path);
  }

  isEditMode: BehaviorSubject<boolean> = new BehaviorSubject(false);
}

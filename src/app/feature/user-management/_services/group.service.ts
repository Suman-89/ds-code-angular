import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/_services';
import { GroupModel, GroupNewModel } from '../_models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/_models';

@Injectable()
export class GroupService {
  userManagementApiUrl: string = environment.userManagementApiUrl;

  constructor(private apiSvc: ApiService) {}

  createGroup(group): Observable<ResponseModel<GroupNewModel>> {
    // let path: string = this.userManagementApiUrl + `group`;
    let path: string = this.userManagementApiUrl + `users/group`;
    // let path: string = `http://dev.ds-workflow.com/userapi/api/users/group`;
    return this.apiSvc.post(path, group);
  }

  updateGroup(group): Observable<ResponseModel<GroupModel>> {
    // let path: string = this.userManagementApiUrl + `group`;
    let path: string = this.userManagementApiUrl + `users/group`;
    // let path: string = `http://dev.ds-workflow.com/userapi/api/users/group`;
    return this.apiSvc.put(path, group);
  }
  deleteGroup(groupId): Observable<ResponseModel<GroupModel>> {
    // let path: string = this.userManagementApiUrl + `group`;
    let path: string = this.userManagementApiUrl + `users/group/` + groupId;
    // let path: string = `http://dev.ds-workflow.com/userapi/api/users/group`;
    return this.apiSvc.delete(path);
  }
  getGroupRoles(groupId) {
    let path: string =
      this.userManagementApiUrl + `users/group/${groupId}/roles`;
    return this.apiSvc.get(path);
  }
  getAllGroups() {
    let path: string = this.userManagementApiUrl + 'users/groups';
    return this.apiSvc.get(path);
  }

  getGroup(groupId: string): Observable<ResponseModel<GroupModel>> {
    let path: string = this.userManagementApiUrl + `/group/${groupId}`;
    return this.apiSvc.get(path);
  }
}

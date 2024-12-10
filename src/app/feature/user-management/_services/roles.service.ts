import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/_services';
import { GroupModel } from '../_models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/_models';

@Injectable()
export class RolesService {
  userManagementApiUrl: string = environment.userManagementApiUrl;

  constructor(private apiSvc: ApiService) {}

  createRole(role) {
    // let path: string = this.userManagementApiUrl + `group`;
    let path: string = this.userManagementApiUrl + `users/role`;
    // let path: string = `http://dev.ds-workflow.com/userapi/api/users/group`;
    return this.apiSvc.post(path, role);
  }
  updateRole(role) {
    // let path: string = this.userManagementApiUrl + `group`;
    let path: string = this.userManagementApiUrl + `users/role`;
    // let path: string = `http://dev.ds-workflow.com/userapi/api/users/group`;
    return this.apiSvc.put(path, role);
  }
  deleteRole(roleId) {
    // let path: string = this.userManagementApiUrl + `group`;
    let path: string = this.userManagementApiUrl + `users/role/` + roleId;
    // let path: string = `http://dev.ds-workflow.com/userapi/api/users/group`;
    return this.apiSvc.delete(path);
  }
  getAllRoles() {
    let path: string = this.userManagementApiUrl + 'users/roles';
    return this.apiSvc.get(path);
  }
  getUpmappedRoles() {
    let path: string = this.userManagementApiUrl + 'users/role/unmapped';
    return this.apiSvc.get(path);
  }

  //   getRole(groupId: string): Observable<ResponseModel<GroupModel>> {
  //     let path: string = this.userManagementApiUrl + `/group/${groupId}`;
  //     return this.apiSvc.get(path);
  //   }
}

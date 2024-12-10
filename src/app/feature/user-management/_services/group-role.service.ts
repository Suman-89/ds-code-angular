import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/_services';
import { GroupModel, GroupNewModel } from '../_models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/core/_models';

@Injectable({
  providedIn: 'root'
})
export class GroupRoleService {

  userManagementApiUrl: string = environment.userManagementApiUrl;

  constructor(private apiSvc: ApiService) {}

  getAllRollsandGroups() {
    let path: string = this.userManagementApiUrl + 'users/groups';
    return this.apiSvc.get(path);
  }
}

import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  LoginModel,
  ResponseModel,
  LoginResponseModel,
  LoggedUserModel,
} from '../_models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GatekeeperService {
  loggedUser: LoggedUserModel;
  token;
  refreshToken;
  baseUrl = environment.userManagementApiUrl;
  loggedInUserEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private apiSvc: ApiService, private router: Router) {}

  login(loginObj: LoginModel): Observable<ResponseModel<LoginResponseModel>> {
    let path = `${this.baseUrl}gatekeeper/signin`;
    return this.apiSvc.post(path, loginObj);
  }

  exchangeToken(refreshModel): Observable<ResponseModel<any>> {
    let path = `${this.baseUrl}users/public/refreshtoken`;
    return this.apiSvc.post(path, refreshModel);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.loggedUser = null;
    this.router.navigate(['/']);
  }
}

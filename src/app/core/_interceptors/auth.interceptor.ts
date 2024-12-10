import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoggedUserModel } from '../_models';
import { GatekeeperService } from './../_services/gatekeeper.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = null;
  refreshToken: string = null;
  user: LoggedUserModel;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private gatekeeperSvc: GatekeeperService,
    private ngxUiLoaderSvc: NgxUiLoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let compuser;

    if (!this.router.url.includes('signin')) {
      this.token = localStorage.getItem('token');
      this.refreshToken = localStorage.getItem('refreshToken');
      compuser = localStorage.getItem('user');
      compuser = JSON.parse(compuser);
      this.user = this.gatekeeperSvc.loggedUser;
    }
    if (req.url.includes('refreshtoken')) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.refreshToken}`,
        },
      });
      return next.handle(cloned);
    }
    if (
      this.token &&
      this.user.userid === compuser.userid &&
      this.user.roles.length !== 0
    ) {
      if ((this.token && this.checkTokenExpired(this.token)) === false) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        return next.handle(cloned).pipe(
          catchError((error: HttpErrorResponse) => {
            return this.errorHandler(error);
          })
        );
      }
      return this.callRefershToken(req, next);
    }
    if (this.token && this.user && this.user.roles.length === 0) {
      this.gatekeeperSvc.logout();
      this.toastr.error(
        'You do not have any role assigned. Please contact Contract Admin'
      );
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHandler(error);
        })
      );
    } else {
      this.gatekeeperSvc.logout();
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorHandler(error);
        })
      );
    }
  }

  errorHandler(error: HttpErrorResponse) {
    this.ngxUiLoaderSvc.stopAll();
    if (error.status === 403 || error.status === 401) {
      this.gatekeeperSvc.logout();
    } else if (error.name === 'HttpErrorResponse' && error.error) {
      let errMsg;
      if ('timestamp' in error.error) {
        // check if spring model
        error.status !== 0
          ? (errMsg =
              'Code: ' + error.error.status + ' Message:' + error.error.error)
          : (errMsg = 'Unknown Error');
      } else {
        error.error.message
          ? (errMsg = error.error.message)
          : (errMsg = error.name + ':' + error.statusText);
      }
      this.toastr.error(errMsg);
    } else if (error.status === 400) {
      this.toastr.error(error.status + ': Bad Request');
    }
    return throwError(error);
  }

  checkTokenExpired(token: string) {
    const decoded: { exp } = jwt_decode(token);
    const expiration = decoded.exp;
    return Date.now() >= Number(expiration) * 1000;
  }

  callRefershToken(req: HttpRequest<any>, next: HttpHandler) {
    const payload = {
      token: this.refreshToken,
    };
    return this.gatekeeperSvc.exchangeToken(payload).pipe(
      switchMap((newToken: any) => {
        localStorage.setItem('token', newToken.data.token);
        localStorage.setItem('refreshToken', newToken.data.refreshToken);
        this.token = newToken.data.token;
        this.refreshToken = newToken.data.refreshToken;
        const transformedReq = req.clone({
          headers: req.headers.set(
            'Authorization',
            `Bearer ${newToken.data.token}`
          ),
        });
        return next.handle(transformedReq);
      }),
      catchError((error: HttpErrorResponse) => {
        return this.errorHandler(error);
      })
    );
  }
}

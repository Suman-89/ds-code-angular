import { Injectable } from '@angular/core';
import {
  Router,
  CanLoad,
  UrlSegment,
  CanActivate,
  CanActivateChild,
} from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { ToastrService } from 'ngx-toastr';
import { Roles } from '../_models';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private toastr: ToastrService) {}

  canActivate() {
    let user = localStorage.getItem('user');
    if (user) {
      let roles = JSON.parse(user).roles;
      console.log('roles', roles);
      if (roles && roles.length > 0) {
        if (roles.length > 1) {
          // multiple roles & atleast one other roles
          // if (roles.find((x) => x === 'RECRUITER_USER')) {
          //   let defaultRoute = '/landing/process/contracts';
          //   this.router.navigate([defaultRoute]);
          //   return false;
          // }
          return true;
        } else {
          // one role
          if (roles[0] == Roles.GUEST_USER) {
            // Guest role only
            let defaultRoute = '/landing/process/contracts';
            this.router.navigate([defaultRoute]);
            return false;
          } else {
            //other role only
            return true;
          }
        }
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.toastr.error(
          'You do not have any role assigned. Please contact Contract Admin'
        );
        this.router.navigate(['/']);
        return false;
      }
    }
    this.router.navigate(['/']);
    return false;
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from 'src/app/core/_services';
import { SidenavData } from '../_constants';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  sideNav = new SidenavData() ;
  constructor(private sharedSvc: SharedService) { }

  getSidenavData(): Observable<any> {
    return this.sharedSvc.getSideNav().pipe(resp => resp)
  }
}

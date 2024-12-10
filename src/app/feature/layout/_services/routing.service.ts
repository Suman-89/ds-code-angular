import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavDataModel, NavItemModel } from 'src/app/core/_models';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  user;
  navData;
  constructor(private router: Router) {}

  checkForValidRoute(navData: NavDataModel, event) {
    let parentItem = navData?.navOptions.find((a) =>
      event.url.startsWith(a.routePath)
    );
    let selChild;
    navData?.navOptions.forEach((a) => {
      a.itemChildren?.find((c) => c.routePath === event.url)
        ? (selChild = a.itemChildren.find((c) => c.routePath === event.url))
        : null;
    });
    selChild ? this.routeToDefaultChild(selChild, parentItem) : null;
  }

  routeToDefaultChild(selChild: NavItemModel, parentItem: NavItemModel) {
    !this.user ? (this.user = JSON.parse(localStorage.getItem('user'))) : null;
    //  let allow = selChild.visibleFor.filter(a => this.user.roles.includes(a)) ;
    let rpath = [];
    let routeTo;
    selChild?.visibleFor?.filter((a) => this.user.roles.includes(a)).length ===
    0
      ? parentItem.itemChildren.forEach((a) => {
          a.visibleFor.forEach((v) => {
            this.user.roles.includes(v) ? rpath.push(a) : null;
          });
        })
      : null;
    routeTo = rpath.length > 0 ? rpath[0]?.routePath : selChild?.routePath;
    selChild ? this.router.navigate([routeTo]) : null;
  }
}

import { OnDestroy, Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class SubscribeRouteService implements OnDestroy {
  managementType: EventEmitter<string> = new EventEmitter();
  currentManagementTypeTimer;
  viewMode: EventEmitter<string> = new EventEmitter();
  subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.subscribeToRouter();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((i) => i.unsubscribe());
  }

  init(): void {
    this.getManagementType(this.router.url);
  }

  subscribeToRouter(): void {
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          if (this.currentManagementTypeTimer) {
            clearTimeout(this.currentManagementTypeTimer);
          }
          this.currentManagementTypeTimer = setTimeout(() => {
            this.getManagementType(event.urlAfterRedirects);
            this.currentManagementTypeTimer = '';
          }, 500);
        })
    );
  }

  getManagementType(eventUrl: string): void {
    let managementType: string;
    let viewMode: string;

    if (eventUrl.includes('users')) {
      managementType = 'user';
    } else if (eventUrl.includes('groups')) {
      managementType = 'group';
    } else if (eventUrl.includes('roles')) {
      managementType = 'role';
    } else if (eventUrl.includes('authentication')) {
      managementType = 'authentication';
    }

    if (eventUrl.includes('create')) {
      viewMode = 'create';
    } else if (eventUrl.includes('view')) {
      viewMode = 'view';
    } else if (eventUrl.includes('edit')) {
      viewMode = 'edit';
    }

    this.managementType.emit(managementType);
    this.viewMode.emit(viewMode);
  }
}

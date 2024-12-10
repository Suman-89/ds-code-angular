import { SharedService } from './../../../../core/_services/shared.service';
import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GatekeeperService, UserService } from 'src/app/core/_services';
import { NotificationModel } from 'src/app/core/_models';
import { timeStamp } from 'console';
import { ToastrService } from 'ngx-toastr';
import { SelectProcessService } from 'src/app/core/_services/select-process.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user;
  notifications: NotificationModel[] = [];
  notifCount: number;
  header;
  selectedProcess;
  @Output() themeEmit = new EventEmitter();
  constructor(
    private gatekeeperSvc: GatekeeperService,
    private userSvc: UserService,
    private router: Router,
    public sharedSvc: SharedService,
    private toastrSvc: ToastrService,
    private selectProcSvc: SelectProcessService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      if (!this.gatekeeperSvc.loggedUser) {
        this.gatekeeperSvc.loggedUser = this.user;
      }
      this.sharedSvc.selectedProcess = localStorage.getItem('selected-process');
      this.selectedProcess = JSON.parse(this.sharedSvc.selectedProcess);
      this.getNotificationCount();
      this.sharedSvc.getCountries();
    }
  }

  getNotificationCount() {
    this.userSvc.getNotificationCount().subscribe((resp) => {
      if (resp.status) {
        this.notifCount = resp.data;
      }
    });
  }
  getNotifications() {
    this.userSvc.getNotification().subscribe((r) => {
      this.notifications = r.data.slice(0, 15);
      this.notifCount = 0;
    });
  }

  notificationAction(notification: NotificationModel) {
    // if(notification.type === 'ContractTerminate'){
    //   this.toastrSvc.warning('Can not view a terminated contract') ;
    // } else {
    this.router.navigate([
      'landing/process/view-contract/' + notification.businesskey,
    ]);
    // }
  }

  logout(): void {
    this.gatekeeperSvc.logout();
  }

  notificationIconType(type) {
    let icon = this.sharedSvc.notificationIconType(type);
    return icon;
  }

  transformMsg(msg) {
    const doc = new DOMParser().parseFromString(msg, 'text/html');
    return doc.body.innerText;
  }

  routeToHome() {
    this.router.navigate(['']);
  }

  changeProcess() {
    this.selectProcSvc.getWorkflowMaps();
  }
}

import { SharedService, UserService } from 'src/app/core/_services';
import { NotificationModel } from 'src/app/core/_models/notification.model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationModel[];
  allNotifications: NotificationModel[];
  categories = ['All', 'Comments', 'Tasks'];
  selCatg;
  multiSelected = false;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  constructor(
    private userSvc: UserService,
    private sharedSvc: SharedService,
    private toastrSvc: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications() {
    this.userSvc.getNotification().subscribe((resp) => {
      if (resp.status) {
        resp.data.forEach((a) => {
          a.selected = false;
        });
        this.notifications = resp.data;
        this.allNotifications = resp.data;
        this.selCatg = this.categories[0];
      }
    });
  }

  deleteNotification(notification, opt) {
    let s;
    !this.multiSelected && opt === 0 ? (s = 2) : (s = opt);
    let obj;
    switch (s) {
      // single delete
      case 1:
        obj = [notification.id];
        break;
      //all delete
      case 2:
        this.notifications.forEach((a) => {
          a.selected = true;
        });
        obj = this.notifications.filter((a) => a.selected).map((m) => m.id);
        break;
      // selected delete
      case 0:
        obj = this.notifications.filter((a) => a.selected).map((m) => m.id);
        break;
    }
    this.userSvc.deleteNotification(obj).subscribe((resp) => {
      if (resp.status) {
        if (opt === 1) {
          this.notifications = this.notifications.filter(
            (a) => a.id !== notification.id
          );
          this.allNotifications = this.allNotifications.filter(
            (a) => a.id !== notification.id
          );
        } else {
          this.notifications = this.notifications.filter((a) => !a.selected);
          this.allNotifications = this.allNotifications.filter(
            (a) => !a.selected
          );
        }
        this.toastrSvc.success('Notification Deleted');
        this.multiSelected = false;
      }
    });
  }

  notificationIconType(type) {
    let icon = this.sharedSvc.notificationIconType(type);
    return icon;
  }

  filterNotification(type) {
    this.selCatg = type;
    if (type.includes('Task')) {
      type = 'Task';
    }
    switch (type) {
      case 'All':
        this.notifications = this.allNotifications;
        break;
      case 'Comments':
        this.notifications = this.allNotifications.filter((a) =>
          a.type.includes('Comment')
        );
        break;
      case 'CommentReply':
        this.notifications = this.allNotifications.filter(
          (a) => a.type === 'Comment'
        );
        break;
      case 'Task':
        this.notifications = this.allNotifications.filter(
          (a) => !a.type.includes('Comment')
        );
        break;
    }
  }
  notificationAction(notification: NotificationModel) {
    this.router.navigate([
      'landing/process/view-contract/' + notification.businesskey,
    ]);
  }

  selectNotification(id, event) {
    this.notifications.find((a) => a.id == id).selected = event.checked;
    this.allNotifications.find((a) => a.id == id).selected = event.checked;
    const l = this.notifications.filter((a) => a.selected).length;
    l > 0 ? (this.multiSelected = true) : (this.multiSelected = false);
  }

  selectAll(cat, event) {
    if (cat == 'All') {
      this.notifications.forEach((a) => (a.selected = event.checked));
      this.allNotifications.forEach((a) => (a.selected = event.checked));
    } else {
      this.notifications.forEach((a) => (a.selected = event.checked));
      this.allNotifications
        .filter((a) => a.type.includes(cat))
        .map((m) => (m.selected = event.checked));
    }
  }

  checkAllSelection() {
    let res;
    let f = this.notifications?.find((n) => !n.selected);
    f ? (res = false) : (res = true);
    return res;
  }
}

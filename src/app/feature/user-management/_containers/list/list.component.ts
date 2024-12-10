import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { LoggedUserModel } from 'src/app/core/_models';
import * as _fromCoreServices from 'src/app/core/_services';
import { CreateUserModalComponent } from '../../_modals/create-user-modal/create-user-modal.component';
import { GroupModalComponent } from '../../_modals/group-modal/group-modal.component';
import { RolesModalComponent } from '../../_modals/roles-modal/roles-modal.component';
import { GroupNewModel, UserModel } from '../../_models';
import { RolesModel } from '../../_models/role.model';
import * as _fromServices from '../../_services';
import {
  FailedCamundaUserDisplayComponent,
  ViewEditUserModalComponent,
} from './../../_modals';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  viewProviders: [_fromServices.SubscribeRouteService],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('gridinstance') gridInstance;
  managementType = '';
  groupList: GroupNewModel[] = [];
  rolesList: RolesModel[] = [];
  userList: LoggedUserModel[] = [];
  selectedRow: any;
  subscriptions: Subscription[] = [];
  roles = [];
  groups = [];
  selectedProcess;
  constructor(
    private router: Router,
    private userSvc: _fromCoreServices.UserService,
    private route: ActivatedRoute,
    private groupSvc: _fromServices.GroupService,
    private subscribeRoute: _fromServices.SubscribeRouteService,
    private modalSvc: NgbModal,
    private roleSvc: _fromServices.RolesService,
    private toastrSvc: ToastrService,
    private ngxUiLoaderSvc: NgxUiLoaderService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getManagementType();
    this.subscribeRoute.init();
    this.getRolesAndGroups();
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((i) => i.unsubscribe());
  }

  getRolesAndGroups() {
    this.userSvc.getUserGroups().subscribe((r) => {
      this.groups = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
    this.userSvc.getUserRoles().subscribe((r) => {
      this.roles = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }
  getManagementType(): void {
    this.subscriptions.push(
      this.subscribeRoute.managementType.subscribe((a) => {
        console.log(a);

        this.managementType = a;
        switch (a) {
          case 'user':
            this.getUserList();
            break;
          case 'group':
            this.getGroupList();
            break;
          case 'role':
            this.getRoleList();
            break;
          default:
            break;
        }
      })
    );
  }

  setDefaultGroup() {
    this.userSvc.setDefaultGroup().subscribe((r) => {
      if (r.status) {
        this.toastrSvc.success('Default Group assigned to all users');
      }
    });
  }
  getUserList(): void {
    this.subscriptions.push(
      this.userSvc.getAllUsers().subscribe((a) => {
        this.userList = a.data.sort((x, y) =>
          x.fullname > y.fullname ? 1 : -1
        );
        this.userList.forEach((u) => {
          if (u.roles && u.roles.length > 0) {
            u.roles = u.roles.sort((a, b) => (a > b ? 1 : -1));
          }
          u.activeString = u.active ? 'Yes' : 'No';

          if (u.groupnames && u.groupnames.length > 0) {
            u.groupnames = u.groupnames.sort((a, b) => (a > b ? 1 : -1));
          }
        });
        this.groupList = [];
        this.rolesList = [];
      })
    );
  }

  getGroupList(): void {
    this.subscriptions.push(
      this.groupSvc.getAllGroups().subscribe((data) => {
        this.groupList = data?.data?.map((grp) => ({
          ...grp,
          rolevm: grp.rolevm.map((role) => role.name),
        }));
        this.userList = [];
        this.rolesList = [];
      })
    );
  }

  getRoleList(): void {
    this.subscriptions.push(
      this.roleSvc.getAllRoles().subscribe((data) => {
        if (data.status) {
          console.log(data);
          this.rolesList = data?.data;
          this.userList = [];
          this.groupList = [];
        }
      })
    );
  }
  openRolesModal(role?) {
    const modalRef = this.modalSvc.open(RolesModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    // modalRef.componentInstance.group = { name: '', description: '' };
    modalRef.componentInstance.roles = this.rolesList;
    if (role) {
      modalRef.componentInstance.roleToEdit = role;
    }
    // modalRef.componentInstance.groups = this.groups;

    modalRef.componentInstance.roleEmitter.subscribe((r) => {
      if (role) {
        this.roleSvc.updateRole(r).subscribe((resp) => {
          if (resp.status) {
            this.toastrSvc.success('Role updated');
            const idx = this.rolesList.findIndex(
              (a) => a?.id?.toString() === r?.id?.toString()
            );

            this.rolesList[idx] = r;
            this.gridInstance.updateRow(idx, r);
            modalRef.close();
          } else {
            this.toastrSvc.error('Role could not be updated');
          }
        });
      } else {
        this.roleSvc.createRole(r).subscribe((resp) => {
          if (resp.status) {
            this.toastrSvc.success('Role Created');
            this.rolesList.push(resp.data);
            // this.userList[idx] = r ;
            this.gridInstance.updateBoundData();
            modalRef.close();
            // window.location.reload();
          } else {
            this.toastrSvc.error('Role could not be created');
          }
        });
      }
    });
  }
  openGroupModal(group?) {
    const modalRef = this.modalSvc.open(GroupModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    // modalRef.componentInstance.group = { name: '', description: '' };
    modalRef.componentInstance.groups = this.groupList;
    // modalRef.componentInstance.groups = this.groups;
    if (group) {
      modalRef.componentInstance.groupToEdit = this.groupList.find(
        (grp) => grp.groupid === group.groupid
      );
    }
    modalRef.componentInstance.groupEmitter.subscribe((r) => {
      if (group) {
        this.groupSvc.updateGroup(r).subscribe((resp) => {
          if (resp.status) {
            this.toastrSvc.success('Group updated');
            location.reload();
            // const idx = this.groupList.findIndex(
            //   (a) => a?.id?.toString() === r?.id?.toString()
            // );
            // this.groupList[idx] = {
            //   ...r,g
            //   rolevm: r.rolevm.map((role) => role.name),
            // };
            // console.log(this.groupList, {
            //   ...r,
            //   rolevm: r.rolevm.map((role) => role.name),
            // });

            // this.gridInstance.updateRow(idx, r);
            // modalRef.close();
          } else {
            this.toastrSvc.error('Group could not be updated');
          }
        });
      } else {
        this.groupSvc.createGroup({ ...r }).subscribe((resp) => {
          if (resp.status) {
            this.toastrSvc.success('Group created');
            // let newGroupGridformatedRoles = resp.data?.rolevm?.map(
            //   (role) => role.name
            // );
            // this.groupList.push({
            //   ...resp.data,
            // });
            // this.userList[idx] = r ;
            // this.gridInstance.updateBoundData();
            modalRef.close();
            window.location.reload();
          } else {
            this.toastrSvc.error('Group could not be created');
          }
        });
      }
    });
  }
  addRole(): void {
    this.openRolesModal();
  }
  editRole(): void {
    if (this.selectedRow) {
      let { id, description, name } = this.selectedRow;
      let role: RolesModel = { id, description, name };
      this.openRolesModal(role);
    }
  }
  addGroup(): void {
    this.openGroupModal();
  }
  editGroup(): void {
    if (this.selectedRow) {
      let { id, description, name, groupid } = this.selectedRow;
      let group: GroupNewModel = { id, description, name, groupid };
      console.log('nnnnnnnnnnnnn', group);
      this.openGroupModal(group);
    }
  }

  deleteGroup() {
    if (this.selectedRow) {
      let selectedGroup = this.groupList.find(
        (grp) => grp.groupid === this.selectedRow.groupid
      );
      let { id } = selectedGroup;
      this.groupSvc.deleteGroup(id).subscribe((resp) => {
        if (resp.status) {
          this.toastrSvc.success('Group Deleted');
          // console.log(this.groupList);
          // this.groupList = this.groupList.filter((group) => group.id !== id);
          // this.userList[idx] = r ;
          // console.log(this.groupList);

          // this.gridInstance.updateBoundData();
          window.location.reload();
        } else {
          this.toastrSvc.error('Group could not be deleted');
        }
      });
    }
  }
  deleteRole() {
    if (this.selectedRow) {
      let { id } = this.selectedRow;
      this.roleSvc.deleteRole(id).subscribe((resp) => {
        if (resp.status) {
          this.toastrSvc.success('Role deleted');
          // this.rolesList = this.rolesList.filter((role) => role.id !== id);
          // this.userList[idx] = r ;
          // const idx = this.rolesList.findIndex((role) => role.id === id);

          // this.rolesList.splice(idx, 1);
          // this.gridInstance.updateBoundData();
          window.location.reload();
        } else {
          this.toastrSvc.error('Role could not be deleted');
        }
      });
    }
  }
  clearAssignMent(userid): void {
    this.userSvc.getUser(userid).subscribe((resp) => {
      this.openModal(resp.data, 'clear');
    });
  }

  doubleClick(e: any) {
    // console.log('DOUBLE CLICK >>', e);
    if (e.userid) {
      this.viewUser(e.userid);
    } else if (e.groupid) {
      this.editGroup();
    } else if (!e.userid && !e.groupid) {
      this.editRole();
    }
  }

  onGridRowSelect(e: any): void {
    this.selectedRow = e.row;
    switch (e.action) {
      case 'adduser':
        this.addUser();
        break;
      case 'view':
        this.viewUser(this.selectedRow.userid);
        break;
      case 'setdefaultgroup':
        this.setDefaultGroup();
        break;
      case 'clearassignment':
        this.clearAssignMent(this.selectedRow.userid);
        break;
      case 'sync':
        this.syncWithAD();
        break;
      case 'addgroup':
        this.addGroup();
        break;
      case 'viewgroup':
        this.editGroup();
        break;
      case 'deletegroup':
        this.deleteGroup();
        break;
      case 'addrole':
        this.addRole();
        break;
      case 'editrole':
        this.editRole();
        break;
      case 'deleterole':
        this.deleteRole();
        break;
    }
  }

  viewUser(userid): void {
    // this.router.navigate([`./view/${this.selectedRow.id}`], {relativeTo: this.route});
    this.userSvc.getUser(userid).subscribe((resp) => {
      let res = resp;
      let userProfileIconUrl;
      this.userSvc.previewUserImage(userid).subscribe((resp) => {
        if (resp.body.size > 0) {
          userProfileIconUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(resp.body)
          );
        }
        res.data.userProfileIconUrl = userProfileIconUrl;
        this.openModal(res.data, 'view');
      });
    });
  }

  addUser(): void {
    let user: UserModel = {
      id: '',
      userid: '',
      fname: '',
      lname: '',
      fullname: '',
      email: '',
      suspended: false,
      roles: [],
      groupnames: [],
      active: false,
    };
    this.createUserModal(user);
  }

  createUserModal(user) {
    const modalRef = this.modalSvc.open(CreateUserModalComponent, {
      size: 'xl',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.roles = this.roles;
    modalRef.componentInstance.groups = this.groups;
    modalRef.componentInstance.userEmitter.subscribe((r) => {
      r.fullname = r.fname + ' ' + r.lname;
      r.userid = (r.fname.charAt(0) + r.lname).toLowerCase();
      console.log(r.userid);
      r.email = r.email.toLowerCase();
      this.userSvc.createUser(r).subscribe(
        (resp) => {
          if (resp.status) {
            this.toastrSvc.success('New User created sucessfully');
            modalRef.close();
            window.location.reload();
          }
        },
        (error) => {
          //this.toastrSvc.error(error.error.error);
          modalRef.close();
        }
      );
    });
  }

  openModal(user, actionType) {
    const modalRef = this.modalSvc.open(ViewEditUserModalComponent, {
      size: 'xl',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.actionType = actionType;
    modalRef.componentInstance.roles = this.roles;
    modalRef.componentInstance.groups = this.groups;

    modalRef.componentInstance.userEmitter.subscribe((r) => {
      if (actionType === 'clear') {
        this.ngxUiLoaderSvc.start();
        let processname = JSON.parse(localStorage.getItem('selected-process'));

        this.userSvc.clearAssignments(r, processname.name).subscribe((resp) => {
          if (resp.status) {
            this.toastrSvc.success('Cleared Assignements for the user');
            // const idx = this.userList.findIndex( a => a.userid === r.userid) ;
            // this.userList[idx] = r ;
            // this.gridInstance.updateRow(idx, r) ;
            modalRef.close();
            window.location.reload();
          }
        });
      } else {
        this.userSvc.editUser(r).subscribe((resp) => {
          if (resp.status) {
            this.toastrSvc.success('User Details Edited');
            // const idx = this.userList.findIndex( a => a.userid === r.userid) ;
            // this.userList[idx] = r ;
            // this.gridInstance.updateRow(idx, r) ;
            modalRef.close();
            window.location.reload();
          }
        });
      }
    });
  }
  syncWithAD() {
    this.userSvc.syncWithAD().subscribe((res) => {
      if (res.status) {
        this.toastrSvc.success('Sync completed');
        this.openFailedUserModal(res.data);
      }
    });
  }

  openFailedUserModal(users) {
    const refMod = this.modalSvc.open(FailedCamundaUserDisplayComponent, {
      size: 'lg',
    });
    refMod.componentInstance.users = users;
  }
}

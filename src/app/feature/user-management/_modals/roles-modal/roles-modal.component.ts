import { UserService } from 'src/app/core/_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from './../../_models/user.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Roles, UserGroupsEnum } from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';
import { GroupModel } from '../../_models';
import { RolesModel } from '../../_models/role.model';
@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.scss'],
})
export class RolesModalComponent implements OnInit {
  @Input() roleToEdit: RolesModel;

  @Input() roles;
  @Input() groups;
  @Output() roleEmitter = new EventEmitter();
  role: RolesModel = { id: 0, name: '', description: '' };
  selectedRoles = [];
  selectedGroups = [];

  // dropdownSettings: IDropdownSettings = {
  //   singleSelection: false,
  //   closeDropDownOnSelection: false,
  //   idField: 'id',
  //   textField: 'name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 3,
  //   allowSearchFilter: true,
  //   enableCheckAll: false,
  // };

  constructor(
    private activeModal: NgbActiveModal,
    private userSvc: UserService,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.roleToEdit) {
      this.role = this.roleToEdit;
    }
  }

  // populateDefaultRolesandGroups() {
  //   this.roles.forEach((a) => {
  //     if (this.user.roles.includes(a.id) || this.user.roles.includes(a.name)) {
  //       this.selectedRoles.push(a);
  //     }
  //   });
  //   this.groups.forEach((a) => {
  //     if (
  //       this.user.groupnames.includes(a.id) ||
  //       this.user.groupnames.includes(a.name)
  //     ) {
  //       this.selectedGroups.push(a);
  //     }
  //   });
  // }

  close() {
    this.activeModal.dismiss();
  }

  save() {
    if (this.roles.name?.trim() == '') return;
    this.roleEmitter.emit(this.role);
  }

  // onItemSelect(event, type) {
  //   if (!this.user[type] || this.user[type] === null) {
  //     this.user[type] = [];
  //   }
  //   // if ( this.user[type].includes(event.id)) {
  //   //   this.user[type] = this.user[type].filter(a => a !== event.id) ;

  //   // } else {
  //   //   this.user[type].push(event.id) ;
  //   // }
  //   if (type === 'groupnames') {
  //     if (this.checkSalesUser(event.id, 2)) {
  //       this.selectedGroups.includes(event)
  //         ? (this.selectedGroups = this.selectedGroups)
  //         : this.selectedGroups.push(event);
  //       this.user[type].includes(event.id)
  //         ? (this.user[type] = this.user[type].filter((a) => a !== event.id))
  //         : this.user[type].push(event.id);
  //     } else {
  //       this.selectedGroups = this.selectedGroups.filter(
  //         (s) => s.id !== event.id
  //       );
  //       this.toastrSvc.warning('Cannot Add Selected Group With Sales');
  //     }
  //   }
  //   if (type === 'roles') {
  //     if (this.checkSalesUser(event.name, 1)) {
  //       this.selectedRoles.includes(event)
  //         ? (this.selectedRoles = this.selectedRoles)
  //         : this.selectedRoles.push(event);
  //       this.user[type].includes(event.id || event.name)
  //         ? (this.user.roles = this.user.roles.filter(
  //             (a) => a !== event.id || a !== event.name
  //           ))
  //         : this.user.roles.push(event.name);
  //     } else {
  //       this.selectedRoles = this.selectedRoles.filter(
  //         (s) => s.name !== event.name
  //       );
  //       this.toastrSvc.warning('Cannot Add Selected Role With Sales');
  //     }
  //   }
  // }

  // onSelectAll(event, type) {
  //   if (type === 'groupnames'){
  //     this.toastrSvc.warning('Cannot Select All Groups') ;
  //     // this.populateDefaultRolesandGroups() ;
  //     this.selectedGroups = this.selectedGroups.filter(s => this.user.groupnames.includes(s.id)) ;
  //   } else if (type === 'roles') {
  //     this.toastrSvc.warning('Cannot Select All Roles') ;
  //     this.selectedRoles = this.selectedRoles.filter(r => this.user.groupnames.includes(r.name));
  //     // this.populateDefaultRolesandGroups() ;
  //   }

  //   this.user[type] = [] ;
  //   event.forEach(a => {
  //    this.user[type].push(a.id) ;
  //    if (type === 'groupnames') {
  //     this.selectedGroups = [] ;
  //     this.selectedGroups.push(a) ;
  //   } else if (type === 'roles') {
  //     this.selectedRoles = [] ;
  //     this.selectedRoles.push(a) ;
  //   }
  //  }) ;
  // }

  // onDeSelect(event, type) {
  //   if (type === 'groupnames') {
  //     this.selectedGroups = this.selectedGroups.filter((a) => a !== event);
  //     this.user.groupnames = this.user.groupnames.filter((a) => a !== event.id);
  //   } else if (type === 'roles') {
  //     this.selectedRoles = this.selectedRoles.filter((a) => a !== event);
  //     this.user.roles = this.user.roles.filter((a) => a !== event.name);
  //   }
  // }

  // onDeSelectAll(event, type) {
  //   this.user[type] = [] ;
  //   if (type === 'groupnames') {
  //     this.selectedGroups = [] ;
  //   } else if (type === 'roles') {
  //     this.selectedRoles = [] ;
  //   }
  // }

  checkSalesUser(inputRoleorGrp, opt): boolean {
    let t;
    let m;
    switch (opt) {
      case 1: //role
        m = this.selectedRoles.map((s) => s.name);
        if (m.includes(Roles.SALES_USER)) {
          t = m.find(
            (a) =>
              a !== Roles.SUPER_ADMIN &&
              a !== Roles.GUEST_USER &&
              a !== Roles.SALES_USER
          );
          return t ? false : true;
        } else {
          return true;
        }
      case 2: //group
        m = this.selectedGroups.map((s) => s.id);
        if (m.includes(UserGroupsEnum.SALES)) {
          t = m.find(
            (a) =>
              a !== UserGroupsEnum.CAMUNDA_ADMIN &&
              a !== UserGroupsEnum.GUEST &&
              a !== UserGroupsEnum.SALES
          );
          return t ? false : true;
        } else {
          return true;
        }
    }
  }

  // toggleActiveStatus(event) {
  //   this.user.active = event.checked;
  // }
}

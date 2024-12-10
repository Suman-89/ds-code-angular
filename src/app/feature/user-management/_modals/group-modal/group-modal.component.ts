import { UserService } from 'src/app/core/_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from './../../_models/user.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Roles, UserGroupsEnum } from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';
import { GroupModel, GroupNewModel } from '../../_models';
import { GroupService, RolesService } from '../../_services';

@Component({
  selector: 'app-group-modal',
  templateUrl: './group-modal.component.html',
  styleUrls: ['./group-modal.component.scss'],
})
export class GroupModalComponent implements OnInit {
  @Input() groupToEdit: GroupNewModel;
  @Input() readOnly: false;
  roles = [];

  @Input() groups;
  @Output() groupEmitter = new EventEmitter();
  group: GroupNewModel = {
    id: 0,
    name: '',
    groupid: '',
    description: '',
    rolevm: [],
  };
  selectedRoles = [];
  selectedGroups = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
  };

  constructor(
    private activeModal: NgbActiveModal,
    private userSvc: UserService,
    private toastrSvc: ToastrService,
    private roleSvc: RolesService,
    private grpSvc: GroupService
  ) {}

  ngOnInit(): void {
    this.roleSvc.getUpmappedRoles().subscribe((res) => {
      this.roles = res.data.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
    if (this.groupToEdit) {
      this.group = this.groupToEdit;
      this.grpSvc.getGroupRoles(this.groupToEdit?.id).subscribe((resp) => {
        this.group.rolevm = resp.data;
        this.selectedRoles = resp.data;
      });
    }
  }
  generateGroupid(event) {
    if (!this.groupToEdit) {
      this.group.groupid = this.group.name
        ?.split('')
        ?.filter((char) => char !== ' ')
        .join('')
        ?.toLowerCase();
    }
  }
  formatGroupid(event) {
    this.group.groupid = this.group.groupid
      ?.split('')
      ?.filter((char) => char !== ' ')
      ?.join('')
      ?.toLowerCase();
  }
  close() {
    this.activeModal.dismiss();
  }

  save() {
    let groupName = this.group.name?.trim();
    let groupId = this.group.groupid.trim();
    if (groupName == '')
      return this.toastrSvc.error(`Group Name cannot be empty`);
    if (groupId == '') return this.toastrSvc.error(`Group Id cannot be empty`);

    let regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (regex.test(groupId)) {
      return this.toastrSvc.error(
        `Special characters in Group Id are not allowed i.e. \`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`
      );
    }
    let finalGroup: GroupNewModel = {
      ...this.group,
      name: groupName,
      groupid: groupId,
    };
    this.groupEmitter.emit(finalGroup);
  }

  onItemSelect(event, type) {
    this.group.rolevm.push(event);
  }

  onDeSelect(event, type) {
    this.group.rolevm = this.group.rolevm.filter(
      (role) => role.id !== event.id
    );
  }

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
}

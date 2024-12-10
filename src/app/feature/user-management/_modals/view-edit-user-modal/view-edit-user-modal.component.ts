import { UserService } from 'src/app/core/_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from './../../_models/user.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Roles, UserGroupsEnum } from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-edit-user-modal',
  templateUrl: './view-edit-user-modal.component.html',
  styleUrls: ['./view-edit-user-modal.component.scss'],
})
export class ViewEditUserModalComponent implements OnInit {
  @Input() user: UserModel;
  @Input() roles;
  @Input() actionType = 'view';
  @Input() groups;
  @Output() userEmitter = new EventEmitter();

  fullPhoneNumber: string;

  selectedRoles = [];
  selectedGroups = [];
  groupToUsersMap = {};
  selectedGroupToUsersMap = {};
  selectedAssignedUserMap = {};
  selectedGroupId = '';

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

  profileImageUrl;
  profileIconName;

  tempProfileImageUrl:any;
  tempProfileIconName;

  inputImg:any;

  displayAssignMenu = false;

  isEditMode: boolean;

  constructor(
    private activeModal: NgbActiveModal,
    private userSvc: UserService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.populateDefaultRolesandGroups();
    if(this.user.userProfileIconUrl){
      this.profileImageUrl = this.user.userProfileIconUrl;
    }else{
      this.profileImageUrl="https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"

    }

    // console.log(this.user);
    // console.log(this.profileImageUrl)
  
    // const url = this.profileImageUrl.changingThisBreaksApplicationSecurity;
    // const blobUrlParts = url.split('/');
    // console.log(blobUrlParts)
    // const fileName = blobUrlParts[blobUrlParts.length - 1];
    // console.log(fileName);

    this.userSvc.isEditMode.subscribe((res) => {
      this.isEditMode = res;
    });
  }

  populateDefaultRolesandGroups() {
    this.roles.forEach((a) => {
      if (this.user.roles.includes(a.id) || this.user.roles.includes(a.name)) {
        this.selectedRoles.push(a);
      }
    });

    this.groups.forEach((a) => {
      if (
        this.user.groupnames.includes(a.id) ||
        this.user.groupnames.includes(a.name)
      ) {
        this.selectedGroups.push(a);
      }
    });

    if (this.actionType === 'clear') {
      this.selectedGroups.forEach((grp) => {
        this.getGroupUsers(grp.id);
      });
    }
    console.log('selectedGroups', this.selectedGroups);
  }

  toggleGroupQueue(groupId, event) {
    this.groups.find((grp) => grp.id == groupId).checked = event.target.checked;
    if (event.target.checked === false && !this.groupToUsersMap[groupId]) {
      this.userSvc.getGroupUsersByGroup(groupId, true).subscribe((r) => {
        this.groupToUsersMap[groupId] = r.data.sort((a, b) =>
          a.fullname > b.fullname ? 1 : -1
        );
      });
    }
  } 

  

  getProfilePic(e){
    let file=e.target.files[0];
    this.tempProfileIconName=e.target.files[0].name
    let url = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(file))
      // this.tempProfileImageUrl=url;
    this.tempProfileImageUrl=url
    this.profileIconName =this.tempProfileIconName;
    this.inputImg=file
  }

  saveProfilePic(){
    // this.profileIconName =this.tempProfileIconName;
    let formdata = new FormData();
    formdata.append('multipartfile', this.inputImg);
    // formdata['multipartfile']=e.target.files[0];
    // console.log(formdata);
    this.userSvc.uploadUserImage(this.user.userid, formdata).subscribe((p) => {
      if (p.status) {
        this.userSvc.previewUserImage(this.user.userid).subscribe((resp) => {
          var url = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(resp.body)
          );
          this.profileImageUrl = url;
        });
      }
    })
  }
 // remove onFileSelect image upload logic inside saveProfilePic and added temporary variables to display image inside preview
  close() {
    this.activeModal.dismiss();
  }

  save() {
    this.user.phoneNumber = this.fullPhoneNumber; //getting data from country code
    if(this.tempProfileImageUrl!==undefined){
      this.saveProfilePic();
    }
    if (this.actionType === 'clear') {
      let data = {
        userid: this.user.userid,
        userReAssignMents: this.user.groupnames
          .filter(
            (groupId) => groupId !== 'camunda-admin' && groupId !== 'guest'
          )
          .map((groupId) => ({
            oldgroupname: groupId,
            newusername: this.selectedAssignedUserMap[groupId]?.userid,
            assigntogroup:
              this.selectedAssignedUserMap[groupId] === 'Group Queue',
          })),
      };

      this.userEmitter.emit(data);
    } else this.userEmitter.emit(this.user);
  }

  onItemSelect(event, type) {
    if (!this.user[type] || this.user[type] === null) {
      this.user[type] = [];
    }

    if (type === 'groupnames') {
      this.selectedGroups.includes(event)
        ? (this.selectedGroups = this.selectedGroups)
        : this.selectedGroups.push(event);

      this.user[type].includes(event.id)
        ? (this.user[type] = this.user[type].filter((a) => a !== event.id))
        : this.user[type].push(event.id);
    }
    if (type === 'roles') {
      // if (this.checkSalesUser(event.name, 1)) {
      this.selectedRoles.includes(event)
        ? (this.selectedRoles = this.selectedRoles)
        : this.selectedRoles.push(event);
      this.user[type].includes(event.id || event.name)
        ? (this.user.roles = this.user.roles.filter(
            (a) => a !== event.id || a !== event.name
          ))
        : this.user.roles.push(event.name);
      // } else {
      //   this.selectedRoles = this.selectedRoles.filter( s => s.name !== event.name ) ;
      //   this.toastrSvc.warning('Cannot Add Selected Role With Sales') ;
      // }
    }
  }

  getGroupUsers(groupId) {
    if (!this.groupToUsersMap[groupId]) {
      this.userSvc.getGroupUsersByGroup(groupId, true).subscribe((r) => {
        this.groupToUsersMap[groupId] = r.data.sort((a, b) =>
          a.fullname > b.fullname ? 1 : -1
        );
        if (this.actionType === 'clear') {
          this.getUserAssignments();
        }
      });
    }
  }

  getUserAssignments() {
    this.userSvc.getUserReassignments(this.user.userid).subscribe((res) => {
      res.data.userReAssignMents?.forEach((reassignment) => {
        if (reassignment.assigntogroup) {
          this.selectedAssignedUserMap[reassignment.oldgroupname] =
            'Group Queue';
        } else {
          this.selectedAssignedUserMap[reassignment.oldgroupname] =
            this.groupToUsersMap[reassignment.oldgroupname]?.find(
              (user) => user.userid === reassignment.newusername
            );
        }
      });
    });
  }

  setUserFromGroup(group, user, event) {
    if (user) {
      this.selectedAssignedUserMap[group.id] = user;
    } else {
      this.selectedAssignedUserMap[group.id] = 'Group Queue';
    }
    this.displayMenu(
      event,
      this.selectedGroups[0] ? this.selectedGroups[0].id : 'guest'
    );
  }

  displayMenu(event, id) {
    console.log('SELECTED ID ', id);
    if (typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    if (id == this.selectedGroupId && this.displayAssignMenu) {
      this.displayAssignMenu = false;
    } else {
      this.displayAssignMenu = true;
    }
    this.selectedGroupId = id;
  }

  onDeSelect(event, type) {
    if (type === 'groupnames') {
      this.selectedGroups = this.selectedGroups.filter((a) => a !== event);
      this.user.groupnames = this.user.groupnames.filter((a) => a !== event.id);
    } else if (type === 'roles') {
      this.selectedRoles = this.selectedRoles.filter((a) => a !== event);
      this.user.roles = this.user.roles.filter((a) => a !== event.name);
    }
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

  toggleActiveStatus(event) {
    this.user.active = event.checked;
  }
  onIconInputClick(inputId) {
    document.getElementById(inputId).click();
  }
  onFileChange(e) {
    this.profileIconName = e.target.files[0].name;
    let formdata = new FormData();
    // formdata.append('multipartfile', e.target.files[0]);
    formdata['multipartfile']=e.target.files[0];
    console.log(formdata);
    this.userSvc.uploadUserImage(this.user.userid, formdata).subscribe((p) => {
      if (p.status) {
        this.userSvc.previewUserImage(this.user.userid).subscribe((resp) => {
          var url = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(resp.body)
          );
          this.profileImageUrl = url;
        });
      }
    });

  }

  editMode(val: boolean): void {
    val ? (this.isEditMode = true) : (this.isEditMode = false);
  }

  getFullNumber(e) {
    this.fullPhoneNumber = e;
  }
}

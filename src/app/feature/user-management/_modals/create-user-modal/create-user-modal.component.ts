import { ProcessLandingComponent } from './../../../process/layout/_containers/process-landing/process-landing.component';
import { filter } from 'rxjs/operators';
import { Component, OnInit,Input, Output, EventEmitter} from '@angular/core';
import { UserService } from 'src/app/core/_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from './../../_models/user.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Roles, UserGroupsEnum } from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';
import { GroupRoleService } from '../../_services';
@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss']
})
export class CreateUserModalComponent implements OnInit {
  @Input() user: UserModel ;
  //@Input() user: CreateUserModel;
  // @Input() roles  ;
  // @Input() groups ;
  @Output() userEmitter = new EventEmitter<UserModel>() ;
  selectedRoles = [];
  selectedGroups = [];
  newRoles;
  newGroups;
  rolevm=[];
  showuserId:string;
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false 
  };


  constructor(private activeModal: NgbActiveModal, private userSvc: UserService, private toastrSvc: ToastrService,
              private groupandroleSvc: GroupRoleService) { }

  ngOnInit(): void {
    this.newGroups = [];
    this.newRoles = [];
    this.getGroupAndRoles();
  }
  getUserId(fname,lname){
   this.showuserId = (fname.charAt(0)+lname).toLowerCase();
  }
  getGroupAndRoles(){
     this.groupandroleSvc.getAllRollsandGroups().subscribe(resp=>{
       this.newGroups = resp.data;
    });
  }


  close() {
    this.activeModal.dismiss() ;
  }

  save() {

    for(let x=0;x<this.selectedGroups.length;x++){
      this.user.groupnames.push(this.selectedGroups[x].name.trim());
    }
    for(let x=0;x<this.selectedRoles.length;x++){
      this.user.roles.push(this.selectedRoles[x].name.trim());
    }
    
    this.userEmitter.emit(this.user) ;
  }
  
  onItemSelect(event,type){
   if(type === 'groupnames'){
    this.selectedGroups.includes(event) ? this.selectedGroups = this.selectedGroups : this.selectedGroups.push(event);
    this.getRoles(event);
   }
   else if(type === 'roles'){
    this.selectedRoles.includes(event) ? this.selectedRoles = this.selectedRoles:this.selectedRoles.push(event) ;
    this.user.roles = this.selectedRoles;
    }
  }

  onDeSelect(event,type) { 
    if(type === 'groupnames'){
      let data = this.newGroups;
      for(let i=0;i<data.length;i++){
        if(data[i].name==event.name){
          let obj = data[i].rolevm;
          for(let x=0;x<obj.length;x++){
            this.newRoles = this.newRoles.filter(s=> s.id != obj[x].id);
            this.selectedRoles = this.selectedRoles.filter(s => s.id != obj[x].id);
          }
        }
      }
      this.selectedGroups = this.selectedGroups.filter(s => s.name != event.name);      
    }
    else if(type === 'roles'){
      this.selectedRoles = this.selectedRoles.filter(s => s.name != event.name);
      console.log(this.selectedRoles);
   }
  }

getRoles(event){
    let data = this.newGroups;
    for(let i=0;i<data.length;i++){
      if(data[i].name==event.name){
        this.rolevm = data[i].rolevm;        
        for(let x=0;x<this.rolevm.length;x++){
          this.newRoles.includes(this.rolevm[x]) ? this.newRoles = this.newRoles : this.newRoles = [...this.newRoles,this.rolevm[x]];
          this.selectedRoles = this.newRoles;
        }
        break;
      }
    }
}

  toggleActiveStatus(event) {
    this.user.active = event.checked ;
  }
  toggleExternalUsers(event) {
    this.user.externaluser = event.checked ;
  }


}

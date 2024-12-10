import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SyncUserResponseType } from 'src/app/core/_models';

@Component({
  selector: 'app-failed-camunda-user-display',
  templateUrl: './failed-camunda-user-display.component.html',
  styleUrls: ['./failed-camunda-user-display.component.scss']
})
export class FailedCamundaUserDisplayComponent implements OnInit {
@Input() users;
selectedList ;
userType = SyncUserResponseType ;
filterList: any[] ;
  constructor(public activeModal : NgbActiveModal) { 
  }

  ngOnInit(): void {
    this.setFilterList() ;
    delete this.users[this.userType.failedCamundaUsers] ;
    this.selectedList = this.users[this.userType.newUsers] ;

  }

  filterUsers(type) {
    this.selectedList = this.users[type] ;
    this.filterList.map(f => {
       f.selected = f.value === type ? true  : false;
        return f;
      })
  }

  setFilterList() {
   this.filterList = [
  //  {label: 'Failed', value: this.userType.failedCamundaUsers, selected: true},
   {label: 'New Users', value: this.userType.newUsers, selected: true},
   {label: 'Deleted Users', value: this.userType.deletedUsers, selected: false},
   {label: 'Users From AD', value: this.userType.usersfromAD, selected: false}
   ] ;
  }
}

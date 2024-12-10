import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {} from 'protractor';
import { UserService } from 'src/app/core/_services';
import { GroupModel, UserModel } from 'src/app/feature/user-management/_models';
import { SearchParamModel } from '../../_models';
import { TaskService } from '../../_services';

@Component({
  selector: 'app-contract-search',
  templateUrl: './contract-search.component.html',
  styleUrls: ['./contract-search.component.scss'],
})
export class ContractSearchComponent implements OnInit {
  @Input() searchParams? = {} as SearchParamModel;
  @Output() searchObj = new EventEmitter<any>();
  showpanel = false;
  groups: GroupModel[];
  users: UserModel[];
  taskStatus = [
    { name: 'All', value: null },
    { name: 'In Progress', value: true },
    { name: 'Completed', value: false },
  ];
  contractStatus = [
    { name: 'All', value: null },
    { name: 'In-Process', value: 1 },
    { name: 'Completed', value: 2 },
    { name: 'Terminated', value: 3 },
  ];
  constructor(private taskSvc: TaskService, private userSvc: UserService) {}

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups() {
    this.userSvc.getUserGroups().subscribe((r) => {
      if (r.status) {
        this.groups = r.data;
        if (this.searchParams && this.searchParams.group) {
          this.getUsersByGroup(this.searchParams.group);
        }
      }
    });
  }

  assignGroup(ev) {
    this.getUsersByGroup(this.searchParams.group);
    this.searchParams.user = null;
  }

  getUsersByGroup(gid) {
    this.userSvc.getGroupUsersByGroup(gid).subscribe((resp) => {
      if (resp.status) {
        this.users = resp.data;
      }
    });
  }
  expandPanel() {
    this.showpanel = true;
  }

  search() {
    if (this.searchParams.inprocess === undefined) {
      this.searchParams.inprocess = null;
    }
    if (this.searchParams.group === 'null') {
      this.searchParams.group = null;
    }
    if (this.searchParams.user === 'null') {
      this.searchParams.user = null;
    }
    localStorage.setItem(
      'all_tasks_searchparams',
      JSON.stringify(this.searchParams)
    );

    this.searchObj.emit(this.searchParams);
    this.showpanel = false;
  }

  resetAndCloseForm() {
    this.searchParams = {} as SearchParamModel;
    this.showpanel = false;
  }
}

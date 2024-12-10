import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridToolbarType } from 'src/app/core/_models';
import {
  ExcelExportService,
  SharedService,
  UserService,
} from 'src/app/core/_services';
import { ContractSearchResultModel, SearchParamModel } from '../../_models';
import { TaskActionService, TaskService } from '../../_services';

@Component({
  selector: 'app-contract-search-result',
  templateUrl: './contract-search-result.component.html',
  styleUrls: ['./contract-search-result.component.scss'],
})
export class ContractSearchResultComponent implements OnInit {
  @ViewChild('gridToolbar') gridToolbarInst;
  // @Input() searchParams;
  // @Output() searchEventEmitter = new EventEmitter<any>() ;
  searchParams: SearchParamModel = {
    group: null,
    user: null,
    inprocess: true,
    contractstatus: 1,
  };
  searchData: ContractSearchResultModel[] = [];
  gridType = GridToolbarType;
  user;
  groups;
  groupsArr = [];
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  isContractProcess = this.selectedProcess?.key === 'Process_initiation_impl';
  localization = { emptydatastring: ' ' };
  // gridWidth ;
  constructor(
    private taskSvc: TaskService,
    private userSvc: UserService,
    private sharedSvc: SharedService,
    private taskActionSvc: TaskActionService,
    private exportExcelSvc: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.setSavedSearchedParams();
    this.getGroups();
    this.getUsers();
  }

  ngAfterViewInit() {
    this.search(this.searchParams);
    this.gridToolbarInst.groups = this.groupsArr;
  }

  setSavedSearchedParams() {
    let savedSearchedParams = localStorage.getItem('all_tasks_searchparams');
    if (savedSearchedParams) {
      this.searchParams = JSON.parse(savedSearchedParams);
    }
  }
  search(ev) {
    let prefix = JSON.parse(localStorage.getItem('selected-process'));
    this.taskSvc.searchContract(ev).subscribe((r) => {
      if (r.status) {
        //  let obj ;
        localStorage.setItem('searchContract', JSON.stringify(ev));
        this.searchData = r.data.filter((d) =>
          d.contractid.startsWith(prefix.businessKeyPrefix)
        );

        console.log(this.searchData);
        this.searchData.map((o) => {
          o.contractelapsedtime = this.secondsToDays(o.contractelapsedtime);
          o.elapsedhour = this.secondsToHour(o.elapsedtime);
          o.elapseddays = this.secondsToDays(o.elapsedtime);
          o.taskstatus = o.endtime ? 'Completed' : 'In Progress';
          switch (o.contractstatus) {
            case 1:
              o.overallStats = 'In-Process';
              break;
            case 2:
              o.overallStats = 'Completed';
              break;
            case 3:
              o.overallStats = 'Terminated';
              break;
          }
          if (!o.assignee) {
            if (
              o.taskname === 'Process Started' ||
              o.taskname === 'Process Completed'
            ) {
              o.assignee = o.initiatedbyfullname;
            } else {
              o.assignee = o.groupname + ' Queue';
            }
          }
          if (o.product === 'IOT' && o.contracttype === 'Service Contract') {
            o.contractTypeSecondLevel = o.iotContractType;
            if (o.processvariables) {
              o.processvariables.contractTypeSecondLevel = o.iotContractType;
            }
          }
          if (
            this.selectedProcess.key == 'Initiation_preScreeningProcess' &&
            !o.processvariables?.['psCandidateProfileImage']
          ) {
            // console.log("PROCESS ", a.processvariables, a.processvariables?.['psCandidateProfileImage'])
            o.processvariables.psCandidateProfileImage =
              o.processvariables?.psCandidateFirstName?.[0] +
              o.processvariables?.psCandidateLastName?.[0];
          }
          if (o.initiationfields) {
            o.processvariables = {
              ...o.initiationfields,
              ...o.processvariables,
            };
          }
          if (
            this.selectedProcess.key === 'Initiation_vMTProcess' &&
            o.processvariables &&
            o.processvariables['amendmentId']
          ) {
            o.processvariables['dealId'] =
              (o.processvariables['parentId'] || '') +
              '.' +
              o.processvariables['amendmentId'];
          }
          return o;
        });
        // if (this.isContractProcess) {
        this.groupsArr = ['groupname'];
        // }
        const savedState = JSON.parse(
          localStorage.getItem(`grid-state-${this.gridType.allProcess}`)
        );
        // console.log(this.searchData);

        this.gridToolbarInst.data = this.searchData;
        this.gridToolbarInst.updateBoundData(savedState);
      }
    });
  }

  getElapsedTime(starttime) {
    let s, e;
    s = new Date(starttime).getSeconds();
    e = new Date().getSeconds();
    return this.secondsToHms(e - s);
  }

  secondsToHms(d) {
    return this.sharedSvc.secondsToHms(d);
  }

  secondsToHour(d) {
    return this.sharedSvc.secondsToHour(d);
  }

  secondsToDays(d) {
    return this.sharedSvc.secondsToDays(d);
  }

  getWidth(): number {
    return document.getElementById('searchGridCont').offsetWidth;
  }

  getGroups() {
    this.userSvc.getUserGroups().subscribe((r) => {
      if (r.status) {
        this.groups = r.data;
      }
    });
  }

  getUsers() {
    this.userSvc.getAllUsers().subscribe((r) => {
      if (r.status) {
        this.user = r.data;
      }
    });
  }

  retGrpName(gid) {
    return this.groups ? this.groups?.find((g) => g.id === gid)?.name : null;
  }

  retUsrName(uid) {
    return this.user ? this.user.find((u) => u.userid === uid).fullname : null;
  }

  retStatus(stat) {
    if (stat === undefined || stat === null) {
      return 'All Status';
    } else {
      return stat ? 'In Progress' : 'Completed';
    }
  }

  doubleClick(e): void {
    this.viewTask({ rows: [e] });
  }
  toolbarAction(e: any): void {
    switch (e.action) {
      case 'viewtask':
        this.viewTask(e);
        break;
      // case 'export' :
      //   this.exportAsXLSX(e.columns)  ;
      //   break;
    }
  }
  viewTask(e) {
    this.taskActionSvc.viewMyContract(e.rows[0].contractid);
  }

  // exportAsXLSX(columns) {
  //   const lCol = localStorage.getItem(`grid-columns-${this.gridType.alltasks}`) ;
  //   let date = new Date().toDateString() ;
  //   this.exportExcelSvc.exportAsExcelFile(`${this.gridType.alltasks}-${date}`, lCol, columns, this.searchData);
  // }
}

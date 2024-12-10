import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ContractDetailsModel,
  TaskCommentModel,
  TaskDocumentModel,
  TaskDocumentResponseModel,
  TasksModel,
  TaskTerminateRequestModel,
  UpdateSingleSession,
} from '../../_models';
import {
  TaskService,
  TaskActionService,
  TaskInfoService,
  TaskSignalService,
} from '../../_services';
import { ToastrService } from 'ngx-toastr';
import { ContractModel } from '../../_models/contract.model';
import { GridToolbarType, Roles, UserGroupsEnum } from 'src/app/core/_models';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import {
  ExcelExportService,
  SharedService,
  UserService,
  WhatsappService,
} from 'src/app/core/_services';
import { GroupModel } from 'src/app/feature/user-management/_models';
import { GlobalUpdateConstant } from '../../_models/global-update.constant';
import { CompareTaskComponent } from '../compare-task/compare-task.component';
import { TranscriptionModel } from '../../_models/transcription.model';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss'],
})
export class TasklistComponent implements OnInit, OnDestroy {
  @ViewChild('contractGrid') contractGridInst;
  @ViewChild('groupGrid') grpGridInst;
  @ViewChild('tasklistGrid') tasklistGridInst;
  @ViewChild('commentGrid') commentGridInst;
  nextTask: any;
  documentMap: TaskDocumentResponseModel;
  documentList: TaskDocumentModel[] = [];
  selectedRows: any;
  taskActionRenderer: boolean = false;
  showChevronIcons: boolean = false;
  actions = [];
  contractId: string;
  transcriptionList: TranscriptionModel[] = [];
  commentsAll: TaskCommentModel[] = [];
  contractInfo: ContractModel;
  tasklistType: string;
  gridType = GridToolbarType;
  groupBy: string[] = [];
  tasks: TasksModel[] = null;
  contracts: ContractModel[] = null;
  gridFilterLength = 0;
  contractsFilterWithScore: ContractModel[] = null;
  contractFilterNoScore: ContractModel[] = null;
  subscriptions: Subscription[] = [];
  nestedSourceData: ContractDetailsModel[] = [] as ContractDetailsModel[];
  loggedUser;
  statusName: string = 'In-Process';
  groups: GroupModel[];
  selGrp: UserGroupsEnum;
  groupsEnum = UserGroupsEnum;
  globalPmGrpConstant = new GlobalUpdateConstant().productManagementGrps;
  commentList;
  grps;
  headers;
  header;
  participatingGroups;
  OverAllStatus = ['In-Process', 'Terminated', 'Completed', 'All'];
  processes = [
    'Initiation  Issue Management Process',
    'Initiation E-mail Process',
  ];
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  isPreScreeningProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_preScreeningProcess';
  isAgroAdvisoryProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_agroAdvisoryProcess';
  constructor(
    private router: Router,
    private taskSvc: TaskService,
    private route: ActivatedRoute,
    private toastrSvc: ToastrService,
    private taskActionSvc: TaskActionService,
    private modalSvc: NgbModal,
    private sharedSvc: SharedService,
    private userSvc: UserService,
    private excelService: ExcelExportService,
    private whatsappSvc: WhatsappService,
    public taskInfoSvc: TaskInfoService,
    private taskSignalSvc: TaskSignalService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig.path === 'contracts') {
      // ||this.route.snapshot.routeConfig.path === 'group'
      this.taskActionRenderer = true;
      this.showChevronIcons = true;
    }
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    this.participatingGroups = this.selectedProcess?.participatingGroups
      ?.map((i) => i.id)
      .filter((i) => this.loggedUser.groupnames.includes(i))
      .filter((i) => i != 'guest')
      .filter((i) => i != 'camunda-admin')
      .sort();
    if (this.router.url.includes('group')) {
      this.tasklistType = this.gridType.workbasket;
    } else if (this.router.url.includes('my-queue')) {
      this.tasklistType = this.gridType.worklist;
    }
    // 1) Group Queue is not enabled for Sales group. It should be allowed.
    // if (this.tasklistType == 'GROUPQ') {
    //   this.participatingGroups = this.participatingGroups.filter(
    //     (i) => i != 'sales'
    //   );
    // }
    this.headers = JSON.parse(localStorage.getItem('process-labels'));

    this.loggedUser.groupnames = this.loggedUser.groupnames.sort((a, b) =>
      a > b ? 1 : -1
    );
    this.fetchGroups();
    this.getTasklistType(this.router.url);
    this.header = JSON.parse(localStorage.getItem('selected-process')).label;

    // this.getContractInfoById(); // getting contractInfio by id

    // this.setActions(1); // calling to get and set actions 2
    // // this.getTaskComments(); // getting all comments
    // this.getTaskTranscriptions(); // getting all transcriptions
  }
  ngAfterViewInit() {
    this.search('In-Process');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((i) => i.unsubscribe());
  }
  filterdata(data) {
    this.gridFilterLength = data;
  }

  taskActionRendererIcon(): void {
    this.taskActionRenderer = !this.taskActionRenderer;
  }

  getTasklistType(eventUrl: string): void {
    if (eventUrl.includes('group')) {
      this.tasklistType = this.gridType.workbasket;
    } else if (eventUrl.includes('contracts')) {
      this.tasklistType = this.gridType.contractlist;
    } else if (eventUrl.includes('comment')) {
      this.tasklistType = this.gridType.comments;
    } else {
      this.tasklistType = this.gridType.worklist;
    }
    this.getTasks();
  }

  taskActionRunner(ev) {
    this.selectedRows = ev.rows; // getting the selected rows
    if (this.selectedRows.length === 0) {
      this.taskActionRenderer = false;
      this.showChevronIcons = false;
    } else if (this.selectedRows.length === 1) {
      this.taskActionRenderer = true;
      this.showChevronIcons = true;
    } else {
      this.taskActionRenderer = false;
      this.showChevronIcons = false;
    }
    if (this.taskActionRenderer && this.selectedRows.length === 1) {
      this.setActions(1); // calling to get and set actions 2
      this.getContractInfoById(
        this.selectedRows[0].psId
          ? this.selectedRows[0].psId
          : this.selectedRows[0].contractid
      ); // getting contractInfio by id

      this.getTaskComments(
        this.selectedRows[0].psId
          ? this.selectedRows[0].psId
          : this.selectedRows[0].contractid
      ); // getting all comments
      this.getTaskTranscriptions(
        this.selectedRows[0].psId
          ? this.selectedRows[0].psId
          : this.selectedRows[0].contractid
      ); // getting all transcriptions
    }
  }

  getTaskTranscriptions(data): void {
    this.taskInfoSvc.getTranscriptionList(data).subscribe((a) => {
      this.transcriptionList = a.data;
      this.transcriptionList.sort((a, b) =>
        new Date(a.timestamp) < new Date(b.timestamp) ? 1 : -1
      );
    });
  }

  getNextTask(): void {
    this.taskSvc
      .getNextTask(null, this.contractInfo.contractid)
      .subscribe((a) => {
        if (a.status && a.data) {
          this.nextTask = a.data.tasks;
          // this.tasks.map(
          //   (i) =>
          //     (i.readonly = !i.assignee || i.assignee !== this.loggedUser.userid)
          // );
          this.taskSignalSvc.ongoingTasks.next(this.nextTask);
        }
      });
  }

  getTaskComments(data): void {
    this.taskInfoSvc.getCommentList(data).subscribe((a) => {
      this.commentsAll = a.data;
      this.commentsAll.sort((a, b) =>
        new Date(a.createdtime) < new Date(b.createdtime) ? 1 : -1
      );
    });
  }

  setActions(opt?): void {
    const settings = this.sharedSvc.allProcessData.find(
      (i) =>
        i?.processkey ==
        JSON.parse(localStorage.getItem('selected-process'))?.key
    );
    this.actions = settings?.processDef?.tabSettings?.filter(
      (i) => i.isVisible
    );
  }

  getContractInfoById(data): void {
    this.taskSvc.getContractById(data).subscribe((a) => {
      if (a.status) {
        this.contractInfo = a.data;
        this.taskSignalSvc.businessKey.next(this.contractInfo.contractid); // business key for transcriptions
        this.taskSignalSvc.taskVariables.next(this.contractInfo.variables); //putting variables in task variables
        if (!this.processes.includes(this.selectedProcess.name)) {
          if (this.contractInfo.variables.length > 0) {
            this.contractInfo.variables.find(
              (i) => i.name == 'initiator'
            ).value = this.contractInfo.initiatedbyfullname;
          }
        }

        // for getting docs
        let vars: any = {};
        this.contractInfo.variables.forEach((i) => (vars[i.name] = i.value));

        this.contractInfo.companyCode = vars.companyCode;

        this.getCompanyDoc();

        // for posting comments
        this.getNextTask();
      }
    });
  }

  getCompanyDoc(): void {
    this.taskInfoSvc
      .getFilteredDocumentList(
        this.contractInfo.companyCode,
        this.contractInfo.contractid
      )
      .subscribe((a) => {
        if (a.status) {
          if (
            this.contractInfo.completiondatetime &&
            !this.contractInfo.terminated
          ) {
            delete a.data['Final-unsigned'];
            // delete a.data['Business Case']
            delete a.data['Company Documents'];
            delete a.data['Other'];
          }

          this.documentMap = a.data;

          let taskDocTypes = Object.keys(a.data);
          // taskDocTypes = taskDocTypes.filter(d => d !== 'Final-unsigned') ;
          taskDocTypes.forEach(
            (i) => (this.documentList = [...this.documentList, ...a.data[i]])
          );
          // this.documentList = this.documentList.filter(d => d.foldername !== 'Final-unsigned') ;
          this.taskSignalSvc.docList.next(this.documentList);
          this.taskSignalSvc.docMap.next(a.data);
        }
      });
  }

  getTasks(): void {
    this.tasks = null;
    this.contracts = null;
    this.selGrp = this.participatingGroups?.length
      ? this.participatingGroups[0]
      : UserGroupsEnum.GUEST;
    if (this.tasklistType === this.gridType.workbasket) {
      this.filterGroups();

      this.subscriptions.push(
        this.taskSvc.getGroupTasksByName(this.selGrp).subscribe((a) => {
          this.tasks = this.taskSvc.tasksBusinessKey(
            a,
            this.selectedProcess,
            this.selGrp
          );
          this.gridFilterLength = this.tasks.length;
          this.tasks.forEach((task) => {
            if (
              this.selectedProcess.key === 'Initiation_preScreeningProcess' ||
              this.selectedProcess.key === 'Initiation_agroAdvisoryProcess'
            ) {
              if (task.processvariables.lastMessageTimestamp) {
                task.processvariables['lastMessageTimestamp'] = moment(
                  task.processvariables?.lastMessageTimestamp
                ).format('DD-MMM-YYYY HH:mm:ss');
              }
            }
          });

          // this.tasks = a.data.filter(
          //   (d) =>
          //     d.businessKey?.startsWith(
          //       this.selectedProcess.businessKeyPrefix
          //     ) &&
          //     d?.groupid?.toLocaleLowerCase() ===
          //       this.selGrp?.toLocaleLowerCase()
          // );

          this.taskSvc.groupIdFilter(
            a,
            UserGroupsEnum,
            this.globalPmGrpConstant,
            this.selGrp,
            this.tasks
          );

          // a.data.filter(
          //   (a) =>
          //     a.groupid?.toLocaleLowerCase() ===
          //     UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
          // ) && this.globalPmGrpConstant.includes(this.selGrp)
          //   ? (this.tasks = this.tasks.concat(
          //       a.data.filter(
          //         (a) =>
          //           a.groupid?.toLocaleLowerCase() ===
          //           UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
          //       )
          //     ))
          //   : null;
          this.sortTasks('created');
          this.taskSvc.productContractType(this.tasks, this.selectedProcess);
          // this.tasks.forEach((a) => {
          //   if (
          //     a.initiationfields.product === 'IOT' &&
          //     a.initiationfields.contractType === 'Service Contract'
          //   ) {
          //     a.processvariables.contractTypeSecondLevel = a.initiationfields
          //       ?.iotContractType
          //       ? a.initiationfields.iotContractType
          //       : a.processvariables.iotContractType;
          //   }
          //   if (a.initiationfields) {
          //     a.processvariables = {
          //       ...a.initiationfields,
          //       ...a.processvariables,
          //     };
          //   }
          //   if (
          //     this.selectedProcess.key === 'Initiation_vMTProcess' &&
          //     a.processvariables &&
          //     a.processvariables['amendmentId']
          //   ) {
          //     a.processvariables['dealId'] =
          //       (a.processvariables['parentId'] || '') +
          //       '.' +
          //       a.processvariables['amendmentId'];
          //   }
          //   if (
          //     this.selectedProcess.key == 'Initiation_preScreeningProcess' &&
          //     !a.processvariables?.['psCandidateProfileImage']
          //   ) {
          //     // console.log("PROCESS ", a.processvariables, a.processvariables?.['psCandidateProfileImage'])
          //     a.processvariables.psCandidateProfileImage =
          //       a.processvariables?.psCandidateFirstName?.[0] +
          //       a.processvariables?.psCandidateLastName?.[0];
          //   }
          // });
        })
      );
      this.filterTaskbyGrp(this.selGrp);
    } else if (this.tasklistType === this.gridType.worklist) {
      this.subscriptions.push(
        this.taskSvc.getIndividualTasks().subscribe((a) => {
          // console.log('LIST ', a);
          this.tasks = this.taskSvc.tasksBusinessKey(
            a,
            this.selectedProcess,
            this.selGrp
          );

          this.gridFilterLength = this.tasks.length;
          this.tasks.forEach((task) => {
            if (
              this.selectedProcess.key === 'Initiation_preScreeningProcess' ||
              this.selectedProcess.key === 'Initiation_agroAdvisoryProcess'
            ) {
              if (task.processvariables.lastMessageTimestamp) {
                task.processvariables['lastMessageTimestamp'] = moment(
                  task.processvariables?.lastMessageTimestamp
                ).format('DD-MMM-YYYY HH:mm:ss');
              }
            }
          });

          this.taskSvc.groupIdFilter(
            a,
            UserGroupsEnum,
            this.globalPmGrpConstant,
            this.selGrp,
            this.tasks
          );

          this.sortTasks('created');
          this.taskSvc.productContractType(this.tasks, this.selectedProcess);
          // this.tasks.forEach((a) => {
          //   if (
          //     a?.initiationfields?.product === 'IOT' &&
          //     a?.initiationfields?.contractType === 'Service Contract'
          //   ) {
          //     a.processvariables.contractTypeSecondLevel = a.initiationfields
          //       ?.iotContractType
          //       ? a.initiationfields.iotContractType
          //       : a.processvariables.iotContractType;
          //   }
          //   if (a.initiationfields) {
          //     a.processvariables = {
          //       ...a.initiationfields,
          //       ...a.processvariables,
          //     };
          //   }
          //   if (
          //     this.selectedProcess.key == 'Initiation_preScreeningProcess' &&
          //     !a.processvariables?.['psCandidateProfileImage']
          //   ) {
          //     // console.log("PROCESS ", a.processvariables, a.processvariables?.['psCandidateProfileImage'])
          //     a.processvariables.psCandidateProfileImage =
          //       a.processvariables?.psCandidateFirstName?.[0] +
          //       a.processvariables?.psCandidateLastName?.[0];
          //   }

          //   if (
          //     this.selectedProcess.key === 'Initiation_vMTProcess' &&
          //     a.processvariables &&
          //     a.processvariables['amendmentId']
          //   ) {
          //     a.processvariables['dealId'] =
          //       (a.processvariables['parentId'] || '') +
          //       '.' +
          //       a.processvariables['amendmentId'];
          //   }
          // });
        })
      );
      this.filterGroups();
      this.selGrp = this.participatingGroups?.length
        ? this.participatingGroups[0]
        : UserGroupsEnum.GUEST;
      console.log(
        'ELSE >>>>>>>>',
        this.participatingGroups,
        this.selGrp,
        this.tasklistType,
        this.tasks
      );
      // this.filterTaskbyGrp(this.selGrp);
    }

    // else if (
    //   this.tasklistType === this.gridType.contractlist ||
    //   this.tasklistType === this.gridType.allProcess
    // ) {
    //   this.subscriptions.push(
    //     this.taskSvc.getContractList().subscribe((a) => {
    //       // console.log('CONTRACTS RESPONSE', a.data);
    //       this.gridFilterLength = a.data.length;

    //       this.contracts = a.data.filter((d) =>
    //         d.contractid?.startsWith(this.selectedProcess?.businessKeyPrefix)
    //       );

    //       this.contracts.forEach((i) => {
    //         i.overallStats = i.terminated
    //           ? 'Terminated'
    //           : i.inprogress
    //           ? 'In-Process'
    //           : 'Completed';
    //         // i.elapsedtime = this.secondsToHms(i.elapsedtime) ;
    //         i.elapsedhour = this.secondsToHour(i.elapsedtime);
    //         i.elapseddays = this.secondsToDays(i.elapsedtime);
    //         if (i.product === 'IOT' && i.contracttype === 'Service Contract') {
    //           i.contractTypeSecondLevel = i.iotContractType;
    //           i.processvariables.contractTypeSecondLevel = i.iotContractType;
    //         }
    //         if (
    //           this.selectedProcess.key == 'Initiation_preScreeningProcess' &&
    //           !i.processvariables?.['psCandidateProfileImage']
    //         ) {
    //           // console.log("PROCESS ", a.processvariables, a.processvariables?.['psCandidateProfileImage'])
    //           let len = i.processvariables?.psCandidateName?.split(' ').length;
    //           i.processvariables = {
    //             ...i.processvariables,
    //             psCandidateProfileImage:
    //               i.processvariables?.psCandidateFirstName &&
    //               i.processvariables?.psCandidateLastName
    //                 ? i.processvariables?.psCandidateFirstName?.[0] +
    //                   i.processvariables?.psCandidateLastName?.[0]
    //                 : len > 1
    //                 ? i.processvariables?.psCandidateName.split(' ')[0][0] +
    //                   i.processvariables?.psCandidateName.split(' ')[len - 1][0]
    //                 : i.processvariables?.psCandidateName?.split(' ')[0][0],
    //           };
    //         }
    //         if (i.initiationfields) {
    //           i.processvariables = {
    //             ...i.initiationfields,
    //             ...i.processvariables,
    //           };
    //         }
    //         if (
    //           this.selectedProcess.key === 'Initiation_vMTProcess' &&
    //           i.processvariables &&
    //           i.processvariables['amendmentId']
    //         ) {
    //           i.processvariables['dealId'] =
    //             (i.processvariables['parentId'] || '') +
    //             '.' +
    //             i.processvariables['amendmentId'];
    //         }
    //         if (
    //           this.selectedProcess.key === 'Process_initiation_impl' &&
    //           i.processDate
    //         ) {
    //           i.processvariables['processdate'] = moment(i.processDate)
    //             .tz('America/New_York')
    //             .format('YYYY-MM-DD HH:mm:ss z');
    //         }
    //         if (
    //           this.selectedProcess.key === 'Initiation_preScreeningProcess' ||
    //           this.selectedProcess.key === 'Initiation_agroAdvisoryProcess'
    //         ) {
    //           if (i.processvariables.lastMessageTimestamp) {
    //             i.processvariables['lastMessageTimestamp'] = moment(
    //               i.processvariables.lastMessageTimestamp
    //             ).format('DD-MMM-YYYY HH:mm:ss');
    //           }
    //         }
    //         if (this.selectedProcess.key === 'Initiation_preScreeningProcess') {
    //           if (i.processvariables.psWaEnabledUpto) {
    //             i.processvariables['psWaEnabledUpto'] = moment(
    //               i.processvariables?.psWaEnabledUpto
    //             ).format('DD-MMM-YYYY HH:mm:ss');
    //           }
    //         }
    //       });

    //       // if (this.isPreScreeningProcess) {
    //       //   this.contractsFilterWithScore = a.data
    //       //     .filter(
    //       //       (x) =>
    //       //         x.processvariables?.psUnreadMessageCount &&
    //       //         x.processvariables?.psUnreadMessageCount > 0
    //       //     )
    //       //     .sort((a, b) => {
    //       //       return a.processvariables?.psLastIncomingMsgTime ? -1 : 1;
    //       //     })
    //       //     .sort(
    //       //       (a, b) =>
    //       //         new Date(
    //       //           b.processvariables?.psLastIncomingMsgTime
    //       //         ).getTime() -
    //       //         new Date(a.processvariables?.psLastIncomingMsgTime).getTime()
    //       //     );

    //       //   this.contractFilterNoScore = a.data.filter(
    //       //     (x) =>
    //       //       !x.processvariables?.psUnreadMessageCount ||
    //       //       x.processvariables?.psUnreadMessageCount === 0
    //       //   );

    //       //   this.contracts = this.contractsFilterWithScore
    //       //     .concat(this.contractFilterNoScore)
    //       //     .sort((a, b) => {
    //       //       return a.processvariables?.lastMessageTimestamp ? -1 : 1;
    //       //     })
    //       //     .sort(
    //       //       (a, b) =>
    //       //         new Date(b.processvariables?.lastMessageTimestamp).getTime() -
    //       //         new Date(a.processvariables?.lastMessageTimestamp).getTime()
    //       //     );

    //       //   this.contracts.sort((a, b) =>
    //       //     a.overallStats === 'In-Process' &&
    //       //     (b.overallStats === 'Completed' ||
    //       //       b.overallStats === 'Terminated')
    //       //       ? -1
    //       //       : a.overallStats === 'Completed' &&
    //       //         b.overallStats === 'Terminated'
    //       //       ? -1
    //       //       : 1
    //       //   );
    //       // } else if (this.isAgroAdvisoryProcess) {
    //       //   this.contracts
    //       //     .sort((a, b) => {
    //       //       return a.processvariables?.lastMessageTimestamp ? -1 : 1;
    //       //     })
    //       //     .sort(
    //       //       (a, b) =>
    //       //         new Date(b.processvariables?.lastMessageTimestamp).getTime() -
    //       //         new Date(a.processvariables?.lastMessageTimestamp).getTime()
    //       //     );
    //       //   this.contracts.sort((a, b) =>
    //       //     a.overallStats === 'In-Process' &&
    //       //     (b.overallStats === 'Completed' ||
    //       //       b.overallStats === 'Terminated')
    //       //       ? -1
    //       //       : a.overallStats === 'Completed' &&
    //       //         b.overallStats === 'Terminated'
    //       //       ? -1
    //       //       : 1
    //       //   );
    //       //   console.log('this.contracts', this.contracts);
    //       // } else {
    //       //   this.contracts
    //       //     .sort(
    //       //       (a, b) =>
    //       //         new Date(b.initiationdate).getTime() -
    //       //         new Date(a.initiationdate).getTime()
    //       //     )
    //       //     .sort((a, b) =>
    //       //       a.overallStats === 'In-Process' &&
    //       //       (b.overallStats === 'Completed' ||
    //       //         b.overallStats === 'Terminated')
    //       //         ? -1
    //       //         : a.overallStats === 'Completed' &&
    //       //           b.overallStats === 'Terminated'
    //       //         ? -1
    //       //         : 1
    //       //     );
    //       // }

    //       // console.log('this.contracts', this.contracts);

    //       this.contracts;
    //       // .reverse();
    //       // .sort(
    //       //   (a, b) =>
    //       //     new Date(b.initiationdate).getTime() -
    //       //     new Date(a.initiationdate).getTime()
    //       // )
    //       // .sort((a, b) =>
    //       //   a.overallStats === 'In-Process' &&
    //       //   (b.overallStats === 'Completed' ||
    //       //     b.overallStats === 'Terminated')
    //       //     ? -1
    //       //     : a.overallStats === 'Completed' &&
    //       //       b.overallStats === 'Terminated'
    //       //     ? -1
    //       //     : 1
    //       // );

    //       this.gridFilterLength = this.contracts.length;
    //     })
    //   );
    // }
    else if (this.tasklistType === this.gridType.comments) {
      this.subscriptions.push(
        this.taskSvc.getCommentListForUser().subscribe((a) => {
          this.commentList = a;
        })
      );
    }
  }

  sortTasks(fieldname) {
    this.tasks.sort(
      (a, b) =>
        new Date(b[fieldname]).getTime() - new Date(a[fieldname]).getTime()
    );
  }

  filterGroups() {
    const filterGroups = [this.groupsEnum.GUEST, this.groupsEnum.CAMUNDA_ADMIN];
    this.loggedUser.groupnames = this.loggedUser.groupnames.filter(
      (a) => filterGroups.find((f) => f === a) !== a
    );
  }

  filterTaskbyGrpSelect(gid: UserGroupsEnum) {
    console.log('CHANGE!!!!');
    let getTasks =
      this.tasklistType === this.gridType.workbasket
        ? this.taskSvc.getGroupTasksByName(this.selGrp)
        : this.taskSvc.getIndividualTasks();

    this.selGrp = gid;
    this.subscriptions.push(
      getTasks.subscribe((a) => {
        if (a) {
          this.tasks = a.data.filter((a) => {
            return (
              a?.groupid?.toLocaleLowerCase() === gid?.toLocaleLowerCase() &&
              a?.businessKey?.startsWith(this.selectedProcess.businessKeyPrefix)
            );
          });
          this.taskSvc.groupIdFilter(
            a,
            UserGroupsEnum,
            this.globalPmGrpConstant,
            this.selGrp,
            this.tasks
          );
          // a.data.filter(
          //   (a) =>
          //     a.groupid?.toLocaleLowerCase() ===
          //     UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
          // ) && this.globalPmGrpConstant.includes(this.selGrp)
          //   ? (this.tasks = this.tasks.concat(
          //       a.data.filter(
          //         (a) =>
          //           a.groupid?.toLocaleLowerCase() ===
          //           UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
          //       )
          //     ))
          //   : null;
          this.sortTasks('created');
          this.taskSvc.productContractType(this.tasks, this.selectedProcess);
          // this.tasks.forEach((a) => {
          //   if (
          //     a.initiationfields.product === 'IOT' &&
          //     a.initiationfields.contractType === 'Service Contract'
          //   ) {
          //     a.processvariables.contractTypeSecondLevel = a.initiationfields
          //       ?.iotContractType
          //       ? a.initiationfields.iotContractType
          //       : a.processvariables.iotContractType;
          //   }
          //   if (
          //     this.selectedProcess.key == 'Initiation_preScreeningProcess' &&
          //     !a.processvariables?.['psCandidateProfileImage']
          //   ) {
          //     // console.log("PROCESS ", a.processvariables, a.processvariables?.['psCandidateProfileImage'])
          //     a.processvariables.psCandidateProfileImage =
          //       a.processvariables?.psCandidateFirstName?.[0] +
          //       a.processvariables?.psCandidateLastName?.[0];
          //   }
          //   if (a.initiationfields) {
          //     a.processvariables = {
          //       ...a.initiationfields,
          //       ...a.processvariables,
          //     };
          //   }
          //   if (
          //     this.selectedProcess.key === 'Initiation_vMTProcess' &&
          //     a.processvariables &&
          //     a.processvariables['amendmentId']
          //   ) {
          //     a.processvariables['dealId'] =
          //       (a.processvariables['parentId'] || '') +
          //       '.' +
          //       a.processvariables['amendmentId'];
          //   }
          // });
          if (this.tasklistGridInst) {
            this.tasklistGridInst.data = this.tasks;
            this.tasklistGridInst.updateBoundData();
          } else if (this.grpGridInst) {
            this.grpGridInst.data = this.tasks;
            this.grpGridInst.updateBoundData();
          }
        }
      })
    );
  }

  filterTaskbyGrp(gid: UserGroupsEnum) {
    let getTasks =
      this.tasklistType === this.gridType.workbasket
        ? this.taskSvc.getGroupTasksByName(this.selGrp)
        : this.taskSvc.getIndividualTasks();

    this.selGrp = gid;
    if (this.tasks) {
      this.tasks = this.tasks.filter((a) => {
        return a?.groupid?.toLocaleLowerCase() === gid?.toLocaleLowerCase();
      });
      this.sortTasks('created');
      this.tasks.filter(
        (a) =>
          a.groupid?.toLocaleLowerCase() ===
          UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
      ) && this.globalPmGrpConstant.includes(this.selGrp)
        ? (this.tasks = this.tasks.concat(
            this.tasks.filter(
              (a) =>
                a.groupid?.toLocaleLowerCase() ===
                UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
            )
          ))
        : null;

      this.taskSvc.productContractType(this.tasks, this.selectedProcess);
      // this.tasks.forEach((a) => {
      //   if (
      //     a.initiationfields.product === 'IOT' &&
      //     a.initiationfields.contractType === 'Service Contract'
      //   ) {
      //     a.processvariables.contractTypeSecondLevel = a.initiationfields
      //       ?.iotContractType
      //       ? a.initiationfields.iotContractType
      //       : a.processvariables.iotContractType;
      //   }
      //   if (
      //     this.selectedProcess.key == 'Initiation_preScreeningProcess' &&
      //     !a.processvariables?.['psCandidateProfileImage']
      //   ) {
      //     // console.log("PROCESS ", a.processvariables, a.processvariables?.['psCandidateProfileImage'])
      //     a.processvariables.psCandidateProfileImage =
      //       a.processvariables?.psCandidateFirstName?.[0] +
      //       a.processvariables?.psCandidateLastName?.[0];
      //   }
      //   if (a.initiationfields) {
      //     a.processvariables = {
      //       ...a.initiationfields,
      //       ...a.processvariables,
      //     };
      //   }
      //   if (
      //     this.selectedProcess.key === 'Initiation_vMTProcess' &&
      //     a.processvariables &&
      //     a.processvariables['amendmentId']
      //   ) {
      //     a.processvariables['dealId'] =
      //       (a.processvariables['parentId'] || '') +
      //       '.' +
      //       a.processvariables['amendmentId'];
      //   }
      // });

      if (this.tasklistGridInst) {
        this.tasklistGridInst.data = this.tasks;
        this.tasklistGridInst.updateBoundData();
      } else if (this.grpGridInst) {
        this.grpGridInst.data = this.tasks;
        this.grpGridInst.updateBoundData();
      }
    }
  }

  getTasksbyGrpName(gid) {
    this.selGrp = gid;
    if (this.selGrp === UserGroupsEnum.SALES) {
      this.tasks = [];
      this.grpGridInst.data = this.tasks;
      this.grpGridInst.updateBoundData();
    } else {
      this.subscriptions.push(
        this.taskSvc.getGroupTasksByName(gid).subscribe((a) => {
          if (a.status) {
            // this.tasks = null;
            this.tasks = a.data;
            this.sortTasks('created');
            this.grpGridInst.data = this.tasks;
            console.log('ELSE IF ______', this.tasks);
            this.grpGridInst.updateBoundData();
            return;
          }
        })
      );
    }
  }

  getChildTasks(parentObj) {
    console.log('GET CHILD TASKS!', parentObj.record.overallstats);
    if (parentObj.record.overallstats === 'In-Process') {
      // this.nestedSourceData = this.nestedSourceData.filter(
      //   (n) => n.contractid !== parentObj.record.contractid
      // );
      this.taskSvc.getAuditTrail(parentObj.record.contractid).subscribe((r) => {
        if (r.status) {
          r.data = r.data.filter((e) => e.endtime === null);
          r.data.forEach((a) => {
            a.taskstatus = a.endtime === null ? 'In-process' : 'Completed';
            // a.elapsedtime = this.secondsToHms(a.elapsedtime) ;
            a.endtime === null
              ? (a.elapsedtime = null)
              : (a.elapsedtime = this.secondsToHms(a.elapsedtime));
            this.nestedSourceData.push(a);
          });
        }
        this.contractGridInst.populateNestingRow(
          parentObj.index,
          parentObj.parentElement,
          parentObj.gridElement,
          parentObj.record
        );
      });
    } else {
      const obj = {} as ContractDetailsModel;
      this.nestedSourceData.push(obj);
      this.contractGridInst.populateNestingRow(
        parentObj.index,
        parentObj.parentElement,
        parentObj.gridElement,
        parentObj.record
      );
    }
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

  doubleClick(e): void {
    this.viewTask({ rows: [e] });
  }

  singleClick(e): void {
    console.log('FROM SINGLE CLICK', e);
  }

  toolbarAction(e: any): void {
    if (this.tasklistType == this.gridType.contractlist) {
      this.taskActionRunner(e); // for getting contract_ID
    }
    switch (e.action) {
      case 'update':
        this.updateZoho(e);
        break;
      case 'viewtask':
        this.viewTask(e);
        break;
      case 'compare':
        this.compareTask(e);
        break;
      case 'terminate':
        this.terminateTask(e);
        break;
      case 'startPreScreening':
        this.prescreening(e);
        break;
      case 'bulk':
        this.bulkMessage(e);
        break;

      case 'unclaim':
        this.unclaimTask(e);
        break;

      case 'claim':
        this.claimTask(e);
        break;

      case 'assign':
        this.assignTask(e, 1);
        break;
      case 'delegate':
        break;
      case 'reassign':
        this.assignTask(e, 2);
      // case 'export':
      //   this.exportAsXLSX(e.columns);
      //   break;
      default:
        break;
    }
  }

  updateZoho(e: { rows: any[] }): void {
    let refreshToken = localStorage.getItem('refreshToken');
    console.log('rowdata', e);
    if (e.rows.length > 0) {
      this.sharedSvc.updateZohoData(refreshToken).subscribe((response) => {
        console.log(response);
        if (response.data.length > 0) {
          this.toastrSvc.success('Candidates Update Successfully');
          let status = 'Updated from RecA';
          let flag = '3';
          this.sharedSvc.updateZohoStatus(status, flag).subscribe((res) => {
            console.log(res);
          });
        }
      });
    }
  }

  assignTask(e, opt): void {
    let taskIds = e.rows.map((i) => i.id);
    let taskDetails;
    taskDetails = e.rows.map((i) => {
      let t = this.tasks.find((a) => a.id === i.id);
      return {
        id: i.id,
        processInstanceId: i.processInstanceId,
        name: t.name,
        businessKey: t.businessKey,
        formKey: t.formKey,
        groupname: this.selGrp,
      };
    });
    this.taskActionSvc.assignTask(
      taskIds,
      opt,
      (a) => {
        if (a.status) {
          const user = a.data[0];
          this.toastrSvc.success('Task Assigned to ' + user);
          a.data.forEach((d) => {
            taskIds = taskIds.filter((t) => t !== d);
          });
          this.tasks = this.tasks.filter(
            (i) => taskIds.find((j) => j == i.id) == undefined
          );
          window.location.reload();
        }
      },
      taskDetails
    );
  }

  viewTask(e: { rows: any[] }): void {
    if (
      this.tasklistType === this.gridType.worklist ||
      this.tasklistType === this.gridType.workbasket
    ) {
      this.taskActionSvc.viewTask(e.rows[0].id);
    } else if (this.tasklistType === this.gridType.contractlist) {
      this.taskActionSvc.viewMyContract(e.rows[0].contractid);
    }
  }

  claimTask(e: { action: string; rows: any[] }): void {
    let taskIds = e.rows.map((i) => i.id);
    let processInst = [];
    if (
      this.tasklistType === this.gridType.worklist ||
      this.tasklistType === this.gridType.workbasket
    ) {
      processInst = e.rows.map((i) => {
        let t = this.tasks.find((a) => a.id === i.id);
        return {
          id: i.id,
          name: t.name,
          code: t.businessKey,
          formKey: t.formKey,
          processinstanceid: t.processInstanceId,
        };
      });
    } else if (this.tasklistType === this.gridType.contractlist) {
      processInst = e.rows.map((i) => {
        let t = this.tasks.find(
          (a) => a.processInstanceId === i.processInstanceId
        );
        return {
          id: i.id,
          name: t.name,
          code: t.businessKey,
          formKey: t.formKey,
          processinstanceid: t.processInstanceId,
        };
      });
    }

    if (this.tasklistType == this.gridType.workbasket) {
      this.taskSvc.claimTask(processInst).subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Tasks Claimed');
          this.tasks = this.tasks.filter(
            (i) => taskIds.find((j) => j == i.id) == undefined
          );
        }
      });
    }
  }

  unclaimTask(e: { action: string; rows: any[] }): void {
    let taskIds = e.rows.map((i) => i.id);
    let processInst = [];
    if (
      this.tasklistType === this.gridType.worklist ||
      this.tasklistType === this.gridType.workbasket
    ) {
      processInst = e.rows.map((i) => {
        let t = this.tasks.find(
          (a) => a.processInstanceId === i.processInstanceId
        );
        return {
          id: i.id,
          name: t.name,
          code: t.businessKey,
          formKey: t.formKey,
          processinstanceid: t.processInstanceId,
        };
      });
    } else if (this.tasklistType === this.gridType.contractlist) {
      processInst = e.rows.map((i) => {
        let t = this.tasks.find(
          (a) => a.processInstanceId === i.processInstanceId
        );
        return {
          id: i.id,
          name: t.name,
          code: t.businessKey,
          formKey: t.formKey,
          processinstanceid: t.processInstanceId,
        };
      });
    }
    if (this.tasklistType !== this.gridType.workbasket) {
      this.taskSvc.unclaimTask(processInst).subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Tasks returned to queue');
          this.tasks = this.tasks.filter(
            (i) => taskIds.find((j) => j == i.id) == undefined
          );
        }
      });
    }
  }

  compareTask(e: { action: string; rows: any[] }) {
    let processInstanceId = false;
    let compareTasksIds;
    if (e.rows[0].processInstanceId) {
      processInstanceId = true;
      compareTasksIds = e.rows.map((i) => i.processInstanceId);
    } else {
      processInstanceId = false;
      compareTasksIds = e.rows.map((i) => i.rootprocessid);
    }
    // localStorage.setItem('compareTasksIds', JSON.stringify(compareTasksIds));
    let data: any = this.contracts?.length ? this.contracts : this.tasks;
    let candidateTasks = data.filter((i) => {
      if (processInstanceId) {
        return compareTasksIds.includes(i.processInstanceId);
      } else {
        return compareTasksIds.includes(i.rootprocessid);
      }
    });
    candidateTasks = candidateTasks.map((i) => ({
      ...i,
      ...i.processvariables,
      ...i.initiationfields,
    }));
    // this.taskActionSvc.compareTask();
    console.log('candidateTasks', compareTasksIds, candidateTasks);
    this.openModal(candidateTasks, 'COMPARING ------', true);
  }

  terminateTask(e: { action: string; rows: any[] }): void {
    // console.log("rows",e.rows[0])
    // console.log("taskListType",this.gridType)
    // console.log("headers",this.headers.initiate)
    const m = e.rows.map((a) => a.overallStats);
    if (m.includes('Completed') || m.includes('Terminated')) {
      this.toastrSvc.error('Cannot terminate Closed or Terminated Contracts');
    } else {
      let processInst = [];
      let multipleUpdateSessionPayload: UpdateSingleSession[] = [];
      let text = '';

      console.log(e.rows, 'rowwwwwwwwwwwwwwwwwwwws');
      if (
        this.tasklistType === this.gridType.worklist ||
        this.tasklistType === this.gridType.workbasket
      ) {
        processInst = e.rows.map((i) => {
          return {
            processInstanceId: i.processInstanceId,
            businessKey: i.businessKey,
          };
        });
        multipleUpdateSessionPayload = e.rows.map((i) => {
          return {
            businessKey: i.contractid,
            data: {
              iflowStatus: 2,
            },
            key: i.contractid?.split('-')[1],
          };
        });
        text =
          e.rows.length === 1
            ? `${e.rows[0].partnerLegalName}, ${e.rows[0].product}, ${e.rows[0].contractType}`
            : '';
      } else if (this.tasklistType === this.gridType.contractlist) {
        processInst = e.rows.map((i) => {
          return {
            processInstanceId: i.rootprocessid,
            businessKey: i.contractid,
          };
        });
        multipleUpdateSessionPayload = e.rows.map((i) => {
          return {
            businessKey: i.contractid,
            data: {
              iflowStatus: 2,
            },
            key: i.contractid.split('-')[1],
          };
        });
        if (this.isPreScreeningProcess) {
          text = e.rows.length === 1 ? '' : '';
        } else {
          text =
            e.rows.length === 1
              ? `${e.rows[0].partnerLegalName}, ${e.rows[0].product}, ${e.rows[0].contractType}`
              : '';
        }
      }

      this.taskActionSvc.terminateTask(
        processInst,
        (a) => {
          if (a.status) {
            this.toastrSvc.success('Process Terminated Successfully');

            if (
              JSON.parse(localStorage.getItem('selected-process')).key ===
              'Initiation_preScreeningProcess'
            ) {
              this.whatsappSvc
                .updateMultipleSession(multipleUpdateSessionPayload)
                .subscribe((res) => {});
            }

            if (
              this.tasklistType === this.gridType.worklist ||
              this.tasklistType === this.gridType.workbasket
            ) {
              this.tasks = this.tasks.filter(
                (i) =>
                  processInst.find(
                    (j) => j.processInstanceId == i.processInstanceId
                  ) == undefined
              );
            } else if (this.tasklistType === this.gridType.contractlist) {
              // processInst.forEach( p => {
              //   this.contracts.find(c => c.contractid === p.businessKey).overallStats = 'Terminated' ;
              // }) ;
              // this.getTasks();
              this.getAllContract('In-process');
            }
          }
        },
        text
      );
    }
  }

  prescreening(e: { action: string; rows: any[] }): void {
    this.taskActionSvc.startPrescreening(e.rows);
  }

  bulkMessage(e: { action: string; rows: any[] }): void {
    let opt;
    if (this.isPreScreeningProcess) {
      opt = 2;
    } else if (this.selectedProcess.name === 'Initiation Lead Management') {
      opt = 4;
    } else {
      opt = 3;
    }

    this.taskActionSvc.sendBulkMessage(e.rows, opt);
  }

  checkAdminRole() {
    const array = [
      'LEGAL_ADMIN',
      'SUPER_ADMIN',
      'BILLING_ADMIN',
      'COMMERCIAL-OPS_ADMIN',
      'CREDIT_ADMIN',
      'FPA_ADMIN',
      'INTERCONNECT-DESIGN_ADMIN',
      'PRODUCT-MANAGEMENT_ADMIN',
      'PMIOT_ADMIN',
      'PMSMS_ADMIN',
      'PMVOICE_ADMIN',
      'PMMOBILE_ADMIN',
      'EMTIOT_ADMIN',
      'EMTMOBILE_ADMIN',
      'EMTCFO_ADMIN',
    ];
    const adminrole = [];
    this.loggedUser.roles.forEach((r) => {
      if (array.includes(r)) {
        adminrole.push(r);
      }
    });
    return adminrole.length > 0 ? true : false;
  }

  fetchGroups() {
    this.userSvc.getUserGroups().subscribe((resp) => {
      if (resp.status) {
        this.groups = resp.data;
      }
    });
  }

  retGrpName(gid) {
    // console.log('GGGGGGG0', this.groups);
    if (this.groups) {
      return this.groups?.find((g) => {
        return g?.id?.toLowerCase() == gid?.toLowerCase();
      })?.name;
    }
  }
  // exportAsXLSX(columns) {
  //   const lCol = localStorage.getItem(`grid-columns-${this.tasklistType}`) ;
  //   let date = new Date().toDateString() ;
  //   let data = this.tasklistType === this.gridType.contractlist ? this.contracts : this.tasks
  //   this.excelService.exportAsExcelFile(`${this.tasklistType}-${date}`, lCol, columns, data);
  // }

  openModal(data, header, opt) {
    const ngbModalOpt: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static',
      size: 'xl',
    };
    const modalRef = this.modalSvc.open(CompareTaskComponent, ngbModalOpt);
    // console.log("************",data.valuesource)
    modalRef.componentInstance.candidateList = data;
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.emitVar.subscribe((resp) => {
      console.log('ON RESPONSE-------------------', resp);
    });
  }

  getAllContract(status) {
    this.subscriptions.push(
      this.taskSvc.getContractList(status).subscribe((a) => {
        this.gridFilterLength = a.data.length;

        this.contracts = a.data.filter((d) =>
          d.contractid?.startsWith(this.selectedProcess?.businessKeyPrefix)
        );

        this.contracts.forEach((i) => {
          i.overallStats = i.terminated
            ? 'Terminated'
            : i.inprogress
            ? 'In-Process'
            : 'Completed';
          i.elapsedhour = this.secondsToHour(i.elapsedtime);
          i.elapseddays = this.secondsToDays(i.elapsedtime);
          if (i.product === 'IOT' && i.contracttype === 'Service Contract') {
            i.contractTypeSecondLevel = i.iotContractType;
            if (i.processvariables) {
              i.processvariables.contractTypeSecondLevel = i.iotContractType;
            }
          }
          if (
            this.selectedProcess.key == 'Initiation_preScreeningProcess' &&
            !i.processvariables?.['psCandidateProfileImage']
          ) {
            let len = i.processvariables?.psCandidateName?.split(' ').length;
            i.processvariables = {
              ...i.processvariables,
              psCandidateProfileImage:
                i.processvariables?.psCandidateFirstName &&
                i.processvariables?.psCandidateLastName
                  ? i.processvariables?.psCandidateFirstName?.[0] +
                    i.processvariables?.psCandidateLastName?.[0]
                  : len > 1
                  ? i.processvariables?.psCandidateName.split(' ')[0][0] +
                    i.processvariables?.psCandidateName.split(' ')[len - 1][0]
                  : i.processvariables?.psCandidateName?.split(' ')[0][0],
            };
          }
          if (i.initiationfields) {
            i.processvariables = {
              ...i.initiationfields,
              ...i.processvariables,
            };
          }
          if (
            this.selectedProcess.key === 'Initiation_vMTProcess' &&
            i.processvariables &&
            i.processvariables['amendmentId']
          ) {
            i.processvariables['dealId'] =
              (i.processvariables['parentId'] || '') +
              '.' +
              i.processvariables['amendmentId'];
          }
          if (
            this.selectedProcess.key === 'Process_initiation_impl' &&
            i.processDate
          ) {
            i.processvariables['processdate'] = moment(i.processDate)
              .tz('America/New_York')
              .format('YYYY-MM-DD HH:mm:ss z');
          }
          if (
            this.selectedProcess.key === 'Initiation_preScreeningProcess' ||
            this.selectedProcess.key === 'Initiation_agroAdvisoryProcess'
          ) {
            if (i.processvariables.lastMessageTimestamp) {
              i.processvariables['lastMessageTimestamp'] = moment(
                i.processvariables.lastMessageTimestamp
              ).format('DD-MMM-YYYY HH:mm:ss');
            }
          }
          if (this.selectedProcess.key === 'Initiation_preScreeningProcess') {
            if (i.processvariables.psWaEnabledUpto) {
              i.processvariables['psWaEnabledUpto'] = moment(
                i.processvariables?.psWaEnabledUpto
              ).format('DD-MMM-YYYY HH:mm:ss');
            }
          }
        });
        const savedState = JSON.parse(
          localStorage.getItem(`grid-state-${this.gridType.contractlist}`)
        );

        this.contractGridInst.data = this.contracts;
        this.contractGridInst.updateBoundData(savedState);

        this.gridFilterLength = this.contracts.length;
      })
    );
  }

  search(status) {
    this.statusName = status;
    this.getAllContract(status);
  }
}

// ProgramManagement 'ProgramManagement', 'guest', 'programmgmt' programmgmt

//'LearningExperience', 'guest', 'learningexp'

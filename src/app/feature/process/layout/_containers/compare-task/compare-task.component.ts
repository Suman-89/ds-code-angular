import { TaskService } from '../../_services/task.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  TaskInfoService,
  TaskSignalService,
  TaskValidationService,
  TaskActionService,
  TaskFormSaveService,
} from '../../_services';
import {
  TaskInfoModel,
  TasksAutoFillTaskInfo,
  TaskTerminateRequestModel,
  TaskDocumentModel,
  ReviewTaskConstant,
  TaskCommentModel,
  DocumentCategoryEnum,
  DocumentCategoryName,
} from '../../_models';
import {
  LoggedUserModel,
  GridToolbarType,
  ToolbarButtonModel,
  Roles,
  CompanyModel,
  ProcessFormModel,
  UserGroupsEnum,
  ProcessVariableModel,
  GridColumnModel,
} from 'src/app/core/_models';
import { Subscription } from 'rxjs';
import {
  SharedService,
  CompanyManagementService,
  UserService,
} from 'src/app/core/_services';
import { ToastrService } from 'ngx-toastr';
import { CreateCompanyModalComponent } from 'src/app/shared/_modals';
import { PrintProcessDocumentModalComponent } from '../../_modals/print-process-document-modal/print-process-document-modal.component';
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { threadId } from 'worker_threads';
import { TranscriptionModel } from '../../_models/transcription.model';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compare-task',
  templateUrl: './compare-task.component.html',
  styleUrls: ['./compare-task.component.scss'],
  viewProviders: [
    TaskSignalService,
    TaskValidationService,
    TaskFormSaveService,
    NgbDropdown,
    NgModule,
    NgbModule,
  ],
})
export class CompareTaskComponent implements OnInit, OnChanges, OnDestroy {
  @Input() candidateList;
  @Input() header: any;
  @Output() emitVar = new EventEmitter<any>();
  compareTaskIds;
  allContracts = [];
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  bpmapi = environment.bpmUrl;

  constructor(
    private route: ActivatedRoute,
    public taskInfoSvc: TaskInfoService,
    private taskSvc: TaskService,
    private taskSignalSvc: TaskSignalService,
    private sharedSvc: SharedService,
    private toastrSvc: ToastrService,
    public taskActionSvc: TaskActionService,
    private ngbModalSvc: NgbModal,
    private taskValidationSvc: TaskValidationService,
    private companySvc: CompanyManagementService,
    private ngxLoaderSvc: NgxUiLoaderService,
    private userSvc: UserService,
    private taskFormSavesvc: TaskFormSaveService,
    private activeModal: NgbActiveModal
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  type: any = '';
  columns: any = [];
  selectedColumns: GridColumnModel[] = [];
  statePredefined: boolean = true;
  checkedCol: any = [];

  ngOnInit(): void {
    this.type = localStorage.getItem('gridType');
    console.log('type', this.type);
    // this.columns = JSON.parse(
    //   localStorage.getItem(`grid-columns-${this.type}`)
    // );
    let processDef = this.sharedSvc.allProcessData.find(i => i.processkey == this.selectedProcess.key)?.processDef;
    let columns = processDef.gridsettings?.find(i=>i.type=="COMPARE")?.columns
    // columns = columns.filter( i => !i.disabled)
    columns = columns.filter(i => !i.disabled)
    this.columns=columns;

    // console.log('columns', this.columns);
    // this.columns = this.columns.filter((el) => {
    //   return el.text !== '#';
    // });
    // this.checkedCol = this.columns.filter((el) => {
    //   if (el.checked === true) {
    //     return el;
    //   }
    // });
    console.log("columns" , columns)
    this.checkedCol=this.columns.filter(i => !i.hidden)
    console.log("cehckedcol", this.checkedCol)
    
  }

  ngOnChange(): void {
    //  console.log("colaaaaaaaaam",this.columns)
    // this.initFn();
  }

  ngOnDestroy(): void {}

  close() {
    this.activeModal.close();
    // window.location.reload()
  }

  downloadExcel(): void {
    let type = 5;
    let busKey = [];
    this.candidateList.forEach((candidate) => {
      busKey.push(candidate.businessKey);
    });
      let checkedColKey=this.checkedCol.map((el)=>el.key)
      // console.log("checkeddddddd", checkedColKey)
    this.taskSvc.compareReportDownload(busKey,checkedColKey, type).subscribe((resp) => {
      console.log("resp", resp.body)
      if (resp.status) {
        var pom = document.createElement('a');
        // var csvContent= resp; //here we load our csv data
        // var blob = new Blob([csvContent],{type: 'text/xls;charset=utf-8;'});
        var url = URL.createObjectURL(resp.body);
        pom.href = url;
        // let filename = `${this.type}.xlsx`;
        let currentTime = moment().format('DD-MMM-YYYY HH:mm:ss');
        // let filename = userfileName
        //   ? `${this.sourceLabel}_${userfileName}_${currentTime}.xlsx`
        //   : `${this.sourceLabel}_${currentTime}.xlsx`;
        let filename=`Compare_Candidates_${currentTime}.xlsx`

        pom.setAttribute('download', filename);
        pom.click();
      }
    });
  }

  initFn(opt: boolean = true): void {
    this.compareTaskIds = JSON.parse(localStorage.getItem('compareTasksIds'));
    this.taskSvc.getContractList().subscribe((a) => {
      this.allContracts = a.data.filter((i) =>
        this.compareTaskIds.includes(i.rootprocessid)
      );
      this.allContracts = this.allContracts.map((i) => ({
        ...i,
        ...i.processvariables,
        ...i.initiationfields,
      }));
      console.log('CONTRACTS RESPONSE', a.data, this.allContracts);
    });
    console.log('ON COMPARE --->>', this.compareTaskIds);
  }

  setSelectedColumnsfromState() {
    // localStorage.setItem(
    //   `grid-columns-${this.type}`,
    //   JSON.stringify(this.columns)
    // );
   
    this.selectedColumns = this.columns.map((c) => {
      c.checked = !c.hidden;
      return c;
    });
  }
  columnClicked(column): void {
    column.hidden = !column.hidden;
    // console.log("keyyyy" , column.key, column.disabled)
    if (column.hidden) {
      this.columns.find((i) => i.key == column.key).hidden = true;
    }
    else{
      this.columns.find((i) => i.key == column.key).hidden = false;
    }
    this.checkedCol=this.columns.filter(i => !i.hidden)

    // this.checkedCol = this.columns.filter((el) => {
    //   if (el.hidden === false) {
    //     return el;
    //   }
    // });
    // console.log("checked", this.checkedCol)
  }
}

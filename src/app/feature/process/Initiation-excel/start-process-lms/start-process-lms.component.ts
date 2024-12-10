import {
  Component,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {
  CompanyManagementService,
  ExcelExportService,
  SharedService,
} from 'src/app/core/_services';
import { TaskService } from '../../layout/_services/task.service';
import { TaskInfoService } from './../../layout/_services/task-info.service';
import { ToastrService } from 'ngx-toastr';
import { GridColumnModel, GridToolbarType } from 'src/app/core/_models';
import { Subscription } from 'rxjs';
import * as _fromCoreSvc from 'src/app/core/_services';
import { Router } from '@angular/router';

import { utils } from 'xlsx';

@Component({
  selector: 'app-start-process-lms',
  templateUrl: './start-process-lms.component.html',
  styleUrls: ['./start-process-lms.component.scss'],
})
export class StartProcessLmsComponent implements OnInit, OnChanges {
  @ViewChild('grid') gridInstance;
  type = GridToolbarType;
  subscriptions: Subscription[] = [];
  columns: GridColumnModel[] = [];
  sourceConfig: any = {};
  source: any = [];
  constructor(
    private excelSvc: ExcelExportService,
    private taskInfoSvc: TaskInfoService,
    private toastSvc: ToastrService,
    private companySvc: CompanyManagementService,
    private sharedApiSvc: SharedService,
    private gridColumnSvc: _fromCoreSvc.GridColumnsService,
    private gridSourceSvc: _fromCoreSvc.GridSourceService,
    private taskSvc: TaskService,
    private router: Router
  ) {}
  ev;
  atsFile;
  excelData;
  isFile;

  ngOnInit(): void {
    this.getLmsColumn();
  }
  ngOnChanges(e: SimpleChanges): void {
    this.updateBoundData();
    this.setGridData();
  }

  handleFileUpload(ev) {
    this.ev = ev;
    const filename = ev.target.files[0].name;
    this.isFile = filename;
    this.excelSvc.getJsonFromXlsx(ev).subscribe(({ name, file: data }) => {
      let jsonToExcel = utils.json_to_sheet(data);
      let excelToCsv = utils.sheet_to_csv(jsonToExcel, {
        rawNumbers: true,
      });

      // window.URL = window.webkitURL || window.URL;

      // this.atsFile = new File([excelToCsv], name, {
      //   type: 'text/csv',
      // });
      // console.log(this.atsFile);
      // console.log(this.ev.target.files[0]);

      if (data && data.length > 0) {
        this.excelData = data;
        this.setGridData();
        this.updateBoundData();
      }
    });
  }

  getLmsColumn() {
    this.gridColumnSvc.getLmsGridColumns(this.type.LMS).subscribe((a) => {
      this.columns = [...this.columns, ...a];
      this.columns.map((c) => {
        c.cellsrenderer = this.cellclassrenderer;
      });
    });
  }
  getSource() {
    this.sourceConfig = this.gridSourceSvc.sourceConfig[this.type.LMS];
  }

  setGridData(): void {
    this.source = new jqx.dataAdapter({
      localdata: this.excelData,
      ...this.sourceConfig,
    });
  }

  cellclassrenderer = (
    row,
    column,
    value,
    defaultHtml,
    columnSettings,
    rowData
  ) => {
    let classname = 'inprocessClass';

    return `<div class="jqx-grid-cell-left-align ${classname}" style="margin-left: 5px; margin-top:10px">${value}</div>`;
  };

  updateBoundData(savedState?) {
    if (this.gridInstance) {
      this.gridInstance.updateData = this.excelData;
      this.gridInstance.config = this.sourceConfig;
      this.gridInstance.updateBoundData(savedState);
    }
  }

  ready() {}

  submitData() {
    let formdata = new FormData();
    formdata.append('file', this.ev.target.files[0]);
    this.taskSvc.startWorkflowByCsv(formdata).subscribe((x) => {
      if (x.status) {
        this.toastSvc.success('Process Inititated Successfully');
        this.router.navigate([`/landing/process/contracts`]);
      }
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GridToolbarType } from 'src/app/core/_models';
import * as moment from 'moment-timezone';
import {
  GridColumnsService,
  ReportsService,
  SharedService,
  SourceLabelService,
} from 'src/app/core/_services';

@Component({
  selector: 'app-preview-report',
  templateUrl: './preview-report.component.html',
  styleUrls: ['./preview-report.component.scss'],
})
export class PreviewReportComponent implements OnInit {
  @ViewChild('groupGrid') grpGridInst;
  constructor(
    private repSvc: ReportsService,
    private actRoute: ActivatedRoute,
    private gridColumnSvc: GridColumnsService,
    private sourceLabelSvc: SourceLabelService,
    private sharedSvc: SharedService
  ) {}

  reportName;
  type;
  toolbarType = GridToolbarType;
  ready = false;
  data: any[] = [];
  columns = [];
  conditions = [];
  filterConditions = [];
  groupsArr = ['groupname'];
  sourceLabel = '';
  localization = {
    filterselectstring: 'Select',
  };
  gridType = GridToolbarType;

  state = {
    filters: {},
  };

  ngOnInit(): void {
    this.reportName = this.actRoute.snapshot.paramMap.get('reportName');
    this.conditions = history.state.conditions ?? [];

    this.repSvc.getReportCondition(this.reportName).subscribe((res) => {
      this.type = this.sourceLabelSvc.getTypesFromSourceTypes(res.data?.source);
      this.filterConditions = res.data?.Conditions;
      this.sourceLabel = res.data?.sourceLabel;

      this.gridColumnSvc.getTasklistGridColumns(this.type).subscribe((a) => {
        let commonCols = [];

        if (
          this.type === this.toolbarType.worklist ||
          this.type === this.toolbarType.workbasket ||
          this.type === this.toolbarType.contractlist ||
          this.type === this.toolbarType.allProcess
        ) {
          commonCols = [...this.gridColumnSvc.commonCols()[this.type]];
        }

        let columns = [
          ...this.columns,
          ...a.map((element) => {
            return {
              text: element.header ? element.header : '',
              datafield: element.key ? element.key : '',
              filtertype: element.filtertype || 'input',
              minwidth: '100px',
              width: element.width ? element.width : '',
              hidden: element.hidden ? element.hidden : false,
              cellsformat: element.key?.includes('elapsed')
                ? 'd2'
                : element.cellsformat
                ? element.cellsformat
                : '',
            };
          }),
        ];

        let finalColumns = [];
        let columnsMap = {};
        for (let i = 0; i < columns.length; i++) {
          columnsMap[columns[i]['datafield']] = {
            data: columns[i],
            index: i,
            hidden: true,
          };
        }

        for (let i = 0; i < res.data.Columns.length; i++) {
          finalColumns.push(columnsMap[res.data.Columns[i].datafield].data);
          columnsMap[columnsMap[res.data.Columns[i].datafield].index] = true;
          columnsMap[res.data.Columns[i].datafield].hidden = false;
        }

        for (let i = 0; i < columns.length; i++) {
          if (i.toString() in columnsMap === false) {
            columns[i].hidden = true;
            finalColumns.push(columns[i]);
          }
        }

        this.columns = finalColumns;

        this.repSvc
          .getReportPreview({
            reportName: this.reportName,
            conditions: this.conditions,
            processName: JSON.parse(this.sharedSvc.selectedProcess).name,
          })
          .subscribe((res) => {
            let data = res.data;
            console.log(data);

            if (this.type === this.toolbarType.contractlist) {
              let prefix = JSON.parse(localStorage.getItem('selected-process'));

              this.data = data.filter((d) =>
                d.contractid.startsWith(prefix.businessKeyPrefix)
              );

              this.data.forEach((i) => {
                i.overallStats = i.terminated
                  ? 'Terminated'
                  : i.inprogress
                  ? 'In-Process'
                  : 'Completed';
                // i.elapsedtime = this.secondsToHms(i.elapsedtime) ;
                i.elapsedhour = this.sharedSvc.secondsToHour(i.elapsedtime);
                i.elapseddays = this.sharedSvc.secondsToDays(i.elapsedtime);
                if (
                  i.product === 'IOT' &&
                  i.contracttype === 'Service Contract'
                ) {
                  i.contractTypeSecondLevel = i.iotContractType;
                  i.processvariables.contractTypeSecondLevel =
                    i.iotContractType;
                }
                if (i.initiationfields) {
                  i.processvariables = {
                    ...i.initiationfields,
                    ...i.processvariables,
                  };
                }
                if (
                  i.product === 'IOT' &&
                  i.contracttype === 'Service Contract'
                ) {
                  i.contractTypeSecondLevel = i.iotContractType;
                }
                if (i.processDate) {
                  i.processvariables['processdate'] = moment(i.processDate)
                    .tz('America/New_York')
                    .format('YYYY-MM-DD HH:mm:ss z');
                }
              });

              this.data
                .sort(
                  (a, b) =>
                    new Date(b.initiationdate).getTime() -
                    new Date(a.initiationdate).getTime()
                )
                .sort((a, b) =>
                  a.overallStats === 'In-Process' &&
                  (b.overallStats === 'Completed' ||
                    b.overallStats === 'Terminated')
                    ? -1
                    : a.overallStats === 'Completed' &&
                      b.overallStats === 'Terminated'
                    ? -1
                    : 1
                );
            }

            if (this.type === this.toolbarType.allProcess) {
              let prefix = JSON.parse(localStorage.getItem('selected-process'));
              this.data = data.filter((d) =>
                d.contractid.startsWith(prefix.businessKeyPrefix)
              );

              this.data.sort(
                (a, b) =>
                  new Date(b.contractinitiationtime).getTime() -
                  new Date(a.contractinitiationtime).getTime()
              );

              this.data.map((o) => {
                o.contractelapsedtime = this.sharedSvc.secondsToDays(
                  o.contractelapsedtime
                );
                o.elapsedhour = this.sharedSvc.secondsToHour(o.elapsedtime);
                o.elapseddays = this.sharedSvc.secondsToDays(o.elapsedtime);

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
                  o.assignee = o.groupname + ' Queue';
                }
                if (
                  o.product === 'IOT' &&
                  o.contracttype === 'Service Contract'
                ) {
                  o.contractTypeSecondLevel = o.iotContractType;
                  o.processvariables.contractTypeSecondLevel =
                    o.iotContractType;
                }
                if (o.initiationfields) {
                  o.processvariables = {
                    ...o.initiationfields,
                    ...o.processvariables,
                  };
                }
                return o;
              });
            }

            this.data = data;
            this.ready = true;
            // console.log('finalColumns', this.columns);
          });
      });
    });
  }

  getData(cols): Observable<any> {
    let columns = cols.map((col) => ({
      datafield: col.datafield,
      label: col.text,
    }));

    return this.repSvc.getEntireDataSet({
      columns,
      conditions: [],
      source: this.sourceLabelSvc.getSourceType(this.type),
    });
  }

  getColumns(): Observable<any> {
    this.columns = [];
    switch (this.type) {
      case this.toolbarType.worklist:
        return this.gridColumnSvc.getTasklistGridColumns(this.type);
      case this.toolbarType.workbasket:
        return this.gridColumnSvc.getTasklistGridColumns(this.type);
      case this.toolbarType.contractlist:
        return this.gridColumnSvc.getTasklistGridColumns(this.type);
      case this.toolbarType.comments:
        return this.gridColumnSvc.getTasklistGridColumns(this.type);
      case this.toolbarType.user:
        return this.gridColumnSvc.getUserGridColumns();
      case this.toolbarType.group:
        // this.getGroupGridColumns();
        break;
      case this.toolbarType.company:
        return this.gridColumnSvc.getCompanyGridColumns(this.type);
      case this.toolbarType.country:
        return this.gridColumnSvc.getCompanyGridColumns(this.type);
      case this.toolbarType.processvariable:
        return this.gridColumnSvc.getProcessVariableColumns();
      case this.toolbarType.processform:
        return this.gridColumnSvc.getProcessFormColumns(this.type);
      case this.toolbarType.reports:
        return this.gridColumnSvc.getReportsColumns();
      case this.toolbarType.contentmanagement:
        return this.gridColumnSvc.getTemplatesGridColumns();
      case this.toolbarType.alltasks:
        return this.gridColumnSvc.getContractSearchResultColumns();
      default:
        break;
    }
  }
}

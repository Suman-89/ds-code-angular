import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.scss'],
})
export class EditReportComponent implements OnInit {
  constructor(
    private repSvc: ReportsService,
    private actRoute: ActivatedRoute,
    private gridColumnSvc: GridColumnsService,
    private toastrSvc: ToastrService,
    private sourceLabelSvc: SourceLabelService,
    private sharedSvc: SharedService
  ) {}
  @ViewChild('groupGrid') gridInst;

  reportName;
  editedReportName = '';
  type;
  toolbarType = GridToolbarType;
  ready = false;
  data: any[] = [];
  columns = [];
  filters = [];

  conditions = [];
  localization = { filterselectstring: 'Select' };
  gridType = GridToolbarType;
  searchContract = '';
  sourceLabel = '';

  showEditReportName = false;

  @Output() columnVisibilityChange = new EventEmitter();

  state = {
    filters: {},
  };

  ngOnInit(): void {
    this.reportName = this.actRoute.snapshot.paramMap.get('reportName');
    this.editedReportName = this.reportName;
    this.repSvc.getReportCondition(this.reportName).subscribe((res) => {
      let filters = {};
      let i = 0;
      this.type = this.sourceLabelSvc.getTypesFromSourceTypes(res.data?.source);
      this.searchContract = res.data?.searchContract;
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
          columnsMap[columns[i]['datafield']] = { data: columns[i], index: i };
        }

        for (let i = 0; i < res?.data?.Columns.length; i++) {
          finalColumns.push(columnsMap[res?.data.Columns[i].datafield].data);
          columnsMap[columnsMap[res?.data.Columns[i].datafield].index] = true;
        }

        for (let i = 0; i < columns.length; i++) {
          if (i.toString() in columnsMap === false) {
            columns[i].hidden = true;
            finalColumns.push(columns[i]);
          }
        }

        // console.log('finalColumns', finalColumns);

        this.columns = finalColumns;

        this.getData(columns).subscribe((res) => {
          this.data = res.data;
          // console.log(res);

          if (this.type === this.toolbarType.allProcess) {
            let prefix = JSON.parse(localStorage.getItem('selected-process'));
            this.data = this.data.filter((d) =>
              d.contractid.startsWith(prefix.businessKeyPrefix)
            );

            this.data.sort(
              (a, b) =>
                new Date(b.contractinitiationtime).getTime() -
                new Date(a.contractinitiationtime).getTime()
            );

            this.data.map((o) => {
              // o.elapsedtime = this.secondsToHms(o.elapsedtime) ;
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
              }
              return o;
            });
          }

          if (this.type === this.toolbarType.contractlist) {
            let prefix = JSON.parse(localStorage.getItem('selected-process'));

            this.data = this.data.filter((d) =>
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
                i.processvariables.contractTypeSecondLevel = i.iotContractType;
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
          this.ready = true;
        });
      });

      this.conditions = res.data?.Conditions;

      let sortedConditionsWithDateFirst = [...res.data?.Conditions].sort(
        (a, b) => (a.datatype === 'date' ? -1 : 1)
      );

      sortedConditionsWithDateFirst?.forEach((filter) => {
        if (filter.range) {
          let keys = Object.keys(filter.dateRange);
          for (let j = 0; j < keys.length; j++) {
            filters[`filtercondition${i}`] = keys[j];
            filters[`filteroperator${i}`] = 0;
            filters[`filterdatafield${i}`] = filter.operand;
            // console.log(filter?.datatype);
            filters[`${filter.operand}operator`] = 'and';
            filters[
              `filtertype${i}`
            ] = `${filter?.datatype?.toLowerCase()}filter`;
            if (filter?.datatype?.toLowerCase().includes('date')) {
              filters[`filtertype${i}`] = 'datefilter';
            }
            filters[`filtervalue${i}`] = filter.dateRange[keys[j]];
            i++;
          }
        } else {
          filters[`filtercondition${i}`] = filter.operator;
          filters[`filteroperator${i}`] =
            filter?.datatype?.toLowerCase() == 'string' &&
            filter.operator == 'EQUAL'
              ? 1
              : 0;
          filters[`filterdatafield${i}`] = filter.operand;
          filters[`filtertype${i}`] = `${
            filter?.datatype?.toLowerCase().includes('date') ? 'date' : 'string'
          }filter`;
          filters[`filtervalue${i}`] = filter.value;
          filters[`${filter.operand}operator`] = 'and';
          i++;
        }
      });

      filters = { ...filters, filterscount: i };
      // console.log('filters..................', filters);
      this.state = { filters };
    });
  }

  onFilterChange(filters) {
    this.filters = [...filters];
  }

  getData(cols): Observable<any> {
    let columns = cols.map((col) => ({
      datafield: col.datafield,
      label: col.text,
    }));

    return this.repSvc.getEntireDataSet({
      columns,
      conditions: [],
      processName: JSON.parse(this.sharedSvc.selectedProcess).name,
      searchContract: this.searchContract,
      source: this.sourceLabelSvc.getSourceType(this.type),
    });
  }
  toggleEditReportName(bool: boolean) {
    let trimmedTerm = this.editedReportName.trim();
    if (bool === false) {
      if (trimmedTerm === '') {
        return this.toastrSvc.error('Please type a name for this report');
      }
      let regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (regex.test(trimmedTerm)) {
        return this.toastrSvc.error(
          `Special characters are not allowed i.e. \`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`
        );
      }
    }
    this.reportName = trimmedTerm;
    this.gridInst.editedReportDetails = {
      ifEdited: true,
      editedReportName: this.reportName,
    };
    this.showEditReportName = bool;
  }

  onColumnVisibilityChange(event) {
    let col = this.columns.find((col) => col.datafield === event.datafield);
    col.hidden = event.hidden;
  }
}

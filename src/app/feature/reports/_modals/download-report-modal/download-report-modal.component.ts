import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { GridToolbarType } from 'src/app/core/_models';
import * as _fromCoreSvc from 'src/app/core/_services';
import {
  GridColumnsService,
  ReportsService,
  SourceLabelService,
} from 'src/app/core/_services';

var formatedDate = (date, { istimeincluded = false }) => {
  if (typeof date !== 'string') {
    let dt = date.toDateString().split(' ');
    return (
      dt[2] + '-' + dt[1] + '-' + dt[3] + (istimeincluded ? ' 00:00:00' : '')
    );
  } else return '';
};

@Component({
  selector: 'app-download-report-modal',
  templateUrl: './download-report-modal.component.html',
  styleUrls: ['./download-report-modal.component.scss'],
})
export class DownloadReportModalComponent implements OnInit {
  constructor(
    public modal: NgbActiveModal,
    private repSvc: ReportsService,
    private gridColumnSvc: GridColumnsService,
    private sourceLabelSvc: SourceLabelService
  ) {}

  reportName;
  model = [];

  includedChanges = {};
  conditions = [];

  toolbarType = GridToolbarType;

  columns = [];
  filterConditions = [];
  ready = false;
  type = '';
  sourceLabel = '';

  ngOnInit(): void {
    this.repSvc.getReportCondition(this.reportName).subscribe((res) => {
      let modelArr = [];
      this.filterConditions = res.data?.Conditions;
      this.type = this.sourceLabelSvc.getTypesFromSourceTypes(res.data?.source);
      this.sourceLabel = res.data?.sourceLabel;

      this.gridColumnSvc.getTasklistGridColumns(this.type).subscribe((a) => {
        let commonCols = [];

        if (
          this.type === this.toolbarType.worklist ||
          this.type === this.toolbarType.workbasket ||
          this.type === this.toolbarType.contractlist ||
          this.type === this.toolbarType.allProcess
        ) {
          commonCols = [
            ...commonCols,
            ...this.gridColumnSvc.commonCols()[this.type],
          ];
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
              cellsformat: element.cellsformat ? element.cellsformat : '',
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
          // columnsMap[columns[i]['datafield'].toLowerCase()] = {
          //   data: columns[i],
          //   index: i,
          //   hidden: true,
          // };
        }

        for (let i = 0; i < res.data.Columns.length; i++) {
          console.log(res.data.Columns[i].datafield);
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
        // console.log('finalColumns', finalColumns);

        this.ready = true;
      });

      res?.data?.Conditions?.forEach((cond) => {
        if (cond.range || cond.datatype === 'date') {
          let model = { ...cond };
          let sameCol = res?.data?.Columns?.find(
            (col) => col.datafield == model.operand
          );
          // console.log('model', model, 'sameCol', sameCol);
          if (sameCol) {
            model.colLabel = sameCol.label;
          }
          modelArr.push(model);
        }
      });
      this.model = modelArr;
    });
  }

  onDateChange = (mod, event) => {
    // console.log(event);
    var commons = {
      operand: mod.operand,
      datatype: mod.datatype,
      istimeincluded: mod.istimeincluded,
    };

    let changes = [];

    if (mod.range) {
      changes = [
        {
          ...commons,
          operator: Object.keys(mod.dateRange)[0],
          value: formatedDate(event.startDate, {
            istimeincluded: mod.istimeincluded,
          }),
        },
        {
          ...commons,
          operator: Object.keys(mod.dateRange)[1],
          value: formatedDate(event.endDate, {
            istimeincluded: mod.istimeincluded,
          }),
        },
      ];
    } else {
      changes = [
        {
          ...commons,
          operator: mod.operator,
          value: formatedDate(event, {
            istimeincluded: mod.istimeincluded,
          }),
        },
      ];
    }

    if (
      changes[0]['operand'] + changes[0]['operator'] in
      this.includedChanges
    ) {
      this.conditions[
        this.includedChanges[changes[0]['operand'] + changes[0]['operator']]
      ] = changes[0];
    } else {
      this.conditions.push(changes[0]);
      this.includedChanges[changes[0]['operand'] + changes[0]['operator']] =
        this.conditions.length - 1;
    }
    if (mod.range) {
      if (
        changes[1]['operand'] + changes[1]['operator'] in
        this.includedChanges
      ) {
        this.conditions[
          this.includedChanges[changes[1]['operand'] + changes[1]['operator']]
        ] = changes[1];
      } else {
        this.conditions.push(changes[1]);
        this.includedChanges[changes[1]['operand'] + changes[1]['operator']] =
          this.conditions.length - 1;
      }
    }

    // console.log('conditionss............', this.conditions);
  };

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

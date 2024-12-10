import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { GridColumnModel, GridToolbarType } from 'src/app/core/_models';
import { Subscription } from 'rxjs';
import * as _fromCoreSvc from 'src/app/core/_services';

@Component({
  selector: 'app-csv-extract',
  templateUrl: './csv-extract.component.html',
  styleUrls: ['./csv-extract.component.scss'],
})
export class CsvExtractComponent implements OnInit, OnChanges {
  @ViewChild('grid') gridInstance;
  type = GridToolbarType;
  @Input() excelData;
  gridData;
  subscriptions: Subscription[] = [];
  columns: GridColumnModel[] = [];
  sourceConfig: any = {};
  source;

  constructor(
    private gridColumnSvc: _fromCoreSvc.GridColumnsService,
    private gridSourceSvc: _fromCoreSvc.GridSourceService
  ) {}

  ngOnInit(): void {
    this.getPrescreeningColumn();
  }

  ngOnChanges(e: SimpleChanges): void {
    // console.log('changeeeeeeeeeeeeeeeeeeeee');
    this.updateBoundData();
    this.setGridData();
  }

  getPrescreeningColumn() {
    this.subscriptions.push(
      this.gridColumnSvc
        .getPrescreeningGridColumns(this.type.prescreening)
        .subscribe((a) => {
          this.columns = [...this.columns, ...a];
          // console.log('Saiberiya', this.columns);
          this.columns.map((c) => {
            c.cellsrenderer = this.cellclassrenderer;
          });
        })
    );
  }

  getSource() {
    this.sourceConfig = this.gridSourceSvc.sourceConfig[this.type.prescreening];
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
    if (column === 'Cases') {
      let link = ``;

      if (rowData.Cases && rowData.Cases.length > 0) {
        // console.log('rowData.Cases', rowData.Cases);
        for (let x of rowData.Cases) {
          if (x.isInProgress === true && x.isTerminated === false) {
            let classname = 'inprocessClass';
            link += `<div><a href="${location.origin}/landing/process/view-contract/${x.businessKey}" target="_blank" class ="${classname}">${x.businessKey}</a></div>`;
          } else if (x.isTerminated === true && x.isInProgress === false) {
            let classname = 'terminatedClass';
            link += `<div><a href="${location.origin}/landing/process/view-contract/${x.businessKey}" target="_blank" class ="${classname}">${x.businessKey}</a></div>`;
          } else {
            let classname = 'completedClass';
            link += `<div><a href="${location.origin}/landing/process/view-contract/${x.businessKey}" target="_blank" class ="${classname}">${x.businessKey}</a></div>`;
          }
        }
      }
      return `<div class="jqx-grid-cell-left-align" style="margin-left: 5px; margin-top:10px; display:flex ; gap:5px; overflow:scroll">${link}</div>`;
    }

    var y = true;
    if (rowData.Cases && rowData.Cases.length > 0) {
      for (let x of rowData.Cases) {
        if (x.isInProgress === true && x.isTerminated === false) {
          y = false;
        }
      }
    }
    let classname;
    if (rowData.Reason.length > 0 || y === false) {
      classname = 'terminatedClass';
    } else {
      classname = 'inprocessClass';
    }
    rowData.Reason.length < 0 || y ? 'inprocessClass' : 'terminatedClass';
    return `<div class="jqx-grid-cell-left-align ${classname}" style="margin-left: 5px; margin-top:10px">${value}</div>`;
  };

  ready() {}

  updateBoundData(savedState?) {
    if (this.gridInstance) {
      this.gridInstance.updateData = this.excelData;
      this.gridInstance.config = this.sourceConfig;
      this.gridInstance.updateBoundData(savedState);
    }
  }
}

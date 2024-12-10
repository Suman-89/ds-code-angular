import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProcessVariableModel } from 'src/app/core/_models';
import {
  GridSetterColumnModel,
  GridTypeSetterEnum,
} from '../../_models/procdef.model';
import { GeneralSettingsService } from '../../../../../core/_services/general-settings.service';

@Component({
  selector: 'app-proc-def-grid-setter',
  templateUrl: './proc-def-grid-setter.component.html',
  styleUrls: ['./proc-def-grid-setter.component.scss'],
})
export class ProcDefGridSetterComponent implements OnInit {
  @Input() columnModel: GridSetterColumnModel[];
  @Input() variables: ProcessVariableModel[];
  @Input() gridSetColumns;

  @Output() columnModelEmitter = new EventEmitter();

  columnsArr = [];
  fieldsType = [];
  fieldsWidth = [];
  cellFormat = [];
  gridTypeSetterEnum = GridTypeSetterEnum;

  constructor(private procFormSvc: GeneralSettingsService) {}

  ngOnInit(): void {
    this.procFormSvc.getFormWidthType().subscribe((value) => {
      this.fieldsType = value['fieldsType'];
      this.cellFormat = value['cellFormat'];
    });

    if (this.columnModel.length > 0) {
      this.transformColumns();
    }
  }

  setnewGridSetColumns() {
    this.gridSetColumns = [
      {
        type: GridTypeSetterEnum.MYQ,
        columns: [],
      },
      {
        type: GridTypeSetterEnum.GROUPQ,
        columns: [],
      },
    ];
  }
  assignHeader(val, i) {
    this.columnModel[i].header = val;
  }

  addNewColDef() {
    if (!this.columnModel) {
      this.columnModel = [] as GridSetterColumnModel[];
    }
    this.columnModel.push({} as GridSetterColumnModel);
  }

  assignHeaderName(event, id) {
    console.log(
      'THIS VAR ',
      this.variables.find((a) => a.name === event).displaylabel
    );
    this.columnModel[id].header = this.variables.find(
      (a) => a.name === event
    ).displaylabel;
    this.columnModel[id].key = event;
    this.columnModel[id].width = this.columnModel[id].width
      ? this.columnModel[id].width
      : '100';
    let fieldType = this.fieldsType.find(
      (item) =>
        item.text === this.variables.find((a) => a.name === event).datatype
    ).value;
    this.columnModel[id].filtertype = fieldType;
    this.gridSetColumns.forEach((a) => {
      a.columns.forEach((column) => {
        if (column.key == this.columnModel[id].key) {
          column.filtertype = fieldType;
          event != 'date' ? (column.cellsformat = '') : null;
        }
      });
    });

    console.log('GRID COLS ', this.gridSetColumns);
    console.log('Array item ', this.columnModel);
    this.transformColumns();
  }

  assignFieldWidth(event, id) {
    this.gridSetColumns.forEach((a) => {
      a.columns.forEach((column) => {
        if (column.key == this.columnModel[id].key) {
          this.columnModel[id].width = event;
          column.width = event;
        }
      });
    });
    this.transformColumns();
  }

  // assignFieldType(event, id) {
  //    this.gridSetColumns.forEach(a => {
  //      a.columns.forEach(column => {
  //        if (column.key == this.columnModel[id].key) {
  //          this.columnModel[id].filtertype = event;
  //          column.filtertype = event;
  //          event != "date" ? column.cellsformat = "" : null;
  //       }
  //      });
  //    });
  //   this.transformColumns();
  // }

  assignCellsFormat(event, id) {
    this.gridSetColumns.forEach((a) => {
      a.columns.forEach((column) => {
        if (column.key == this.columnModel[id].key) {
          this.columnModel[id].cellsformat = event;
          column.cellsformat = event;
        }
      });
    });
    this.transformColumns();
  }

  //implemnented due to structural problem in the array
  transformColumns() {
    // this.columnsArr = JSON.parse(JSON.stringify(this.columnModel)) ;
    let arr = (this.columnsArr[0] = {} as GridSetterColumnModel);
    this.columnsArr[0] = {
      header: this.columnModel[0].header,
      key: this.columnModel[0].key,
      width: this.columnModel[0].width,
      filtertype: this.columnModel[0].filtertype,
      cellsformat: this.columnModel[0].cellsformat,
    };
    // return this.columnsArr ;
    // this.columnModelEmitter.emit(this.columnsArr) ;
  }
  queueToggle(checked, ind, opt) {
    checked
      ? this.gridSetColumns
          .find((a) => a.type === opt)
          .columns.push(this.columnModel[ind])
      : (this.gridSetColumns.find((a) => a.type === opt).columns =
          this.gridSetColumns
            .find((a) => a.type === opt)
            .columns.filter((a) => a.key !== this.columnModel[ind].key));
  }

  checkForColInGrid(id, type) {
    return this.gridSetColumns
      .find((a) => a.type === type)
      .columns.find((a) => a.key === this.columnModel[id].key)
      ? true
      : false;
  }

  removeColumn(col_id, remove_col) {
    if (remove_col.key) {
      this.gridSetColumns.forEach((element, id) => {
        this.gridSetColumns[id].columns = element.columns
          .filter((col) => col)
          .filter((col) => col.key != remove_col.key);
      });
    }
    this.columnModel.splice(col_id, 1);
    // console.log("IIIIII", col_id, col,this.gridSetColumns);
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProcessVariableModel } from 'src/app/core/_models';
import { ConfirmModalComponent } from 'src/app/feature/system/process-forms/_modals';
import {
  GridSetterColumnModel,
  GridTypeSetterEnum,
  GridSettingTypeEnum,
} from '../../../feature/system/process-forms/_models/procdef.model';

@Component({
  selector: 'app-grid-col-setting',
  templateUrl: './grid-col-setting.component.html',
  styleUrls: ['./grid-col-setting.component.scss'],
})
export class GridColSettingComponent implements OnInit {
  @Input() column: GridSetterColumnModel;
  @Input() index: Number;
  @Input() gridsettings;
  @Input() variables: ProcessVariableModel[];
  @Input() gridConfigValues;
  @Input() gridSettingType: GridSettingTypeEnum;
  @Input() gridType: GridTypeSetterEnum;
  @Output() variableSelectedEmitter: EventEmitter<any> =
    new EventEmitter<any>();
  basicColumnsGrid;

  constructor(private toastrSvc: ToastrService, private modalSvc: NgbModal) {}

  variableSetting = { label: 'displaylabel', value: 'name' };
  dateFormatSetting = { label: 'text', value: 'value' };
  filterType = { label: 'text', value: 'value' };
  mobile = { label: 'text', value: 'value' };
  tablet = { label: 'text', value: 'value' };
  gridTypeSetterEnum = GridTypeSetterEnum;
  gridSettingTypeEnum = GridSettingTypeEnum;
  mobileInpOptions: any[] = [
    { text: 'Line 1', value: 'line_1' },
    { text: 'Line 2', value: 'line_2' },
    { text: 'Line 3', value: 'line_3' },
  ];
  tabletInpOptions: any[] = [
    { text: 'Line 1', value: 'line_1' },
    { text: 'Line 2', value: 'line_2' },
    { text: 'Line 3', value: 'line_3' },
  ];

  ngOnInit(): void {
    this.basicColumnsGrid = this.gridsettings.find(
      (grid) => grid.type === this.gridTypeSetterEnum.BASIC
    );
    // console.log("this.gridsettings",this.gridsettings)
  }

  assignVariable(obj) {
    let matchedVariable = this.variables.find((a) => a.name === obj.value);

    let ifDate = matchedVariable.datatype?.toLowerCase()?.includes('date');
    let data = {
      header: matchedVariable?.displaylabel || '',
      key: obj.value,
      width: this.column.width ? this.column.width : '100',
      filtertype: ifDate ? 'date' : 'input',
      cellFormat: ifDate ? 'date' : '',
      common:
        this.gridSettingType === this.gridSettingTypeEnum.GENERAL_SETTINGS
          ? true
          : false,
      disabled: false,
    };

    this.gridsettings.forEach(
      (gridType) => (gridType.columns[obj.id] = { ...data })
    );

    this.variableSelectedEmitter.emit();
  }

  assignValue(event, column, gridSettingField) {
    if (this.gridSettingType === this.gridSettingTypeEnum.PROC_DEF_SPECIFIC) {
      let grid = this.gridsettings.find((grid) => grid.type === this.gridType);
      let col = grid.columns.find((col) => col.key === column.key);
      col[gridSettingField] = event.value;
    } else {
      this.gridsettings.forEach((a) => {
        let col = a.columns.find((col) => col.key === column.key);
        col && (col[gridSettingField] = event.value);
      });
    }
  }

  checkForColInGrid(colKey, type) {
    // console.log("Top SETTING ",colKey,type)
    let grid = this.gridsettings.find((a) => a.type === type);
    if (!grid) {
      grid = { type: type, columns: this.basicColumnsGrid.columns };
      this.gridsettings.push(grid);
    }
    return grid && !grid.columns.find((a) => a?.key === colKey)?.disabled;
  }

  queueToggle(checked, columnKey, type) {
    let grid = this.gridsettings.find((a) => a.type === type);
    if (!grid) {
      grid = { type: type, columns: this.basicColumnsGrid.columns };
      this.gridsettings.push(grid);
    }
    if (grid) {
      let col = grid.columns?.find((col) => col.key === columnKey);
      if (col) {
        col.disabled = !checked;
      }
    }
    console.log('ON TOGGLE ', grid, type, columnKey, this.gridsettings);
  }

  removeColumn(col_id, remove_col) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });

    modalRef.componentInstance.element = {
      label: remove_col.header,
      save: true,
    };

    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      if (r.save) {
        this.gridsettings.forEach((element) => {
          element.columns = element.columns.filter((col, i) =>
            remove_col.key ? col.key != remove_col.key : i !== col_id
          );
        });
      }
      this.toastrSvc.warning(`Deleted!`);
      modalRef.close();
    });
  }
}

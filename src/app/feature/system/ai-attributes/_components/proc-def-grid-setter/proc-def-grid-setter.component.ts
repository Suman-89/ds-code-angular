import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProcessVariableModel } from 'src/app/core/_models';
import { GeneralSettingsService } from 'src/app/core/_services';
import {
  GridSetterColumnModel,
  GridSettingTypeEnum,
  GridTypeSetterEnum,
} from '../../_models/procdef.model';
import { AiAttributeService } from '../../_services/ai-attribute.service';

@Component({
  selector: 'app-proc-def-grid-setter',
  templateUrl: './proc-def-grid-setter.component.html',
  styleUrls: ['./proc-def-grid-setter.component.scss'],
})
export class ProcDefGridSetterComponent implements OnInit {
  @Input() columnModel: GridSetterColumnModel[];
  @Input() variables: ProcessVariableModel[];
  @Input() gridsettings;
  filteredVariables: ProcessVariableModel[];
  ready = false;
  basicColumnsGrid;
  gridTypeSetterEnum = GridTypeSetterEnum;
  gridSettingTypeEnum = GridSettingTypeEnum;
  activeTab = 'MYQ';
  gridConfigValues = {};
  gridLabelNames = {
    MYQ: 'My Queue',
    GROUPQ: 'Group Queue',
    ALLTASKS: 'All Processes',
    ALLPROCESS: 'All Tasks',
  };

  constructor(
    private procFormSvc: AiAttributeService,
    public generalSettingsSvc: GeneralSettingsService
  ) {}

  ngOnInit(): void {
    this.filterExistingVariables();
    this.basicColumnsGrid = this.gridsettings.find(
      (grid) => grid.type === this.gridTypeSetterEnum.BASIC
    );

    !this.basicColumnsGrid
      ? this.fetchCommonColumns()
      : this.syncCommonColumns();

    this.procFormSvc.getFormWidthType().subscribe((data) => {
      this.gridConfigValues = data;
      this.ready = true;
    });
  }

  fetchCommonColumns() {
    this.generalSettingsSvc.getGeneralSetting().subscribe((resp) => {
      let commonGridSettings = resp.data.gridsettings;

      this.basicColumnsGrid = {
        type: 'BASIC',
        columns: [],
      };

      commonGridSettings[0]?.columns.forEach((col) => {
        this.basicColumnsGrid.columns?.push({ ...col });
      });

      this.gridsettings.push(this.basicColumnsGrid);

      commonGridSettings.forEach((gridType) => {
        this.gridsettings.push(gridType);
      });
    });
  }

  syncCommonColumns() {
    this.generalSettingsSvc.getGeneralSetting().subscribe((resp) => {
      let commonGridSettings = resp.data.gridsettings;
      let existingColumns = this.basicColumnsGrid.columns;

      commonGridSettings[0]?.columns.forEach((commonCol, index) => {
        let matchedCol = existingColumns.find(
          (col) => col.key === commonCol.key
        );

        if (!matchedCol) {
          // EDGE CASE: what if new added common column already added in process specific column list
          console.log(commonCol);

          this.basicColumnsGrid.columns.push({ ...commonCol });

          let otherColsExceptBasic = this.gridsettings?.filter(
            (grid) => grid.type !== 'BASIC'
          );

          otherColsExceptBasic.forEach((gridType) => {
            let commonGrid = commonGridSettings.find(
              (grid) => grid.type == gridType.type
            );

            gridType.columns.push({ ...commonGrid?.columns[index] });
          });
        }
      });
    });
  }

  addNewCol() {
    this.gridsettings.forEach((grid) => {
      grid.columns.push({} as GridSetterColumnModel);
    });
  }

  drop(event: CdkDragDrop<string[]>, gridTypeIndex) {
    let gridToBeSwaped = this.gridsettings.find(
      (gridType) => gridType.type === this.gridsettings[gridTypeIndex].type
    );

    moveItemInArray(
      gridToBeSwaped?.columns,
      event.previousIndex,
      event.currentIndex
    );
  }

  filterExistingVariables() {
    let basic = this.gridsettings.find((grid) => grid.type === 'BASIC');
    if (!!basic) {
      this.filteredVariables = this.variables.filter((vari) => {
        return !basic.columns.some((col) => col.key === vari.name);
      });
    } else this.filteredVariables = this.variables;
  }
}

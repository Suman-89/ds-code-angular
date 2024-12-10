import { Component, OnInit, Input } from '@angular/core';
import { ProcessVariableModel } from 'src/app/core/_models';
import { GridSettingTypeEnum } from '../../../process-forms/_models/procdef.model';
import { ProcessFormsService } from '../../../process-forms/_services';
import {
  GridSetterColumnModel,
  GridTypeSetterEnum,
} from '../../_models/procdef.model';

@Component({
  selector: 'app-general-grid-settings',
  templateUrl: './general-grid-settings.component.html',
  styleUrls: ['./general-grid-settings.component.scss'],
})
export class GeneralGridSettingsComponent implements OnInit {
  @Input() variables: ProcessVariableModel[];
  @Input() gridsettings = [];
  @Input() columnModelEmitter;
  filteredVariables: ProcessVariableModel[];

  ready = false;

  gridConfigValues = {};
  gridTypeSetterEnum = GridTypeSetterEnum;
  gridSettingTypeEnum = GridSettingTypeEnum;

  constructor(private procFormSvc: ProcessFormsService) {}

  ngOnInit(): void {
    this.filterExistingVariables();

    this.procFormSvc.getFormWidthType().subscribe((data) => {
      this.gridConfigValues = data;
      this.ready = true;
    });
  }

  addNewCol() {
    this.gridsettings.forEach((grid) => {
      grid.columns.push({} as GridSetterColumnModel);
    });
  }

  filterExistingVariables() {
    let first = this.gridsettings[0];

    this.filteredVariables = this.variables.filter((vari) => {
      return !first.columns.some((col) => col.key === vari.name);
    });
  }
}

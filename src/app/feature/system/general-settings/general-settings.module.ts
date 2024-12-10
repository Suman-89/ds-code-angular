import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ProcessVariableService } from '../process-variable/_services/process-variable.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProcessFormsRoutingModule } from './process-forms-routing.module';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import {
  AddProcessFormsComponent,
  ExpressionGeneratorComponent,
  ProcDefGridSetterComponent,
} from './_components';
import { Ng2PicaModule } from 'ng2-pica';
import { TreeModule } from 'angular-tree-component';
import {
  AddEditGeneralSettingsComponent,
  ViewProcessFormsComponent,
} from './_containers';
import * as _fromModals from './_modals';
import { ImageEditorComponent } from './_modals/image-editor/image-editor.component';
import { GeneralGridSettingsComponent } from './_components/general-grid-settings/general-grid-settings.component';

@NgModule({
  declarations: [
    ViewProcessFormsComponent,
    AddProcessFormsComponent,
    ExpressionGeneratorComponent,
    AddEditGeneralSettingsComponent,
    ProcDefGridSetterComponent,
    _fromModals.ConfirmModalComponent,
    ImageEditorComponent,
    GeneralGridSettingsComponent,
  ],
  imports: [
    CommonModule,
    NgxBootstrapSliderModule,
    ProcessFormsRoutingModule,
    FormsModule,
    SharedModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    TreeModule,
    Ng2PicaModule,
  ],
  providers: [ProcessVariableService],
})
export class GeneralSettingsModule {}

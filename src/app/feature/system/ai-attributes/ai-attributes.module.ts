import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ProcessVariableService } from '../process-variable/_services/process-variable.service';
import { AiAttributeService } from './_services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProcessFormsRoutingModule } from './ai-attributes-routing.module';
import {
  AddProcessFormsComponent,
  ExpressionGeneratorComponent,
  ProcDefGridSetterComponent,
} from './_components';
import { TreeModule } from 'angular-tree-component';
import {
  AddEditAiAttributesComponent,
  ViewAiAttributesComponent,
} from './_containers';
import * as _fromModals from './_modals';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbNavItem } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ViewAiAttributesComponent,
    AddProcessFormsComponent,
    ExpressionGeneratorComponent,
    AddEditAiAttributesComponent,
    ProcDefGridSetterComponent,
    _fromModals.ConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ProcessFormsRoutingModule,
    FormsModule,
    SharedModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    TreeModule,
  ],

  providers: [AiAttributeService, ProcessVariableService, NgbNavItem],
})
export class AiAttributesModule {}

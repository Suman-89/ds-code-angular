import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManagementService } from './_services';
import { ContentManagementRoutingModule } from './content-management-routing.module';
import * as _fromComponents from './_components/';
import * as _fromContainer from './_containers/';
import { ProcessFormsService } from '../process-forms/_services';
import { ProcessVariableService } from '../process-variable/_services/process-variable.service';
import { RuleSetComponent } from './_components/rule-set/rule-set.component';
import { MultiselectToggleComponent } from './_components/multiselect-toggle/multiselect-toggle.component';

@NgModule({
  declarations: [
    _fromContainer.AddEditContentTemplateComponent,
    _fromContainer.TemplateListComponent,
    _fromComponents.ContentLayoutComponent,
    _fromComponents.RulesetInputTypeComponent,
    _fromComponents.RuleSetComponent,
    _fromComponents.MultiselectToggleComponent,
  ],

  imports: [
    CommonModule,
    ContentManagementRoutingModule,
    SharedModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
  ],
  providers: [
    ContentManagementService,
    ProcessFormsService,
    ProcessVariableService,
  ],
  exports : [RuleSetComponent]
})
export class ContentManagementModule {}

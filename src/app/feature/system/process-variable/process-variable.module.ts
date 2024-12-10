import { RefDataService } from 'src/app/core/_services';
import { SharedModule } from './../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProcessVariableService } from './_services/process-variable.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProcessVariableRoutingModule } from './process-variable-routing.module';
import { AddVariableComponent } from './_modal/add-variable/add-variable.component';
import { ViewVariableComponent } from './_components/view-variable/view-variable.component';
import { AddProcNamesComponent } from './_modal/add-proc-names/add-proc-names.component';
import { ContentManagementModule } from '../content-management/content-management.module';

@NgModule({
  declarations: [AddVariableComponent, ViewVariableComponent, AddProcNamesComponent],
  imports: [
    CommonModule,
    ProcessVariableRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    ContentManagementModule
  ],
  providers: [ProcessVariableService, RefDataService],
  entryComponents: [AddVariableComponent],
})
export class ProcessVariableModule {}

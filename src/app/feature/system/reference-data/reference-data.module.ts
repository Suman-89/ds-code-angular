import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TreeModule } from 'angular-tree-component';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';

import * as _fromServices from './_services';
import * as _fromContainers from './_containers';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddRefDataComponent } from './_modals/add-ref-data/add-ref-data.component';
import { InstancePanelComponent } from './_components/instance-panel/instance-panel.component';
import { ReferenceDataRoutingModule } from './reference-data-routing.module';

@NgModule({
  declarations: [
    _fromContainers.ReferenceDataLandingComponent,
    _fromContainers.DashboardComponent,
    _fromContainers.RefDataViewComponent,
    AddRefDataComponent,
    InstancePanelComponent,
  ],
  imports: [
    CommonModule,
    ReferenceDataRoutingModule,
    SharedModule,
    jqxGridModule,
    // TreeModule.forRoot(),
    FormsModule,
  ],
  providers: [_fromServices.RefDataService],
  entryComponents: [AddRefDataComponent],
})
export class ReferenceDataModule {}

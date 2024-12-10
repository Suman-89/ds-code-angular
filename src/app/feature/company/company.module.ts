import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import * as _fromContainers from './_containers';
import * as _fromComponents from './_components';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as _fromModals from './_modals';

@NgModule({
  declarations: [
    _fromContainers.CompanyLandingComponent,
    _fromContainers.CompanyDashboardComponent,
    _fromContainers.CompanyActionComponent,
    _fromContainers.ContractingEntitiesComponent,
    _fromComponents.BankDetailComponent,
    _fromComponents.NoticeContractComponent,
    _fromComponents.ContractEntityEmailListComponent,
    _fromModals.EditCountryDataComponent,
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule,
    FormlyModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormsModule,
    NgbModule,
  ],
})
export class CompanyModule {}

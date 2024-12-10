import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { SharedModule } from '../../../shared/shared.module';

import * as _fromComponents from './_components';
import * as _fromContainers from './_containers';
import * as _fromTaihoContainers from '../initiation/taiho/_containers';
import * as _fromTaihoComponents from '../initiation/taiho/_components';
import * as _fromIbasisComponents from '../initiation/ibasis/_components';
import * as _fromEmployeeComponents from '../initiation/employee/_components';
import * as _fromEmployeeContainers from '../initiation/employee/_containers';
import * as _fromIbasisContainers from '../initiation/ibasis/_containers';
import * as _fromDisputeContainers from '../initiation/dispute/_containers';
import * as _fromDisputeComponents from '../initiation/dispute/_components';
// import * as _fromAadhaarComponents from '../initiation/aadhaar-extraction/_components';
// import * as _fromAadhaarContainers from '../initiation/aadhaar-extraction/_containers';

import * as _fromServices from './_services';
import * as _fromModals from './_modals';

import { ProcessDefInitiationRoutingModule } from './process-def-initiation-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { StartMortgageProcessComponent } from './mortgage/_containers/start-mortgage-process/start-mortgage-process.component';
import { InitiateMortgageComponent } from './mortgage/_components/initiate-mortgage/initiate-mortgage.component';
import { InvoiceExtractMortgageComponent } from './mortgage/_components/invoice-extract-mortgage/invoice-extract-mortgage.component';
import { InitiateEmployeeComponent } from './employee/_components/initiate-employee/initiate-employee.component';
import { CompanyDetailsEmployeeComponent } from './employee/_components/company-details-employee/company-details-employee.component';
import { StartProcessEmployeeComponent } from './employee/_containers/start-process-employee/start-process-employee.component';
import { InitiateAadhaarComponent } from './employee/_components/initiate-aadhaar/initiate-aadhaar.component';
import { AadhaarExtractComponent } from './employee/_components/aadhaar-extract/aadhaar-extract.component';
import { StartProcessAadhaarComponent } from './employee/_containers/start-process-aadhaar/start-process-aadhaar.component';
import { StartProcessPrescreeningComponent } from './prescreening/_containers/start-process-prescreening/start-process-prescreening.component';
import { InitiatePrescreeningComponent } from './prescreening/_components/initiate-prescreening/initiate-prescreening.component';
import { CsvExtractComponent } from './prescreening/_components/csv-extract/csv-extract.component';

@NgModule({
  imports: [
    CommonModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    ProcessDefInitiationRoutingModule,
    FormlyBootstrapModule,
    FormlyModule,
  ],
  declarations: [
    _fromContainers.StartProcessComponent,
    _fromContainers.InitiationLandingComponent,
    _fromContainers.StartVoiceDealComponent,
    _fromContainers.StartSnowDealComponent,

    _fromComponents.DocUploadInitiationComponent,
    // _fromComponents.InitiateComponent,
    _fromComponents.CompanyDetailsComponent,
    _fromComponents.InvoiceExtractComponent,

    _fromTaihoContainers.StartTaihoProcessComponent,

    _fromTaihoComponents.InitiateTaihoComponent,
    _fromTaihoComponents.InvoiceExtractTaihoComponent,

    _fromIbasisContainers.StartProcessIbasisComponent,
    _fromEmployeeContainers.StartProcessEmployeeComponent,

    _fromIbasisComponents.CompanyDetailsComponent,
    _fromIbasisComponents.InitiateIbasisComponent,
    _fromEmployeeComponents.CompanyDetailsEmployeeComponent,
    _fromEmployeeComponents.InitiateEmployeeComponent,

    _fromModals.SelectWorkflowTypeComponent,

    _fromDisputeContainers.StartDisputeProcessComponent,

    _fromDisputeComponents.InitiateDisputeComponent,

    StartMortgageProcessComponent,

    InitiateMortgageComponent,

    InvoiceExtractMortgageComponent,

    InitiateEmployeeComponent,

    CompanyDetailsEmployeeComponent,

    StartProcessEmployeeComponent,

    InitiateAadhaarComponent,

    AadhaarExtractComponent,

    StartProcessAadhaarComponent,

    StartProcessPrescreeningComponent,

    InitiatePrescreeningComponent,

    CsvExtractComponent,
  ],
  providers: [_fromServices.StartProcessSignalService],
  entryComponents: [_fromModals.SelectWorkflowTypeComponent],
})
export class ProcessDefInitiationModule {}

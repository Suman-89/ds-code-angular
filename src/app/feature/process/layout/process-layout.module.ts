import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProcessLayoutRoutingModule } from './process-layout-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import * as _fromContainers from './_containers';
import * as _fromComponents from './_components';
import * as _fromServices from './_services';
import * as _fromModals from './_modals';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DisplayHistoryComponent } from './_components/display-history/display-history.component';
import { PrescreeningModalComponent } from './_modals/prescreening-modal/prescreening-modal.component';
import { BulkMessageModalComponent } from './_modals/bulk-message-modal/bulk-message-modal.component';
import { DisplayPreviewComponent } from './_components/display-preview/display-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule,
    SharedModule,
    ProcessLayoutRoutingModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    }),
  ],
  declarations: [
    _fromContainers.ProcessLandingComponent,
    _fromContainers.ViewTaskComponent,
    _fromContainers.CompareTaskComponent,
    _fromContainers.TasklistComponent,
    _fromContainers.DashboardComponent,
    _fromContainers.TaskActionsComponent,
    _fromContainers.ViewContractComponent,
    _fromContainers.ContractSearchResultComponent,

    _fromComponents.CommentsComponent,
    _fromComponents.TranscriptionsComponent,
    _fromComponents.AuditComponent,
    _fromComponents.TaskInfoComponent,
    _fromComponents.CompareInfoComponent,
    // _fromComponents.DocumentListComponent,
    _fromComponents.TaskFormComponent,
    _fromComponents.NextTaskComponent,
    _fromComponents.ContractSearchComponent,
    _fromComponents.DisplayCommentComponent,

    _fromModals.SelectUserComponent,
    _fromModals.EmailAttachmentComponent,
    _fromModals.FileUploaderModalComponent,
    _fromModals.CheckInFileModalComponent,
    _fromModals.VersionHistoryModalComponent,
    _fromModals.PrintProcessDocumentModalComponent,
    _fromModals.TerminateReasonComponent,
    DisplayHistoryComponent,
    PrescreeningModalComponent,
    BulkMessageModalComponent,
    DisplayPreviewComponent,
  ],
  providers: [
    _fromServices.TaskService,
    _fromServices.TaskInfoService,
    _fromServices.MapToFormlyService,
    _fromServices.TaskActionService,
    _fromServices.TaskSignalService,
    NgbActiveModal,
  ],
  entryComponents: [
    _fromModals.SelectUserComponent,
    _fromModals.EmailAttachmentComponent,
    _fromModals.FileUploaderModalComponent,
    _fromModals.CheckInFileModalComponent,
    _fromModals.TerminateReasonComponent,
    _fromContainers.CompareTaskComponent,
  ],
  // exports: [_fromComponents.DocumentListComponent],
})
export class ProcessLayoutModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ReportsService } from 'src/app/core/_services';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { EditReportComponent } from './_containers/edit-report/edit-report.component';
import { PreviewReportComponent } from './_containers/preview-report/preview-report.component';
import { UserReportsComponent } from './_containers/all_reports/reports.component';
import { DownloadReportModalComponent } from './_modals/download-report-modal/download-report-modal.component';

@NgModule({
  declarations: [
    UserReportsComponent,
    PreviewReportComponent,
    EditReportComponent,
    DownloadReportModalComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
    jqxGridModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  providers: [ReportsService],
})
export class ReportsModule {}

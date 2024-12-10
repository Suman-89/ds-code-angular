import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserReportsComponent } from './_containers/all_reports/reports.component';
import { PreviewReportComponent } from './_containers/preview-report/preview-report.component';
import { EditReportComponent } from './_containers/edit-report/edit-report.component';

const routes: Routes = [
  { path: '', component: UserReportsComponent },
  {
    path: 'preview/:reportName',
    component: PreviewReportComponent,
  },
  {
    path: 'edit/:reportName',
    component: EditReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

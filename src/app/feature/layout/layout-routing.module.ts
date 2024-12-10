import { SystemModule } from './../system/system.module';
import { NotificationsComponent } from './_components/notifications/notifications.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './_containers';
import { UserManagementModule } from '../user-management/user-management.module';
import { CompanyModule } from '../company/company.module';
import { ProcessModule } from '../process/process.module';
import { DownloadDocComponent } from './_components';
import { ReportsModule } from '../reports/reports.module';
import { AnalyticsModule } from '../analytics/analytics.module';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      { path: '', redirectTo: 'process', pathMatch: 'full' },
      { path: 'download/:contentId', component: DownloadDocComponent },
      { path: 'user-management', loadChildren: () => UserManagementModule },
      { path: 'company', loadChildren: () => CompanyModule },
      { path: 'process', loadChildren: () => ProcessModule },
      { path: 'system', loadChildren: () => SystemModule },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'reports', loadChildren: () => ReportsModule },
       { path: 'analytics', loadChildren: () => AnalyticsModule },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}

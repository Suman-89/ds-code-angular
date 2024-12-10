import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsAppComponent } from './_containers/analytics_app/analytics_app.component';


const routes: Routes = [
  { path: '', component: AnalyticsAppComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

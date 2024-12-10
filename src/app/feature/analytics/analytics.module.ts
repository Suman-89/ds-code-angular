import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsRoutingModule } from './analytics-routing.module';
import { AnalyticsAppComponent } from './_containers/analytics_app/analytics_app.component';
import { AnalyticsService } from './_services';

@NgModule({
  declarations: [
    AnalyticsAppComponent,
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
  providers: [AnalyticsService],
})
export class AnalyticsModule
{ }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BltPricingConfigComponent } from './_containers/blt-pricing-config/blt-pricing-config.component';
import { BltPriceListComponent } from './_containers/blt-price-list/blt-price-list.component';

const routes: Routes = [
  // { path: '', component: BltPricingConfigComponent },
  // { path: 'price-list', component: BltPriceListComponent },

//   {
//     path: 'preview/:reportName',
//     component: PreviewReportComponent,
//   },
//   {
//     path: 'edit/:reportName',
//     component: EditReportComponent,
//   },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })


export class BltRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BltRoutingModule } from './blt-routing.module';
import { BltPricingConfigComponent } from './_containers/blt-pricing-config/blt-pricing-config.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { BltPriceListComponent } from './_containers/blt-price-list/blt-price-list.component';
import { BltService } from './_services/blt.service';

@NgModule({
  declarations: [ BltPriceListComponent, BltPricingConfigComponent],
  imports: [
    CommonModule,
    // BltRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule
  ],
  providers: [BltService],
})


export class BltModule { }



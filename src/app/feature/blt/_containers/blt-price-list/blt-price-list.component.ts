import { Component, OnInit } from '@angular/core';
import { BltService } from '../../_services/blt.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-blt-price-list',
  templateUrl: './blt-price-list.component.html',
  styleUrls: ['./blt-price-list.component.scss'],
})
export class BltPriceListComponent implements OnInit {
  constructor(
    private BltSvc: BltService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  pricingList = [];
  elevatorPrices = [];
  locationWisePrices = [];
  installPrices = [];
  freightPrices = [];
  unloadingPrices = [];
  additionalFeaturePrices = [];
  freightHighRiseStop;
  freightRisePremiumPerStop;
  unloadingHighRiseStop;
  unloadingRisePremiumPerStop;

  ngOnInit(): void {
    this.getPricingList();
  }

  getPricingList() {
    this.ngxLoader.start();
    this.BltSvc.getPricingList().subscribe(
      (res) => {
        // console.log('res', res);
        this.pricingList = res.data;
        this.elevatorPrices = res.data.elevatorPrices;
        this.ngxLoader.stop();
        // console.log('pricingklsit', this.pricingList);

        if (res.data.elevatorPrices.length > 0) {
          res.data.elevatorPrices.forEach((el) => {
            el.locationWisePrices.forEach((lp) => {
              lp['capacity'] = el.capacity;
            });
            this.locationWisePrices.push(el.locationWisePrices);
          });
        }

        this.locationWisePrices.forEach((el) => {
          el.forEach((data) => {
            let installObj = {};
            installObj['location'] = data.location;
            installObj['capacity'] = data.capacity;
            installObj['mrgInstallPrice'] = data.mrgInstallPrice;
            installObj['mrglInstallPrice'] = data.mrglInstallPrice;
            installObj['mrlInstallPrice'] = data.mrlInstallPrice;
            this.installPrices.push(installObj);

            let freightObj = {};
            freightObj['location'] = data.location;
            freightObj['capacity'] = data.capacity;
            freightObj['mrFreightPrice'] = data.mrFreightPrice;
            freightObj['mrlFreightPrice'] = data.mrlFreightPrice;
            this.freightPrices.push(freightObj);

            let unloadingObj = {};
            unloadingObj['location'] = data.location;
            unloadingObj['capacity'] = data.capacity;
            unloadingObj['unloadIngPrice'] = data.unloadIngPrice;
            this.unloadingPrices.push(unloadingObj);
          });
        });

        if (res.data.additionalFeaturePrices.length > 0) {
          this.additionalFeaturePrices = res.data.additionalFeaturePrices;
        }

          this.installPrices.sort((a, b) => {
            return a.location.localeCompare(b.location);
        });
        
        this.freightPrices.sort((a, b) => {
          return a.location.localeCompare(b.location);
      });
      
      this.unloadingPrices.sort((a, b) => {
        return a.location.localeCompare(b.location);
    });

        this.freightHighRiseStop = res.data.freightHighRiseStop;
        this.freightRisePremiumPerStop = res.data.freightRisePremiumPerStop;
        this.unloadingHighRiseStop = res.data.unloadingHighRiseStop;
        this.unloadingRisePremiumPerStop = res.data.unloadingRisePremiumPerStop;

        // console.log('locationwiseprices', this.locationWisePrices);
        // console.log('installprices', this.installPrices);
      },
      (err) => {
        // console.error('Error:', err);
      }
    );
  }
}

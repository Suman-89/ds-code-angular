export interface ElevatorPricingPremiumsModel {
     
    capacity: number;
    premiumPerStop: number;
    highRiseStop: number;
    highRisePremiumPerStop: number;
    ssPremium: number;
    ssHighRisePremiumPerStop: number;
    ssLandingDoorPrice: number;
    mrlHighRisePremium: number;
    installCapacityPremium: number;
    freightCapacityPremium: number;
    unloadingCapacityPremium: number;
    createdBy?: string;
    createdTimeStamp?: string;
    elevatorPricingBases?: ElevatorPricingBase[];
}

 export interface ElevatorPricingBase {
    capacity: number;
    machineTractionUnit: string;
    basePrice: number;
  }

 export interface LocationDependentPriceModel {
    location: string;
    installLocationPremium: number;
    freightLocationPremium: number;
    unloadingLocationPremium: number;
  }
  
 export interface PricingMiscellaneousModel {
    id: number;
    gstPercentage: number;
    annualWarrantyPercentage: number;
    commissionPercentage: number;
    profitMarginPercentage: number;
  }
  
 export interface FreightPriceModel {
    id?: number;
    basePrice: number;
    highRiseStop: number;
    highRisePremiumPerStop: number;
    mrlPremium: number;
  }
  
export interface InstallPriceModel {
    id?: number;
    mrgBasePrice: number;
    mrglPremium: number;
    mrlPremium: number;
  }
  
 export interface UnloadingPriceModel {
    id?: number;
    basePrice: number;
    highRiseStops: number;
    highRisePremiumPerStop: number;
  }
  
 export interface AdditionalFeaturePriceModel {
    additionalFeatureType: string;
    additionalFeatureBasePrice: number;
    additionalFeaturePremiumPerStop: number;
  }
  

  export interface PricingConfigModel {
    elevatorPricingPremiums: ElevatorPricingPremiumsModel[];
    locationDependentPrices: LocationDependentPriceModel[];
    pricingMiscellaneous: PricingMiscellaneousModel[];
    freightPrices: FreightPriceModel[];
    installPrices: InstallPriceModel[];
    unloadingPrices: UnloadingPriceModel[];
    additionalFeaturePrices: AdditionalFeaturePriceModel[];
  }

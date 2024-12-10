import { CompanyAddressModel } from 'src/app/core/_models';

export interface InitiationTaskViewModel {
  companyName: string;
  companyLegalName: string;
  companyPrincipalAddr?: CompanyAddressModel;
  aliases?: string[];
  selectedAddr: number;
  addresses?: CompanyAddressModel[];
  companyCountry: string;
  companyGroup?: string;
  ndaStatus?: string;
  msaStatus?: string;
  historicalMSAExists?: boolean;
  historicalNDAExists?: boolean;
  product?: string;
  aadhaar: string;
  pan: string;
  blackList: boolean;
}

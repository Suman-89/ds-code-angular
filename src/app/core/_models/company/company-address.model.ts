export class CompanyAddressModel{
   id: number ;
   primary?: boolean ;
   line: string;
   country: any;
   countrycode: string;
   state: string;
   city: string;
   postalcode: string;
   type?: string ;
   friendlyaddress?: string;
}

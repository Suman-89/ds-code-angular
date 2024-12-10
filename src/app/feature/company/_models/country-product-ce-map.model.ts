export interface CountryProductCEMapModel {
    countryname: string;
    countrycode: string;
    code: string;
    mappings: ProductCEMapModel;
}

export interface ProductCEMapModel {
    productname: string;
    cename: string;
}
import {
  CompanyModel,
  CompanyGroupModel,
} from '../_models/company/company.model';
import { environment } from 'src/environments/environment';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/core/_models';
import {
  CountryDataModel,
  CountryProductCEMapModel,
  ProductCEMapModel,
} from 'src/app/feature/company/_models';

@Injectable({
  providedIn: 'root',
})
export class CompanyManagementService {
  companyUrl = environment.dataUrl;
  refDataUrl = environment.referenceDataUrl + 'refdata/';

  constructor(private apiSvc: ApiService) {}

  uploadCompanyProfileImage(code, data) {
    const path = this.companyUrl + `companies/uploadPic?companyCode=${code}`;
    // console.log(path)
    return this.apiSvc.post(path, data);
  }

  previewUserImage(code) {
    const path = this.companyUrl + `companies/public/comp-pic/${code}`;
    return this.apiSvc.getDownload(path, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getAllCompanies(): Observable<ResponseModel<CompanyModel[]>> {
    // const path = this.companyUrl + 'companies' ;
    let processName = JSON.parse(localStorage.getItem('selected-process')).name;
    const path = this.companyUrl + `companies/all?processname=${processName}`;
    return this.apiSvc.get(path);
  }

  searchCompanies(
    term: string
  ): Observable<ResponseModel<CompanyGroupModel[]>> {
    let processName = JSON.parse(localStorage.getItem('selected-process')).name;
    const path = this.companyUrl + `companies/all?n=${term}`;
    return this.apiSvc.get(path);
  }

  searchEmployees(term: string): Observable<ResponseModel<CompanyModel>> {
    const path = this.companyUrl + `companies/aadhaarid?aadhaarId=${term}`;
    return this.apiSvc.get(path);
  }
  verifyAadhaar(id: string, otp: string): Observable<ResponseModel<any>> {
    const path =
      this.companyUrl + `companies/aadhaarVerify?otp=${otp}&aadhaarId=${id}`;
    return this.apiSvc.get(path);
  }

  otpGenerate(id: string): Observable<ResponseModel<any>> {
    const path = this.companyUrl + `companies/aadhaarOtp?aadhaarId=${id}`;
    return this.apiSvc.get(path);
  }

  getCompanybyId(id): Observable<ResponseModel<CompanyModel>> {
    const path = this.companyUrl + `companies/${id}`;
    return this.apiSvc.get(path);
  }
  getGridColumnsData(): Observable<any[]> {
    const path = 'assets/config/company/company-grid-column.json';
    return this.apiSvc.get(path);
  }
  getContractGridColumns(): Observable<any[]> {
    const path = 'assets/config/company/contract-entities-grid.json';
    return this.apiSvc.get(path);
  }
  getCompanyCreateForm(): Observable<FormlyFieldConfig[]> {
    const path = 'assets/config/company/company-create.json';
    return this.apiSvc.get(path);
  }

  addCompany(data): Observable<any> {
    let ofacCheckValue = JSON.parse(localStorage.getItem('procDefOfacCheck'));
    let processName = JSON.parse(localStorage.getItem('selected-process')).name;
    data.resource.processName = processName;
    // console.log(ofacCheckValue)
    //temporary condition for exixting process as their ofacCheck is null
    if (ofacCheckValue === null || undefined) {
      ofacCheckValue = false;
    }

    //  console.log(ofacCheckValue)
    const path = this.companyUrl + `companies?ofacCheck=${ofacCheckValue}`;
    return this.apiSvc.post(path, data);
  }
  editCompany(data, id): Observable<any> {
    const path = this.companyUrl + 'companies/' + id;
    return this.apiSvc.put(path, data);
  }

  getCompanyTypes(): Observable<ResponseModel<any>> {
    const path = this.companyUrl + 'company/master/types';
    return this.apiSvc.get(path);
  }
  getContactTypes(): Observable<ResponseModel<CompanyGroupModel[]>> {
    const path = this.companyUrl + 'companies/contacttypes';
    return this.apiSvc.get(path);
  }
  getAddressTypes(): Observable<ResponseModel<any>> {
    const path = this.companyUrl + 'company/master/addresstypes';
    return this.apiSvc.get(path);
  }

  getCompanyGroups(): Observable<ResponseModel<CompanyGroupModel[]>> {
    const path = this.companyUrl + 'companies/groups';
    return this.apiSvc.get(path);
  }

  addCompanyGroup(data): Observable<ResponseModel<CompanyGroupModel>> {
    const path = this.companyUrl + 'companies/groups';
    return this.apiSvc.post(path, data);
  }

  getParentCompanies(): Observable<ResponseModel<CompanyGroupModel[]>> {
    const path = this.companyUrl + 'companies/parent';
    return this.apiSvc.get(path);
  }

  addContractingEnities(data): Observable<ResponseModel<any>> {
    const path = this.companyUrl + 'companies/contractingentities';
    return this.apiSvc.post(path, data);
  }
  editContractingEnities(data, id): Observable<ResponseModel<any>> {
    const path = this.companyUrl + 'companies/contractingentities/' + id;
    return this.apiSvc.put(path, data);
  }
  getContractingEntities(): Observable<ResponseModel<any>> {
    const path = this.companyUrl + 'companies/contractingentities';
    return this.apiSvc.get(path);
  }

  getContractingEntityByID(id): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      this.companyUrl + 'companies/contractingentities/' + id
    );
  }

  deleteAddress(compid, addressId): Observable<ResponseModel<any>> {
    return this.apiSvc.delete(
      `${this.companyUrl}companies/${compid}/address/${addressId}`
    );
  }

  deleteCompany(id): Observable<ResponseModel<any>> {
    return this.apiSvc.delete(`${this.companyUrl}companies/${id}`);
  }

  getOfacSstatus(id: string): Observable<ResponseModel<any>> {
    return this.apiSvc.get(`${this.companyUrl}companies/${id}/ofacstatus`);
  }

  editCountryDetails(
    country: CountryDataModel
  ): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.refDataUrl}countries/${country.countrycode}`,
      country
    );
  }
  syncDms(): Observable<ResponseModel<any>> {
    return this.apiSvc.get(`${this.companyUrl}companies/syncdms`);
  }

  getAllContractingEnities(): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      `${this.companyUrl}companies/contractingentities/all`
    );
  }

  putCountryDetailsofCE(
    code,
    cename
  ): Observable<ResponseModel<CountryDataModel>> {
    return this.apiSvc.put(
      `${this.companyUrl}companies/country/${code}/contractingentity/${cename}`
    );
  }

  updateSapId(
    sapid: string,
    sapidType: string,
    companycode: string
  ): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.companyUrl}companies/sapid/${sapid}/${sapidType}/${companycode}`
    );
  }

  mapCountryProductCE(
    data: CountryProductCEMapModel
  ): Observable<ResponseModel<any>> {
    return this.apiSvc.post(
      `${this.companyUrl}companies/country/${data.countrycode}/contractingentity`,
      data.mappings
    );
  }

  getMappedCountryProductCE(
    countrycode,
    product
  ): Observable<ResponseModel<any>> {
    let path = product
      ? `${this.companyUrl}companies/country/${countrycode}/contractingentity?product=${product}`
      : `${this.companyUrl}companies/country/${countrycode}/contractingentity?product=`;
    return this.apiSvc.get(path);
  }
}
// companies/id/ofacstatus

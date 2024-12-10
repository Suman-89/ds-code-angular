import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/core/_services/api.service';
import { Injectable } from '@angular/core';
import * as _fromCoreModels from 'src/app/core/_models';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {
  refDataUrl = environment.referenceDataUrl;
  constructor(private apiSvc: ApiService) { }

  getAllRefdataCategories(): Observable<_fromCoreModels.ResponseModel<_fromCoreModels.ReferenceDataModel[]>> {
    const path = this.refDataUrl + 'refdata/categories' ;
    return this.apiSvc.get(path) ;
  }

  getCategoryByCode(code): Observable<_fromCoreModels.ResponseModel<_fromCoreModels.ReferenceDataModel>> {
    const path = `${this.refDataUrl}refdata/categories/${code}` ;
    return this.apiSvc.get(path) ;
  }
  addRefData(data): Observable<_fromCoreModels.ResponseModel<_fromCoreModels.ReferenceDataModel>> {
    const path = this.refDataUrl + 'refdata/categories' ;
    return this.apiSvc.post(path, data) ;
  }

  //old api for adding instances for refdata
  // addInstance(id, data, isCatVal): Observable<_fromCoreModels.ResponseModel<_fromCoreModels.InstanceModel>> {
  //   const path = this.refDataUrl + `refdata/${id}/instances?iscat=${isCatVal}` ;
  //   return this.apiSvc.post(path, data) ;
  // }
  
  //latest changes for adding instances
    addInstance(id, data , parentId): Observable<_fromCoreModels.ResponseModel<_fromCoreModels.InstanceModel>> {
    const path = this.refDataUrl + `refdata/${id}/catinstances?instanceParentId=${parentId}` ;
    return this.apiSvc.post(path, data) ;
  }

  getInstances(id, isCat): Observable<_fromCoreModels.ResponseModel<_fromCoreModels.InstanceModel[]>> {
    const path = this.refDataUrl + `refdata/${id}/instances?iscat=${isCat}`;
    return this.apiSvc.get(path) ;
  }
  getChildInstances(id , parentId): Observable<_fromCoreModels.ResponseModel<_fromCoreModels.InstanceModel>> {
    const path = this.refDataUrl + `refdata/${id}/catinstances?instanceParentId=${parentId}` ;
    return this.apiSvc.get(path) ;
  }
  editRefData(id, name, isCat?): Observable<_fromCoreModels.ResponseModel<any>> {
    let editUrl ;
    isCat ? editUrl = `refdata/${id}/instances?iscat=${isCat}` : editUrl = `refdata/${id}/instances` ;
    const path = this.refDataUrl + editUrl ;
    // const path = 'http://192.168.23.5:7012/api/' + `test/hello` ;
    return this.apiSvc.put(path, name) ;
  }
  removeRefData(id, isCat?): Observable<_fromCoreModels.ResponseModel<any>> {
    let editUrl ;
    isCat ? editUrl = `refdata/${id}/instances?iscat=${isCat}` : editUrl = `refdata/${id}/instances` ;
    const path = this.refDataUrl + editUrl ;
    return this.apiSvc.delete(path) ;
  }
}

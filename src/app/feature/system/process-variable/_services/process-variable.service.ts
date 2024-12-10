import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/_services/api.service';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/core/_models';
import { ProcessVariableModel } from 'src/app/core/_models';

@Injectable()
export class ProcessVariableService {
  procVarUrl = environment.bpmUrl + 'metadata/variables';
  constructor(private apiSvc: ApiService) {}

  getAllProcessVariables(): Observable<ResponseModel<ProcessVariableModel[]>> {
    return this.apiSvc.get(this.procVarUrl);
  }

  getEmailVariables(): Observable<ResponseModel<ProcessVariableModel[]>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    return this.apiSvc.get(
      `${this.procVarUrl}/email?processName=${processName}`
    );
  }
  getProcessVariablebyId(id): Observable<ResponseModel<ProcessVariableModel>> {
    return this.apiSvc.get(`${this.procVarUrl}/${id}`);
  }

  getCategoryForVariables(): Observable<ResponseModel<string[]>> {
    return this.apiSvc.get(this.procVarUrl + '/categories');
  }

  addCategoryForVariable(data): Observable<ResponseModel<any>> {
    return this.apiSvc.post(`${this.procVarUrl}/categories`, data);
  }
  getUIElementTypes(): Observable<ResponseModel<string[]>> {
    return this.apiSvc.get(this.procVarUrl + '/uielementtypes');
  }

  getSource(): Observable<ResponseModel<string[]>> {
    return this.apiSvc.get(this.procVarUrl + '/sources');
  }

  getVariableNames(ref): Observable<ResponseModel<string[]>> {
    let path;
    ref
      ? (path = this.procVarUrl + '/names?source=REFDATA')
      : (path = this.procVarUrl + '/names');
    return this.apiSvc.get(path);
  }

  getDataTypes(): Observable<ResponseModel<string[]>> {
    return this.apiSvc.get(this.procVarUrl + '/datatypes');
  }

  addProcessVariable(data): Observable<ResponseModel<number>> {
    const path = this.procVarUrl;
    return this.apiSvc.post(this.procVarUrl, data);
  }

  editProcessVariable(data): Observable<ResponseModel<any>> {
    const path = `${this.procVarUrl}/${data.id}`;
    return this.apiSvc.put(path, data);
  }

  editMultipleProcessVariables(data): Observable<ResponseModel<any>> {
    const path = `${this.procVarUrl}/updateProcVars`;
    return this.apiSvc.put(path, data);
  }

  removeProcessVariable(data): Observable<ResponseModel<any>> {
    const path = `${this.procVarUrl}/${data.id}`;
    return this.apiSvc.delete(path);
  }

  getFieldName(label): Observable<ResponseModel<string>> {
    const path = `${this.procVarUrl}/camelize?label=${label}`;
    return this.apiSvc.get(path);
  }

  syncMetadata(): Observable<ResponseModel<any>> {
    return this.apiSvc.get(`${this.procVarUrl}/syncmeta`);
  }

  getAllDefinitionForm(): Observable<ResponseModel<any[]>> {
    return this.apiSvc.get(`${this.procVarUrl}/processes/defination/all`);
  }
}

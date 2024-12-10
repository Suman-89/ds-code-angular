import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/_services/api.service';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/core/_models';
import { ProcessFormModel } from 'src/app/core/_models';
import { ContractSearchResultModel } from '../../process/layout/_models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  bpmnUrl = environment.bpmUrl;
  assetPath = '/assets/config';
  constructor(private apiSvc: ApiService) {}

  addProcessForm(data): Observable<ResponseModel<any>> {
    return this.apiSvc.post(`${this.bpmnUrl}metadata/forms`, data);
  }

  searchContract(obj): Observable<ResponseModel<ContractSearchResultModel[]>> {
    // obj = JSON.stringify(obj) ;
    const params = encodeURI(JSON.stringify(obj));
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    return this.apiSvc.get(
      `${this.bpmnUrl}contract/search?s=${params}&processName=${processname.name}`
    );
  }

  editForm(data): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.bpmnUrl}metadata/forms/${data.key}`,
      data
    );
  }
  getAllProcForms(): Observable<ResponseModel<ProcessFormModel[]>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    return this.apiSvc.get(
      `${this.bpmnUrl}metadata/forms?processName=${processName}`
    );
  }

  getAllProcFormsbyId(key): Observable<ResponseModel<any>> {
    return this.apiSvc.get(`${this.bpmnUrl}metadata/forms/${key}`);
  }

  removeProcForms(key): Observable<ResponseModel<any>> {
    return this.apiSvc.delete(`${this.bpmnUrl}metadata/form/${key}`);
  }

  getAllDefinitionForm(): Observable<ResponseModel<any[]>> {
    return this.apiSvc.get(
      `${this.bpmnUrl}metadata/variables/processes/defination/all`
    );
  }
  saveProcDefForm(form): Observable<ResponseModel<any>> {
    return this.apiSvc.post(
      `${this.bpmnUrl}metadata/variables/processes/defination`,
      form
    );
  }

  editProcDefForm(form): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.bpmnUrl}metadata/variables/processes/defination?processname=${form.processname}`,
      form
    );
  }

  getProcDefbyName(name): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      `${this.bpmnUrl}metadata/variables/processes/defination?processname=${name}`
    );
  }

  getAllProcessDefinintion() {
    return this.apiSvc.get(`${this.bpmnUrl}processes/initiation/all`);
  }
  getFormWidthType() {
    let path = this.assetPath + '/common/process-def-fields.json';
    return this.apiSvc.get(path);
  }
  getProcessMap() {
    let path = this.assetPath + '/common/processes-map.json';
    return this.apiSvc.get(path);
  }

  getGeneralSetting(): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      `${this.bpmnUrl}metadata/variables/project/settings`
    );
  }

  getGeneralSettingData() {
    let path = this.assetPath + '/common/general-settings.json';
    return this.apiSvc.get(path);
  }
  getDMSSettings() {
    let path = this.assetPath + '/common/dms-settings.json';
    return this.apiSvc.get(path);
  }
}

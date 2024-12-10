import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/_services/api.service';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/core/_models';
import { ProcessFormModel } from 'src/app/core/_models';

@Injectable({ providedIn: 'root' })
export class ProcessFormsService {
  procFormUrl = environment.bpmUrl;
  assetPath = '/assets/config';
  constructor(private apiSvc: ApiService) {}

  addProcessForm(data): Observable<ResponseModel<any>> {
    return this.apiSvc.post(`${this.procFormUrl}metadata/forms`, data);
  }

  editForm(data): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.procFormUrl}metadata/forms/${data.key}`,
      data
    );
  }
  getAllProcForms(): Observable<ResponseModel<ProcessFormModel[]>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    return this.apiSvc.get(
      `${this.procFormUrl}metadata/forms?processName=${processName}`
    );
  }

  getAllProcFormsbyId(key): Observable<ResponseModel<any>> {
    return this.apiSvc.get(`${this.procFormUrl}metadata/forms/${key}`);
  }

  removeProcForms(key): Observable<ResponseModel<any>> {
    return this.apiSvc.delete(`${this.procFormUrl}metadata/form/${key}`);
  }

  getAllDefinitionForm(): Observable<ResponseModel<any[]>> {
    return this.apiSvc.get(
      `${this.procFormUrl}metadata/variables/processes/defination/all`
    );
  }
  saveProcDefForm(form): Observable<ResponseModel<any>> {
    return this.apiSvc.post(
      `${this.procFormUrl}metadata/variables/processes/defination`,
      form
    );
  }

  editProcDefForm(form, bool): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.procFormUrl}metadata/variables/processes/defination?processname=${form.processname}&&setDefaultTheme=${bool}`,
      form
    );
  }

  getProcDefbyName(name): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      `${this.procFormUrl}metadata/variables/processes/defination?processname=${name}`
    );
  }

  getAllProcessDefinintion() {
    return this.apiSvc.get(`${this.procFormUrl}processes/initiation/all`);
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
      `${this.procFormUrl}metadata/variables/project/settings`
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

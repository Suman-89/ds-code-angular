import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/_services/api.service';
import { Injectable } from '@angular/core';
import { AnchorFormModel, ResponseModel, TagType } from 'src/app/core/_models';
import { ProcessFormModel } from 'src/app/core/_models';
import { TaskActionService } from 'src/app/feature/process/layout/_services';
import { ProcessVariableService } from '../../process-variable/_services/process-variable.service';

@Injectable({ providedIn: 'root' })
export class AnchorElementService {
  procFormUrl = environment.bpmUrl;
  assetPath = '/assets/config';
  metaDataVars = []
  constructor(private apiSvc: ApiService, private taskActionSvc: TaskActionService,private procVarSvc: ProcessVariableService,) { }
  multiMentionConfig = this.taskActionSvc.getMultiMentionConfig();

  addProcessForm(data): Observable<ResponseModel<any>> {
    // return this.apiSvc.post(`${this.procFormUrl}metadata/forms`, data);
     return this.apiSvc.post('http://dev.ds-workflow.com:7019/amsapi/cmd/anchorconfigs',data);
  }

  getAllProcessVariables(): Observable<ResponseModel<any>> {
    const pathWork = `${this.procFormUrl}metadata/variables`;
    return this.apiSvc.get(pathWork).pipe(map((a) => {
      this.metaDataVars = a.data.map(i => ({
				variableName: i.name,
				variableType: i.datatype,
				isVisible: i.visible,
				isMandatory: i.mandetory?i.mandetory:i.ismandatory,
				isReadOnly: i.readonly,
				expiryTerm: 0
      }));
      this.multiMentionConfig.mentions.forEach(i => {
        if (i.triggerChar == '$') {
          i.items = this.metaDataVars;
          i.labelKey = 'variableName';
          i.mentionSelect = this.insertVariableTagHtml;
        }
      })
      return a;
     }));
  }

  public insertVariableTagHtml(variable) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${variable.variableName}" data-tagtype="${TagType.VARIABLE}"
      contenteditable="false"
      >{${variable.variableName}}</span>`;
  }

  editForm(data): Observable<ResponseModel<any>> {
    // return this.apiSvc.put(
    //   `${this.procFormUrl}metadata/forms/${data.key}`,
    //   data
    // );
    console.log("data",data)
    return this.apiSvc.put(
      `http://dev.ds-workflow.com:7019/amsapi/cmd/anchorconfigs/${data.anchorConfigId}`,
      data
    );
  }
  getAllProcForms(): Observable<ResponseModel<AnchorFormModel[]>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    // return this.apiSvc.get(
    //   `${this.procFormUrl}metadata/forms?processName=${processName}`
    // );
    return this.apiSvc.get(
      // `${this.procFormUrl}query/anchorconfigs/all`
      'http://dev.ds-workflow.com:7019/amsapi/query/anchorconfigs/all'
    );
  }

  lematizeId(id): Observable<ResponseModel<any>> {
    return this.apiSvc.get(`http://dev.ds-workflow.com:7019/amsapi/public/lematize?string=${id}`);
  }

  

   getAllProcFormsbyId(key): Observable<ResponseModel<any>> {
    // return this.apiSvc.get(`${this.procFormUrl}metadata/forms/${key}`);
     return this.apiSvc.get(`http://dev.ds-workflow.com:7019/amsapi/query/anchorconfigs/${key}`)
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

  editProcDefForm(form): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.procFormUrl}metadata/variables/processes/defination?processname=${form.processname}`,
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

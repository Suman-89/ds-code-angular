import { OFACModel } from './../../../../core/_models/company/ofac.model';
import {
  ResponseModel,
  ProcessFormModel,
  TypeAheadModel,
} from 'src/app/core/_models';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/_services';
import { Observable } from 'rxjs';
import { AuditTrailModel } from '../_models/audit-trail.model';
import {
  TaskCommentModel,
  TaskDocumentModel,
  TaskInfoModel,
  TemplateMetaRequestModel,
  TemplateMetaResponseModel,
  TaskDocumentResponseModel,
} from '../_models';
import { environment } from 'src/environments/environment';
import { CheckOutResponseModel } from '../_models/check-out-response.model';
import { TranscriptionModel } from '../_models/transcription.model';

@Injectable({ providedIn: 'root' })
export class TaskInfoService {
  bpmnUrl = environment.bpmUrl;
  dmsUrl = environment.dmsUrl;
  companyUrl = environment.dataUrl;
  emailSubject = '';
  emailRecipientId;
  partnerLegalNameObj;
  defaultCommentTab;

  constructor(private apiSvc: ApiService) {}

  // TASK INFO

  getTaskInfo(taskId: string): Observable<ResponseModel<TaskInfoModel>> {
    let path = `${this.bpmnUrl}tasks/${taskId}`;
    return this.apiSvc.get(path);
  }

  // getTaskVariables(
  //   formKey: string
  // ): Observable<ResponseModel<ProcessFormModel>> {
  //   let path = `${this.bpmnUrl}metadata/forms/${formKey}?fillvalues=true`;
  //   return this.apiSvc.get(path);
  // }
    // previously above api to get task variable now added levels filtration for refdata


  getTaskVariables(
    formKey: string
  ): Observable<ResponseModel<ProcessFormModel>> {
    let path = `${this.bpmnUrl}metadata/forms/levels/${formKey}?fillvalues=true`;
    return this.apiSvc.get(path);
  }

  getAuditTrail(
    businessKey: string
  ): Observable<ResponseModel<AuditTrailModel[]>> {
    const path = `${this.bpmnUrl}contract/${businessKey}/audittrail`;
    return this.apiSvc.get(path);
  }

  // DMS Related

  getDocumentList(
    name: string
  ): Observable<ResponseModel<TaskDocumentResponseModel>> {
    const path = `${this.dmsUrl}/process/document/company?companycode=${name}`;
    return this.apiSvc.get(path);
  }

  getDocumentListByBusinessKey(
    businessKey: string
  ): Observable<ResponseModel<TaskDocumentResponseModel>> {
    const path = `${this.dmsUrl}/process/document?businesskey=${businessKey}`;
    return this.apiSvc.get(path);
  }

  // to be implemented to get documents related to contracts
  getFilteredDocumentList(
    name: string,
    businessKey: string
  ): Observable<ResponseModel<TaskDocumentResponseModel>> {
    const path = name
      ? `${this.dmsUrl}/process/document/company/${businessKey}?companycode=${name}`
      : `${this.dmsUrl}/process/document/company/${businessKey}`;
    return this.apiSvc.get(path);
  }

  openDocument(contentId: string, oldversion?): void {
    oldversion
      ? window.open(`${this.dmsUrl}/file/${contentId}?oldversion=true`)
      : window.open(`${this.dmsUrl}/file/${contentId}`, '_blank');
    // window.open(`/download/${contentId}`);
  }

  getExistingList(
    name: string
  ): Observable<ResponseModel<TaskDocumentResponseModel>> {
    const path = `${
      this.dmsUrl
    }/process/document/company?companycode=${name}&type=${'IP,EC'}`;
    return this.apiSvc.get(path);
  }

  getEmployeeDocs(
    name: string
  ): Observable<ResponseModel<TaskDocumentResponseModel>> {
    const path = `${this.dmsUrl}/process/document/company?companycode=${name}&isEmployee=true`;
    return this.apiSvc.get(path);
  }

  getTemplateMetaFromDMS(
    taskId: string
  ): Observable<ResponseModel<TemplateMetaResponseModel[]>> {
    const path = `${this.bpmnUrl}tasks/${taskId}/contractdocs/preview`;
    return this.apiSvc.get(path);
  }

  getTemplates(
    obj: TemplateMetaRequestModel
  ): Observable<ResponseModel<TypeAheadModel[]>> {
    const path = `${this.dmsUrl}/template/products/contracttype`;
    return this.apiSvc.post(path, obj);
  }

  getTemplatesUsingVars(
    map: TemplateMetaRequestModel
  ): Observable<ResponseModel<TypeAheadModel[]>> {
    return this.apiSvc.post(
      `${this.dmsUrl}/template/products/contracttype/filter`,
      map
    );
  }

  checkOutDoc(
    doc: TaskDocumentModel
  ): Observable<ResponseModel<CheckOutResponseModel>> {
    return this.apiSvc.get(`${this.dmsUrl}/document/${doc.id}/checkout`);
  }

  checkInDoc(
    doc: TaskDocumentModel,
    id: number
  ): Observable<ResponseModel<TaskDocumentModel>> {
    return this.apiSvc.post(`${this.dmsUrl}/document/${id}/checkin`, doc);
  }

  cancelCheckout(doc: TaskDocumentModel): Observable<ResponseModel<boolean>> {
    return this.apiSvc.delete(`${this.dmsUrl}/document/${doc.id}/checkout`);
  }

  getVersionHistory(contentid): Observable<ResponseModel<TaskDocumentModel[]>> {
    return this.apiSvc.get(`${this.dmsUrl}/document/versions/${contentid}`);
  }

  // COMMENT RELATED

  getCommentList(
    businesskey: string,
    processName?: string
  ): Observable<ResponseModel<TaskCommentModel[]>> {
    const selectedProcessName =
      processName ?? JSON.parse(localStorage.getItem('selected-process'))?.name;

    const path = `${this.bpmnUrl}tasks/comments?businesskey=${businesskey}&processName=${selectedProcessName}`;
    return this.apiSvc.get(path);
  }

  getTranscriptionList(
    businesskey: string
  ): Observable<ResponseModel<TranscriptionModel[]>> {
    const path = `${this.bpmnUrl}transcriptions/all?businessKey=${businesskey}`;
    return this.apiSvc.get(path);
  }
  // transcriptions?businessKey=EM-Email-01Dec2022081638&messageSource=email

  getAllTranscriptionsHistory(
    businessKey: string
  ): Observable<ResponseModel<any>> {
    const path = `${this.bpmnUrl}transcriptions/history?businessKey=${businessKey}`;
    return this.apiSvc.get(path);
  }

  postTranscript(formData): Observable<ResponseModel<TranscriptionModel>> {
    return this.apiSvc.post(`${this.bpmnUrl}transcriptions`, formData);
  }

  postComment(
    commentObj: TaskCommentModel,
    taskid,
    businesskey,
    processName?: string
  ): Observable<ResponseModel<TaskCommentModel>> {
    const selectedProcessName =
      processName ?? JSON.parse(localStorage.getItem('selected-process'))?.name;
    let path;
    // commentObj.levelInfo = levelInfo ;
    taskid
      ? (path = `${this.bpmnUrl}tasks/${taskid}/comments?businesskey=${businesskey}&processName=${selectedProcessName}`)
      : (path = `${this.bpmnUrl}tasks/comments?businesskey=${businesskey}&processName=${selectedProcessName}`);
    return this.apiSvc.post(path, commentObj);
  }

  replyComment(
    commentObj,
    parentCommentId
  ): Observable<ResponseModel<TaskCommentModel>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    return this.apiSvc.post(
      `${this.bpmnUrl}comments/${parentCommentId}/reply?processName=${processName}`,
      commentObj
    );
  }

  getAllReplies(parentCommentId) {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    return this.apiSvc.get(
      `${this.bpmnUrl}comments/${parentCommentId}/reply?processName=${processName}`
    );
  }

  checkMandatoryComment(
    bKey: string,
    epoch: string
  ): Observable<ResponseModel<boolean>> {
    return this.apiSvc.get(
      `${this.bpmnUrl}comments/after/${epoch}?bkey=${bKey}`
    );
  }

  // signatory check

  addSignatoryCheck(
    data: OFACModel,
    compId: number
  ): Observable<ResponseModel<OFACModel>> {
    return this.apiSvc.post(
      `${this.companyUrl}companies/${compId}/signatoryofac`,
      data
    );
  }

  addCompanyOfacCheck(data: OFACModel, compId): Observable<ResponseModel<any>> {
    return this.apiSvc.post(
      `${this.companyUrl}companies/${compId}/companyofac`,
      data
    );
  }

  updateCompanyDetails(
    businessKey: string,
    taskId: string
  ): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.bpmnUrl}contract/${businessKey}/${taskId}`,
      {}
    );
  }

  getInitForm(formkey) {
    return this.apiSvc.get(
      `${this.bpmnUrl}metadata/forms/keys?workflowname=${formkey}`
    );
  }
  showAllReplies(id): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      `${this.bpmnUrl}transcription/get-replies?parentMessageId=${id}`
    );
  }
  postReply(formData): Observable<ResponseModel<any>> {
    return this.apiSvc.post(`${this.bpmnUrl}transcriptions-reply`, formData);
  }
  getSummary(data, bool): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      `${this.bpmnUrl}transcriptions/summary?businessKey=${data}&generateAgain=${bool}`
    );
  }
  // postTranscript(formData): Observable<ResponseModel<TranscriptionModel>> {
  //   return this.apiSvc.post(`${this.bpmnUrl}transcriptions`, formData);
  // }
}

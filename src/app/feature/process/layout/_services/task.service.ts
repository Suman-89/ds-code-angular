import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TasksModel,
  TaskDocumentPreviewRequestModel,
  TaskTerminateRequestModel,
  WorkflowStartResponseModel,
  TaskInfoModel,
  ContractDetailsModel,
  ContractSearchResultModel,
} from '../_models';
import { ApiService } from 'src/app/core/_services';
import {
  InitiationTaskModel,
  InitiationTaskCheckModel,
  InitiationTaskCheckRespModel,
} from '../../initiation/_models';
import { environment } from 'src/environments/environment';
import { ResponseModel } from 'src/app/core/_models';
import { UserModel } from 'src/app/feature/user-management/_models';
import { ContractModel } from '../_models/contract.model';
import { AuditTrailMappedModel } from '../_models/contract-details.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  bpmnUrl = environment.bpmUrl;
  dmsUrl = environment.dmsUrl;
  uploadUrl = environment.uploadUrl;
  constructor(private apiSvc: ApiService) {}
  nameArr;

  checkProcess(
    initiate: InitiationTaskCheckModel
  ): Observable<ResponseModel<InitiationTaskCheckRespModel>> {
    const path = `${this.bpmnUrl}contract/check`;
    return this.apiSvc.post(path, initiate);
  }

  startWorkflow(
    initiate: InitiationTaskModel
  ): Observable<ResponseModel<WorkflowStartResponseModel[]>> {
    initiate.initiator = JSON.parse(localStorage.getItem('user')).userid;

    let path = `${this.bpmnUrl}process/start`;
    return this.apiSvc.post(path, initiate);
  }

  startWorkflowByCsv(file) {
    let path = `${this.bpmnUrl}add-lead/uploadcsv`;
    return this.apiSvc.post(path, file);
  }

  getNextTask(
    processInstId: string,
    businessKey: string = ''
  ): Observable<
    ResponseModel<{ contractcomplete: boolean; tasks: TaskInfoModel[] }>
  > {
    const path = `${this.bpmnUrl}process/${
      processInstId ? processInstId : businessKey
    }/tasks?parent=true&business=${businessKey !== ''}`;
    return this.apiSvc.get(path);
  }

  terminateWorkflow(
    processInst: TaskTerminateRequestModel[],
    reason: string = ''
  ): Observable<ResponseModel<boolean>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    let path = `${this.bpmnUrl}processinstance/delete?reason=${reason}&processName=${processName}`;
    return this.apiSvc.post(path, processInst);
  }

  getContractList(status?): Observable<ResponseModel<ContractModel[]>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;

    if (status === 'All') {
      status = null;
    }

    let path =
      processName === 'Initiation Process Pre-Screening' ||
      processName === 'Initiation Employee Onboarding Process' ||
      processName === 'Initiation E-mail Process' ||
      processName === 'Initiation Agro Advisory Process'
        ? `${this.bpmnUrl}contract?processName=${processName}&sortByLastMessageTimestamp=true&contractStatus=${status}`
        : `${this.bpmnUrl}contract?processName=${processName}&contractStatus=${status}`;
    return this.apiSvc.get(path);
  }

  getCommentListForUser(): Observable<ResponseModel<Comment[]>> {
    let path = 'assets/data/comment-list.json';
    return this.apiSvc.get(path);
  }

  getContractById(
    contractId: string
  ): Observable<ResponseModel<ContractModel>> {
    let path = `${this.bpmnUrl}contract/${contractId}`;
    return this.apiSvc.get(path);
  }

  getIndividualTasks(): Observable<ResponseModel<TasksModel[]>> {
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    let path = `${this.bpmnUrl}tasks?group=false&processname=${processname.name}`;
    return this.apiSvc.get(path);
  }

  tasksBusinessKey(res, selectedProcess, selGrp) {
    return res.data.filter(
      (d) =>
        d.businessKey?.startsWith(selectedProcess.businessKeyPrefix) &&
        d?.groupid?.toLocaleLowerCase() === selGrp?.toLocaleLowerCase()
    );

    // sortTasks('created');
    // tasks.forEach((a) => {
    //   if (
    //     a.initiationfields.product === 'IOT' &&
    //     a.initiationfields.contractType === 'Service Contract'
    //   ) {
    //     a.processvariables.contractTypeSecondLevel = a.initiationfields
    //       ?.iotContractType
    //       ? a.initiationfields.iotContractType
    //       : a.processvariables.iotContractType;
    //   }
    //   if (a.initiationfields) {
    //     a.processvariables = {
    //       ...a.initiationfields,
    //       ...a.processvariables,
    //     };
    //   }
    // });
  }

  groupIdFilter(res, UserGroupsEnum, globalPmGrpConstant, selGrp, tasks) {
    return res.data.filter(
      (a) =>
        a.groupid?.toLocaleLowerCase() ===
        UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
    ) && globalPmGrpConstant.includes(selGrp)
      ? (tasks = tasks.concat(
          res.data.filter(
            (a) =>
              a.groupid?.toLocaleLowerCase() ===
              UserGroupsEnum.PRODUCTION_MANAGEMENT?.toLocaleLowerCase()
          )
        ))
      : null;
  }

  productContractType(task, selectedProcess) {
    return task.forEach((a) => {
      if (
        a.initiationfields.product === 'IOT' &&
        a.initiationfields.contractType === 'Service Contract'
      ) {
        a.processvariables.contractTypeSecondLevel = a.initiationfields
          ?.iotContractType
          ? a.initiationfields.iotContractType
          : a.processvariables.iotContractType;
      }
      if (
        selectedProcess.key == 'Initiation_preScreeningProcess' &&
        !a.processvariables?.['psCandidateProfileImage']
      ) {
        // console.log("PROCESS ", a.processvariables, a.processvariables?.['psCandidateProfileImage'])
        // console.log(
        //   'a.processvariables?.psCandidateName',
        //   a.processvariables?.psCandidateName
        // );
        if (a.processvariables?.psCandidateName) {
          this.nameArr = a.processvariables?.psCandidateName.split(' ').length;
        } else {
          this.nameArr = 0;
        }
        if (
          a.processvariables?.psCandidateFirstName &&
          a.processvariables?.psCandidateLastName
        ) {
          a.processvariables.psCandidateProfileImage =
            a.processvariables?.psCandidateFirstName?.[0] +
            a.processvariables?.psCandidateLastName?.[0];
        } else if (a.processvariables?.psCandidateFirstName) {
          a.processvariables.psCandidateProfileImage =
            a.processvariables?.psCandidateFirstName?.[0];
        } else if (a.processvariables?.psCandidateLastName) {
          a.processvariables.psCandidateProfileImage =
            a.processvariables?.psCandidateLastName?.[0];
        } else if (this.nameArr > 1) {
          a.processvariables.psCandidateProfileImage =
            a.processvariables?.psCandidateName.split(' ')[0][0] +
            a.processvariables?.psCandidateName.split(' ')[this.nameArr - 1][0];
        } else if (this.nameArr === 1) {
          a.processvariables.psCandidateProfileImage =
            a.processvariables?.psCandidateName.split(' ')[0][0];
        } else {
          a.processvariables.psCandidateProfileImage = '?';
        }
      }
      if (a.initiationfields) {
        a.processvariables = {
          ...a.initiationfields,
          ...a.processvariables,
        };
      }
      if (
        selectedProcess.key === 'Initiation_vMTProcess' &&
        a.processvariables &&
        a.processvariables['amendmentId']
      ) {
        a.processvariables['dealId'] =
          (a.processvariables['parentId'] || '') +
          '.' +
          a.processvariables['amendmentId'];
      }
    });
  }

  getGroupTasks(): Observable<ResponseModel<TasksModel[]>> {
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    let path = `${this.bpmnUrl}tasks?group=true&processname=${processname.name}`;
    return this.apiSvc.get(path);
  }
  getGroupTasksByName(gid): Observable<ResponseModel<TasksModel[]>> {
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    let path = `${this.bpmnUrl}tasks/groups?groupids=${gid}&processname=${processname.name}`;
    return this.apiSvc.get(path);
  }

  saveTaskForm(
    taskId: string,
    obj: any,
    businessKey: string = ''
  ): Observable<ResponseModel<any[]>> {
    let path = `${this.bpmnUrl}tasks/${taskId}/variables?buskey=${businessKey}`;
    return this.apiSvc.put(path, obj);
  }

  saveStatus(formkey, businessKey, stat): Observable<ResponseModel<any>> {
    stat = stat ? stat : ' ';
    return this.apiSvc.put(
      `${this.bpmnUrl}contract/status/${businessKey}/${formkey}`,
      stat
    );
  }

  saveVariables(businessKey, varList): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.bpmnUrl}contract/processvariable/${businessKey}`,
      varList
    );
  }
  saveCompanyEmail(
    businessKey,
    companyCode,
    accountManagerName,
    accountManagerId,
    partnerLevel
  ): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.bpmnUrl}remedy/company/email?businessKey=${businessKey}&companyCode=${companyCode}&accountManagerName=${accountManagerName}&accountManagerId=${accountManagerId}&partnerLevel=${partnerLevel}`
    );
  }

  saveTaskDecision(formKey, bkey, decision?) {
    let path = decision
      ? `${this.bpmnUrl}tasks/${formKey}/decision?buskey=${bkey}&decision=${decision}`
      : `${this.bpmnUrl}tasks/${formKey}/feedback?buskey=${bkey}`;
    return this.apiSvc.put(path);
  }

  claimTask(taskIds): Observable<ResponseModel<any>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    let path = `${this.bpmnUrl}tasks/claim/bulk?processName=${processName}`;
    return this.apiSvc.post(path, taskIds);
  }

  unclaimTask(taskIds): Observable<ResponseModel<any>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    let path = `${this.bpmnUrl}tasks/unclaim/bulk?processName=${processName}`;
    return this.apiSvc.post(path, taskIds);
  }

  completeTask(taskId: string, model: any): Observable<ResponseModel<any>> {
    let path = `${this.bpmnUrl}tasks/${taskId}/submit`;
    return this.apiSvc.post(path, model);
  }

  completeReviewTask(
    taskId: string,
    model: TaskDocumentPreviewRequestModel
  ): Observable<ResponseModel<any>> {
    let path = `${this.bpmnUrl}tasks/${taskId}/contractdocs`;
    return this.apiSvc.post(path, model);
  }

  assignTask(
    taskObj,
    user: UserModel,
    procInstId
  ): Observable<ResponseModel<any>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    const path = `${this.bpmnUrl}tasks/${user.userid}/assign?&processinstanceid=${procInstId}&processName=${processName}`;
    return this.apiSvc.post(path, taskObj);
  }

  reassignTask(
    taskId,
    user: UserModel,
    buskey,
    fromUser,
    procInstId,
    taskgroup
  ): Observable<ResponseModel<any>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    const path = `${this.bpmnUrl}tasks/${user.userid}/reassign?buskey=${buskey}&fromuser=${fromUser}&processinstanceid=${procInstId}&processName=${processName}&taskgroup=${taskgroup}`;
    return this.apiSvc.post(path, taskId);
  }

  reportDownload(
    taskId,
    type,
    viewtype,
    zoneId
  ): Observable<ResponseModel<any>> {
    let path;
    viewtype === 'task'
      ? (path = `${this.bpmnUrl}reports?type=${type}&b=false&zoneId=${zoneId}&id=${taskId}`)
      : (path = `${this.bpmnUrl}reports?type=${type}&b=true&zoneId=${zoneId}&id=${taskId}`);

    return this.apiSvc.get(path);
  }

  compareReportDownload(busKeyList, checkedCol, type): Observable<any> {
    let path = `${this.bpmnUrl}reports?type=${type}&b=true&busKeyList=${busKeyList}&attributes=${checkedCol}`;
    return this.apiSvc.getDownload(path, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  // processDocDownload(obj): Observable<ResponseModel<any>> {
  //   const path = `${this.dmsUrl}/file/zip/` + obj ;
  //   return this.apiSvc.get(path) ;
  // }
  reportDownloadZip(id: string, bk: string): Observable<ResponseModel<any>> {
    let path = id
      ? this.bpmnUrl + `reports/${id}/combined?bkey=${bk}`
      : this.bpmnUrl + `reports/contractlevel/${bk}/combined`;
    return this.apiSvc.get(path);
  }

  ofacQuestionarePost(data): Observable<ResponseModel<any>> {
    const path = `${this.dmsUrl}/process/document/ofac`;
    return this.apiSvc.post(path, data);
  }

  searchContract(obj): Observable<ResponseModel<ContractSearchResultModel[]>> {
    // obj = JSON.stringify(obj) ;
    const params = encodeURI(JSON.stringify(obj));
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    return this.apiSvc.get(
      `${this.bpmnUrl}contract/search?s=${params}&processName=${processname.name}`
    );
  }

  getAuditTrail(
    businessKey
  ): Observable<ResponseModel<ContractDetailsModel[]>> {
    return this.apiSvc.get(`${this.bpmnUrl}contract/${businessKey}/tasktrail`);
  }

  extractPDFData(formdata, url?): Observable<any> {
    if (url) {
      return this.apiSvc.post(`${url}`, formdata);
    }
    return this.apiSvc.post(`${this.uploadUrl}`, formdata);
  }

  extractDOCImgData(formdata, url?): Observable<any> {
    if (url) {
      return this.apiSvc.post(`${url}`, formdata);
    }
    return this.apiSvc.post(`${this.dmsUrl}/aadhaar/upload`, formdata);
  }

  getGroupedAuditTrail(
    businessKey
  ): Observable<ResponseModel<AuditTrailMappedModel[]>> {
    return this.apiSvc.get(
      `${this.bpmnUrl}contract/${businessKey}/tasktrail/grouped`
    );
  }

  getAllPurchaseDetails(): Observable<any> {
    return this.apiSvc.get('assets/data/dummy-po.json');
  }

  getFormlyFields(): Observable<any> {
    return this.apiSvc.get('assets/data/formly-field.json');
  }

  attachCompanySapId(businessKey, companyCode) {
    let path = `${this.bpmnUrl}companysapid/${businessKey}/${companyCode}`;
    return this.apiSvc.put(path);
  }
}

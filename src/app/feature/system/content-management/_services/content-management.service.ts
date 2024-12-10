import { ContentBodyModel, EmailTemplateModel } from './../_models/email-template.model';
import { ResponseModel } from 'src/app/core/_models';
import { environment } from './../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/_services';
import { Injectable } from '@angular/core';
import { TagType } from 'src/app/core/_models'
@Injectable()
export class ContentManagementService {
  templateUrl = environment.bpmUrl + 'metadata/forms/mailtemplates' ;
  
  constructor(private apiSvc: ApiService) { }

  onContentTemplateSubmit = (htmlstring, issubject?, callback?: Function) : ContentBodyModel => {
    if (htmlstring) {
      console.log('submitted: ', htmlstring);
      let reqdata: ContentBodyModel = { content: htmlstring, tagged: [] } ;
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
      if(issubject) {
        reqdata.subjectline = htmlDoc?.children[0]['innerText'].trim() ;
      }
      if (htmlDoc?.children[0]['innerText'].trim()) {
        let mentions = htmlDoc.getElementsByClassName("mention");
        console.log("m: ", mentions);
        for (var i = 0; i < mentions.length; i++) {
          console.log(mentions[i].id); //second console output
          if (mentions[i]['dataset'].tagtype == TagType.VARIABLE) {
            reqdata.tagged.push(mentions[i].id)
          } 
         }
        }
      return reqdata ; 
      }

    }

  addTemplate(template, id?): Observable<ResponseModel<any>> {
  return this.apiSvc.post(`${this.templateUrl}`, template) ;
  }

  getTemplates(): Observable<ResponseModel<any[]>> {
    const processName = JSON.parse(localStorage.getItem('selected-process')).name;
    return this.apiSvc.get(`${this.templateUrl}?processName=${processName}`) ;
  }

  getTemplatesbyId(id): Observable<ResponseModel<EmailTemplateModel>> {
    return this.apiSvc.get(`${this.templateUrl}/${id}`);
  }

  removeTemplate(id): Observable<ResponseModel<any>> {
    return this.apiSvc.delete(`${this.templateUrl}/${id}`);
  }

  editTemplate(data, id): Observable<ResponseModel<EmailTemplateModel>> {
    return this.apiSvc.put(`${this.templateUrl}/${id}`, data);
  }

}

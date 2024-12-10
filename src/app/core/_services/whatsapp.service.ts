import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ResponseModel } from 'src/app/core/_models';
import { environment } from 'src/environments/environment';
import { TranscriptionModel } from 'src/app/feature/process/layout/_models/transcription.model';
import { UpdateSingleSession } from 'src/app/feature/process/layout/_models';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  constructor(private apiSvc: ApiService) {}
  whatsappUrl_reca = environment.whatsappUrl_reca;
  whatsappUrl_ays = environment.whatsappUrl_ays;

  getRecruiters(): Observable<ResponseModel<any>> {
    const path = `${this.whatsappUrl_reca}/companies`;
    return this.apiSvc.get(path);
  }

  updateSingleSession(
    processInst: UpdateSingleSession
  ): Observable<ResponseModel<any>> {
    return this.apiSvc.put(`${this.whatsappUrl_reca}/session`, processInst);
  }

  updateMultipleSession(
    processInst: UpdateSingleSession[]
  ): Observable<ResponseModel<any>> {
    return this.apiSvc.put(
      `${this.whatsappUrl_reca}/session/multiple`,
      processInst
    );
  }

  postAts(data): Observable<ResponseModel<TranscriptionModel>> {
    return this.apiSvc.post(`${this.whatsappUrl_reca}/upload`, data);
  }

  singleSendMessageReca(data): Observable<ResponseModel<TranscriptionModel>> {
    return this.apiSvc.post(`${this.whatsappUrl_reca}/message/send`, data);
  }

  singleSendMessageAys(data): Observable<any> {
    return this.apiSvc.post(
      `${this.whatsappUrl_ays}messaging/send-message`,
      data
    );
  }

  bulkSendMessageReca(data) {
    const path = this.whatsappUrl_reca + `message/send/bulkManualMessage`;
    return this.apiSvc.post(path, data);
  }

  bulkSendMessageAys(data) {
    const path = this.whatsappUrl_ays + `messaging/bulk-message`;
    return this.apiSvc.post(path, data);
  }
}

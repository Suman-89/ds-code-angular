import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/_services/api.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  reportsUrl = environment.bpmUrl + 'report/all';
  reportsSaveUrl = environment.bpmUrl + 'report';
  reportsDeleteUrl = environment.bpmUrl + 'report';
  reportsGenUrl = environment.bpmUrl + 'report/export';
  reportConditions = environment.bpmUrl + `report/params?reportName=`;
  reportPreview = environment.bpmUrl + `report/preview`;
  checkRepNameAvailabliity = environment.bpmUrl + `report/exists?reportName=`;
  entireDataset = environment.bpmUrl + `reports/fill`;

  constructor(private apiSvc: ApiService) {}

  saveReport(payload): Observable<any> {
    return this.apiSvc.post(this.reportsSaveUrl, payload);
  }

  updateReport(payload, reportName) {
    return this.apiSvc.put(`${this.reportsSaveUrl}/${reportName}`, payload);
  }
  checkNameAvailability(fileName: String): Observable<any> {
    return this.apiSvc.get(`${this.checkRepNameAvailabliity}${fileName}`);
  }

  getAllReports(): Observable<any> {
    return this.apiSvc.get(this.reportsUrl);
  }

  getReport(payload): Observable<any> {
    return this.apiSvc.postDownload(this.reportsGenUrl, payload, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getReportPreview(payload): Observable<any> {
    return this.apiSvc.post(this.reportPreview, payload);
  }

  getReportCondition(reportName): Observable<any> {
    return this.apiSvc.get(this.reportConditions + reportName);
  }

  getEntireDataSet(payload) {
    return this.apiSvc.post(this.entireDataset, payload);
  }
  deleteReport(reportName) {
    return this.apiSvc.delete(
      this.reportsDeleteUrl + '?reportName=' + reportName
    );
  }
}

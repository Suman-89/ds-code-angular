import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { GridColumnModel } from '../_models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SourceLabelService {
  constructor(private apiSvc: ApiService) {}
  path = 'assets/config/source-labels/source-labels.json';

  getSourceLabels(type: string): Observable<string> {
    return this.apiSvc.get(this.path).pipe(map((a) => a[type]));
  }

  getSourceType(type: string): string {
    return this.sourceTypesForReports[type];
  }

  getTypesFromSourceTypes(reportSource: string): string {
    return this.gridTypesFromSourceTypes[reportSource];
  }

  sourceTypesForReports = {
    MYQ: 'work_list',
    GROUPQ: 'work_basket',
    ALLTASKS: 'contract_list',
    ALLPROCESS: 'all_tasks',
    process_list: 'Process List',
    process_variable: 'process_list',
    process_form: 'form_list',
    user: 'User',
    group: 'Group',
    company: 'company',
    country: 'country',
    processform: 'Form List',
    email_list: 'email_list',
  };

  gridTypesFromSourceTypes = {
    work_list: 'MYQ',
    work_basket: 'GROUPQ',
    contract_list: 'ALLTASKS',
    all_tasks: 'ALLPROCESS',
    'Process List': 'process_list',
    User: 'user',
    Group: 'group',
    Company: 'company',
    'Form List': 'processform',
  };
  //   getGroupGridColumns(): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(this.path);
  //   }

  //   getTasklistGridColumns(type: string): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(this.path).pipe(map((a) => a[type]));
  //   }

  //   getCompanyGridColumns(type): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(this.path).pipe(map((a) => a[type]));
  //   }

  //   getProcessVariableColumns(): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(
  //       'assets/config/grid-columns/process-variable-column.json'
  //     );
  //   }
  //   getProcessFormColumns(): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(
  //       'assets/config/grid-columns/process-form-column.json'
  //     );
  //   }

  //   getReportsColumns(): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(
  //       'assets/config/grid-columns/reports-grid-column.json'
  //     );
  //   }

  //   getTemplatesGridColumns(): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(
  //       './assets/config/grid-columns/template-grid-columns.json'
  //     );
  //   }

  //   getContractSearchResultColumns(): Observable<GridColumnModel[]> {
  //     return this.apiSvc.get(
  //       './assets/config/grid-columns/contract-search-grid-columns.json'
  //     );
  //   }
}

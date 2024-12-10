import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { GridColumnModel, GridToolbarType } from '../_models';
import { map, retry } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GridColumnsService {
  assetPath = '/assets/config';
  baseUrl = environment.bpmUrl;
  toolbarType = GridToolbarType;

  constructor(private apiSvc: ApiService, private sharedSvc: SharedService) {}

  getUserGridColumns(): Observable<GridColumnModel[]> {
    let path = 'assets/config/grid-columns/user-grid-column.json';
    return this.apiSvc.get(path);
  }

  getGroupGridColumns(): Observable<GridColumnModel[]> {
    let path = this.assetPath + '/grid-columns/group-grid-columns.json';
    return this.apiSvc.get(path);
  }

  getRolesGridColumns(): Observable<GridColumnModel[]> {
    let path = this.assetPath + '/grid-columns/role-grid-columns.json';
    return this.apiSvc.get(path);
  }

  getTasklistGridColumns(type: string) {
    const pathWork = `${
      this.baseUrl
    }metadata/variables/gridsettings?processname=${
      JSON.parse(this.sharedSvc.selectedProcess)?.name
    }`;
    return this.apiSvc.get(pathWork).pipe(
      map((r) =>
        r.data[0].gridsettings
          .find((grid) => grid.type == type)
          .columns.filter((column) => {
            return !column.disabled;
          })
      )
    );
  }

  getStaticGridColumns(): Observable<GridColumnModel[]> {
    const path = this.assetPath + '/grid-columns/static-grid-column.json';
    return this.apiSvc.get(path).pipe(map((a) => a));
  }

  getCompanyGridColumns(type): Observable<GridColumnModel[]> {
    const path = this.assetPath + '/grid-columns/company-grid-column.json';
    return this.apiSvc.get(path).pipe(map((a) => a[type]));
  }

  getPrescreeningGridColumns(type): Observable<GridColumnModel[]> {
    const path = this.assetPath + '/grid-columns/prescreening-grid-column.json';
    return this.apiSvc.get(path).pipe(map((a) => a[type]));
  }
  getLmsGridColumns(type): Observable<GridColumnModel[]> {
    const path = this.assetPath + '/grid-columns/lms-grid-column.json';
    return this.apiSvc.get(path).pipe(map((a) => a[type]));
  }

  getProcessVariableColumns(): Observable<GridColumnModel[]> {
    return this.apiSvc.get(
      this.assetPath + '/grid-columns/process-variable-column.json'
    );
  }
  getProcessFormColumns(type): Observable<GridColumnModel[]> {
    const path = this.assetPath + '/grid-columns/process-form-column.json';
    return this.apiSvc.get(path).pipe(map((a) => a[type]));
  }
  getProcessDefinitionColumns(type): Observable<GridColumnModel[]> {
    const path = this.assetPath + '/grid-columns/process-form-column.json';
    return this.apiSvc.get(path).pipe(map((a) => a[type]));
  }
  getKeywordsColumns(type): Observable<GridColumnModel[]> {
    const path = this.assetPath + '/grid-columns/process-form-column.json';
    return this.apiSvc.get(path).pipe(map((a) => a[type]));
  }

  getReportsColumns(): Observable<GridColumnModel[]> {
    return this.apiSvc.get(
      'assets/config/grid-columns/reports-grid-column.json'
    );
  }

  getTemplatesGridColumns(): Observable<GridColumnModel[]> {
    return this.apiSvc.get(
      this.assetPath + '/grid-columns/template-grid-columns.json'
    );
  }

  getContractSearchResultColumns(): Observable<GridColumnModel[]> {
    return this.apiSvc.get(
      this.assetPath + '/grid-columns/contract-search-grid-columns.json'
    );
  }

  commonCols() {
    return {
      MYQ: [
        {
          text: 'Last Updated Date',
          filtertype: 'date',
          datafield: 'created',
          minwidth: '100px',
          cellsformat: 'dd-MMM-yyyy',
        },
        {
          text: 'Task Name',
          filtertype: 'input',
          datafield: 'name',
          minwidth: '120px',
          cellsformat: '',
        },
        {
          text: 'Group',
          filtertype: 'input',
          datafield: 'groupname',
          minwidth: '120px',
          cellsformat: '',
        },
      ],
      GROUPQ: [
        {
          text: 'Last Updated Date',
          filtertype: 'date',
          datafield: 'created',
          minwidth: '100px',
          cellsformat: 'dd-MMM-yyyy',
        },
        {
          text: 'Task Name',
          filtertype: 'input',
          datafield: 'name',
          minwidth: '120px',
          cellsformat: '',
        },
        {
          text: 'Group',
          filtertype: 'input',
          datafield: 'groupname',
          minwidth: '120px',
          cellsformat: '',
        },
      ],

      ALLTASKS: [
        {
          text: 'Overall Status',
          filtertype: 'checkedlist',
          datafield: 'overallStats',
          minwidth: '120px',
          cellsformat: '',
        },
        {
          text: 'Contract Completion Time',
          datafield: 'completiondatetime',
          filtertype: 'range',
          cellsformat: 'dd-MMM-yyyy HH:mm:ss',
          width: '15%',
        },
        {
          text: 'Contract Elapsed Time (Days)',
          filtertype: 'input',
          datafield: 'elapseddays',
          minwidth: '120px',
          cellsalign: 'center',
          cellsformat: 'f2',
        },
        {
          text: 'Contract Elapsed Time (Hours)',
          filtertype: 'input',
          datafield: 'elapsedhour',
          minwidth: '120px',
          cellsalign: 'center',
          cellsformat: 'f2',
        },
      ],
      ALLPROCESS: [
        {
          text: 'User',
          filtertype: 'input',
          datafield: 'assignee',
          minwidth: '120px',
          cellsformat: '',
        },
        {
          text: 'Task Elapsed Time (Hours)',
          filtertype: 'input',
          datafield: 'elapsedhour',
          minwidth: '120px',
          cellsalign: 'center',
          cellsformat: 'f2',
        },
        {
          text: 'Task Elapsed Time (Days)',
          filtertype: 'input',
          datafield: 'elapseddays',
          minwidth: '120px',
          cellsalign: 'center',
          cellsformat: 'f2',
        },
        {
          text: 'Start Time',
          filtertype: 'range',
          datafield: 'starttime',
          minwidth: '120px',
          cellsformat: 'dd-MMM-yyyy HH:mm:ss',
        },
        {
          text: 'End Time',
          filtertype: 'range',
          datafield: 'endtime',
          minwidth: '120px',
          cellsformat: 'dd-MMM-yyyy HH:mm:ss',
        },
        {
          text: 'Contract Elapsed Time (Days)',
          datafield: 'contractelapsedtime',
          width: 'auto',
          cellsformat: 'd2',
        },
        {
          text: 'Task Status',
          filtertype: 'checkedlist',
          datafield: 'taskstatus',
          minwidth: '120px',
          cellsformat: '',
        },
        {
          text: 'Overall status',
          filtertype: 'checkedlist',
          datafield: 'overallStats',
          minwidth: '120px',
          cellsformat: '',
        },
        {
          text: 'Group',
          filtertype: 'input',
          datafield: 'groupname',
          minwidth: '120px',
          cellsformat: '',
        },
        {
          text: 'Task Name',
          filtertype: 'input',
          datafield: 'taskname',
          minwidth: '120px',
          cellsformat: '',
        },
      ],
    };
  }

  getColumns(type: string): Observable<any> {
    switch (type) {
      case this.toolbarType.worklist:
        return this.getTasklistGridColumns(type);
      case this.toolbarType.workbasket:
        return this.getTasklistGridColumns(type);
      case this.toolbarType.contractlist:
        return this.getTasklistGridColumns(type);
      case this.toolbarType.comments:
        return this.getTasklistGridColumns(type);
      case this.toolbarType.user:
        return this.getUserGridColumns();
      case this.toolbarType.group:
        // this.getGroupGridColumns();
        break;
      case this.toolbarType.company:
        return this.getCompanyGridColumns(type);
      case this.toolbarType.country:
        return this.getCompanyGridColumns(type);
      case this.toolbarType.prescreening:
        return this.getPrescreeningGridColumns(type);
      case this.toolbarType.processvariable:
        return this.getProcessVariableColumns();
      case this.toolbarType.processform:
        return this.getProcessFormColumns(type);
      case this.toolbarType.reports:
        return this.getReportsColumns();
      case this.toolbarType.contentmanagement:
        return this.getTemplatesGridColumns();
      case this.toolbarType.alltasks:
        return this.getContractSearchResultColumns();
      default:
        break;
    }
  }
}

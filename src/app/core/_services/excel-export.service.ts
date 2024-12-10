import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { promise } from 'protractor';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { GridToolbarType } from '../_models';
import { ApiService } from './api.service';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  url = environment.dmsUrl;
  env = environment;
  constructor(private apiSvc: ApiService) {}

  public exportAsExcelFile(excelFileName: string, rowData): void {
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rowData);
    const myworkbook: XLSX.WorkBook = {
      Sheets: { data: myworksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(myworkbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_exported' + EXCEL_EXTENSION);
  }

  export(payload): Observable<any> {
    let path = this.setExcelPath(payload.source);
    return this.apiSvc.postDownload(path, payload, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  setExcelPath(source) {
    switch (source) {
      case GridToolbarType.user:
      case 'User':
        return `${this.env.userManagementApiUrl}users/reports`;
      case GridToolbarType.company:
        return `${this.env.dataUrl}companies/reports`;
      case GridToolbarType.worklist:
        return `${this.env.bpmUrl}reports`;
      case GridToolbarType.workbasket:
        return `${this.env.bpmUrl}reports`;
      // case GridToolbarType.processform:
      // return `${this.env.bpmUrl}form_list/reports`  ;
      // case GridToolbarType.processvariable:
      // return `${this.env.bpmUrl}process_list/reports`  ;
      // case GridToolbarType.contentmanagement:
      // return `${this.env.bpmUrl}email_list/reports`  ;
      case GridToolbarType.country:
        return `${this.env.referenceDataUrl}refdata/countries/reports`;
      default:
        return `${this.env.bpmUrl}reports`;
    }
  }

  getJsonFromXlsx(e): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      var file = e.target.files[0];

      var reader = new FileReader();
      reader.onload = function (e) {
        /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
        var workbook = XLSX.read(e.target.result);
        var jsa = XLSX.utils.sheet_to_json(
          workbook.Sheets[Object.keys(workbook.Sheets)[0]]
        );
        observer.next({ name: file.name, file: jsa });
        observer.complete();
      };
      reader.readAsArrayBuffer(file);
    });
  }
}

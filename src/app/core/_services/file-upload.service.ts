import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  progress$: BehaviorSubject<number> = new BehaviorSubject(0);
  files: BehaviorSubject<File[]> = new BehaviorSubject([]);

  constructor(private apiSvc: ApiService) {}

  uploadFile(files): void {
    this.files.next(files);

    let form = new FormData();
    form.append('DOC', files);

    let path = 'http://localhost:3000/files';
    let params = new HttpHeaders();
    params = params.set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MiwiRlVMTE5BTUUiOiJZVkMgQWRtaW4iLCJFTUFJTF9BRERSRVNTIjoiYWRtaW5AeXZjLmNvbSIsIkFERFJFU1MxIjpudWxsLCJBRERSRVNTMiI6bnVsbCwiREVTQ1JJUFRJT04iOm51bGwsIkxPR08iOm51bGwsIkVOVElUWV9JRCI6MiwiUk9MRSI6IkFETUlOIiwiRU5USVRZX05BTUUiOiJZVkMiLCJFTlRJVFlfRVRIX0FERFJFU1MiOiIweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJFTlRJVFlfU1RBVEUiOiJPUEVOIiwiRU5USVRZX0VNQUlMIjoiaW5mb0B5dmMuY29tIiwiRU5USVRZX1NUQVRVUyI6IlZFUklGSUVEIiwiRU5USVRZX1RZUEUiOiJDT01QQU5ZIiwiQXNzZXRUb2tlblN0YXR1cyI6Ik5PTkUiLCJpYXQiOjE1OTE4NTMyMzQsImV4cCI6MTU5MTkzOTYzNH0.JadO_l5_vBcb-35nActdoSXlcvi8ObeTr_pfmkeU6dc'
    );

    this.apiSvc.post(path, form, params).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          this.progress$.next(Math.round((event.loaded / event.total) * 100));
          break;

        case HttpEventType.Response:
          setTimeout(() => {
            this.progress$.next(0);
          }, 1500);
          break;
      }
    });
  }

  getAllDocCategory(processName?: string) {
    if (processName) {
      return this.apiSvc.get(
        `${environment.dmsUrl}/folders/types?name=${processName}`
      );
    }
    return this.apiSvc.get(`${environment.dmsUrl}/folders/types`);
  }

  uploadDocument(data) {
    return this.apiSvc.post(`${environment.dmsUrl}/process/document`, data);
  }

  uploadAsset(data, processName) {
    return this.apiSvc.post(
      `${environment.dmsUrl}/logo?processName=${processName}`,
      data
    );
  }
  uploadCustomIcons(data) {
    return this.apiSvc.post(`${environment.dmsUrl}/icon`, data);
  }
}

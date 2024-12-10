import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(
    path: string,
    headers: HttpHeaders = new HttpHeaders(),
    params?: HttpParams
  ): Observable<any> {
    return this.http.get(path, {
      headers: headers,
      params: params,
    }) as Observable<any>;
  }

  put(
    path: string,
    body?: any,
    params: HttpHeaders = new HttpHeaders()
  ): Observable<any> {
    return this.http.put(path, body, { headers: params }) as Observable<any>;
  }

  post(
    path: string,
    body: any,
    params: HttpHeaders = new HttpHeaders()
  ): Observable<any> {
    return this.http.post(path, body, { headers: params }) as Observable<any>;
  }

  delete(
    path: string,
    params: HttpHeaders = new HttpHeaders()
  ): Observable<any> {
    return this.http.delete(path, { headers: params }) as Observable<any>;
  }

  download(path: string, options): Observable<any> {
    return this.http.get(path, options) as Observable<any>;
  }
  postDownload(path: string, body, options): Observable<any> {
    return this.http.post(path, body, options) as Observable<any>;
  }
  getDownload(path: string, options): Observable<any> {
    return this.http.get(path, options) as Observable<any>;
  }
}

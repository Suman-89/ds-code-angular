import { CountryModel } from './../_models/country.model';
import { environment } from './../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { SidenavModel } from '../_models/sidenav.model';
import {
  AddressType,
  ProcessVariableModel,
  ToolbarButtonModel,
} from '../_models';
import { ResponseModel } from '../_models';
import { filter, map } from 'rxjs/operators';
import { UserService } from './user.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  refdataUrl = environment.referenceDataUrl;
  masterdataUrl = environment.referenceDataUrl + 'refdata/';
  dmsUrl = environment.dmsUrl;
  bpmUrl = environment.bpmUrl;
  dmsLink = environment.dmslink;
  zohoLink = environment.zohoUrl;
  notificationLink = environment.notificationUrl;
  groups$ = new BehaviorSubject<any[]>([]);
  logoUrl = environment.logoUrl;
  responsiveLogoChange: boolean = false;
  allUsers = [];
  allGroups = [];
  dynamicThemeUrls: BehaviorSubject<{
    logoUrl: string;
    loginLogoUrl: string;
    faviconUrl: string;
    workflowOverlayTitle: string;
  }> = new BehaviorSubject({
    logoUrl: '',
    loginLogoUrl: '',
    faviconUrl: '',
    workflowOverlayTitle: '',
  });

  // loginLogoUrl = environment.loginLogoUrl;
  allProcessData;
  selectedProcess;
  countryList$ = new BehaviorSubject<CountryModel[]>(null);
  feedbackVars = new BehaviorSubject(null);
  constructor(private apiSvc: ApiService, private userSvc: UserService) {}

  getGroups(): void {
    this.userSvc.getUserGroups().subscribe((a) => {
      if (a.status) {
        this.groups$.next(a.data);
      }
    });
  }

  getThemes() {
    let path = this.bpmUrl + 'metadata/variables/project/themes';
    return this.apiSvc.get(path).pipe(
      map((a) => {
        return a.data;
      })
    );
  }

  getCountries() {
    // if ( this.countryList.length === 0) {
    this.getCountryOnInit().subscribe((r) => {
      if (r.status) {
        this.countryList$.next(r.data);
        // return this.countryList$ ;
      }
    });
  }

  getFeedbackVars(): Observable<ResponseModel<ProcessVariableModel[]>> {
    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    )?.name;
    return this.apiSvc.get(
      this.bpmUrl + `metadata/variables?processName=${processName}`
    );
  }

  uploadCsv(data): Observable<ResponseModel<ProcessVariableModel[]>> {
    let path = `${this.bpmUrl}process/start/readcsv`;
    return this.apiSvc.post(path, data);
  }
  getCountryOnInit(): Observable<ResponseModel<CountryModel[]>> {
    const path = this.masterdataUrl + 'countries';
    return this.apiSvc.get(path);
  }
  getAllProcessDefinintion() {
    return this.apiSvc.get(`${this.bpmUrl}processes/initiation/all`);
  }

  getStates(countryid): Observable<ResponseModel<any>> {
    const path = this.masterdataUrl + 'countries' + '/' + countryid + '/states';
    return this.apiSvc.get(path);
  }

  getZohoData(candidateFilteredField, candidateFilteredList) {
    const path =
      this.zohoLink +
      `candidates?candidateFilteredField=${candidateFilteredField}&candidateFilterList=${candidateFilteredList}`;
    return this.apiSvc.get(path);
  }

  updateZohoData(refToken) {
    const path = this.zohoLink + `update/candidates?refToken=${refToken}`;
    return this.apiSvc.put(path);
  }

  updateZohoStatus(status_id, flag) {
    const path =
      this.zohoLink +
      `update/candidates/status?status=${status_id}&flag=${flag}`;
    return this.apiSvc.put(path);
  }

  sendNotification(data) {
    const path = this.notificationLink;
    return this.apiSvc.post(path, data);
  }

  getNewSideNav(type): Observable<SidenavModel[]> {
    const path = 'assets/config/common/sidenav.json';
    return this.apiSvc.get(path).pipe(map((a) => a[type]));
  }

  getSideNav(): Observable<SidenavModel[]> {
    const pathWork = `${this.bpmUrl}metadata/variables/processes/defination/all`;
    let selProc = JSON.parse(localStorage.getItem('selected-process'));
    return this.apiSvc.get(pathWork).pipe(
      map((a) => {
        const allProcess = a.data;
        this.allProcessData = allProcess;
        // console.log("CALLED AGAIN????",this.allProcessData)
        if (!selProc?.name) {
          localStorage.setItem(
            'selected-process',
            JSON.stringify({
              businessKeyPrefix: allProcess[0].prefix,
              key: allProcess[0].processkey,
              label: allProcess[0].processlabel,
              name: allProcess[0].processname,
              sidenavsuffix: allProcess[0].processkey,
            })
          );
          selProc = JSON.parse(localStorage.getItem('selected-process'));
        }
        try {
          let contractLabels = a.data.find(
            (process) => process.processname == selProc?.name
          )?.processDef.sideNavItemList[0]?.itemChildren;
          let contractLabelsMap = {};
          contractLabels.forEach((each) => {
            let navId = each.itemId;
            navId
              ? (contractLabelsMap[each.itemId] = each.itemName)
              : (contractLabelsMap['myqueue'] = each.itemName);
          });
          localStorage.setItem(
            'process-labels',
            JSON.stringify(contractLabelsMap)
          );
        } catch (e) {
          console.log(e);
        }
        return a.data.find((process) => process.processname == selProc?.name)
          .processDef.sideNavItemList;
      })
    );
  }

  getWorkflowTypeMaps() {
    const pathWork = `${this.bpmUrl}metadata/variables/processes/defination/all`;
    return this.apiSvc.get(pathWork).pipe(
      map((a) => {
        return a.data;
      })
    );
  }

  getToolbarButtons(type: string): Observable<ToolbarButtonModel[]> {
    if (type === 'group' || type === 'role') {
      const path = 'assets/config/common/groups-roles-buttons.json';
      return this.apiSvc.get(path).pipe(map((a) => a[type]));
    }

    const pathWork = `${this.bpmUrl}metadata/variables/processes/defination/all`;
    return this.apiSvc.get(pathWork).pipe(
      map((a) => {
        return a.data.find((process) => {
          return process.processname == JSON.parse(this.selectedProcess)?.name;
        }).processDef.toolBarButtons[type];
      })
    );
  }

  getProcDefbyName(name): Observable<ResponseModel<any>> {
    return this.apiSvc.get(
      `${this.bpmUrl}metadata/variables/processes/defination?processname=${name}`
    );
  }

  preScreeingProcessCheck(data: any): Observable<any> {
    const path = `${this.bpmUrl}contract/combinations/variables`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('combinationList', data);
    return this.apiSvc.get(path, new HttpHeaders(), queryParams);
  }

  getToolbarButtonsTypes(): Observable<ToolbarButtonModel[]> {
    const path = 'assets/config/common/toolbar-buttons.json';
    return this.apiSvc.get(path).pipe(map((a) => a['toolbar_button_types']));
  }
  getToolbarButtonsAll(): Observable<ToolbarButtonModel[]> {
    const path = 'assets/config/common/toolbar-buttons.json';
    return this.apiSvc.get(path).pipe(map((a) => a));
  }

  downloadDoc(contentId: string): Observable<any> {
    const path = `${this.dmsUrl}/file/${contentId}`;
    return this.apiSvc.download(path, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getAllIcons() {
    let path = 'assets/config/common/iconsList.json';
    return this.apiSvc.get(path);
  }
  getCustomIcons() {
    let path = `${this.dmsUrl}/icon/all`;
    return this.apiSvc.get(path);
  }

  secondsToHms(d) {
    d = Math.abs(Number(d));

    let day = Math.floor(d / (24 * 3600));
    let dayString;
    day < 10 ? (dayString = '0' + day) : (dayString = day.toString());
    const h = Math.floor((d % (24 * 3600)) / 3600);
    const m = Math.floor(((d % (24 * 3600)) % 3600) / 60);
    const s = Math.floor(((d % (24 * 3600)) % 3600) % 60);

    return (
      dayString +
      ' days ' +
      ('0' + h).slice(-2) +
      ' hours ' +
      ('0' + m).slice(-2) +
      ' mins ' +
      ('0' + s).slice(-2) +
      ' secs'
    );
  }

  secondsToHour(d) {
    d = Math.abs(Number(d));
    return d / 3600;
  }

  secondsToDays(d) {
    d = Math.abs(Number(d));
    return d / (24 * 3600);
  }
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : null;
  }
  notificationIconType(type) {
    switch (type) {
      case 'ContractTerminate':
        return 'fa fa-ban';
      case 'ContractComplete':
        return 'fa fa-check-square';
      case 'TaskAssignment':
        return 'fa fa-tasks';
      case 'TaskPulled':
        return 'fa fa-tasks';
      case 'TaskReturned':
        return 'fa fa-tasks';
      case 'Comment':
        return 'fa fa-comment';
      default:
        return 'fa fa-tasks';
    }
  }

  returnAddressType(data) {
    if (data === AddressType.PRINCIPAL) {
      return 'PRINCIPAL';
    } else {
      return 'REGISTERED';
    }
  }

  returnFlags(flag) {
    if (flag === null) {
      return {
        mobilemsa: null,
        voicemsa: null,
        smsmsa: null,
        iotmsa: null,
        nda: null,
        ndaiot: null,
      };
    } else {
      return flag;
    }
  }

  replaceString(str) {
    let re = /initiation /gi;
    switch (str) {
      case 'Process_initiation_impl':
        return 'Contract';
      case 'Initiation_hrTicketProcess':
        return 'HR Tickets';
      case 'Process_1vj7von':
        return 'Leave Approval';
      case 'Initiation_CreditRiskProcess':
        return 'Credit Risk';
      case 'Process_initiation_taiho':
        return 'Invoice(AP)';
      case 'process_intitate_id_generation':
        return 'ID Generation';
      case 'Process_initiation_dispute':
        return 'Dispute Process';
      case 'Initiation_TicketProcess':
        return 'WN Ticket Process';
      default:
        return str.replace(re, '');
    }
  }
}

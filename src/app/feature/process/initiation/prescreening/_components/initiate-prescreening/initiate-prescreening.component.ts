import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  CompanyManagementService,
  ExcelExportService,
  SharedService,
  WhatsappService,
} from 'src/app/core/_services';
import { TaskInfoService } from './../../../../layout/_services/task-info.service';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  Subject,
  Subscription,
  BehaviorSubject,
  combineLatest,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { utils } from 'xlsx';

@Component({
  selector: 'app-initiate-prescreening',
  templateUrl: './initiate-prescreening.component.html',
  styleUrls: ['./initiate-prescreening.component.scss'],
})
export class InitiatePrescreeningComponent implements OnInit {
  constructor(
    private excelSvc: ExcelExportService,
    private taskInfoSvc: TaskInfoService,
    private toastSvc: ToastrService,
    private companySvc: CompanyManagementService,
    private sharedApiSvc: SharedService,
    private whatsappSvc: WhatsappService
  ) {}
  showHiringCompany: boolean = false;
  showRole: boolean = false;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));

  validatePhoneNumberRegex = /^91[6-9]\d{9}$/; //olny for indian number
  // validatePhoneNumberRegex =
  //   /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  @Output() excelEmit = new EventEmitter();

  hiringCompForm: string;

  tmpArr = [];
  mobileNumberArr = [];
  excelData;
  ev;
  submitBtnDisabler: boolean = false;
  questionsFileUploaded: boolean = false;
  focusHiringCompanyType$ = new Subject<string>();
  focusSelectRole$ = new Subject<string>();
  selectedHiringCompany: any = null;
  selectedRole: any = null;
  count = 0;
  wsSenderNumber;
  atsFile;
  questionsFile;
  hiringCompanyTypes = [];
  roleTypes = [];
  movies: any[] = [];
  recruitingCompany;
  hiringListArrFn = () =>
    this.focusHiringCompanyType$.pipe(map(() => this.hiringCompanyTypes));
  selectRoleFn = () => this.focusSelectRole$.pipe(map(() => this.roleTypes));
  myList: any = [];
  allReason: string[][] = [];
  // pairObj: any = {};
  atsData;
  roleObs = new BehaviorSubject<any>(null);
  fileInputObs = new BehaviorSubject<any>(null);
  questionsObs = new BehaviorSubject<any>(null);

  ngOnInit(): void {
    // ========= combineLatest ==============
    combineLatest(this.roleObs, this.fileInputObs, this.questionsObs).subscribe(
      ([a, b, c]) => {
        // console.log(a, b, c, 'reeeeeeeeeeeeeeeeeeeeeeeees');
        if (b) {
          this.atsDataValidate();
        }
      }
    );
  }

  questionsObserver(e) {
    this.questionsObs.next(e);
  }

  roleObserver(e) {
    this.roleObs.next(e);
  }

  isQuesFile: any;

  handleQuestionsFileUpload(ev) {
    const filename = ev.target.files[0].name;
    this.isQuesFile = filename;
    this.excelSvc.getJsonFromXlsx(ev).subscribe(({ name, file: data }) => {
      let jsonToExcel = utils.json_to_sheet(data);
      let excelToCsv = utils.sheet_to_csv(jsonToExcel, {
        rawNumbers: true,
      });
      // console.log('excel', excelToCsv);

      window.URL = window.webkitURL || window.URL;

      this.questionsFile = new File([excelToCsv], name);

      // if (data && data.length > 0) {
      //   this.atsData = data;
      // }
      if (data) {
        this.questionsFileUploaded = true;
        this.questionsObserver(ev);
      }
    });
  }

  isFile: any;

  handleFileUpload(ev) {
    this.ev = ev;
    const filename = ev.target.files[0].name;
    this.isFile = filename;
    this.excelSvc.getJsonFromXlsx(ev).subscribe(({ name, file: data }) => {
      let jsonToExcel = utils.json_to_sheet(data);
      let excelToCsv = utils.sheet_to_csv(jsonToExcel, {
        rawNumbers: true,
      });
      // console.log('excel', excelToCsv);

      window.URL = window.webkitURL || window.URL;

      this.atsFile = new File([excelToCsv], name);

      if (data && data.length > 0) {
        this.atsData = data;
        this.atsDataValidate();
        this.fileInputObs.next(ev);
      }
    });
  }

  pullData() {
    let candidateFilteredList = 'New,Not Contacted,Attempted to Contact';
    let candidateFilteredField = 'Candidate_Status';
    this.sharedApiSvc
      .getZohoData(candidateFilteredField, candidateFilteredList)
      .subscribe((data) => {
        console.log('DDDDDDDDDDDDDDDDDDDDDDD', data);

        if (data && data.length > 0) {
          let status = 'Pulled into RecA';
          let flag = '1';
          this.sharedApiSvc.updateZohoStatus(status, flag).subscribe((res) => {
            console.log(res);
          });
          let zohoDataArray = [];
          data.forEach((x) => {
            let temObj = {};
            if (x['id']) {
              temObj['zoho_id'] = x['id'];
            }
            if (x['First_Name']) {
              temObj['Candidate First Name'] = x['First_Name'];
            }
            if (x['Last_Name']) {
              temObj['Candidate Last Name'] = x['Last_Name'];
            }
            if (x['Full_Name']) {
              temObj['Candidate Name'] = x['Full_Name'];
            }
            if (x['Mobile']) {
              temObj['Candidate Mobile Number'] = x['Mobile'];
            }
            if (x['Source']) {
              temObj['Candidate Source'] = x['Source'];
            }
            if (x['Email']) {
              temObj['Candidate Email'] = x['Email'];
            }
            zohoDataArray.push(temObj);
          });

          // console.log('zohoDataArray', zohoDataArray);

          if (zohoDataArray && zohoDataArray.length > 0) {
            let jsonToExcel = utils.json_to_sheet(zohoDataArray);
            let excelToCsv = utils.sheet_to_csv(jsonToExcel, {
              rawNumbers: true,
            });
            // console.log('excel', excelToCsv);

            window.URL = window.webkitURL || window.URL;

            this.atsFile = new File([excelToCsv], 'ats.xlsx');
            this.atsData = zohoDataArray;
            this.atsDataValidate();
            this.fileInputObs.next(data);
          }
        }
      });
  }

  atsDataValidate() {
    this.submitBtnDisabler = false;
    for (let sigleAtsdata of this.atsData) {
      this.mobileNumberArr.push(sigleAtsdata['Candidate Mobile Number']);
    }

    for (let sigleAtsdata of this.atsData) {
      let reasonArr = [];
      if (sigleAtsdata['Candidate Source']?.length <= 0) {
        reasonArr.push('Invalid Source');
      }

      if (sigleAtsdata['Candidate Name']?.length <= 0) {
        reasonArr.push('Invalid Name');
      }

      if (
        this.validatePhoneNumberRegex.test(
          sigleAtsdata['Candidate Mobile Number']
        ) === false
      ) {
        reasonArr.push('Invalid Phone Number');
      } else {
        if (!this.questionsFileUploaded) {
          this.submitBtnDisabler = true;
        }
        if (
          this.selectedHiringCompany.phoneNumber &&
          this.validatePhoneNumberRegex.test(
            this.selectedHiringCompany.phoneNumber
          )
        ) {
          let mobileNumObject: any = {};
          mobileNumObject.psWaSenderNumber =
            this.selectedHiringCompany.phoneNumber;
          mobileNumObject.psCandidateMobile =
            sigleAtsdata['Candidate Mobile Number'].toString();
          this.myList.push(mobileNumObject);
        }
      }

      let count = this.mobileNumberCounter(
        this.mobileNumberArr,
        sigleAtsdata['Candidate Mobile Number']
      );
      if (count > 1) {
        reasonArr.push(
          `Duplicate Phone Numbers Found: ${sigleAtsdata['Candidate Mobile Number']}`
        );
      }
      if (reasonArr.length > 0) {
        this.submitBtnDisabler = true;
      }
      sigleAtsdata.Reason = reasonArr;

      if (reasonArr.length > 0) {
        this.allReason.push(reasonArr);
      }
    }
    // console.log(this.atsData);

    this.mobileNumberArr = [];

    if (this.myList.length > 0 && this.allReason.length === 0) {
      this.prescreeningProcessCheck();
      this.myList = [];
    } else {
      this.excelData = this.atsData;
      this.excelEmit.emit(this.atsData);
      this.myList = [];
    }
  }

  mobileNumberCounter(arr, number) {
    return arr.filter((a) => a === number).length;
  }

  prescreeningProcessCheck() {
    this.sharedApiSvc
      .preScreeingProcessCheck(JSON.stringify(this.myList))
      .subscribe((p) => {
        // console.log('Animesh response', p);
        const businessKeyPrefix = this.selectedProcess.businessKeyPrefix;
        let pairObj = {};
        if (p.status) {
          let ObjData = p.data.filter((x) => {
            let busKey = x.businessKey.split('-')[0];
            return busKey === businessKeyPrefix;
          });
          for (let x of ObjData) {
            if (
              pairObj[`${x.psWaSenderNumber}_${x.psCandidateMobile}`] == null
            ) {
              pairObj[`${x.psWaSenderNumber}_${x.psCandidateMobile}`] = [];
              pairObj[`${x.psWaSenderNumber}_${x.psCandidateMobile}`].push(x);
            } else {
              pairObj[`${x.psWaSenderNumber}_${x.psCandidateMobile}`].push(x);
            }
          }
          // console.log('new object', pairObj);
          for (let x of this.atsData) {
            let pairKey = `${this.selectedHiringCompany.phoneNumber}_${x['Candidate Mobile Number']}`;
            if (pairObj[pairKey]) {
              x.Cases = pairObj[pairKey];
            } else {
              x.Cases = [];
            }
          }
          for (let x of ObjData) {
            if (x.isInProgress === true && x.isTerminated === false) {
              this.submitBtnDisabler = true;
              break;
            }
          }
          // console.log('upadated object', this.atsData);
          this.excelData = this.atsData;
          //let newAtsData = Object.assign({}, this.atsData); //so that we can create a new obj everytime(method 1)
          let newAtsData = { ...this.atsData }; //so that we can create a new obj everytime(method 2)
          this.excelEmit.emit(newAtsData);
        }
      });
  }

  selectRecruiter(e) {
    if (e.name.toLowerCase().length > 0) {
      this.showHiringCompany = true;
      this.recruitingCompany = e;
      this.getHiringCompanies();
      this.hiringCompForm = '';
      this.selectedRole = '';
      this.showRole = false;
    }
  }

  submitData() {
    //Animesh work start
    let formdata = new FormData();
    formdata.append('ats', this.atsFile);
    formdata.append('questions', this.questionsFile);
    formdata.append('Recruiting Company Name', this.recruitingCompany.name);
    formdata.append('Hiring Company Name', this.selectedHiringCompany.name);
    formdata.append('Job Position', this.selectedRole.role);
    this.whatsappSvc.postAts(formdata).subscribe((p) => {
      // console.log('ats upload', p);
      if (p.status) {
        this.toastSvc.success(p.message);
        let status = 'Contacted in RecA';
        let flag = '2';
        this.sharedApiSvc.updateZohoStatus(status, flag).subscribe((res) => {
          console.log(res);
        });
        //time out fn is used so that the user can see the success message before reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });

    // Animesh work end
  }

  //to get the selected hiring company
  selectHiringCompany(e): void {
    e = e.item;
    this.selectedHiringCompany = e;
    this.showRole = true;
    // console.log('hiringCompany', this.selectedHiringCompany);
    this.getRoles();
    this.selectedRole = '';
  }

  // to get the selected Role
  selectRole(e): void {
    e = e.item;
    this.selectedRole = e;
    // console.log('selected ROLE', this.selectedRole);
  }

  searchHiringCompany = (x) => x.name; // for searching Hiring Companies
  searchRoles = (x) => x.role; // for searching roles

  // getContractTypes(): void {
  //   this.hiringCompanyTypes ;
  // }
  getHiringCompanies(): void {
    this.whatsappSvc.getRecruiters().subscribe((a) => {
      let recruiter = a.data.find(
        (comp) => comp.name === this.recruitingCompany.name
      );
      let hiringComapanyList = recruiter?.clients.map((comp) => ({
        id: comp.name,
        name: comp.name,
        phoneNumber: comp.phone_number,
        job_desc: comp.Job_Descriptions,
      }));
      this.hiringCompanyTypes = hiringComapanyList;
      // console.log(this.hiringCompanyTypes);
      // console.log('this.hiringCompanies', this.hiringCompanyTypes);
    });
  }

  getRoles(): void {
    let rolesList = this.selectedHiringCompany?.job_desc.map((role) => ({
      role: role.role,
    }));
    this.roleTypes = rolesList;
  }
}

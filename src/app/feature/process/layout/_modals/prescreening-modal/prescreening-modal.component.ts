import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  Subject,
  Subscription,
  BehaviorSubject,
  combineLatest,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { WhatsappService } from 'src/app/core/_services';
import { utils } from 'xlsx';

@Component({
  selector: 'app-prescreening-modal',
  templateUrl: './prescreening-modal.component.html',
  styleUrls: ['./prescreening-modal.component.scss'],
})
export class PrescreeningModalComponent implements OnInit {
  @Input() rows;
  constructor(
    private activeModal: NgbActiveModal,
    private whatsappSvc: WhatsappService
  ) {}
  atsFile;
  showHiringCompany: boolean = false;
  hiringCompForm: string;
  recruitingCompany;
  selectedHiringCompany: any = null;
  selectedRole: any = null;
  hiringCompanyTypes = [];
  buttonDisabler: boolean = true;
  roleTypes = [];
  showRole: boolean = false;
  focusHiringCompanyType$ = new Subject<string>();
  focusSelectRole$ = new Subject<string>();
  hiringListArrFn = () =>
    this.focusHiringCompanyType$.pipe(map(() => this.hiringCompanyTypes));
  selectRoleFn = () => this.focusSelectRole$.pipe(map(() => this.roleTypes));
  roleObs = new BehaviorSubject<any>(null);

  ngOnInit(): void {
    // ========= combineLatest ==============
    combineLatest(this.roleObs).subscribe(([a]) => {
      // console.log(a, b, c, 'reeeeeeeeeeeeeeeeeeeeeeeees');
    });
    this.creatAts(this.rows);
  }

  roleObserver(e) {
    this.roleObs.next(e);
  }
  selectRecruiter(e) {
    if (e.name.toLowerCase().length > 0) {
      this.showHiringCompany = true;
      this.recruitingCompany = e;
      this.getHiringCompanies();
      this.hiringCompForm = '';
      this.selectedRole = '';
      this.showRole = false;
      if (this.selectedRole.role?.length > 0) {
        this.buttonDisabler = false;
      } else {
        this.buttonDisabler = true;
      }
    }
  }

  close() {
    this.activeModal.close();
  }

  startprescreening() {
    this.close();
  }

  searchHiringCompany = (x) => x.name;
  searchRoles = (x) => x.role; // for searching roles

  selectHiringCompany(e): void {
    e = e.item;
    this.selectedHiringCompany = e;
    this.showRole = true;
    console.log('hiringCompany', this.selectedHiringCompany);
    this.getRoles();
    this.selectedRole = '';
    if (this.selectedRole.role?.length > 0) {
      this.buttonDisabler = false;
    } else {
      this.buttonDisabler = true;
    }
  }
  selectRole(e): void {
    e = e.item;
    this.selectedRole = e;
    if (this.selectedRole.role.length > 0) {
      this.buttonDisabler = false;
    } else {
      this.buttonDisabler = true;
    }
    console.log('selected ROLE', this.selectedRole);
  }

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

  creatAts(rows): void {
    if (rows.length > 0) {
      let candidateArray = [];
      rows.map((x) => {
        let temObj = {};
        if (x['psCandidateFirstName']) {
          temObj['Candidate First Name'] = x['psCandidateFirstName'];
        }
        if (x['psCandidateLastName']) {
          temObj['Candidate Last Name'] = x['psCandidateLastName'];
        }
        if (x['psCandidateName']) {
          temObj['Candidate Name'] = x['psCandidateName'];
        }
        if (x['psCandidateMobile']) {
          if (x['psCandidateMobile'].length === 12) {
            temObj['Candidate Mobile Number'] = x['psCandidateMobile'];
          } else if (x['psCandidateMobile'].length === 10) {
            let number = x['psCandidateMobile'];
            temObj['Candidate Mobile Number'] = `91${number}`;
          }
        }
        if (x['psCandidateSource']) {
          temObj['Candidate Source'] = x['psCandidateSource'];
        } else {
          temObj['Candidate Source'] = 'from email';
        }
        if (x['psCandidateEmail']) {
          temObj['Candidate Email'] = x['psCandidateEmail'];
        }
        candidateArray.push(temObj);
      });
      if (candidateArray && candidateArray.length > 0) {
        let jsonToExcel = utils.json_to_sheet(candidateArray);
        let excelToCsv = utils.sheet_to_csv(jsonToExcel, {
          rawNumbers: true,
        });
        // console.log('excel', excelToCsv);

        window.URL = window.webkitURL || window.URL;

        this.atsFile = new File([excelToCsv], 'ats.xlsx');
      }
    }
  }
}

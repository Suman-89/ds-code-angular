import { FormDataConstants } from './../../../core/_models/company/form.data';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  CompanyManagementService,
  SharedService,
} from 'src/app/core/_services';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { CompanyModel } from 'src/app/core/_models';

@Component({
  selector: 'app-create-company-modal',
  templateUrl: './create-company-modal.component.html',
  styleUrls: ['./create-company-modal.component.scss'],
})
export class CreateCompanyModalComponent implements OnInit {
  @Input() userRole?: string = 'admin';
  @Input() companyName?: string = null;
  @Input() companyId?: number = 0;
  @Input() showCompleteView? = false;
  @Output() addCompanyEvent: EventEmitter<any> = new EventEmitter();

  companyObj: CompanyModel = {} as CompanyModel;
  actType = null;
  companyForm: FormGroup;
  edit;
  countrylist;
  constructor(
    private compService: CompanyManagementService,
    private toastrSvc: ToastrService,
    private activeModal: NgbActiveModal,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    console.log(this.userRole);

    this.getCountryList();
  }

  initFn() {
    if (this.companyName) {
      this.actType = 'Create Company';
      this.createNewForm();
      this.edit = false;
    }
    if (this.companyId != 0) {
      this.getCompanyById(this.companyId);
      this.edit = true;
    }
  }
  formClickEvent(event): void {
    switch (event.type) {
      case 1:
        this.companyId != 0
          ? this.editCompany(event.data)
          : this.addCompany(event.data);
        break;
      case 2:
        this.closeModal();
        break;
    }
  }

  addCompany(data): void {
    this.compService.addCompany(data).subscribe((res) => {
      if (res.status) {
        this.toastrSvc.success('Company Added');
        data.resource.id = res.data;
        this.addCompanyEvent.emit(data);
        this.activeModal.dismiss();
      }
    });
  }

  editCompany(data): void {
    this.compService.editCompany(data, this.companyId).subscribe((res) => {
      if (res.status) {
        this.toastrSvc.success('Company Details Edited');
        data.resource.id = res.data;
        this.addCompanyEvent.emit(data);
        this.closeModal();
      }
    });
  }
  getCompanyById(pid) {
    this.compService.getCompanybyId(pid).subscribe((res) => {
      this.companyObj = res.data;
      this.actType = this.companyObj.name;
      this.createNewForm();
    });
  }

  createNewForm(): void {
    this.companyId
      ? (this.companyForm = new FormDataConstants().editCompanyForm)
      : (this.companyForm = new FormDataConstants().addCompanyForm);
    if (this.companyName) {
      this.companyForm.patchValue({
        name: this.companyName,
      });
    } else {
      this.patchValues();
    }
  }

  patchValues() {
    this.companyForm.patchValue({
      id: this.companyObj.id,
      name: this.companyObj.name,
      code: this.companyObj.code,
      friendlyname: this.companyObj.friendlyname,
      parentid: this.companyObj.parentid,
      comptype: this.companyObj.comptype,
      addresses: this.companyObj.addresses,
      contacts: this.companyObj.contacts,
      aliases: this.companyObj.aliases,
      group: this.companyObj.group,
      parentfriendlyname: this.companyObj.parentfriendlyname,
      isactive: this.companyObj.isactive,
      registered: this.companyObj.registered
        ? this.countrylist.find(
            (c) => c.countryname === this.companyObj.registered
          )
        : '',
      ofacs: this.companyObj.ofacs,
      // aadhaar: this.companyObj.aadhaarId,
    });
  }

  closeModal(): void {
    this.addCompanyEvent.emit(true);
    this.activeModal.dismiss();
  }
  getCountryList() {
    //  this.sharedSvc.getCountries() ;
    this.sharedSvc.countryList$.subscribe((a) => {
      if (a) {
        this.countrylist = a;
        this.initFn();
      } else {
        this.sharedSvc.getCountries();
      }
    });
  }
}

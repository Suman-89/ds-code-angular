import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CompanyManagementService,
  SharedService,
} from 'src/app/core/_services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormDataConstants } from 'src/app/core/_models';
import validator from 'validator';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contracting-entities',
  templateUrl: './contracting-entities.component.html',
  styleUrls: ['./contracting-entities.component.scss'],
})
export class ContractingEntitiesComponent implements OnInit {
  @ViewChild('principalAddressForm') principalAddress;
  @ViewChild('bankform') bankForm;
  @ViewChild('noticeAddress') noticeAddressChild;
  contractEntity: FormGroup;
  contractEntityAddress: FormGroup; // used once for address form error
  bankDetails: FormGroup;
  bankAddress: FormGroup;
  noticeAddress: FormGroup;
  noticeForm: FormGroup;
  alias = new FormGroup({
    aliasname: new FormControl(''),
  });
  emailList;
  expandPanel = [];
  phoneCountryCode = [];
  tabnames = ['General Information', 'Bank Details'];
  selectedTab;
  editContractEn;
  addressCheck = false;
  emailPattern;
  entId;
  editBankDetId = -1;
  showBankForm = false;
  editAddAddress = [];
  countries;
  constructor(
    private companySvc: CompanyManagementService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private toastrSvc: ToastrService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    this.sharedSvc.countryList$.subscribe((a) => {
      if (a) {
        this.countries = a;
      } else {
        this.sharedSvc.getCountries();
      }
    });
    this.checkAddorEdit();
    this.selectTab(this.tabnames[0]);
    this.getDropdownData();
    this.emailPattern = new FormDataConstants().emailPattern;
  }

  checkForAddress() {
    this.addressCheck = !this.addressCheck;
    if (this.addressCheck) {
      this.noticeForm.value.noticeAddress =
        this.contractEntity.value.principaladdress;
    } else {
      this.noticeForm.value.noticeAddress = null;
    }
  }

  checkAddorEdit() {
    this.entId = this.actRoute.snapshot.paramMap.get('id');
    if (this.entId) {
      this.getContractEntitybyId(this.entId);
    } else {
      this.createContractForm();
    }
  }

  getContractEntitybyId(id) {
    this.companySvc.getContractingEntityByID(id).subscribe((resp) => {
      this.editContractEn = resp.data;
      this.populateForm();
    });
  }

  searchCountry = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.countries
              .map((countr) => countr.countryname)
              .filter(
                (countryname) =>
                  countryname.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  };

  populateForm() {
    this.createContractForm();
    this.contractEntity.patchValue({
      id: this.editContractEn.id,
      entitylegalname: this.editContractEn.data.entitylegalname,
      entityname: this.editContractEn.data.entityname,
      registration: this.editContractEn.data.registration,
      companytype: this.editContractEn.data.companytype,
      principaladdress: this.editContractEn.data.principaladdress,
      corporateidnumber: this.editContractEn.data.corporateidnumber,
      email: this.editContractEn.data.email,
      bankdetails: this.editContractEn.data.bankdetails,
      noticecontact: this.editContractEn.data.noticecontact,
      alias: this.editContractEn.data.alias,
      code: this.editContractEn.code,
    });
    this.emailList.forEach((a) => {
      a.emails = this.editContractEn.data.email[a.value];
    });
    this.noticeForm.patchValue({
      attn: this.editContractEn.data.noticecontact.attn,
      email: this.editContractEn.data.noticecontact.email,
      fax: this.editContractEn.data.noticecontact.fax,
      tel: this.editContractEn.data.noticecontact.tel,
      noticeAddress: this.editContractEn.data.noticecontact.noticeAddress,
    });
  }

  selectTab(name) {
    this.selectedTab = name;
  }
  getDropdownData() {
    this.getCountryCodesForPhone();
  }

  getCountryCodesForPhone() {
    this.phoneCountryCode = ['+91', '+1', '+44'];
  }

  toggleBankForm() {
    this.showBankForm = !this.showBankForm;
  }
  createContractForm() {
    this.entId
      ? (this.contractEntity = new FormDataConstants().editContractEntity)
      : (this.contractEntity = new FormDataConstants().contractEntity);
    this.bankDetails = new FormDataConstants().bankDetails;
    this.emailList = new FormDataConstants().emailList;
    this.noticeForm = new FormDataConstants().noticeForm;
  }

  addAliases() {
    const data = this.alias.value.aliasname;
    if (!this.contractEntity.value.aliases.includes(data)) {
      this.contractEntity.value.aliases.push(data);
    } else {
      return;
    }
  }

  deleteAlias(data) {
    this.contractEntity.value.aliases =
      this.contractEntity.value.aliases.filter((a) => a !== data);
  }

  deleteBankDetails(data) {
    this.contractEntity.patchValue({
      bankdetails: this.contractEntity.value.bankdetails.filter(
        (a) => a !== data
      ),
    });
  }

  changeVisSelection(e) {
    if (e.target.checked) {
      if (!this.contractEntity.value.visiblein.includes(e.target.value)) {
        this.contractEntity.value.visiblein.push(e.target.value);
      }
    } else {
      this.contractEntity.value.visiblein =
        this.contractEntity.value.visiblein.filter((a) => a !== e.target.value);
    }
  }

  addAddress(data, opt) {
    switch (opt) {
      case 1:
        this.contractEntity.patchValue({
          principaladdress: data,
        });
        if (this.addressCheck) {
          this.noticeForm.value.noticeAddress =
            this.contractEntity.value.principaladdress;
        }
        break;
      case 2:
        this.bankDetails.value.bankaddress.push(data);
        break;
      case 3:
        this.noticeForm.patchValue({
          noticeAddress: data,
        });
        break;
    }
  }

  addEmailList(event) {
    if (event.type === 'add') {
      this.contractEntity.value.email[event.data.type].push(event.data.value);
    } else if (event.type === 'del') {
      this.contractEntity.value.email[event.data.type] =
        this.contractEntity.value.email[event.data.type].filter(
          (a) => a !== event.data.value
        );
    }
  }

  saveEditBank(event, id) {
    this.editBankDetId = id;
    this.addBankDetails(event);
  }

  addBankDetails(event) {
    if (this.editBankDetId > -1) {
      this.contractEntity.value.bankdetails[this.editBankDetId] = event;
      this.editBankDetId = -1;
      this.editDetails();
    } else {
      this.contractEntity.value.bankdetails.push(event);
      this.toggleBankForm();
    }
  }

  editbankDetails(bank, id) {
    this.editBankDetId = id;
    this.bankForm.editDetails(bank);
  }

  togglePanel(id) {
    if (this.expandPanel.includes(id)) {
      this.expandPanel = this.expandPanel.filter((a) => a !== id);
    } else {
      this.expandPanel.push(id);
    }
  }

  editDetails() {
    if (this.editContractEn) {
      this.companySvc
        .editContractingEnities(this.contractEntity.value, this.entId)
        .subscribe((resp) => {
          if (resp.status) {
            // this.toastrSvc.success('Contracting Entity Edited') ;
            // this.router.navigate(['../../'], {relativeTo: this.actRoute}) ;
          }
        });
    }
  }

  setEditAddBankaddress(event, id) {
    event === 'add'
      ? this.editAddAddress.push(id)
      : (this.editAddAddress = this.editAddAddress.filter((a) => a !== id));
  }

  addPendingBankDetailsReturnCheck() {
    let ret = true;

    if (this.bankForm) {
      if (!this.checkBankDetailsValidation(this.bankForm.bankDetails?.value))
        return;
      if (
        this.bankForm.bankDetails.touched &&
        this.bankForm.bankDetails.status.toLowerCase() !== 'invalid'
      ) {
        if (
          this.bankForm.bankaddressform &&
          this.bankForm.bankaddressform.companyAddress.status.toLowerCase() !==
            'invalid'
        ) {
          this.bankForm.bankaddressform.companyAddress.patchValue({
            country:
              this.bankForm.bankaddressform.companyAddress.value.country
                .countryname,
          });
          this.bankForm.bankDetails.value.bankaddress.push(
            this.bankForm.bankaddressform.companyAddress.value
          );
        } else if (
          this.bankForm.bankaddressform &&
          this.bankForm.bankaddressform.companyAddress.status.toLowerCase() ==
            'invalid'
        ) {
          ret = false;
          this.toastrSvc.info('Please add a Country to the bank address');
        }
        this.contractEntity.value.bankdetails.push(
          this.bankForm.bankDetails.value
        );
      } else {
        this.toastrSvc.info('Please add a Beneficiary name');
        ret = false;
      }
    } else if (this.contractEntity?.value?.bankdetails?.length) {
      let allValid = true;
      this.contractEntity?.value?.bankdetails.forEach((bank) => {
        if (!this.checkBankDetailsValidation(bank)) {
          allValid = false;
          return;
        }
      });
      ret = allValid;
    }
    return ret;
  }

  checkBankDetailsValidation(bankDetails) {
    let isValid = true;

    if (bankDetails?.bankbenficiaryname?.trim() === '') {
      this.toastrSvc.error('Beneficiary Name cannot be empty');
      isValid = false;
    } else if (bankDetails?.bankname?.trim() === '') {
      this.toastrSvc.error('Bank Name cannot be empty');
      isValid = false;
    } else if (bankDetails?.bankaccountcurrency?.trim() === '') {
      this.toastrSvc.error('Bank Account Currency cannot be empty');
      isValid = false;
    }
    return isValid;
  }

  checkFormValidation() {
    let isValid = true;
    if (this.contractEntity.value.entityname.trim() === '') {
      this.toastrSvc.error('Entity Name cannot be empty');
      isValid = false;
    } else if (this.contractEntity.value.entitylegalname.trim() === '') {
      this.toastrSvc.error('Entity Legal Name cannot be empty');
      isValid = false;
    } else if (this.contractEntity.value.code.trim() === '') {
      this.toastrSvc.error('Entity Code cannot be empty');
      isValid = false;
    } else if (
      this.contractEntity.value.code.trim().length !== 3 ||
      !validator.isAlpha(this.contractEntity.value.code) ||
      !validator.isUppercase(this.contractEntity.value.code)
    ) {
      this.toastrSvc.error('Entity Code needs to be 3 capitals letters');
      isValid = false;
    }
    return isValid;
  }

  onSubmit() {
    let isValid = this.checkFormValidation();
    if (!isValid) return;

    // this.addNoticeDetails() ; /* removed due to one single point of call, value assigned later in the method
    const pendingBankcheck = this.addPendingBankDetailsReturnCheck();
    // this.contractEntity.value.principaladdress = this.principalAddress.companyAddress.value ;
    // this.contractEntity.value.principaladdress = this.principalAddress.companyAddress.value ;
    // this.addEmailList(this.emailList.value) ;
    this.contractEntity.patchValue({
      entityname: this.contractEntity.value.entityname.trim(),
      entitylegalname: this.contractEntity.value.entitylegalname.trim(),
      noticecontact: this.noticeForm.value,
    });

    if (this.editContractEn && pendingBankcheck) {
      this.companySvc
        .editContractingEnities(this.contractEntity.value, this.entId)
        .subscribe((resp) => {
          if (resp.status) {
            this.toastrSvc.success('Contracting Entity Edited');
            // this.router.navigate(['../../'], { relativeTo: this.actRoute });
          }
        });
    } else if (pendingBankcheck) {
      this.companySvc
        .addContractingEnities(this.contractEntity.value)
        .subscribe((resp) => {
          if (resp.status) {
            if (resp.data === -1) {
              this.toastrSvc.error('Code Must Be Unique');
              return;
            }
            this.toastrSvc.success('Contracting Entity Added');
            this.router.navigate(['../'], { relativeTo: this.actRoute });
          }
        });
    }
  }

  back() {
    if (this.editContractEn) {
      this.router.navigate(['../../'], { relativeTo: this.actRoute });
    } else {
      this.router.navigate(['../'], { relativeTo: this.actRoute });
    }
  }
}

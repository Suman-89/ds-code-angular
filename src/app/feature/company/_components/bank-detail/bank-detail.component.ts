import { ToastrService } from 'ngx-toastr';
import { FormDataConstants } from 'src/app/core/_models/company/form.data';
import { RefDataService, SharedService } from 'src/app/core/_services';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { BankDetailsModel } from '../../_models/contracting-entities.model';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss'],
})
export class BankDetailComponent implements OnInit {
  @ViewChild('bankAddressForm') bankaddressform;
  @Input() bankDetails: FormGroup;
  @Output() bankAddressEmit: EventEmitter<BankDetailsModel> =
    new EventEmitter<BankDetailsModel>();
  @Output() cancelEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addeditBankAddress = new EventEmitter();
  @Input() patchVal? = false;
  @Input() addedBankDetails;
  bankAddress = null;
  editId = -1;
  currencyList = [];
  showAddressForm = false;
  countries;
  constructor(
    private refDataSvc: RefDataService,
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
    this.getCurencyRefData();
    if (this.patchVal) {
      this.bankDetails = new FormDataConstants().bankDetails;
      this.editDetails(this.addedBankDetails);
    }
  }

  getCurencyRefData() {
    this.refDataSvc.getInstances('CUR', true).subscribe((resp) => {
      this.currencyList = resp.data;
    });
  }

  addAddress(data) {
    // console.log('Add address emitter', data);

    if (this.editId > -1) {
      this.bankDetails.value.bankaddress[this.editId] = data;
      this.editId = -1;
    } else {
      this.bankDetails.value.bankaddress.push(data);
    }
    this.emitOnchange();
    this.addeditBankAddress.emit('remove');
  }

  // checkForBankAddressAdd() {
  //   if(this.bankaddressform) {
  //     this.bankDetails.value.bankaddress.push(this.bankaddressform.companyAddress.value) ;
  //   }
  // }

  addBankDetails() {
    if (1) {
      this.bankDetails.value.bankaddress.length > 0
        ? this.bankDetails.patchValue({
            bankfriendlyaddress:
              this.bankDetails.value.bankaddress[0].friendlyaddress,
          })
        : null;
      this.bankAddressEmit.emit(this.bankDetails.value);
      // this.bankDetails = new FormDataConstants().bankDetails;
    } else {
      this.toastrSvc.info('Please Add Bank Addresses');
    }
  }

  addressAction(event) {
    if (event.type === 'remove') {
      this.bankDetails.value.bankaddress =
        this.bankDetails.value.bankaddress.filter((a) => a !== event.data);
    } else {
      this.editId = event.id;
      // this.bankAddress = event.data ;
      this.addAddress(event.data);
    }
  }

  emitAddressEdit(event) {
    event
      ? this.addeditBankAddress.emit('add')
      : this.addeditBankAddress.emit('remove');
  }

  togglePanel() {
    // this.expandPanel = !this.expandPanel ;
  }

  editDetails(bank) {
    this.bankDetails.patchValue({
      bankbenficiaryname: bank.bankbenficiaryname,
      bankalias: bank.bankalias,
      bankname: bank.bankname,
      bankbranch: bank.bankbranch,
      bankaccountnumber: bank.bankaccountnumber,
      bankaccountcurrency: bank.bankaccountcurrency,
      bankibancode: bank.bankibancode,
      bankswift: bank.bankswift,
      bankaddress: bank.bankaddress,
    });
  }

  emitOnchange() {
    if (this.patchVal) {
      this.addBankDetails();
    }
  }

  showHideAddressForm() {
    this.showAddressForm = !this.showAddressForm;
    this.showAddressForm
      ? this.addeditBankAddress.emit('add')
      : this.addeditBankAddress.emit('remove');
  }
  cancel() {
    this.cancelEmit.emit(false);
  }
}

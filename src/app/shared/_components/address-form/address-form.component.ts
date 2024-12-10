import { ToastrService } from 'ngx-toastr';
import {
  CountryModel,
  FormDataConstants,
  Roles,
  AddressType,
} from 'src/app/core/_models';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  CompanyManagementService,
  SharedService,
} from 'src/app/core/_services';
import { FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { CompanyAddressModel } from 'src/app/feature/company/_models';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit, OnChanges {
  @ViewChild('friendlyaddress') frndlyAddr;
  @Input() editAddress?: CompanyAddressModel;
  @Input() showAddBtn: boolean;
  @Input() addressname? = 'Address';
  @Input() bindonchange? = false;
  @Input() type? = true;
  @Input() showCancel? = false;
  @Input() countries: CountryModel[];
  @Output() addressObjectEmitter: EventEmitter<CompanyAddressModel> =
    new EventEmitter<CompanyAddressModel>();
  @Output() cancelAddress = new EventEmitter<boolean>();
  @Output() addressSaveEmitter = new EventEmitter<CompanyAddressModel>();
  companyAddress: FormGroup;
  addressType;
  states;
  friendlyAddress = '';
  user;
  valid = false;
  emitSingleForm = () => this.emitForm();
  searchCountry = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.countries
              .filter(
                (v) =>
                  v.countryname.toLowerCase().indexOf(term.toLowerCase()) >
                    -1 ||
                  v.countrycode.toLowerCase().indexOf(term.toLowerCase()) >
                    -1 ||
                  v.code.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  };
  searchStates = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.states
              .filter(
                (v) =>
                  v.statename.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  };

  countryformatter = (x) => x.countryname;
  stateformatter = (x) => x.statename;
  countryresultformatter = (x) => x;
  constructor(
    private companySvc: CompanyManagementService,
    private sharedSvc: SharedService,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.formDecider();
    this.getDropdownData();
    // this.companyAddress.valueChanges.subscribe((x) => {
    //   this.addressObjectEmitter.emit(this.companyAddress.value);
    // });
  }

  ngOnChanges() {
    this.formDecider();
  }

  getDropdownData() {
    this.companySvc.getAddressTypes().subscribe((resp) => {
      this.addressType = resp.data;
      // if (this.user.roles.includes(Roles.SALES_USER) && !this.user.roles.includes(Roles.LEGAL_ADMIN)
      // && !this.user.roles.includes(Roles.SUPER_ADMIN)) {
      //     this.addressType = this.addressType.filter(a => a === AddressType.PRINCIPAL) ;
      // }
    });
    // this.getCountries() ;
  }

  returnAddressType(data) {
    return this.sharedSvc.returnAddressType(data);
  }
  getCountries() {
    // if (this.sharedSvc.countryList.length === 0) {
    //   this.sharedSvc.getCountryOnInit().subscribe( r => {
    //     if (r.status) {
    //       this.countries = r.data ;
    //     }
    //   }) ;
    // } else {
    //   this.countries = this.sharedSvc.countryList ;
    // }
    this.sharedSvc.countryList$.subscribe((a) => {
      if (a) {
        this.countries = a;
      } else {
        this.sharedSvc.getCountries();
      }
    });
  }
  preventNumber(event, field?) {
    if (
      event.code.includes('Digit') ||
      event.code === 'Space' ||
      event.code.includes('Control') ||
      event.ctrlKey
    ) {
      this.companyAddress.patchValue({
        [field]: '',
      });
    }
  }
  assignStates(event?) {
    this.valid = true;
    // selCountry = this.countries.filter( a => a.countryname === this.companyAddress.value.country) ;
    this.companyAddress.patchValue({
      country: { countryname: event.item.countryname },
    });
    this.sharedSvc.getStates(event.item.id).subscribe((resp) => {
      this.states = resp.data;
    });
    this.companyAddress.value.country = event.item.countryname;

    this.emitForm();
  }

  getStates(id) {
    this.sharedSvc.getStates(id).subscribe((resp) => {
      this.states = resp.data;
    });
  }
  setStateValue(event) {
    this.companyAddress.patchValue({
      state: { statename: event.item.statename },
    });

    this.emitForm();
  }
  formDecider() {
    if (this.editAddress) {
      // this.getCountries() ;
      this.populateAddressForm(this.editAddress);
    } else {
      this.createNewAddressForm();
    }
  }

  populateAddressForm(address: CompanyAddressModel) {
    let stateObj;
    let countryObj;
    address.country && address.country.countryname
      ? (address.country = address.country.countryname)
      : null;
    if (address.country && address.country.length > 0) {
      countryObj = this.countries.find(
        (a) => a.countryname === address.country
      );
      countryObj
        ? this.getStates(countryObj.id)
        : (countryObj = { countryname: address.country });
    } else {
      countryObj = '';
    }
    if (address.state && address.state.length > 0) {
      stateObj = { statename: address.state };
    } else {
      stateObj = '';
    }

    if (!this.bindonchange) {
      this.companyAddress = new FormDataConstants().editCompanyAddress;
      this.companyAddress.patchValue({
        id: address.id,
        line: address.line,
        country: countryObj,
        state: stateObj,
        city: address.city,
        postalcode: address.postalcode,
        friendlyaddress: address.friendlyaddress,
        type: address.type,
      });
      if (
        !this.companyAddress.value.friendlyaddress ||
        this.companyAddress.value.friendlyaddress == null
      ) {
        this.companyAddress.patchValue({
          friendlyaddress: this.transformToFriendlyAddress(
            this.companyAddress.value
          ),
        });
      }
    } else if (this.bindonchange) {
      this.companyAddress = new FormDataConstants().companyAddress;
      if (address.id) {
        this.companyAddress.patchValue({
          id: address.id,
        });
      }
      this.companyAddress.patchValue({
        line: address.line,
        country: countryObj,
        state: stateObj,
        city: address.city,
        postalcode: address.postalcode,
        friendlyaddress: address.friendlyaddress,
        type: address.type,
      });
    }

    // check for undefined type
    if (!this.companyAddress.value.type) {
      this.companyAddress.value.type = '';
    }
  }

  createNewAddressForm() {
    this.companyAddress = new FormDataConstants().companyAddress;
    this.companyAddress.patchValue({
      type: AddressType.PRINCIPAL,
    });
  }

  emitAddress(save?) {
    if (
      this.companyAddress.value.state &&
      this.companyAddress.value.state.statename
    ) {
      this.companyAddress.value.state =
        this.companyAddress.value.state.statename;
    }
    if (this.companyAddress.value.country.countryname) {
      this.companyAddress.value.country = this.companyAddress.value.country
        .countryname
        ? this.companyAddress.value.country.countryname
        : this.companyAddress.value.country;
      this.addressObjectEmitter.emit(this.companyAddress.value);
      save ? this.addressSaveEmitter.emit(this.companyAddress.value) : null;
      this.companyAddress.reset();
      this.companyAddress.patchValue({
        type: AddressType.PRINCIPAL,
      });
    } else if (
      this.companyAddress.value.country.length === 0 ||
      !this.companyAddress.value.country.length
    ) {
      this.toastrSvc.error('Please Enter a Country');
    }
  }

  emitForm(change?) {
    const li = this.companyAddress.value.line;
    const ci = this.companyAddress.value.city;
    const zi = this.companyAddress.value.postalcode;
    this.companyAddress.patchValue({
      line: li ? li.trim() : '',
      city: ci ? ci.trim() : '',
      postalcode: zi ? zi.trim() : '',
    });
    if (!change) {
      this.companyAddress.patchValue({
        friendlyaddress: this.transformToFriendlyAddress(
          this.companyAddress.value
        ),
      });
    }

    if (this.bindonchange) {
      if (this.companyAddress.value.country.countryname) {
        this.companyAddress.value.country =
          this.companyAddress.value.country.countryname;
      }
      if (
        this.companyAddress.value.state &&
        this.companyAddress.value.state.statename
      ) {
        this.companyAddress.value.state =
          this.companyAddress.value.state.statename;
      }
      this.addressObjectEmitter.emit(this.companyAddress.value);
    }
  }

  transformToFriendlyAddress(data) {
    data.country.countryname
      ? (data.country = data.country.countryname)
      : (data.country = data.country);
    if (data.state && data.state.statename) {
      data.state = data.state.statename;
    }
    let p1;
    data.line && data.line.length > 0 ? (p1 = data.line + ',') : (p1 = '');
    p1 = p1.trim();
    p1.charAt(p1.length - 2) === ','
      ? (p1 = p1.substr(0, p1.length - 1))
      : (p1 = p1); // checking for trailing ','
    let p2;
    data.city && data.city.length > 0 ? (p2 = data.city + ',') : (p2 = '');
    let p3;
    data.state && data.state.length > 0 ? (p3 = data.state + ',') : (p3 = '');
    let p4;
    data.country && data.country.length > 0
      ? (p4 = data.country + ',')
      : (p4 = '');
    let p5;
    data.postalcode && data.postalcode.length > 0
      ? (p5 = data.postalcode)
      : (p5 = '');
    let addressText = `${p1} ${p2} ${p3} ${p4} ${p5}`;
    if (addressText.charAt(addressText.length - 2) === ',') {
      return (addressText = addressText
        .substr(0, addressText.length - 2)
        .trim());
    } else {
      return addressText.trim();
    }
  }

  cancel() {
    this.cancelAddress.emit(false);
  }

  checkSelection(field) {
    let val;
    field === 'country'
      ? (val = this.countries.find(
          (a) => a.countryname === this.companyAddress.value.country.countryname
        ))
      : (val = this.states.find(
          (a) => a.statename === this.companyAddress.value.state.statename
        ));
    if (!val) {
      this.companyAddress.patchValue({
        [field]: '',
      });
    }
  }
}

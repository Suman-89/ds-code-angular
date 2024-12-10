import {
  RefDataService,
  SharedService,
  UserService,
} from './../../../core/_services';
import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import * as _fromCoreSvc from 'src/app/core/_services';
import {
  FormDataConstants,
  Roles,
  TypeAheadModel,
  CompanyGroupModel,
} from 'src/app/core/_models';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss'],
})
export class AddEditCompanyComponent implements OnInit {
  @ViewChild('groupTypeahead') groupTypeahead;
  @ViewChild('parentname') parentname;
  @ViewChild('addressForm') addressForm;
  @Input() editDetails: any;

  // for userRole accountmanager only the bare minimum needs to be required
  @Input() userRole? = 'admin';
  @Input() showCompleteView: boolean;
  @Input() edit? = false;
  @Input() showFlags? = false;
  @Output() emitNewForm: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitProfileImg: EventEmitter<any> = new EventEmitter<any>();


  

  btnTab: string = 'basicDetails';
  childBtnTab: string = 'aadhaar';
  editAddId: number;
  compType;
  companyLevels;
  addressType;
  form: FormGroup;
  companyAddress: FormGroup = null;
  contactForm = new FormDataConstants().contactForm;
  historicalContractList = new FormDataConstants().historicalDocList;
  alias = new FormGroup({
    aliasname: new FormControl(''),
  });
  vendorsapid = new FormGroup({
    vendorsapidname: new FormControl(''),
  });
  customersapid = new FormGroup({
    customersapidname: new FormControl(''),
  });
  otherEmails = new FormGroup({
    otherEmailsName: new FormControl(''),
  });
  gstinIds = new FormGroup({
    gstinIdsName: new FormControl(''),
  });
  otherPhoneNumbers = new FormGroup({
    otherPhoneNumbersName: new FormControl(''),
  });

  accountManagers = new FormGroup({
    accountManagersName: new FormControl(''),
  });

  countries;
  outcome = new FormDataConstants().signatory;
  signatory = new FormDataConstants().signatory;
  contactType: CompanyGroupModel[];
  outcomeType = new FormDataConstants().outcomeType;
  phoneCountryCode = [];
  editContactId;
  enableAddGroup = new FormGroup({
    enable: new FormControl(false),
    data: new FormControl(''),
  });
  groupName = '';
  showAddressForm = false;
  editOfacId = -1;
  editsignOfacid = -1;
  editSection = 0;
  kycEditSection: boolean = false;
  showoutcomeForm = false;
  showSignatoryForm = false;
  showContactForm = false;
  ofac = { signatory: [], company: [] };
  pristineVal;
  roles = Roles;
  emailpattern = new FormDataConstants().emailPattern;
  valid = false;
  groupDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    idField: 'id',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true,
  };
  salesUsers;
  tempGstinIds: string[]; //assigning a temp variable for gstinIds bug
  // upload rofile pic 
  profileIconName:any;
  companyProfileImageUrl:any;

  tempProfileIconName:any;
  tempProfileImageUrl:any;
  inputImg:any;

  getProfilePic(e){
    let file=e.target.files[0];
    this.tempProfileIconName=e.target.files[0].name
    let url = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(file))
      this.tempProfileImageUrl=url;
    this.tempProfileImageUrl=url
    this.profileIconName =this.tempProfileIconName;
    this.inputImg=file
    this.emitProfileImg.emit({
      data:this.inputImg,
    });
  }

  saveProfilePic(){
    // this.profileIconName =this.tempProfileIconName;
    let formdata = new FormData();   
    formdata.append('companyPic', this.inputImg);
    // console.log(formdata)
    this.companySvc.uploadCompanyProfileImage(this.editDetails.value.code, formdata).subscribe((p) => {
      if (p.status) {
        this.companySvc.previewUserImage(this.editDetails.value.code).subscribe((resp) => {
          var url = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(resp.body)
          );
          this.companyProfileImageUrl = url;
        });
        // console.log("Profile pic uploaded successfully")
      }
    })
  }


  onIconInputClick(inputId) {
    document.getElementById(inputId).click();
  }

  

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
  countryformatter = (x) => x.countryname;

  constructor(
    private toastrSvc: ToastrService,
    private companySvc: _fromCoreSvc.CompanyManagementService,
    private sharedSvc: SharedService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private userSvc: UserService,
    private refSvc: RefDataService,
    private readonly sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    
    if(this.editDetails.value.code){
      this.companySvc.previewUserImage(this.editDetails.value.code).subscribe((resp) => {

        if(resp.body.size!==0){
  
          var url = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(resp.body))
          this.companyProfileImageUrl = url;
  
        }else{
          this.companyProfileImageUrl="https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
  
        }
        // console.log(this.companyProfileImageUrl)

      });
  
    }else{
      this.companyProfileImageUrl="https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
    }
   
    this.getUsers();
    console.log(
      'EDIT DETAILS ==========',
      this.showCompleteView,
      this.editDetails
    );
    if (this.editDetails.value.id > 0) {
      this.form = this.editDetails;
      this.edit = true;
      this.editDetails.value.group
        ? (this.groupName = this.editDetails.value.group.name)
        : (this.groupName = '');
      this.distOfac();
      this.outcome.patchValue({
        issignatory: false,
      });
    } else {
      this.createNewForm();
      this.edit = false;
    }
    this.getDropdownData();
    this.userRole = JSON.parse(localStorage.getItem('user')).roles;
    if (this.showCompleteView === undefined) {
      this.viewDecider();
    }
    if (!this.edit) {
      this.showAddressForm = true;
    }
  }

  getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.salesUsers = a.data
        .filter((i) => i.groupnames.includes('sales'))
        .map((i) => ({ id: i.userid, fullName: i.fullname }));
      console.log('SALES USERS ', this.salesUsers);
    });
  }

  // get addcontform() { return this.contactForm.controls ; }

  distOfac() {
    if (this.editDetails.value.ofacs.length > 0) {
      this.ofac.signatory = this.editDetails.value.ofacs.filter(
        (a) => a.issignatory
      );
      this.ofac.company = this.editDetails.value.ofacs.filter(
        (a) => !a.issignatory
      );
    }
  }
  editSectionEnable(id) {
    this.editSection = id;
    if (id === 1) {
      this.pristineVal = JSON.parse(JSON.stringify(this.form.value));
    }
  }

  kycEditSectionEnable(val: boolean) {
    this.kycEditSection = val;
    if (!val) {
      this.form.patchValue({
        aadhaar: {
          aadhaarId: this.pristineVal?.aadhaar.aadhaarId,
          name: this.pristineVal?.aadhaar.name,
          dob: this.pristineVal?.aadhaar.dob,
          gender: this.pristineVal?.aadhaar.gender,
          care_of: this.pristineVal?.aadhaar.care_of,
          address: this.pristineVal?.aadhaar.address,
        },
        pan: {
          id: this.pristineVal?.pan.id,
          name: this.pristineVal?.pan.name,
          dob: this.pristineVal?.pan.dob,
          fathersName: this.pristineVal?.pan.fathersName,
        },
        ieCode: this.pristineVal?.ieCode,
        companyId: this.pristineVal?.companyId,
      });
    }
  }

  closeEditSection(opt?) {
    this.editSection = 0;
    if (opt) {
      this.form.patchValue({
        id: this.pristineVal.id,
        name: this.pristineVal.name,
        code: this.pristineVal.code,
        friendlyname: this.pristineVal.friendlyname,
        parentid: this.pristineVal.parentid,
        comptype: this.pristineVal.comptype,
        aliases: this.pristineVal.aliases,
        group: this.pristineVal.group,
        parentfriendlyname: this.pristineVal.parentfriendlyname,
        registered: this.pristineVal.registered,
        isactive: this.pristineVal.isactive,
        vendorsapid: this.pristineVal.vendorsapid,
        customersapid: this.pristineVal.customersapid,
        primaryPhoneNumber: this.pristineVal.primaryPhoneNumber,
        primaryEmailId: this.pristineVal.primaryEmailId,
        // aadhaarId: this.pristineVal.aadhaarId,
      });
      window.location.reload();
    }
  }
  viewDecider() {
    if (
      this.userRole.includes(this.roles.SALES_USER) &&
      this.userRole.length === 1
    ) {
      this.showCompleteView = false;
    } else if (
      this.userRole.includes(this.roles.LEGAL_ADMIN) ||
      this.userRole.includes(this.roles.LEGAL_USER) ||
      this.userRole.includes(this.roles.SUPER_ADMIN)
    ) {
      this.showCompleteView = true;
    }
  }

  // dropdown and typeahead data  get methods //
  getDropdownData() {
    this.companySvc.getCompanyTypes().subscribe((resp) => {
      this.compType = resp.data;
    });
    this.companySvc.getContactTypes().subscribe((resp) => {
      this.contactType = resp.data;
    });
    this.refSvc.getInstances('PARTNER_LEVEL', true).subscribe((p) => {
      if (p.status) {
        this.companyLevels = p.data.map((i) => i.name);
        console.log('PARTNER LEG', this.companyLevels);
      }
      console.log('partner level data', p);
    });
    this.getCountries();
    this.getCountryCodesForPhone();
  }

  getCountries() {
    this.sharedSvc.countryList$.subscribe((a) => {
      if (a) {
        this.countries = a;
      } else {
        this.sharedSvc.getCountries();
        if (this.edit && this.editDetails.value.registered.length > 0) {
          this.form.patchValue({
            registered: { countryname: this.editDetails.value.registered },
          });
        }
      }
    });
    // if (this.sharedSvc.countryList.length === 0) {
    //   this.sharedSvc.getCountryOnInit().subscribe( r => {
    //     if (r.status) {
    //       this.countries = r.data ;
    //       if (this.edit && this.editDetails.value.registered.length > 0) {
    //         this.form.patchValue({
    //           registered: {countryname: this.editDetails.value.registered } }) ;
    //       }
    //     }
    //   }) ;
    // } else {
    //   this.countries = this.sharedSvc.countryList ;
    //   if (this.edit && this.editDetails.value.registered.length > 0) {
    //     this.form.patchValue({
    //       registered: {countryname: this.editDetails.value.registered }
    //     }) ;
    //   }
    // }
  }
  getCountryCodesForPhone() {
    this.phoneCountryCode = ['+91', '+1', '+44'];
  }

  // ---------FORM Methods--------------- //

  formCheck() {
    return (this.valid =
      this.form.value.addresses.length > 0 && this.form.valid ? true : false);
  }
  preventNumber(event, field?) {
    if (
      event.code.includes('Digit') ||
      event.code === 'Space' ||
      event.code.includes('Control') ||
      event.ctrlKey ||
      event.code.includes('Numpad')
    ) {
      this.form.patchValue({
        [field]: '',
      });
    }
  }
  checkReg() {
    let reg = this.countries.find(
      (a) => a.countryname === this.form.value.registered.countryname
    );
    if (!reg) {
      this.form.patchValue({
        registered: '',
      });
    }
  }

  toggleAddressForm() {
    this.showAddressForm = !this.showAddressForm;
  }
  createNewForm() {
    this.form = new FormDataConstants().addCompanyForm;

    if (this.editDetails.value.name.length > 0) {
      this.form.patchValue({
        name: this.editDetails.value.name,
      });
    }
  }

  assignDefaultName(data) {
    this.trimField('name');
    if (this.form.value.friendlyname.length === 0) {
      this.form.patchValue({
        friendlyname: data.trim(),
      });
    }
  }

  // sub forms methods ---------------------//

  returnFlagChecker(val, opt) {
    //  let radioVal;
    //  switch(opt) {
    //    case 1:
    //      radioVal = true;
    //      break;
    //    case 2:
    //      radioVal = false ;
    //      break;
    //    case 3:
    //       radioVal = null ;
    //       break;
    //  }
    return this.form.value.flags[val] === opt ? true : false;
  }

  setFlag(val, opt) {
    if ((opt === true || opt == false) && this.form.value.flags[val] === opt) {
      opt = !opt;
    }
    if (opt === null && this.form.value.flags[val] === opt) {
      this.toastrSvc.warning('Please select Yes or No to disable NA');
      this.form.controls.flags.patchValue({
        [val]: false,
      });
    } else {
      this.form.controls.flags.patchValue({
        [val]: opt,
      });
    }
  }

  putContactval(id, val, field) {
    if (field === 'typeid') {
      val = this.contactType.find((a) => a.name === val).id;
    }
    this.form.value.contacts[id][field] = val;
  }

  closeContactEdit() {
    this.editContactId = -1;
  }
  saveContactChanges() {
    this.editContactId = -1;
    this.save();
  }
  addAlias() {
    if (!this.form.value.aliases.includes(this.alias.value.aliasname)) {
      this.form.value.aliases.push(this.alias.value.aliasname);
      this.alias.reset();
    }
  }
  addVendorSapId() {
    if (
      !this.form.value.vendorsapid.includes(
        this.vendorsapid.value.vendorsapidname
      )
    ) {
      this.form.value.vendorsapid.push(this.vendorsapid.value.vendorsapidname);
      this.vendorsapid.reset();
    }
  }
  addCustomerSapId() {
    // console.log("this.customersapid.value.customersapidname",this.form.value);
    if (
      !this.form.value.customersapid.includes(
        this.customersapid.value.customersapid_name
      )
    ) {
      this.form.value.customersapid.push(
        this.customersapid.value.customersapidname
      );
      this.customersapid.reset();
    }
  }

  addContactEmails() {
    if (
      this.form.value.otherEmails &&
      !this.form.value.otherEmails.includes(
        this.otherEmails.value.otherEmailsName
      )
    ) {
      this.form.value.otherEmails.push(this.otherEmails.value.otherEmailsName);
      this.otherEmails.reset();
    } else if (
      this.form.value.otherEmails &&
      this.form.value.otherEmails.includes(
        this.otherEmails.value.otherEmailsName
      )
    ) {
      this.toastrSvc.error(
        'Email is Already Entered, Please Enter a Different Email.'
      );
      this.otherEmails.reset();
    } else if (this.form.value.otherEmails == null) {
      this.form.value.otherEmails = [this.otherEmails.value.otherEmailsName];
      this.otherEmails.reset();
    }
  }

  addOtherPhone() {
    if (
      this.form.value.otherPhoneNumbers &&
      !this.form.value.otherPhoneNumbers.includes(
        this.otherPhoneNumbers.value.otherPhoneNumbersName
      )
    ) {
      this.form.value.otherPhoneNumbers.push(
        this.otherPhoneNumbers.value.otherPhoneNumbersName
      );
      this.otherPhoneNumbers.reset();
    } else if (
      this.form.value.otherPhoneNumbers &&
      this.form.value.otherPhoneNumbers.includes(
        this.otherPhoneNumbers.value.otherPhoneNumbersName
      )
    ) {
      this.toastrSvc.error(
        'Phone Number is Already Entered, Please Enter a Different Phone Number.'
      );
      this.otherPhoneNumbers.reset();
    } else if (this.form.value.otherPhoneNumbers == null) {
      this.form.value.otherPhoneNumbers = [
        this.otherPhoneNumbers.value.otherPhoneNumbersName,
      ];
      this.otherPhoneNumbers.reset();
    }
  }
  addGstId() {
    if (
      this.form.value.gstinIds &&
      !this.form.value.gstinIds.includes(this.gstinIds.value.gstinIdsName)
    ) {
      this.form.value.gstinIds.push(this.gstinIds.value.gstinIdsName);
      this.gstinIds.reset();
    } else if (
      this.form.value.gstinIds &&
      this.form.value.gstinIds.includes(this.gstinIds.value.gstinIdsName)
    ) {
      this.toastrSvc.error(
        'GSTN-ID is Already Entered, Please Enter a Different GSTN-ID.'
      );
      this.gstinIds.reset();
    } else if (this.form.value.gstinIds == null) {
      this.form.value.gstinIds = [this.gstinIds.value.gstinIdsName];
      this.gstinIds.reset();
    }
  }

  deleteAlias(al) {
    this.form.value.aliases = this.form.value.aliases.filter((a) => a !== al);
  }
  deleteVendorSapId(al) {
    this.form.value.vendorsapid = this.form.value.vendorsapid.filter(
      (a) => a !== al
    );
  }
  deleteCustomerSapId(al) {
    this.form.value.customersapid = this.form.value.customersapid.filter(
      (a) => a !== al
    );
  }
  deleteContactEmails(al) {
    this.form.value.otherEmails = this.form.value.otherEmails.filter(
      (a) => a !== al
    );
  }
  deleteGstID(al) {
    this.form.value.gstinIds = this.form.value.gstinIds.filter((a) => a !== al);
  }
  deleteOtherPhone(al) {
    this.form.value.otherPhoneNumbers =
      this.form.value.otherPhoneNumbers.filter((a) => a !== al);
  }

  selectType(data) {
    this.form.value.companytype = data;
  }
  addOutcome(val) {
    switch (val) {
      case 1:
        this.form.value.ofacs.push(this.outcome.value);
        this.outcome.reset();
        this.toggleOutcomeForm();
        break;
      case 2:
        this.signatory.patchValue({
          issignatory: true,
        });
        this.form.value.ofacs.push(this.signatory.value);
        this.signatory.reset();
        this.toggleSignatoryForm();
        break;
    }
    this.save();
  }

  toggleOutcomeForm() {
    this.showoutcomeForm = !this.showoutcomeForm;
  }

  toggleSignatoryForm() {
    this.showSignatoryForm = !this.showSignatoryForm;
  }

  editOfac(id, opt?) {
    opt ? (this.editsignOfacid = id) : (this.editOfacId = id);
  }
  cancelEditOfac(opt?) {
    opt ? (this.editsignOfacid = -1) : (this.editOfacId = -1);
  }
  closeOfac(opt?) {
    opt ? (this.editsignOfacid = -1) : (this.editOfacId = -1);
    this.save();
  }
  putValueOfac(id, value, field, opt?) {
    if (field === 'ofacdate') {
      let obj;
      obj = this.ngbDateParserFormatter.format(value);
      // const year = value.year.toString();
      // let day;
      // value.day > 9 ? day = value.day.toString() : day = '0' + value.day.toString() ;
      // let month;
      // value.month > 9 ? month = value.month.toString() : month = '0' + value.month.toString() ;
      // obj = year + '-' + month + '-' + day ;
      value = obj;
    }

    opt
      ? (this.ofac.signatory[id][field] = value.trim())
      : (this.ofac.company[id][field] = value.trim());
  }

  addAddress(data) {
    if (this.editAddId > -1) {
      this.form.value.addresses[this.editAddId] = data;
      // this.form.value.friendlyaddress[this.editAddId] = this.transformToFriendlyAddress(data) ;
      this.editAddId = -1;
      this.companyAddress = null;
    } else {
      // this.addressForm.saveAddress && this.addressForm.companyAddress.valid ? this.form.value.addresses.push(data) : null ;
      // this.showAddressForm = this.addressForm.saveAddress  ?  false : true;
      // this.form.value.friendlyaddress.push(this.transformToFriendlyAddress(data)) ;
      this.form.value.addresses.push(data);
      this.showAddressForm = false;
    }
    if (this.edit) {
      this.save();
    }
  }

  cancelAddressForm(val) {
    this.showAddressForm = val;
  }

  addContact() {
    if (this.contactForm.valid) {
      if (this.editContactId > -1) {
        this.form.value.contacts[this.editContactId] = this.contactForm.value;
      } else {
        this.form.value.contacts.push(this.contactForm.value);
      }
      this.contactForm.reset();
      this.editContactId = null;
      this.toggleContactForm();
      this.save();
    }
  }

  editContact(contact, id) {
    this.editContactId = id;
    //  this.contactForm.patchValue({
    //   name: contact.name,
    //   typeid: contact.typeid,
    //   email: contact.phone,
    //   // Code: contact.contactCode ,
    //   phone: contact.phone,
    //   fax: contact.fax
    //  }) ;
  }
  toggleContactForm() {
    this.showContactForm = !this.showContactForm;
  }
  findContactTypeName(cont) {
    const id = cont.typeid;
    let obj;
    id ? (obj = this.contactType.find((a) => a.id === id).name) : (obj = '');
    return obj ? (obj = obj) : (obj = '');
  }
  addressAction(event) {
    switch (event.type) {
      case 'remove':
        return this.deleteAddress(event.data);
      case 'edit':
        return this.enableEditForAddress(event.data, event.id);
    }
  }

  enableEditForAddress(address, id): void {
    this.editAddId = id;
    this.addAddress(address);
  }

  assignGroup(data: TypeAheadModel) {
    if (data.name.includes('Create')) {
      const obj = {
        resource: {
          name: data.param,
        },
      };
      this.companySvc.addCompanyGroup(obj).subscribe((resp) => {
        this.form.patchValue({ group: { id: resp.data } });
        this.toastrSvc.success('Group Added');
        this.groupName = data.name;
      });
    } else {
      this.form.patchValue({ group: { id: data.id } });
      this.groupName = data.name;
    }
  }

  assignParent(data) {
    this.form.patchValue({
      parentid: data.id,
    });
  }

  deleteFromForms(obj, parentObj) {
    this.form.value[`${parentObj}`] = this.form.value[`${parentObj}`].filter(
      (a) => a !== obj
    );
  }

  // validation and trim

  trimField(field) {
    this.form.patchValue({
      [field]: this.form.value[field].trim(),
    });
  }

  // ------------------------- //

  transformValueBeforeSubmit() {
    // console.log(this.form.value);

    if (this.form.value.comptype === '') {
      this.form.patchValue({
        comptype: this.compType[0].name,
      });
    }
    if (this.form.value.group && this.form.value.group.id === null) {
      this.form.patchValue({
        group: null,
      });
    }
    if (
      this.groupTypeahead === undefined ||
      this.groupTypeahead.typeAheadVal.length === 0
    ) {
      this.form.patchValue({
        group: null,
      });
    }

    if (
      this.parentname === undefined ||
      this.parentname.typeAheadVal.length === 0
    ) {
      this.form.patchValue({
        parentid: null,
      });
    }

    // if (!this.form.value.aadhaar?.aadhaarId) {
    //   this.form.value.aadhaar = null;
    // }

    // if (
    //   this.aadhaar === undefined ||
    //   this.parentname.typeAheadVal.length === 0
    // ) {
    //   this.form.patchValue({
    //     parentid: null,
    //   });
    // }
    if (this.form.value.registered && this.form.value.registered.countryname) {
      this.form.value.registered = this.form.value.registered.countryname;
    }
    // if (this.outcome.valid && this.showCompleteView && this.edit) {
    //   this.addOutcome(1) ;

    // }
    // if (this.signatory.valid && this.showCompleteView && this.edit) {
    //   this.addOutcome(2) ;
    // }
  }

  checkForAddress(): boolean {
    let check = 0;
    let val;
    if (
      this.addressForm &&
      this.addressForm.companyAddress.valid &&
      this.addressForm.companyAddress.value.country.countryname !== undefined
    ) {
      // avoids cancelled address form add. addressform is undefined if cancelled
      // this.addressForm.emitAddress() ;
      this.addressForm.companyAddress.value.country = this.addressForm
        .companyAddress.value.country.countryname
        ? this.addressForm.companyAddress.value.country.countryname
        : this.addressForm.companyAddress.value.country;
      this.addressForm.companyAddress.value.state =
        this.addressForm.companyAddress.value.state &&
        this.addressForm.companyAddress.value.state.statename
          ? this.addressForm.companyAddress.value.state.statename
          : '';
      this.form.value.addresses.push(this.addressForm.companyAddress.value);
    } else if (
      this.addressForm &&
      this.addressForm.companyAddress.value.country.countryname === undefined
    ) {
      check = check + 1;
    }
    this.form.value.addresses.forEach((a) => {
      if (a.country.length === 0 || !a.country.length) {
        check = check + 1;
      }
    });
    check === 0 ? (val = true) : (val = false);
    return val;
  }

  // form submit method
  onSubmit(opt) {
    switch (opt) {
      case 1:
        const check = this.checkForAddress();
        if (this.form.valid) {
          if (this.form.value.addresses.length > 0 && check) {
            this.transformValueBeforeSubmit();
            this.emitNewForm.emit({
              type: opt,
              data: { resource: this.form.value },
            });
            // this.createNewForm() ;
          } else {
            this.toastrSvc.error('Please enter at least one valid address');
          }
        } else {
          this.toastrSvc.error('Please fill all the mandatory fields');
        }
        break;
      case 2:
        this.emitNewForm.emit({ type: opt });
        break;
    }
  }

  deleteAddress(data) {
    // console.log("compid", this.form.value.id, this.editDetails.value.id)
    // console.log("dataatatatata", data)
    if (this.form.value.addresses.length === 1) {
      this.toastrSvc.error(
        'Can not delete address as a company must have an address'
      );
    }
    if (data.id && this.form.value.addresses.length > 1) {
      this.companySvc 
        .deleteAddress(this.editDetails.value.id,data.id)
        .subscribe((r) => {
          // console.log("res", r)
          this.toastrSvc.success('Address Deleted');
          this.deleteFromForms(data, 'addresses');
        });
    } else if (this.form.value.addresses.length > 1 && !data.id) {
      this.deleteFromForms(data, 'addresses');
    }
  }

  save() {
    console.log(this.form.value);

    if(this.tempProfileImageUrl!==undefined){
       this.saveProfilePic()
    }

    console.log(this.tempProfileImageUrl)

    this.tempGstinIds = this.form.value.gstinIds; // temp line for bug
    this.transformValueBeforeSubmit();
    this.form.value.gstinIds = this.tempGstinIds; // temp line for bug
    // console.log(this.form.value);
    this.companySvc
      .editCompany({ resource: this.form.value }, this.form.value.id)
      .subscribe((a) => {
        if (a.status) {
          console.log('SAVED DATAA ', this.form.value);

          this.getCompanybyId(this.form.value.id);
          // this.editSection = 0;
          this.kycEditSection = false;
          this.toastrSvc.success('Updated Successfully');
        }
      });

  }
    
  kycSave() {
    this.kycEditSection = false;
    this.pristineVal = this.editDetails.value;
  }

  getCompanybyId(id) {
    this.companySvc.getCompanybyId(id).subscribe((a) => {
      if (a.status) {
        this.form.patchValue({
          id: a.data.id,
          name: a.data.name,
          code: a.data.code,
          friendlyname: a.data.friendlyname,
          flags: a.data.flags,
          parentid: a.data.parentid,
          comptype: a.data.comptype,
          addresses: a.data.addresses,
          contacts: a.data.contacts,
          aliases: a.data.aliases,
          group: a.data.group,
          parentfriendlyname: a.data.parentfriendlyname,
          parentlegalname: a.data.parentlegalname,
          ofacs: a.data.ofacs,
          isactive: a.data.isactive,
          blackList: a.data.blackList,
          registered: { countryname: a.data.registered },
          vendorsapid: a.data.vendorsapid,
          customersapid: a.data.customersapid,
          accountManagers: a.data.accountManagers,
          otherEmails: a.data.otherEmails,
          otherPhoneNumbers: a.data.otherPhoneNumbers,
          gstinIds: a.data.gstinIds,
          partnerLevel: a.data.partnerLevel,
          // aadhaarId : a.data.aadhaar.aadhaarId,
          // aadhaarName : a.data.aadhaar.name,
          // aadhaarAddress: a.data.aadhaar.address,
          // care_of: a.data.aadhaar.care_of,
          // aadhaarDob: a.data.aadhaar.dob,
          // aadhaarGender : a.data.aadhaar.gender
          aadhaar: a.data.aadhaar
            ? {
                aadhaarId: a.data.aadhaar.aadhaarId,
                aadhaarName: a.data.aadhaar.name,
                aadhaarAddress: a.data.aadhaar.address,
                care_of: a.data.aadhaar.care_of,
                aadhaarDob: a.data.aadhaar.dob,
                aadhaarGender: a.data.aadhaar.gender,
              }
            : {},
        });
        this.distOfac();
        // this.toastrSvc.success('Company Details Saved') ;
      }
    });
  }

  btnSwapper(btnInfo: string) {
    this.btnTab = btnInfo;
  }
  childBtnSwapper(btnInfo: string) {
    this.childBtnTab = btnInfo;
    this.kycEditSection = false;
  }

  // testing() {
  //   // console.log('Error Found', this.editCompanyForm.get('aadhaarPhoneNumber'));
  //   console.log(this.form);
  // }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
}

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

export class FormDataConstants {
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  phonePattern = '^[+0-9]*$';
  withoutNum = '^([^0-9]*)$';
  onlyCharPattern = '^[a-zA-Z ]*$';
  aadhaarPattern =
    '^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}s[0-9]{4}s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)';
  gstPattern = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
  panPattern = '[A-Z]{5}[0-9]{4}[A-Z]{1}';
  aadhaarNamePattern = "([A-Z][a-z]*)([\\s\\'-][A-Z][a-z]*)*";
  // company addition form data
  editCompanyForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    code: new FormControl(''),
    friendlyname: new FormControl(''),
    parentid: new FormControl(''),
    parentfriendlyname: new FormControl(''),
    parentlegalname: new FormControl(''),
    group: new FormControl({ id: null, name: '' }),
    primaryEmailId: new FormControl('', [
      Validators.pattern(this.emailPattern),
    ]),
    primaryPhoneNumber: new FormControl('', [
      Validators.pattern(this.phonePattern),
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
    comptype: new FormControl(''),
    contacts: new FormControl([]),
    aliases: new FormControl([]),
    vendorsapid: new FormControl([]),
    customersapid: new FormControl([]),
    accountManagers: new FormControl([]),
    otherEmails: new FormControl([]),
    otherPhoneNumbers: new FormControl([]),
    partnerLevel: new FormControl(''),
    addresses: new FormControl([]),
    ofacs: new FormControl([]),
    registered: new FormControl(''),
    employeeName: new FormControl(''),
    employeeAddress: new FormControl(''),
    isAadhaarVerified: new FormControl(null),
    dob: new FormControl(''),
    aadhaar: new FormGroup({
      aadhaarId: new FormControl('', [Validators.pattern(this.aadhaarPattern)]),
      name: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
      address: new FormControl(''),
      gender: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
      care_of: new FormControl('', [Validators.pattern(this.withoutNum)]),
      dob: new FormControl(''),
      email: new FormControl(''),
      id: new FormControl(''),
      message: new FormControl(''),
      mobile_hash: new FormControl(''),
      photo_link: new FormControl(''),
      ref_id: new FormControl(''),
      split_address: new FormControl(null),
      status: new FormControl(''),
      year_of_birth: new FormControl(''),
    }),
    pan: new FormGroup({
      id: new FormControl('', [Validators.pattern(this.panPattern)]),
      name: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
      dob: new FormControl(''),
      fathersName: new FormControl('', [Validators.pattern(this.withoutNum)]),
    }),
    aadhaarId: new FormControl(''),
    panId: new FormControl('', [Validators.pattern(this.panPattern)]),
    companyId: new FormControl(''),
    gstinIds: new FormControl([]),
    ieCode: new FormControl(''),
    blackList: new FormControl(false),
    isactive: new FormControl(''),
    ofacrequired: new FormControl(true),
    flags: new FormGroup({
      mobilemsa: new FormControl(''),
      voicemsa: new FormControl(''),
      smsmsa: new FormControl(''),
      iotmsa: new FormControl(''),
      nda: new FormControl(''),
      ndaiot: new FormControl(''),
    }),
  });

  addCompanyForm = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(null),
    friendlyname: new FormControl(''),
    parentid: new FormControl(''),
    comptype: new FormControl(''),
    contacts: new FormControl([]),
    aliases: new FormControl([]),
    vendorsapid: new FormControl([]),
    customersapid: new FormControl([]),
    accountManagers: new FormControl([]),
    otherEmails: new FormControl([]),
    otherPhoneNumbers: new FormControl([]),
    partnerLevel: new FormControl(''),
    addresses: new FormControl([]),
    group: new FormControl({ id: null, name: '' }),
    primaryEmailId: new FormControl('', [
      Validators.pattern(this.emailPattern),
    ]),
    primaryPhoneNumber: new FormControl('', [
      Validators.pattern(this.phonePattern),
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
    registered: new FormControl(''),
    employeeName: new FormControl(''),
    employeeAddress: new FormControl(''),
    dob: new FormControl(''),
    aadhaarId: new FormControl(''),
    panId: new FormControl('', [Validators.pattern(this.panPattern)]),
    companyId: new FormControl(''),
    gstinIds: new FormControl([]),
    ieCode: new FormControl(''),
    blackList: new FormControl(false),
    isactive: new FormControl(true),
    aadhaar: new FormGroup({
      aadhaarId: new FormControl('', [Validators.pattern(this.aadhaarPattern)]),
      name: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
      address: new FormControl(''),
      gender: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
      care_of: new FormControl('', [Validators.pattern(this.withoutNum)]),
      dob: new FormControl(''),
      email: new FormControl(''),
      id: new FormControl(''),
      message: new FormControl(''),
      mobile_hash: new FormControl(''),
      photo_link: new FormControl(''),
      ref_id: new FormControl(''),
      split_address: new FormControl(null),
      status: new FormControl(''),
      year_of_birth: new FormControl(''),
    }),
    pan: new FormGroup({
      id: new FormControl('', [Validators.pattern(this.panPattern)]),
      name: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
      dob: new FormControl(''),
      fathersName: new FormControl('', [Validators.pattern(this.withoutNum)]),
    }),
    flags: new FormGroup({
      mobilemsa: new FormControl(),
      voicemsa: new FormControl(),
      smsmsa: new FormControl(),
      iotmsa: new FormControl(),
      nda: new FormControl(),
      ndaiot: new FormControl(),
    }),
  });

  extractionAadhaarForm = new FormGroup({
    aadhaarId: new FormControl('', [
      Validators.pattern(this.aadhaarPattern),
      Validators.required,
    ]),
    // name: new FormControl('', [
    //   Validators.pattern(this.aadhaarNamePattern),
    //   Validators.required,
    // ]),
  });

  checkHistoryForm = new FormGroup({
    employeeName: new FormControl('', [Validators.required]),
    employeeAdress: new FormControl('', [Validators.required]),
    dob: new FormControl(''),
  });

  contactForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(this.onlyCharPattern),
    ]),
    typeid: new FormControl(''),
    email: new FormControl('', [
      Validators.email,
      Validators.pattern(this.emailPattern),
    ]),
    // countryCode: new FormControl('+1') ,
    phone: new FormControl('', [
      Validators.pattern(this.phonePattern),
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
    fax: new FormControl('', [
      Validators.pattern(this.phonePattern),
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
  });

  signatory = new FormGroup({
    signatoryname: new FormControl(''),
    ofacdate: new FormControl(''),
    outcome: new FormControl(''),
    transactionid: new FormControl(''),
    issignatory: new FormControl(true),
  });
  companyAddress = new FormGroup({
    line: new FormControl(''),
    country: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
    postalcode: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(12),
    ]),
    type: new FormControl(''),
    friendlyaddress: new FormControl(''),
  });
  editCompanyAddress = new FormGroup({
    id: new FormControl(''),
    line: new FormControl(''),
    country: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl('', [Validators.pattern(this.onlyCharPattern)]),
    postalcode: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(12),
    ]),
    friendlyaddress: new FormControl(''),
    type: new FormControl(''),
  });
  outcomeType = ['FAILED', 'PASS'];

  // contracting entities form data //

  emailList = [
    { value: 'billinginquiryemail', label: 'Billing Inquiry', emails: [] },
    { value: 'customerdisputesemail', label: 'Customer Disputes', emails: [] },
    {
      value: 'carriersettlementsemail',
      label: 'Carrier Settlements',
      emails: [],
    },
    {
      value: 'ratenotificationsemail',
      label: 'Rate Notifications',
      emails: [],
    },
    {
      value: 'invoicesandnewbankingdetailsemail',
      label: 'Invoices And New Banking Details',
      emails: [],
    },
    { value: 'otherinquiriesemail', label: 'Other Inquiries', emails: [] },
    {
      value: 'smsbillinginquiriesemail',
      label: 'SMS Billing Inquiries',
      emails: [],
    },
    {
      value: 'smscustomerdisputesemail',
      label: 'SMS Customer Disputes',
      emails: [],
    },
    {
      value: 'smstechnicalsupportemail',
      label: 'SMS Technical Support',
      emails: [],
    },
    {
      value: 'smsratenotificationsemail',
      label: 'SMS Rate Notification',
      emails: [],
    },
  ];

  contractEntity = new FormGroup({
    entitylegalname: new FormControl(''),
    entityname: new FormControl(''),
    registration: new FormControl(''),
    companytype: new FormControl(''),
    alias: new FormControl(''),
    code: new FormControl(''),

    // visiblein: new FormControl([]) ,
    principaladdress: new FormGroup({
      line: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      postalcode: new FormControl(''),
      type: new FormControl(''),
      friendlyaddress: new FormControl(''),
    }),
    corporateidnumber: new FormControl(''),
    email: new FormControl({
      billinginquiryemail: [],
      customerdisputesemail: [],
      carriersettlementsemail: [],
      ratenotificationsemail: [],
      invoicesandnewbankingdetailsemail: [],
      otherinquiriesemail: [],
      smsbillinginquiriesemail: [],
      smscustomerdisputesemail: [],
      smstechnicalsupportemail: [],
      smsratenotificationsemail: [],
    }),
    bankdetails: new FormControl([]),
    noticecontact: new FormControl({
      noticeAddress: '',
      countryCode: '',
      attn: '',
      email: '',
      fax: '',
      tel: '',
    }),
  });

  editContractEntity = new FormGroup({
    id: new FormControl(''),
    entitylegalname: new FormControl(''),
    entityname: new FormControl(''),
    registration: new FormControl(''),
    companytype: new FormControl(''),
    alias: new FormControl(''),
    code: new FormControl(''),
    // visiblein: new FormControl([]) ,
    principaladdress: new FormGroup({
      line: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      postalcode: new FormControl(''),
      type: new FormControl(''),
      friendlyaddress: new FormControl(''),
    }),
    corporateidnumber: new FormControl(''),
    email: new FormControl({
      billinginquiryemail: [],
      customerdisputesemail: [],
      carriersettlementsemail: [],
      ratenotificationsemail: [],
      invoicesandnewbankingdetailsemail: [],
      otherinquiriesemail: [],
      smsbillinginquiriesemail: [],
      smscustomerdisputesemail: [],
      smstechnicalsupportemail: [],
      smsratenotificationsemail: [],
    }),
    bankdetails: new FormControl([]),
    noticecontact: new FormControl({
      noticeAddress: '',
      countryCode: '',
      attn: '',
      email: '',
      fax: '',
      tel: '',
    }),
  });
  bankDetails = new FormGroup({
    bankbenficiaryname: new FormControl(''),
    bankalias: new FormControl(''),
    bankname: new FormControl(''),
    bankbranch: new FormControl(''),
    bankaccountnumber: new FormControl(''),
    bankaccountcurrency: new FormControl(''),
    bankibancode: new FormControl(''),
    bankswift: new FormControl(''),
    bankaddress: new FormControl([]),
    bankfriendlyaddress: new FormControl(''),
  });
  noticeForm = new FormGroup({
    noticeAddress: new FormGroup({
      line: new FormControl(''),
      country: new FormControl({}),
      state: new FormControl(''),
      city: new FormControl(''),
      postalcode: new FormControl(),
      friendlyaddress: new FormControl(),
    }),
    countryCode: new FormControl(''),
    attn: new FormControl(''),
    email: new FormControl('', [Validators.pattern(this.emailPattern)]),
    fax: new FormControl('', [
      Validators.pattern(this.phonePattern),
      Validators.minLength(5),
      Validators.maxLength(15),
    ]),
    tel: new FormControl('', [
      Validators.pattern(this.phonePattern),
      Validators.minLength(5),
      Validators.maxLength(15),
    ]),
  });

  historicalDocList = [
    { label: 'NDA', value: 'nda' },
    { label: 'MOBILE MSA', value: 'mobilemsa' },
    { label: 'VOICE MSA', value: 'voicemsa' },
    { label: 'SMS MSA', value: 'smsmsa' },
    { label: 'IOT MSA', value: 'iotmsa' },
    { label: 'NDA IOT', value: 'ndaiot' },
  ];
}

// mobilemsa?: string ;
// voicemsa?: string ;
// smsmsa?: string ;
// iotmsa?: string ;
// nda?: string ;
// ndaiot?: string;

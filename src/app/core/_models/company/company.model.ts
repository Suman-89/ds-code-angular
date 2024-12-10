import { CompanyAddressModel } from './company-address.model';
export interface CompanyModel {
  id: string;
  code: string;
  parentid?: string;
  parentfriendlyname?: string;
  parentlegalname?: string;
  partnerLegalName: string;
  friendlyname: string;
  registered: string;
  name: string;
  type: string;
  aliases: string[];
  contacts: string[];
  group: string;
  formerlyknownas: string;
  addresses: CompanyAddressModel[];
  comptype: string;
  isactive: boolean;
  ofacrequired?: boolean;
  ofacdone?: boolean;
  ofacs: OFACSignatoryModel[];
  // status?: string ;
  // historical contract section
  flags?: CompanyFlagsModel;
  vendorsapid: string[];
  customersapid: string[];
  accountManagers: string[];
  otherEmails: string[];
  otherPhoneNumbers: string[];
  partnerLevel: string;
  panId: string;
  companyId: string;
  gstinIds: string[];
  ieCode: number;
  blackList: boolean;
  employeeName: string;
  employeeAddress: string;
  dob: string;
  isAadhaarVerified: boolean;
  isNewEmployee?: boolean;
  primaryEmailId: string;
  primaryPhoneNumber: string;
  aadhaar: {
    aadhaarId: string;
    name: string;
    address: string;
    gender: string;
    care_of: string;
    dob: string;
    email: string;
    id: string;
    message: string;
    mobile_hash: string;
    photo_link: string;
    ref_id: string;
    split_address: {
      country: String;
      dist: String;
      house: String;
      landmark: String;
      pincode: String;
      po: String;
      state: String;
      street: String;
      subdist: String;
      vtc: String;
    };
    status: string;
    year_of_birth: string;
  };
  pan: {
    id: string;
    name: string;
    dob: string;
    fathersName: string;
  };
}

export interface CompanyFlagsModel {
  mobilemsa: boolean;
  voicemsa: boolean;
  smsmsa: boolean;
  iotmsa: boolean;
  nda: boolean;
  ndaiot: boolean;
}

export interface OFACOutcomeModel {
  date: Date;
  result: string;
}

export interface OFACSignatoryModel {
  signatoryname: string;
  date: Date;
  outcome: string;
  issignatory: boolean;
}

export interface ContactModel {
  contact: string;
  contacttype: string;
  contactemail: string;
  countryCode: string;
  contactphone: number;
  contactfax: number;
}

export interface CompanyGroupModel {
  id: string;
  name: string;
}

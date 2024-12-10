import { CompanyAddressModel } from 'src/app/core/_models/company/company-address.model';
export class ContractingEntites {
  entityname: string;
  registration: string;
  carriertype: string;
  principaladdress: CompanyAddressModel;
  corporateidnumber: string;
  emaillist: ContractEmailModel ;
  bankdetails: BankDetailsModel[] ;
  noticecontact: NoticeContactModel ;
}

export class BankDetailsModel {
  benficiaryname: string ;
  bankname: string ;
  branch: string ;
  bankaccountnumber: string ;
  bankaccountcurrency: string ;
  ibancode: string ;
  swift: string ;
  bankaddress: CompanyAddressModel ;
}


export class ContractEmailModel {
  billinginquiryemail: string;
  customerdisputesemail: string ;
  carriersettlementsemail: string ;
  ratenotificationsemail: string ;
  invoicesandnewbankingdetails: string ;
  otherinquiries: string ;
  smsbillinginquiriesemail: string ;
  smscustomerdisputesemail: string ;
  smstechnicalsupportemail: string ;
  smsratenotificationsemail: string ;
}


export class NoticeContactModel {
  noticeaddress: CompanyAddressModel;
  attn: string ;
  email: string;
  tel: string;
  fax: string ;
}

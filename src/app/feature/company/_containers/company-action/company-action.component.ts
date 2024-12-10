import { CompanyModel, FormDataConstants } from 'src/app/core/_models';
// import { ProcessDefService } from './../../../process/layout/_services/process-def.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CompanyManagementService,
  SharedService,
} from 'src/app/core/_services';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-company-action',
  templateUrl: './company-action.component.html',
  styleUrls: ['./company-action.component.scss'],
})
export class CompanyActionComponent implements OnInit {
  @ViewChild('company') companyFormChild;
  actType;
  model: CompanyModel;
  edit;
  editform;
  compId;
  countrylist;
  constructor(
    private route: Router,
    private actRoute: ActivatedRoute,
    private compService: CompanyManagementService,
    private toastrSvc: ToastrService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    this.getCountryList();
  }

  getActType() {
    this.compId = this.actRoute.snapshot.paramMap.get('id');
    if (!this.compId) {
      this.actType = 'Add Company';
      this.editform = null;
      this.edit = false;
      this.editform = new FormDataConstants().editCompanyForm;
    } else if (this.compId) {
      this.getCompanyById(this.compId);
    }
  }

  getCompanyById(pid) {
    this.compService.getCompanybyId(pid).subscribe((res) => {
      this.model = res.data;
      this.actType = this.model.name;
      this.editform = new FormDataConstants().editCompanyForm;
      this.edit = true;
      this.createEditForm();
    });
  }

  createEditForm() {
    this.editform.patchValue({
      id: this.model.id,
      name: this.model.name,
      code: this.model.code,
      friendlyname: this.model.friendlyname,
      employeeName: this.model.employeeName,
      employeeAddress: this.model.employeeAddress,
      dob: this.model.dob,
      isAadhaarVerified: this.model.isAadhaarVerified,
      // isNewEmployee: this.model.isNewEmployee,
      primaryEmailId: this.model.primaryEmailId,
      primaryPhoneNumber: this.model.primaryPhoneNumber,
      aadhaar: this.model.aadhaar
        ? {
            aadhaarId: this.model.aadhaar.aadhaarId,
            name: this.model.aadhaar.name,
            address: this.model.aadhaar.address,
            email: this.model.aadhaar.email,
            gender: this.model.aadhaar.gender,
            care_of: this.model.aadhaar.care_of,
            dob: this.model.aadhaar.dob
              ? this.dobFormatter(this.model.aadhaar.dob)
              : '',
            id: this.model.aadhaar.id,
            message: this.model.aadhaar.message,
            mobile_hash: this.model.aadhaar.mobile_hash,
            photo_link: this.model.aadhaar.photo_link,
            ref_id: this.model.aadhaar.ref_id,
            split_address: this.model.aadhaar.split_address,
            status: this.model.aadhaar.status,
            year_of_birth: this.model.aadhaar.year_of_birth,
          }
        : {},
      pan: this.model.pan
        ? {
            id: this.model.pan.id,
            name: this.model.pan.name,
            dob: this.model.pan.dob
              ? this.dobFormatter(this.model.pan.dob)
              : '',
            fathersName: this.model.pan.fathersName,
          }
        : {},
      panId: this.model.panId,
      companyId: this.model.companyId,
      gstinIds: this.model.gstinIds,
      ieCode: this.model.ieCode,
      blackList: this.model.blackList,
      parentid: this.model.parentid,
      comptype: this.model.comptype,
      addresses: this.model.addresses,
      contacts: this.model.contacts,
      aliases: this.model.aliases,
      customersapid: this.model.customersapid,
      vendorsapid: this.model.vendorsapid,
      accountManagers: this.model.accountManagers,
      otherEmails: this.model.otherEmails,
      otherPhoneNumbers: this.model.otherPhoneNumbers,
      partnerLevel: this.model.partnerLevel,
      group: this.model.group,
      parentfriendlyname: this.model.parentfriendlyname,
      parentlegalname: this.model.parentlegalname,
      ofacs: this.model.ofacs,
      isactive: this.model.isactive,
      registered: this.model.registered
        ? this.countrylist.find((c) => c.countryname === this.model.registered)
        : '',
      ofacrequired: this.model.ofacrequired,
      flags: this.returnFlag(this.model.flags),
    });
    // console.log('yoooooooooooooooooooooooooooo', this.model.aadhaar.dob);

    // console.log(
    //   'helooooooooooooooooooooooooooooooooooo',
    //   moment(this.model.aadhaar.dob).format('YYYY-MM-DD')
    // );
  }
   
  profileImg:any;
  getProfileImg(event){
    this.profileImg=event.data;
  }

  
  
  back() {
    let path;
    this.model ? (path = '../../') : (path = '../');
    this.route.navigate([path], { relativeTo: this.actRoute });
  }

  formClickEvent(event) {
    switch (event.type) {
      case 1:
        this.addOrEditDecider(event.data);
        break;
      case 2:
        this.back();
        break;
    }
  }

  addOrEditDecider(data) {
    if (this.model) {
      this.editCompany(data);
    } else {
      this.addCompany(data);
    }
  }

  addCompany(data) {
    this.compService.addCompany(data).subscribe((res) => {
      if (res.status) {
        // console.log(res.data)        //
        // console.log(this.profileImg) 
        if(this.profileImg){
         this.compService.getCompanybyId(res.data).subscribe((res)=> {
                //  console.log(res)
                  let formdata = new FormData();   
                  formdata.append('companyPic', this.profileImg);
                  // console.log(formdata)
                  this.compService.uploadCompanyProfileImage(res.data.code, formdata).subscribe((p) => {
                    if (p.status) {
                      console.log("Profile pic uploaded successfully")
                    }
                  })
                
         })
        }
        this.toastrSvc.success('Company Added');
        this.companyFormChild.createNewForm();
        this.back();
      }
    });
  }

  editCompany(data) {
    this.compService.editCompany(data, this.compId).subscribe((res) => {
      if (res.status) {
        this.toastrSvc.success('Company Details Edited');
        this.back();
      }
    });
  }

  returnFlag(flag) {
    return this.sharedSvc.returnFlags(flag);
  }

  getCountryList() {
    //  this.sharedSvc.getCountries() ;
    this.sharedSvc.countryList$.subscribe((a) => {
      if (a) {
        this.countrylist = a;
        this.getActType();
      } else {
        this.sharedSvc.getCountries();
      }
    });
  }

  dobFormatter(date: string) {
    // console.log('Ami mukul', moment(date).format('YYYY-MM-DD'));
    // console.log(
    //   'yooooooooooo',
    //   moment('2023-03-14T00:00:00.000+00:00').format('YYYY-MM-DD')
    // );
    // console.log(date);

    if (date === moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY')) {
      return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    } else {
      return moment(date).format('YYYY-MM-DD');
    }
  }
}

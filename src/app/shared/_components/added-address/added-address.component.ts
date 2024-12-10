 import { CompanyAddressModel } from './../../../core/_models/company/company-address.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { CompanyManagementService, SharedService } from 'src/app/core/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-added-address',
  templateUrl: './added-address.component.html',
  styleUrls: ['./added-address.component.scss']
})
export class AddedAddressComponent implements OnInit {
  @Input() addresses: CompanyAddressModel[] = [] ;
  @Input() compId?:number;
  @Input() singleAddr ?: CompanyAddressModel ;
  @Input() showActBtns ? = true ;
  @Input() showAddBtn ;
  @Input() header ? = 'Address' ;
  @Output() addressAction: EventEmitter<any> = new EventEmitter<any>() ;
  @Output() addAddress: EventEmitter<any> = new EventEmitter<any>() ;
  @Output() isediting = new EventEmitter() ;
  editId ;
  editAddressVal ;
  countries ; 

  constructor(private sharedSvc: SharedService, private toastrSvc: ToastrService ,
    private companySvc : CompanyManagementService) { }

  ngOnInit(): void {
    console.log("addressess", this.addresses)
    this.sharedSvc.countryList$.subscribe(a => {
      if(a) {
        this.countries = a ;
      } else {
        this.sharedSvc.getCountries() ;
      }
    })
    if (this.singleAddr) {
      this.addresses.push(this.singleAddr) ;
    }
  }

  emitAddressAction(address, idx, action) {
    if(!this.editAddressVal) {
      this.editAddressVal = address ;
    }
    this.editAddressVal.country =  this.editAddressVal.country.countryname ? this.editAddressVal.country.countryname : this.editAddressVal.country ;
    this.editAddressVal.state = this.editAddressVal.state && this.editAddressVal.state.statename ?
      this.editAddressVal.state.statename: '' ;
    
    this.checkForCountry() ? this.addressAction.emit({data: this.editAddressVal, id: idx, type: action}) : this.toastrSvc.error('Please enter country') ;
    this.checkForCountry() ? this.closeEdit() : null ;

  }

  checkForCountry() {
    return this.editAddressVal.country === '' || !this.editAddressVal.country ? false : true 
   }

  editAddress(id) {
    this.editId = id ;
    this.isediting.emit(true) ;
  }

  closeEdit() {
    this.editId = -1 ;
    this.isediting.emit(false) ;
  }



  changeAddress(address) {
    // const id =  this.addresses[this.editId].id ;
    // this.addresses[this.editId] = address ;
    // this.addresses[this.editId].id = id ;
    // this.emitAddressAction(address, this.editId, 'edit') ;
    // this.addressAction.emit({data: address, id:  this.editId, type: 'edit'}) 
    // this.editId = -1 ;
    this.editAddressVal = address ;
    this.editAddressVal.id = this.addresses[this.editId].id ;
 
  }
   
  deleteAddress(address,idx) {
    // this.editId = - 1 ;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Address!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.emitAddressAction(address, idx, 'remove')
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
      ) ;
      }
    }) ;
  }
  // deleteAddress(address, idx) {
  //   this.editId = - 1 ;
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover this Address!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.emitAddressAction(address, idx, 'remove') ;
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //     Swal.fire(
  //       'Cancelled',
  //     ) ;
  //     }
  //   }) ;
  // }


  toggleAddressForm() {
    this.addAddress.emit() ;
  }

  returnAddressType(data) {
    return this.sharedSvc.returnAddressType(data) ;
  }
}

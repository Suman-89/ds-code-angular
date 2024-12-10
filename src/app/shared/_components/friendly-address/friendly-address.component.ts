import { CompanyAddressModel } from 'src/app/core/_models';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-friendly-address',
  templateUrl: './friendly-address.component.html',
  styleUrls: ['./friendly-address.component.scss']
})
export class FriendlyAddressComponent implements OnInit, OnChanges {
@Input() friendlyAddress: any ;
@Input() emitOnChange ? = false ;
@Input() frndAddrnum: any ;
@Output() friendlyAddressEmit = new EventEmitter<any>() ;
addressText: string ;
  constructor() { }

  ngOnInit(): void {
   this.getDetails() ;
  }

 ngOnChanges() {
  this.getDetails() ;

 }

 getDetails() {
  if (this.friendlyAddress.country) {
    let p1 ;
    this.friendlyAddress.line && this.friendlyAddress.line.length > 0 ? p1 = this.friendlyAddress.line + ',' : p1 = '' ;
    let p2 ;
    this.friendlyAddress.city && this.friendlyAddress.city.length > 0 ? p2 = this.friendlyAddress.city + ',' : p2 = '' ;
    let p3 ;
    this.friendlyAddress.state && this.friendlyAddress.state.length > 0 ? p3 = this.friendlyAddress.state + ',' : p3 = '' ;
    let p4 ;
    this.friendlyAddress.country && this.friendlyAddress.country.length > 0 ? p4 = this.friendlyAddress.country + ',' : p4 = '' ;
    let p5 ;
    this.friendlyAddress.postalcode && this.friendlyAddress.postalcode.length > 0 ? p5 = this.friendlyAddress.postalcode + ',' : p5 = '' ;
    this.addressText = `${p1}${p2}${p3}${p4}${p5}` ;
  } else {
    this.addressText = this.friendlyAddress ;
  }
  this.emitAddress() ;
 }
  emitAddress() {
   this.friendlyAddressEmit.emit(this.addressText) ;
  }

  emitChange() {
    if (this.emitOnChange) {
      this.emitAddress() ;
    }
  }

}

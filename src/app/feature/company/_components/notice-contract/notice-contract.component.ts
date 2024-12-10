import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/core/_services';

@Component({
  selector: 'app-notice-contract',
  templateUrl: './notice-contract.component.html',
  styleUrls: ['./notice-contract.component.scss']
})
export class NoticeContractComponent implements OnInit, OnChanges {
@Input() noticeForm: FormGroup ;
@Output() noticeFormEmit: EventEmitter<any> = new EventEmitter<any>() ;
expandPanel = false ;
countries ;
  constructor(private sharedSvc: SharedService) { }

  ngOnInit(): void {
    this.sharedSvc.countryList$.subscribe(a => {
      if(a) {
        this.countries = a ;
      } else {
        this.sharedSvc.getCountries() ;
      }
        
    })
  }

  ngOnChanges(): void {
    this.noticeFormEmit.emit(this.noticeForm.value) ;
  }

  togglepanel() {
    this.expandPanel = !this.expandPanel ;
  }
  addAddress(event) {
    this.noticeForm.value.noticeAddress = event.data ;
  }
}

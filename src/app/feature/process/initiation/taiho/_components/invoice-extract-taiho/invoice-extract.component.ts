import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MapToFormlyService, TaskService } from '../../../../layout/_services';
import { ExtractedDataModel } from '../../../_models';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ProcessFormModel } from 'src/app/core/_models';

@Component({
  selector: 'app-invoice-extract-taiho',
  templateUrl: './invoice-extract.component.html',
  styleUrls: ['./invoice-extract.component.scss']
})
export class InvoiceExtractTaihoComponent implements OnInit {
  @Input() extractedData: ExtractedDataModel ;
  @Input() poTypeahead ;
  
  @Output() emitExtractedDataChanges = new EventEmitter() ;
  @Output() emitPoNumber = new EventEmitter() ; 
  @Output() selectAnnotation = new EventEmitter() ; 
  info = {render: false, text : '', color: '#2aa89b'} ;
  searchFormatter = x => x.purchase_order ? x.purchase_order: x ;
  
  searchPoNumber = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.poTypeahead.filter(v => v.purchase_order.trim().toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        ) ;
      }
    constructor(private ngbDateParserFormatter: NgbDateParserFormatter, private taskSvc: TaskService) { }
    
  
    ngOnInit(): void {
    }
  
    emitForAnnotation(key) {
      key = key.purchase_order ? key.purchase_order: key ;
      this.selectAnnotation.emit(key) ;
    }
  
    emitData() {
      this.emitExtractedDataChanges.emit(this.extractedData) ;
    }
  
    dateSelectEvent(ev, opt?) {
     opt?  this.extractedData.po_date =  this.ngbDateParserFormatter.format(ev) : 
             this.extractedData.invoice_date = this.ngbDateParserFormatter.format(ev) ;
     this.emitData() ;
    }
  
    returnLabel(name) {
      switch(name) {
        case 'invoice_date' :
          return 'Invoice Date' ;
        case 'invoice_id' :
          return 'Invoice Id' ;
        case 'purchase_order' :
          return 'Purchase Order' ; 
        case 'total_amount' :
            return 'Total Amount' ;   
        case 'vendor_name':
            return 'Vendor Name'   ;
        case 'po_date':
          return 'PO Date'  ;
        case 'total_po_value' :
          return 'Total PO Value' ;
        case 'amt_consumed_till_date' :
          return 'Amount Consumed till date' ; 
        case 'amount_left':
          return 'Amount left' ; 
        case 'business_owner':
            return 'PO Business Owner' ; 
        case 'business_group':
              return 'PO Business Group' ;                  
      }
    }
  
    emitSelectedPoNumber(ev) {
      this.emitPoNumber.emit(ev.item.purchase_order) ;
    }
  }

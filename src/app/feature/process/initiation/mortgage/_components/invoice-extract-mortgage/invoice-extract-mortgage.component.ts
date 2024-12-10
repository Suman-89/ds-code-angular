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
  selector: 'app-invoice-extract-mortgage',
  templateUrl: './invoice-extract-mortgage.component.html',
  styleUrls: ['./invoice-extract-mortgage.component.scss']
})
export class InvoiceExtractMortgageComponent implements OnInit {

  @Input() extractedData: any ;
  
  @Output() emitExtractedDataChanges = new EventEmitter() ;
  @Output() selectAnnotation = new EventEmitter() ; 
  info = {render: false, text : '', color: '#2aa89b'} ;
  searchFormatter = x => x.purchase_order ? x.purchase_order: x ;
  
  constructor(private ngbDateParserFormatter: NgbDateParserFormatter, private taskSvc: TaskService) { }
  

  ngOnInit(): void {
    console.log(this.extractedData);
  }

  // emitForAnnotation(key) {
  //   key = key.purchase_order ? key.purchase_order: key ;
  //   this.selectAnnotation.emit(key) ;
  // }
  emitForAnnotation(field) {
    this.selectAnnotation.emit(field) ;
  }

  emitData() {
    this.emitExtractedDataChanges.emit(this.extractedData) ;
  }

}

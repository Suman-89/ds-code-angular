import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MapToFormlyService, TaskService } from '../../../layout/_services';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ProcessFormModel } from 'src/app/core/_models';
import { ExtractedDataModel } from '../../_models/extracted-data.model';

@Component({
  selector: 'app-invoice-extract-config',
  templateUrl: './invoice-extract.component.html',
  styleUrls: ['./invoice-extract.component.scss'],
})
export class InvoiceExtractComponent implements OnInit {
  @Input() extractedData: ExtractedDataModel;
  @Input() initData: ProcessFormModel;
  @Input() poTypeahead;
  @Output() emitExtractedDataChanges = new EventEmitter();
  @Output() emitPoNumber = new EventEmitter();
  @Output() selectAnnotation = new EventEmitter();
  @Output() btnDisablerEmitter = new EventEmitter();
  process;
  user;
  fields: FormlyFieldConfig[] = [];
  info = { render: false, text: '', color: '#2aa89b' };
  model = {};
  modelValue = {};
  form = new FormGroup({});
  notBookingIssues = [
    'Conference Room Booking',
    'Extra Room Required',
    'Extra Seat Required',
    'Projector and Screen Booking',
    'Weekend Booking',
  ];

  searchFormatter = (x) => (x.purchase_order ? x.purchase_order : x);

  searchPoNumber = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.poTypeahead
              .filter(
                (v) =>
                  v.purchase_order
                    .trim()
                    .toLowerCase()
                    .indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  };
  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private taskSvc: TaskService,
    private maptoFormlySvc: MapToFormlyService
  ) {}

  ngOnInit(): void {
    this.process = JSON.parse(localStorage.getItem('selected-process')).key;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.transformToformly();
    console.log("forms" , this.form)
    this.form.valueChanges.subscribe((a) => {
      // console.log("inintdata variables", this.initData.variables)
      // console.log("fields", this.fields)

      for (let i of this.initData.variables) {
          let existingChildOpt=i.options;
          
        if(i.isDropdownDependent && a[i.parentDropdownName]!==null){
          // console.log("iiii" , a[i.parentDropdownName])/
              
            let dependentDropdownVar  = this.fields.find((el)=> el.key === i.name)
            let prevOptions :any[] = Array.isArray(dependentDropdownVar.templateOptions.options) ?  dependentDropdownVar.templateOptions.options : [dependentDropdownVar.templateOptions.options];
             let options: any = existingChildOpt;
           let filteredOptions: any[] = Array.isArray(options) ? options : [options];
          //  console.log("filteredoptions" , filteredOptions , a[i.parentDropdownName])
        filteredOptions=filteredOptions.filter((el)=> {
            return el.instanceParentName === a[i.parentDropdownName]
          })

         
          
          // console.log("flteredlenggthhhhh", filteredOptions, existingChildOpt , prevOptions)
          if(prevOptions.length === 0){
            // alert("fisrt time change")
          dependentDropdownVar.templateOptions.options = filteredOptions;
          }
          else if(filteredOptions.length===0){
          dependentDropdownVar.templateOptions.options = [];
          }
          // console.log("revoptions" , prevOptions , filteredOptions)
        else if(prevOptions[0].instanceParentName !== filteredOptions[0].instanceParentName){
            //  console.log("name" ,dependentDropdownVar)
            //  alert(" i m in change")
          dependentDropdownVar.templateOptions.options = filteredOptions;
          this.form.get(i.name).setValue(null);       
          }          
          // console.log("filtered" ,dependentDropdownVar.templateOptions.options)/
  
        }
        if(i.isDropdownDependent && a[i.parentDropdownName]===null){
        
              
            let dependentDropdownVar  = this.fields.find((el)=> el.key === i.name)
      
          dependentDropdownVar.templateOptions.options = [];
       
  
        }


        
        if (i.isDependantVar && i.parentVars) {
          let rules = i.parentVars;
          let hidden = this.rulesCheck(rules, a)
     
          for (let j of this.fields){
            if (i.name === j.key) {
              if(hidden === true){
                a[j.key]="";
              this.model=a;           
              }
              j.hide = hidden;
            }
          }
        }
      }

      this.btnDisablerEmitter.emit(!this.form.valid);
      // console.log("checking about a", a.valid, a.status)
      if (
        this.form.valid &&
        (a.status !== undefined || (a.status === undefined && a.valid))
      ) {
        console.log(a);
        // console.log("form value emitted", a);
        this.emitExtractedDataChanges.emit(a);
      }
    });
  }

  rulesCheck(rulesArr, formObj) {
    // console.log("rulesArr", rulesArr);
    // console.log("formobj", formObj);
    // console.log("rulesarr", rulesArr)

    for (let i of rulesArr) {
      // console.log("i.operator", i.operator);
      // console.log("i", i)
      if (formObj[i.operand] === undefined) {
        return true;
      }
      for (let key in formObj) {
        if (i.operand === key) {
          switch (i.operator) {
            case 'Contains':
              if (formObj[key] === null || !formObj[key].includes(i.value[0])) {
                return true;
              }
              break;
            case 'Does Not Contain':
              if (formObj[key] && formObj[key].includes(i.value[0])) {
                return true;
              }
              break;
            case 'Equals':
              if (formObj[key] !== i.value[0]) {
                return true;
              }
              break;
            case 'Does Not Equal':
              if (formObj[key] === i.value[0]) {
                return true;
              }
              break;
            case 'Greater Than':
              // console.log("checkinggggggggggggg", isNaN(Number(i.value[0])))
              if (isNaN(Number(i.value[0]))) {
                if (new Date(formObj[key]) < new Date(i.value[0])) {
                  return true;
                } else {
                  if (Number(formObj[key]) < Number(i.value[0])) {
                    return true;
                  }
                }
              }

              break;
            case 'Less Than':
              if (isNaN(Number(i.value[0]))) {
                if (new Date(formObj[key]) > new Date(i.value[0])) {
                  return true;
                } else {
                  if (Number(formObj[key]) > Number(i.value[0])) {
                    return true;
                  }
                }
              }
              break;
            case 'Between':
              const lowerBound = new Date(i.value[0]) || Number(i.value[0]);
              const upperBound = new Date(i.value[1]) || Number(i.value[1]);

              const valueToCompare =
                new Date(formObj[key]) || Number(formObj[key]);

              if (valueToCompare < lowerBound || valueToCompare > upperBound) {
                return true;
              }

              break;

            default:
              break;
          }
        }
      }
    }
    return false;
  }

  transformToformly() {
    if (this.process === 'Initiation_surbhiTravelProcess') {
      this.initData.variables.forEach((i) => {
        switch (i.name) {
          case 'firstName':
            i.value = this.user.fname;
            break;
          case 'lastName':
            i.value = this.user.lname;
            break;
          case 'surbhiEmployeeEmail':
            i.value = this.user.email;
            break;
          case 'phoneNumber':
            i.value = this.user.phoneNumber;
            break;
          default:
            i.value = null;
        }
        this.model[i.name] = i.value;
        this.fields = [
          ...this.fields.filter((item) => item.key != 'bookingdate'),
          ...this.maptoFormlySvc.covertToFormlyInput(i, this.initData),
        ];
      });
    } else {
      this.initData.variables.forEach((i) => {
        // if (i.visible) {
        this.model[i.name] = i.value;
        this.fields = [
          ...this.fields.filter((item) => item.key != 'bookingdate'),
          ...this.maptoFormlySvc.covertToFormlyInput(i, this.initData),
        ];

        // }
      });
    }
  }

  emitForAnnotation(key) {
    key = key.purchase_order ? key.purchase_order : key;
    this.selectAnnotation.emit(key);
  }

  emitData() {
    let val = this.maptoFormlySvc.covertToFormlyInput(
      this.initData.variables.find((item) => item.name == 'bookingdate'),
      this.initData
    );
    if (
      this.notBookingIssues.includes(this.model['issueType']) &&
      (this.initData.key == 'Form_createNewTicket' ||
        this.initData.key == 'Form_resolveTicketOperations') &&
      !this.fields.some((e) => e.key === 'bookingdate')
    ) {
      this.fields = [...this.fields, val[0]];
    }
    if (
      !this.notBookingIssues.includes(this.model['issueType']) &&
      (this.initData.key == 'Form_createNewTicket' ||
        this.initData.key == 'Form_resolveTicketOperations') &&
      this.fields.some((e) => e.key === 'bookingdate')
    ) {
      this.fields = this.fields.filter((item) => item.key !== 'bookingdate');
      this.model['bookingdate'] = '';
    }
    this.emitExtractedDataChanges.emit(this.extractedData);
  }

  dateSelectEvent(ev, opt?) {
    opt
      ? (this.extractedData.po_date = this.ngbDateParserFormatter.format(ev))
      : (this.extractedData.invoice_date =
          this.ngbDateParserFormatter.format(ev));
    this.emitData();
  }

  returnLabel(name) {
    switch (name) {
      case 'invoice_date':
        return 'Invoice Date';
      case 'invoice_id':
        return 'Invoice Id';
      case 'purchase_order':
        return 'Purchase Order';
      case 'total_amount':
        return 'Total Amount';
      case 'vendor_name':
        return 'Vendor Name';
      case 'po_date':
        return 'PO Date';
      case 'total_po_value':
        return 'Total PO Value';
      case 'amt_consumed_till_date':
        return 'Amount Consumed till date';
      case 'amount_left':
        return 'Amount left';
      case 'business_owner':
        return 'PO Business Owner';
      case 'business_group':
        return 'PO Business Group';
    }
  }

  emitSelectedPoNumber(ev) {
    this.emitPoNumber.emit(ev.item.purchase_order);
  }
}

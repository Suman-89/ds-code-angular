import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MapToFormlyService, TaskService } from '../../../../layout/_services';
import { ExtractedDataModel } from '../../../_models';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ProcessFormModel } from 'src/app/core/_models';
import { ExtractedDocModel } from '../../../_models/extracted-doc.model';
import { CompanyManagementService } from 'src/app/core/_services';
import { FormDataConstants } from 'src/app/core/_models';
import { InitiateEmployeeComponent } from 'src/app/feature/process/initiation/employee/_components/initiate-employee/initiate-employee.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OtpVerifyComponent } from 'src/app/shared/_components';

@Component({
  selector: 'app-aadhaar-extract',
  templateUrl: './aadhaar-extract.component.html',
  styleUrls: ['./aadhaar-extract.component.scss'],
  providers: [InitiateEmployeeComponent],
})
export class AadhaarExtractComponent implements OnInit {
  @Input() extractedData: ExtractedDataModel;
  @Input() extractedDoc: ExtractedDocModel;
  @Input() poTypeahead;
  @Input() checkHistoryData;

  @Output() emitExtractedDataChanges = new EventEmitter();
  @Output() emitPoNumber = new EventEmitter();
  @Output() selectAnnotation = new EventEmitter();
  @Output() checkHistoryEmitter = new EventEmitter();
  @Output() checkHistoryClickEmitter = new EventEmitter();
  @Output() otpEmitter = new EventEmitter();

  @Input() checkHistoryClick: boolean;
  @Input() otpBoxIsActive: boolean = false;

  info = { render: false, text: '', color: '#2aa89b' };

  extractionAadhaarForm = new FormDataConstants().extractionAadhaarForm;

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
    private companySvc: CompanyManagementService,
    private modalSvc: NgbModal
  ) {}

  ngOnInit(): void {}
  // checkAadhaarVerify() {
  //   // this.checkHistoryClick = false;
  //   return this.checkHistoryData?.isAadhaarVerified == false;
  // }

  emitForAnnotation(key) {
    key = key.purchase_order ? key.purchase_order : key;
    this.selectAnnotation.emit(key);
  }

  emitData() {
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

  checkHistory() {
    this.checkHistoryEmitter.emit(this.extractionAadhaarForm.value.aadhaarId);
    // if (this.checkHistoryData?.isAadhaarVerified) {
    //   this.checkHistoryClick = false;
    // } else {
    //   this.checkHistoryClick = true;
    // }
    // console.log(this.checkHistoryClick);
    this.checkHistoryClick = true;
    this.checkHistoryClickEmitter.emit(this.checkHistoryClick);
    // this.companySvc
    //   .searchEmployees(this.extractedData.aadhaarId)
    //   .subscribe((res) => {
    //     this.companySvc.extractedExistingData = res;
    //   });
    // this.initiateEmployee.fetchHistory(this.extractedData.aadhaarId);
  }

  generateOtp() {
    this.companySvc
      .otpGenerate(this.extractionAadhaarForm.value.aadhaarId)
      .subscribe((res) => {
        console.log('otp', res);
        if (res.status) {
          this.otpBoxIsActive = true;
          // console.log("jh",this.otpBoxIsActive);
          const modalRef = this.modalSvc.open(OtpVerifyComponent, {
            centered: true,
            container: 'div',
            size: 'sm',
            backdrop: 'static',
            // keyboard: false,
          });
          modalRef.componentInstance.otpEmitter.subscribe((otpObj) => {
            console.log('helllllllllllllllll', otpObj);
            this.otpEmitter.emit(otpObj);
          });
          modalRef.componentInstance.aadhaarId =
            this.extractionAadhaarForm.value.aadhaarId;
        }
      });
  }
}

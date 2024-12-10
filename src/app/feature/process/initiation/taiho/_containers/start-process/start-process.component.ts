import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { StartProcessSignalService } from '../../../_services';
import {
  InitiationTaskViewModel,
  ExtractedDataModel,
  InitiationModel,
} from '../../../_models';
import {
  CompanyManagementService,
  RefDataService,
  SharedService,
} from 'src/app/core/_services';
import {
  TaskInfoService,
  TaskService,
  TaskActionService,
} from '../../../../layout/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import {
  PdfViewerData,
  PdfViewerOptions,
} from 'src/app/shared/_components/pdf-viewer/pdf-viewer.model';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ProcessFormsService } from 'src/app/feature/system/process-forms/_services';

@Component({
  selector: 'app-start-process-taiho',
  templateUrl: './start-process.component.html',
  styleUrls: ['./start-process.component.scss'],
})
export class StartTaihoProcessComponent implements OnInit, OnDestroy {
  @ViewChild('invExtract') invExtractinstance;
  @ViewChild('pdf') pdfInstance;
  initiationData = { selectedDocument: {} as File };
  formFile;
  viewData: InitiationTaskViewModel = {} as InitiationTaskViewModel;
  subscription: Subscription[] = [];
  extractedData: ExtractedDataModel;
  initform = {} as InitiationModel;
  allPoData;
  pdfSrc = '';
  instances: any[];
  boundData;
  pdfData: PdfViewerData;
  pdfOptions: PdfViewerOptions = {
    overwriteCssPath: '/assets/pdftron/overwrite.css',
    annotationColor: { R: 68, G: 230, B: 162 },
  };
  constructor(
    private taskActionSvc: TaskActionService,
    private signalSvc: StartProcessSignalService,
    private companySvc: CompanyManagementService,
    private taskInfoSvc: TaskInfoService,
    private modalSvc: NgbModal,
    private taskSvc: TaskService,
    private toastrSvc: ToastrService,
    private refData: RefDataService,
    private procFormSvc: ProcessFormsService
  ) {}

  ngOnInit(): void {
    this.subscribeToSignal();
    this.getAllPurchaseDetails();
    this.getInstances();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  getInstances() {
    this.refData.getInstances('CONT_TYPE', true).subscribe((r) => {
      this.instances = r.data;
    });
  }
  subscribeToSignal(): void {}

  eventAction(event: string): void {}

  saveDocChanges(ev) {
    this.formFile = ev;
    this.extractData();
    console.log(ev);
  }

  extractData() {
    this.taskSvc.extractPDFData(this.formFile).subscribe((p) => {
      if (p.api_status) {
        // setTimeout( _ => {
        this.pdfData = {
          docUrl: '/assets/pdf/' + this.initiationData.selectedDocument.name,
          annotatedParagraphs: p.results.map((r) => {
            return {
              pageNumber: 1,
              quads: [r.BoundingBox],
              key: r.Key,
              label: r.Label,
            };
          }),
        };
        // })
        this.extractedData = {
          invoice_id: '',
          invoice_date: '',
          purchase_order: '',
          total_amount: '',
        };
        // let idate =  p.results.find(a => a.Label === 'Invoice Date').invoice_date;
        this.extractedData.invoice_date = moment(
          p.results.find((a) => a.Label === 'Invoice Date').invoice_date
        ).format('DD-MMM-YYYY');
        this.extractedData.invoice_id = p.results.find(
          (a) => a.Label === 'Invoice Number'
        ).invoice_id;
        this.extractedData.purchase_order = p.results.find(
          (a) => a.Label === 'Purchase Order Number'
        ).purchase_order;
        this.extractedData.total_amount = p.results.find(
          (a) => a.Label === 'Total Amount'
        ).total_amount;
        this.fetchPurchaseDetails(this.extractedData.purchase_order);
      }
    });
  }

  selectAnnotation(key) {
    this.pdfInstance.selectByKey(key);
  }

  getCompanyDetails(): void {
    this.subscription.push(
      this.companySvc
        .getCompanybyId(this.extractedData.companyId)
        .subscribe((a) => {
          this.extractedData.companyCode = a.data.code;
          this.extractedData.companyId = Number(a.data.id);
        })
    );
  }
  editExtractedData(ev) {
    this.extractedData = ev;
  }

  getAllPurchaseDetails() {
    this.taskSvc.getAllPurchaseDetails().subscribe((p) => {
      this.allPoData = p;
    });
  }

  fetchPurchaseDetails(punumber) {
    let data = this.allPoData.find(
      (a) => a.purchase_order.trim() === punumber.trim()
    );
    if (data) {
      this.invExtractinstance.info.render = true;
      this.invExtractinstance.info.text =
        'Data filled from matching purchase order';
      this.invExtractinstance.info.color = '#2aa89b';

      data.data.forEach((a) => {
        this.extractedData[a.key] = a.value;
      });
      this.getCompanyDetails();
    } else {
      this.invExtractinstance.info.render = true;
      this.invExtractinstance.info.text =
        'No matching purchase order found. Please search for matching purchase order from the field';
      this.invExtractinstance.info.color = 'red';
    }
  }

  save() {
    this.transformData();
    this.initform.processname = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    this.taskSvc.startWorkflow(this.initform).subscribe((d) => {
      if (d.status) {
        this.procFormSvc
          .getProcDefbyName(this.initform.processname)
          .subscribe((r) => {
            if (r.data?.key?.variablename) {
              this.initform.processname[r.data?.key?.variablename] =
                r.data[0].businessKey;
            }
            this.taskSvc
              .saveVariables(d.data[0].businessKey, {
                ...this.initform,
                businesskey: d.data[0].businessKey,
                // constracType: d.data[0].contractType,
              })
              .subscribe();
            this.toastrSvc.success('Invoice Initiated');
            this.back();
          });
      }
    });
  }

  convertCurrency(curr) {
    // curr === typeof String ? curr = curr.trim() : curr = curr ;
    // return Number(curr) === NaN ? Number(curr.substr(1,curr.length)) : Number(curr) ;
    if (typeof curr === 'string') {
      curr = curr.trim().replace(',', '').replace('$', '');
      return Number(curr.trim());
    } else {
      return curr;
    }
  }

  transformData() {
    this.initform = {
      invoiceNumber: this.extractedData.invoice_id,
      invoiceDate: this.extractedData.invoice_date,
      totalContractValue: this.convertCurrency(this.extractedData.total_amount),
      invoiceAmount: this.convertCurrency(this.extractedData.total_amount),
      product: this.extractedData.purchase_order.purchase_order
        ? this.extractedData.purchase_order.purchase_order
        : this.extractedData.purchase_order,
      productSecondLevel: this.extractedData.invoice_id,
      poNumber: this.extractedData.purchase_order.purchase_order
        ? this.extractedData.purchase_order.purchase_order
        : this.extractedData.purchase_order,
      poDate: this.extractedData.po_date,
      poTotalAmount: this.convertCurrency(this.extractedData.total_po_value),
      poAmountConsumedTillDate: this.convertCurrency(
        this.extractedData.amt_consumed_till_date
      ),
      totalPoAmountLeft: this.convertCurrency(this.extractedData.amount_left),
      poBusinessOwner: this.extractedData.business_owner,
      poBusinessGroup: this.extractedData.business_group,
      partnerLegalName: this.extractedData.vendor_name,
      contractType: 'Invoice Processing',
      /* below line was replaced as contract type was being selected for nda and service with no scope of selecting contract type */
      // contractType: !this.instances ? [{"id":102,"name":"Invoice Processing","code":null,"catname":"Contract Type","catcode":"CONT_TYPE","levels":1}] : this.instances,
      contractTypeSecondLevel: this.extractedData.po_date,
      country: this.extractedData.invoice_date,
      medicalAffairsUser: this.extractedData.medicalAffairsUser,
      companyCode: this.extractedData.companyCode,
      companyId: this.extractedData.companyId,
    };
  }
  back() {
    this.taskActionSvc.viewMyQueue();
  }

  addAnnotation(selectedText) {
    localStorage.setItem('annotation', selectedText);
  }

  blurEvent(ev) {
    const cont = document.getElementById('startContainer');
    cont.click();
  }
}

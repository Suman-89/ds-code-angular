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
  selector: 'app-start-mortgage-process',
  templateUrl: './start-mortgage-process.component.html',
  styleUrls: ['./start-mortgage-process.component.scss'],
})
export class StartMortgageProcessComponent implements OnInit {
  @ViewChild('invExtract') invExtractinstance;
  @ViewChild('pdf') pdfInstance;
  initiationData = { selectedDocument: {} as File };
  formFile;
  viewData: InitiationTaskViewModel = {} as InitiationTaskViewModel;
  subscription: Subscription[] = [];
  extractedData = [];
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
  }

  extractData() {
    this.taskSvc
      .extractPDFData(this.formFile, 'http://14.98.251.126:5005/file')
      .subscribe((p) => {
        if (p.api_status) {
          // setTimeout( _ => {
          this.pdfData = {
            docUrl: '/assets/pdf/' + this.initiationData.selectedDocument.name,
            annotatedParagraphs: p.results.map((r) => {
              return {
                pageNumber: r.page,
                quads: [r.box],
                key: r.label,
                label: r.label,
              };
            }),
          };
          // })
          this.extractedData = p.results;
        }
      });
  }

  selectAnnotation(field) {
    this.pdfInstance.selectByKey(field.label);
  }

  editExtractedData(ev) {
    this.extractedData = ev;
  }

  getAllPurchaseDetails() {
    this.taskSvc.getAllPurchaseDetails().subscribe((p) => {
      this.allPoData = p;
    });
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
                constracType: d.data[0].contractType,
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

  transformData() {}
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

  // openDocument(doc) {
  //   this.primaryDocument = doc;
  //   this.showPdf(this.primaryDocument.doc_url);
  // }

  // annotate(anotationInfo){
  //   this.pdfViewer.deleteExistingAnnotations();
  //   this.pdfViewer.searchTerm(anotationInfo, {regex: true}, true);
  // }
  // isDocumentLoading(isLoading){
  //   if(isLoading){ // document loading;
  //   } else { // document loaded
  //     // this.highlightText();
  //   }
  // }
  // // highlightText() {
  // //   this.annotate(this.textToSearch.map(t => {
  // //     return {text: this.getRegexString(t.text), id: t.id}
  // //   }))
  // // }
  // showPdf(uri) {
  //   setTimeout( _ => {
  //     this.pdfData= {docUrl: uri ,annotatedParagraphs:[]}
  //   },0)
  // }
  // closePdf() {
  // }

  // getSelectedAnnotation(e) {
  //   console.log(e.IC);
  // }
  // getRegexString(req){
  //   return this.masterSvc.getRegexString(req);
  // }

  // ngOnInit(): void {
  //   // this.textToSearch = [{ text: this.data.text, id: 1}];
  //   this.openDocument(this.documents[0]);
  // }
}

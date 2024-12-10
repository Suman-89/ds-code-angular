import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { StartProcessSignalService } from '../../_services';
import {
  InitiationTaskViewModel,
  ExtractedDataModel,
  InitiationModel,
} from '../../_models';
import {
  CompanyManagementService,
  RefDataService,
  SharedService,
} from 'src/app/core/_services';
import {
  TaskInfoService,
  TaskService,
  TaskActionService,
} from '../../../layout/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  PdfViewerData,
  PdfViewerOptions,
} from 'src/app/shared/_components/pdf-viewer/pdf-viewer.model';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SelectWorkflowTypeComponent } from '../../_modals';
import { DomSanitizer } from '@angular/platform-browser';
import { ProcessFormsService } from 'src/app/feature/system/process-forms/_services';
import { TypeAheadModel } from 'src/app/core/_models';
import { CreateCompanyModalComponent } from 'src/app/shared/_modals';

@Component({
  selector: 'app-start-process',
  templateUrl: './start-process.component.html',
  styleUrls: ['./start-process.component.scss'],
})
export class StartProcessComponent implements OnInit, OnDestroy {
  @ViewChild('invExtract') invExtractinstance;
  @ViewChild('pdf') pdfInstance;
  initiationData: any = { selectedDocument: {} as File };
  formFile;
  viewData: InitiationTaskViewModel = {} as InitiationTaskViewModel;
  subscription: Subscription[] = [];
  extractedData: ExtractedDataModel;
  initData;
  initform = {} as InitiationModel;
  allPoData;
  pdfSrc = '';
  instances: any[];
  companyBoolean: boolean = false;
  boundData;
  pdfData: PdfViewerData;
  pdfOptions: PdfViewerOptions = {
    overwriteCssPath: '/assets/pdftron/overwrite.css',
    annotationColor: { R: 68, G: 230, B: 162 },
  };
  fields: FormlyFieldConfig[];
  workflowType;
  procName;
  header;
  actions = [
    { id: 'comment', name: 'View Comments', icon: 'fa fa-commenting-o' },
    { id: 'document', name: 'View Documents', icon: 'fa fa-file' },
  ];
  comment;
  submitbtnDisabler: boolean = true;
  tempComp = null;
  selectCom;
  partnerLegalName;
  isComp: boolean = false;
  constructor(
    private refData: RefDataService,
    private sharedSvc: SharedService,
    private taskActionSvc: TaskActionService,
    private signalSvc: StartProcessSignalService,
    private companySvc: CompanyManagementService,
    private taskInfoSvc: TaskInfoService,
    private modalSvc: NgbModal,
    private taskSvc: TaskService,
    private toastrSvc: ToastrService,
    private sanitizer: DomSanitizer,
    private procFormSvc: ProcessFormsService
  ) {}

  ngOnInit(): void {
    this.subscribeToSignal();
    this.getAllPurchaseDetails();
    this.getInstances();
    this.getWorkflowTypes(JSON.parse(this.sharedSvc.selectedProcess));
    this.header = JSON.parse(localStorage.getItem('selected-process')).label;
  }

  getWorkflowTypes(r) {
    this.taskInfoSvc.getInitForm(r.name).subscribe((i) => {
      if (i.status) {
        this.procName = r.name;
        this.taskInfoSvc.getTaskVariables(i.data[0]).subscribe((v) => {
          if (v.status) {
            this.partnerLegalName = v.data.variables.find(
              (item) => item.name == 'partnerLegalName'
            );

            this.initData = {
              ...v.data,
              variables: v.data.variables.filter(
                (item) => item.name !== 'partnerLegalName'
              ),
            };

            if (
              v.data.variables.find((item) => item.name === 'partnerLegalName')
            ) {
              this.companyBoolean = true;
            }
            console.log('INITIATION FORM', this.initData);
            let processname = JSON.parse(
              localStorage.getItem('selected-process')
            ).name;

            if (processname === 'Initiation Surbhi Travel Process') {
            }

            if (processname === 'Initiation Content Creation') {
              let contentCreationVar = this.initData?.variables?.find(
                (v) => v.name === 'contentCreationUser'
              );
              contentCreationVar.options = contentCreationVar.options.map(
                (option) => ({
                  actualName: option.name,
                  name: option.label,
                })
              );
            }
          }
        });
      }
    });
    // this.sharedSvc.getAllProcessDefinintion().subscribe(r => {
    //   if(r.status) {
    //     this.workflowType = []
    //     let data = r.data ;
    //     Object.keys(data).forEach( a => {
    //       this.workflowType.push({key: a, label: data[a]}) ;
    //     })
    //     this.openSelectProcessModal() ;
    //   }
    // })
  }

  openSelectProcessModal() {
    const refmod = this.modalSvc.open(SelectWorkflowTypeComponent, {
      size: 'sm',
      keyboard: false,
      backdrop: 'static',
    });
    refmod.componentInstance.workflowtypes = this.workflowType;
    refmod.componentInstance.selWorkflowEmitter.subscribe((r) => {
      if (r) {
        this.procName = r.key;
        this.taskInfoSvc.getInitForm(r.label).subscribe((i) => {
          if (i.status) {
            refmod.close();
            this.taskInfoSvc.getTaskVariables(i.data[0]).subscribe((v) => {
              if (v.status) {
                this.initData = v.data;
              }
            });
          }
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  getInstances() {
    this.refData.getInstances('CONT_TYPE', true).subscribe((r) => {
      this.instances = r.data;
    });
  }

  subscribeToSignal() {}

  eventAction(event: string) {}

  saveDocChanges(ev) {
    this.formFile = ev;
    this.extractData();
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
        this.extractedData.invoice_date = p.results.find(
          (a) => a.Label === 'Invoice Date'
        ).invoice_date;
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

  btnDisabler(ev): void {
    // console.log("disable",ev)
    this.submitbtnDisabler = ev;
    // if(!ev && this.header==="DS Content Creation"){
    //   this.tempComp=!ev
    // }
  }

  getAllPurchaseDetails() {
    this.taskSvc.getAllPurchaseDetails().subscribe((p) => {
      this.allPoData = p;
    });
    this.taskSvc.getFormlyFields().subscribe((a) => {
      this.fields = a;
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
    // this.transformData() ;
    let m = this.invExtractinstance.model;
    Object.keys(m)
      .filter((a) => a.endsWith('Other'))
      .forEach((e) => {
        delete m[e];
      });

    if (m.bookingdate == null) {
      m.bookingdate = '';
    }

    m.processname = JSON.parse(localStorage.getItem('selected-process')).name;
    // hard coded
    if (m.processname === 'Initiation Process HR Ticket') {
      m.hrTicketSource = 'App';
    }
    if (m.processname === 'Initiation Content Creation') {
      let contentCreationVar = this.initData?.variables?.find(
        (v) => v.name === 'contentCreationUser'
      );
      let chosenOption = contentCreationVar.options.find(
        (option) => option.name === m['contentCreationUser']
      );

      m.contentCreationUser = chosenOption.actualName;
      m.contentCreationUserName = chosenOption.name;
    }
    if (m.processname === 'Initiation Surbhi Travel Process') {
      let phone = m.phoneNumber;
      if (phone.length === 12 && phone.startsWith('91')) {
        m.phoneNumber = phone;
      } else {
        if (phone.length !== 12 && !phone.startsWith('+91')) {
          this.toastrSvc.error('Please add +91 before phone number.');
          return;
        } else if (phone.length !== 12 && phone.startsWith('+91')) {
          m.phoneNumber = phone.substring(1);
        } else {
          this.toastrSvc.error('Please add +91 before phone number.');
          return;
        }
      }
    }

    // if (m.processname === '')
    Object.keys(m).forEach((x) => {
      if (m[x] === null) {
        m[x] = '';
      }
    });

    let notificationObj = {
      bookingType: m.bookingType,
      firstName: m.firstName,
      lastName: m.lastName,
      phoneNumber: m.phoneNumber,
      bookingRequirement: m.bookingRequirement,
      notificationType: 'caseInitiation',
      useCase: 'Initiation Surbhi Travel Process',
    };

    this.taskSvc.startWorkflow(m).subscribe((d) => {
      if (d.status) {
        console.log('llllllllllllllll', d.data);
        let processname = JSON.parse(
          localStorage.getItem('selected-process')
        ).name;

        if (processname === 'Initiation Surbhi Travel Process') {
          this.sharedSvc.sendNotification(notificationObj).subscribe((x) => {
            if (x.status) {
              this.toastrSvc.success(x.message);
            }
          });
        }

        m.businesskey = d.data[0].businessKey;
        // m.contractType = d.data[0].contractType;

        this.procFormSvc.getProcDefbyName(m.processname).subscribe((r) => {
          if (r.data?.key?.variablename) {
            m[r.data?.key?.variablename] = d.data[0].businessKey;
          }

          this.taskSvc.saveVariables(d.data[0].businessKey, m).subscribe();
          this.toastrSvc.success('Process Initiated Successfully');
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
      contractType: !this.instances
        ? [
            {
              id: 102,
              name: 'Invoice Processing',
              code: null,
              catname: 'Contract Type',
              catcode: 'CONT_TYPE',
              levels: 1,
            },
          ]
        : this.instances,
      contractTypeSecondLevel: this.extractedData.po_date,
      country: this.extractedData.invoice_date,
      medicalAffairsUser: this.extractedData.medicalAffairsUser,
      companyCode: this.extractedData.companyCode,
      companyId: this.extractedData.companyId,
    };
  }
  initiateWorkflow(comment?: string): void {
    if (
      this.initiationData.contractType[0].name
        .toLowerCase()
        .includes('amendment')
    ) {
      this.initiationData.amendmentType =
        this.initiationData.contractTypeSecondLevel;
    }

    this.subscription.push(
      this.taskSvc.startWorkflow(this.initiationData).subscribe((a) => {
        if (a.status && a.data.length > 0) {
          // need to break up the following code in smaller chunks
          this.taskSvc
            .saveVariables(a.data[0].businessKey, this.initiationData)
            .subscribe();

          if (!this.initiationData.initiateOfac) {
            const nextProc = a.data.find((i) => i.status);
            if (nextProc) {
              const ct = this.initiationData.contractType
                .map((i) => i.name)
                .join(', ');
              this.toastrSvc.success(
                `${ct} Process Initiated for ${this.initiationData.product}`
              );
              if (comment) {
                this.taskActionSvc.onCommentSubmitted(
                  comment,
                  null,
                  nextProc.businessKey,
                  []
                );
              }
              this.taskActionSvc.nextTask({
                businessKey: nextProc.businessKey,
                processId: nextProc.id,
              });
            } else {
              this.toastrSvc.warning(
                'Not able to initiate process. Please try again'
              );
            }
          } else {
            const ofacProc = a.data.find((i) => i.ofac && i.status);
            const nextProc = a.data.find((i) => i.status && !i.ofac);
            if (ofacProc && nextProc) {
              const ct = this.initiationData.contractType
                .map((i) => i.name)
                .join(', ');
              this.toastrSvc.success(`OFAC Process Initiated`);
              this.toastrSvc.success(
                `${ct} Process Initiated for ${this.initiationData.product}`
              );
              this.taskActionSvc.nextTask({
                businessKey: ofacProc.businessKey,
                processId: ofacProc.id,
              });
              if (comment) {
                this.taskActionSvc.onCommentSubmitted(
                  comment,
                  null,
                  nextProc.businessKey,
                  []
                );
              }
            } else if (
              nextProc &&
              nextProc.contractType === 'Process_initiation_impl'
            ) {
              const ct = this.initiationData.contractType
                .map((i) => i.name)
                .join(', ');
              this.toastrSvc.success(
                `${ct} Process Initiated for ${this.initiationData.product}`
              );
              this.taskActionSvc.nextTask({
                businessKey: nextProc.businessKey,
                processId: nextProc.id,
              });
              if (comment) {
                this.taskActionSvc.onCommentSubmitted(
                  comment,
                  null,
                  nextProc.businessKey,
                  []
                );
              }
            } else {
              if (!ofacProc) {
                this.toastrSvc.warning(
                  'Not able to initiate OFAC process. Please try again'
                );
              }
              if (!nextProc) {
                this.toastrSvc.warning(
                  'Not able to initiate process. Please try again'
                );
              }
            }
          }
        }
      })
    );
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

  // addCommentsPriorInititation(text?) {
  //   const refMod = this.modalSvc.open(FullCommentBoxModalComponent, {
  //     keyboard: false,
  //     backdrop: 'static',
  //   });
  //   let mentionConfig = this.taskActionSvc.getMultiMentionConfig();
  //   refMod.componentInstance.mentionConfig = mentionConfig;
  //   // if(text) {
  //   //   refMod.componentInstance.commenttype = text ;
  //   // }
  //   refMod.componentInstance.commentBoxOptions = {
  //     allowFullScreen: false,
  //     height: 300,
  //     plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
  //     toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
  //   };
  //   refMod.componentInstance.closeOnSubmit = false;
  //   refMod.componentInstance.onSubmitted.subscribe((r) => {
  //     if (r) {
  //       var parser = new DOMParser();
  //       var htmlDoc = parser.parseFromString(r, 'text/html');
  //       let check = htmlDoc?.children[0]['innerText'].trim();
  //       check.length > 0
  //         ? this.initiateWorkflow(r)
  //         : this.toastrSvc.warning('Please enter comment prior to initiation');
  //       check.length > 0 ? refMod.close() : null;
  //     }
  //   });
  // }

  clearCompany(e: boolean): void {
    this.invExtractinstance.model.dealCompany = '';
    this.tempComp = null;
  }
  selectCompany(e: TypeAheadModel): void {
    e.id = e.id.toString();

    console.log('COMPANY ', e);
    console.log('e', e);
    this.tempComp = e;
    if (!e.id.includes('create')) {
      this.selectCom = e;
      if (e.name === 'Emami' || 'Digitalsherpa.ai' || 'DigitalSherpa') {
        this.isComp = true;
      }
      this.invExtractinstance.model.partnerLegalName = e.name;
      this.invExtractinstance.model.companyId = parseInt(e.id);
      this.invExtractinstance.model.companyCode = e.code;

      // this.initiation.companyFound = true;
      // this.initiationConfig.showProduct = true;
      // this.emitData('companySelected');
    } else {
      // this.initiation.companyFound = false;
      // this.initiationConfig.showProduct = false;
      this.openModal(e.param);
    }
  }
  openModal(companyName?: string): void {
    const modalRef = this.modalSvc.open(CreateCompanyModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.userRole = 'accountmanager';
    modalRef.componentInstance.companyName = companyName;
    this.subscription.push(
      modalRef.componentInstance.addCompanyEvent.subscribe((a) => {
        if (a) {
          this.getCompanyById(a, a.resource.id);
        }
      })
    );
  }
  addCompany(e) {
    this.invExtractinstance.model.partnerLegalName = e.resource.name;
    this.invExtractinstance.model.companyId = parseInt(e.resource.id);
    this.selectCom = e.resource;
  }

  getCompanyById(resource, id): void {
    this.companySvc.getCompanybyId(id).subscribe((res) => {
      this.invExtractinstance.model.companyCode = res.data.code;
      this.addCompany(resource);
    });
  }
}

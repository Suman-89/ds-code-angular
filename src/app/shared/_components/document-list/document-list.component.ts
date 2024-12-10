import { CheckInFileModalComponent } from '../../../feature/process/layout/_modals/check-in-file-modal/check-in-file-modal.component';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  TaskDocumentModel,
  TaskInfoModel,
  TaskDocumentResponseModel,
  DocumentCategoryName,
  TaskCommentModel,
} from '../../../feature/process/layout/_models';
import {
  TaskInfoService,
  TaskSignalService,
  TaskActionService,
  TaskService,
} from '../../../feature/process/layout/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FileUploaderModalComponent,
  VersionHistoryModalComponent,
} from '../../../feature/process/layout/_modals';
import { Subscription } from 'rxjs';
import {
  LoggedUserModel,
  ProcessFormModel,
  ProcessVariableModel,
  ProcFormDoclistDropdownModel,
  Roles,
} from 'src/app/core/_models';
import { ContractModel } from '../../../feature/process/layout/_models/contract.model';
import { PrintProcessDocumentModalComponent } from '../../../feature/process/layout/_modals';
import { FileUploadService } from 'src/app/core/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  @Input() commentList: TaskCommentModel[];
  @Input() completedContract: boolean = false;
  @Input() viewType?: string = '';
  @Input() aadhaarId: string;
  @Input() darkTheme: boolean;

  @Output() printDoc = new EventEmitter<any>();
  @Output() onSapIdAttach = new EventEmitter<any>();
  documentList: TaskDocumentModel[] = [];
  kycDocs: TaskDocumentModel[] = [];
  allDocumentList: TaskDocumentModel[] = [];
  taskDocMap: TaskDocumentResponseModel = null;
  subscription: Subscription[] = [];
  taskDetails: TaskInfoModel;
  contractInfo: ContractModel;
  taskVariables: ProcessVariableModel[] = [];
  docTypes: string[] = [];
  selectedType: string[] = [];
  defaultDoc: string;
  loggedUser: LoggedUserModel;
  role = Roles;
  documentCategoryName = DocumentCategoryName;
  inProcessCheckOutPermission: string[] = [];
  bcCheckOutPermission: string[] = [];
  filterType;
  selectedDocTypes: ProcFormDoclistDropdownModel[];
  uploadableTypes;
  initSelection: boolean = false;
  taskModel;
  procForm: ProcessFormModel;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  documentTabSettings;

  constructor(
    private taskInfoSvc: TaskInfoService,
    private modalService: NgbModal,
    private taskActionSvc: TaskActionService,
    private taskSignalSvc: TaskSignalService,
    private toastrSvc: ToastrService,
    private taskSvc: TaskService,
    private fileUploaderSvc: FileUploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.viewType === 'company') {
      this.getDocumentListByAadhaarId();
      return;
    }

    this.loggedUser = JSON.parse(localStorage.getItem('user'));

    this.inProcessCheckOutPermission = [
      this.role.SUPER_ADMIN,
      this.role.LEGAL_ADMIN,
      this.role.LEGAL_USER,
      this.role.SALES_USER,
      this.role.SYSTEM_ADMIN,
      this.role.PRODUCT_MANAGEMENT_USER,
      this.role.PRODUCT_MANAGEMENT_ADMIN,
      this.role.PMGRMOBILE_ADMIN,
      this.role.PMGRMOBILE_USER,
      this.role.PMIOT_ADMIN,
      this.role.PMIOT_USER,
      this.role.PMMOBILE_ADMIN,
      this.role.PMMOBILE_USER,
      this.role.PMSMS_ADMIN,
      this.role.PMSMS_USER,
      this.role.PMVOICE_USER,
      this.role.PMVOICE_ADMIN,
      this.role.CREDIT_ADMIN,
      this.role.CREDIT_USER,
    ];

    this.bcCheckOutPermission = [
      this.role.SYSTEM_ADMIN,
      this.role.SUPER_ADMIN,
      this.role.SALES_USER,
      this.role.INTERCONNECT_DESIGN_ADMIN,
      this.role.INTERCONNECT_DESIGN_USER,
      this.role.COMMERCIAL_OPS_USER,
      this.role.COMMERCIAL_OPS_ADMIN,
      this.role.PRODUCT_MANAGEMENT_USER,
      this.role.PRODUCT_MANAGEMENT_ADMIN,
      this.role.PMGRMOBILE_ADMIN,
      this.role.PMGRMOBILE_USER,
      this.role.PMIOT_ADMIN,
      this.role.PMIOT_USER,
      this.role.PMMOBILE_ADMIN,
      this.role.PMMOBILE_USER,
      this.role.PMSMS_ADMIN,
      this.role.PMSMS_USER,
    ];

    this.getTaskInfo();
    this.getTaskVariables();
    this.subscribeToDocs();
    this.getTabsettingsForDocument();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  isViewTask() {
    return this.router.url.includes('view-task');
  }

  getTaskInfo(): void {
    this.viewType === 'contract'
      ? this.subscription.push(
          this.taskSignalSvc.ongoingTasks.subscribe((a) => {
            if (a && a.length > 0) {
              this.taskDetails = a[0];
            }
          })
        )
      : this.subscription.push(
          this.taskSignalSvc.taskInfo.subscribe((a) => {
            if (a) {
              this.taskDetails = a;
            }
          })
        );
  }

  getContractInfo(): void {
    this.subscription.push(
      this.taskSignalSvc.contractInfo.subscribe((a) => {
        if (a) {
          this.contractInfo = a;
        }
      })
    );
  }

  getTaskVariables(): void {
    this.subscription.push(
      this.taskSignalSvc.taskVariables.subscribe((a) => {
        if (a && a.length > 0) {
          this.taskVariables = a;
        }
      })
    );
    this.subscription.push(
      this.taskSignalSvc.model.subscribe((r) => {
        if (r) {
          this.taskModel = r;
        }
      })
    );
    this.subscription.push(
      this.taskSignalSvc.procForm.subscribe((r) => {
        if (r) {
          this.procForm = r;
        }
      })
    );
  }

  getCourse() {
    return (
      this.taskModel?.course ||
      this.taskVariables.find((vari) => vari.name === 'course').value
    );
  }
  getModule() {
    return (
      this.taskModel?.module ||
      this.taskVariables.find((vari) => vari.name === 'module').value
    );
  }
  subscribeToDocs(): void {
    this.subscription.push(
      this.taskSignalSvc.docMap.subscribe((a) => {
        if (a) {
          this.taskDocMap = a;
          this.allDocumentList = [];
          this.docTypes = Object.keys(a);
          this.defaultDoc = this.taskActionSvc.getDefaultFile(this.docTypes);
          this.docTypes.forEach((i) => {
            this.allDocumentList = [...this.allDocumentList, ...a[i]];
          });
          this.documentList = this.orderDocs(this.allDocumentList);
          console.log('ALL DOCUMENTS ', this.documentList);

          if (!this.filterType) {
            // on init condition
            this.checkForAllSelection();
            //  this.filterDocument(this.defaultDoc);
            this.taskSignalSvc.selectedDocTypes.subscribe((d) => {
              if (d) {
                d.forEach((a) => {
                  a.id = 0;
                });
                if (d.length > 0) {
                  this.uploadableTypes = d.filter((a) => a.uploadable);
                }
                /* to be implemented selected document type */
                // const selType = d.filter(a => a.selected).map( m => m.name) ;
                // this.selectedType = [] ;
                // selType.forEach(a => {
                //   if( this.docTypes.includes(a)) {
                //     this.filterDocument(a) ;
                //   }
                // })
                // if(!this.selectedDocTypes) {
                //   this.selectedDocTypes=[] ;
                //   this.filterDocument('All') ;
                // }
                // } else {
                if (!this.initSelection) {
                  this.filterDocument('All');
                  this.initSelection = true;
                }
              }
              //     this.docTypes= d.map(a => a.name) ;
              //     this.docTypes.unshift('All');
              //     this.getInitSelection() ;
              //    } else {
              //     this.checkForAllSelection() ;
              //     this.filterDocument('All') ;
              //    }
            });
          } else if (this.filterType) {
            this.checkForAllSelection();
            //  this.filterDocument(this.filterType) ;
            //  this.documentList = this.allDocumentList.filter(a => this.selectedType.includes(a.foldername)) ;
          }

          // this.taskSignalSvc.docList.next(this.allDocumentList);
        }
      })
    );

    this.viewType === 'contract'
      ? this.subscription.push(
          this.fileUploaderSvc.getAllDocCategory().subscribe((t) => {
            if (t) {
              this.selectedDocTypes = t.data.filter(
                (a) => a.name == this.documentCategoryName.other
              );
            }
          })
        )
      : null;
  }

  checkForAllSelection() {
    if (!this.docTypes.includes('All')) {
      this.docTypes.unshift('All');
    }
  }

  getInitSelection() {
    this.selectedType = [];
    const filterType = this.selectedDocTypes
      .filter((a) => a.selected)
      .map((a) => a.name);
    filterType.forEach((e) => {
      this.filterDocument(e);
      this.filterType = e;
    });
  }

  orderDocs(doc) {
    doc = doc.sort((a, b) => {
      if (a.checkedoutdate) {
        a.time = a.checkedoutdate;
      }
      if (b.checkedoutdate) {
        b.time = b.checkedoutdate;
      }
      if (a.checkedoutdate === null) {
        a.modifieddate ? (a.time = a.modifieddate) : (a.time = a.createddate);
      }
      if (b.checkedoutdate === null) {
        b.modifieddate ? (b.time = b.modifieddate) : (b.time = b.createddate);
      }
      return a.time > b.time ? -1 : 1;
    });
    //  a.checkedoutdate > b.checkedoutdate || a.modifieddate > b.modifieddate || !b.modifieddate
    //             || a.createddate > b.checkedoutdate ||  a.checkedoutdate > b.modifieddate ||  a.createddate > b.createddate ? -1 : 1) ;
    return doc;
  }
  download(doc: TaskDocumentModel): void {
    this.taskInfoSvc.openDocument(doc.contentid);
  }

  openNewDocModal() {
    const modalRef = this.modalService.open(FileUploaderModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    let vars: any = {};

    this.taskDetails?.variables
      ? this.taskDetails.variables.forEach((i) => (vars[i.name] = i.value))
      : this.taskVariables.forEach((i) => (vars[i.name] = i.value));
    console.log(vars);

    const inputData = {
      taskid: this.taskDetails?.id,
      companyLegalName: vars.partnerLegalName,
      product: vars.product,
      // aadhaar: vars.aadhaarId,
      employeeName: vars.employeeName,
      contractType: vars.contractType,
      businessKey: vars.businessKey,
      companyCode:
        this.viewType === 'company' ? this.aadhaarId : vars.companyCode,
      ibasisContractingEntity: vars.ibasisContractingEntity,
      contractTypeSecondLevel: vars.contractTypeSecondLevel,
      taskForm: this.taskDetails?.formKey,
      taskVariables: this.taskVariables,
      inProcessAllowed: this.inProcessCheckOutPermission,
      bcAllowed: this.bcCheckOutPermission,
      doccat: [],
      cdoc: [],
      filename: '',
      selectedDocument: null,
      initiatorname: this.taskDetails
        ? this.taskDetails.initiatorname
        : vars.initiatorname,
      levelInfo: this.taskDetails
        ? this.taskActionSvc.setLevelInfo([this.taskDetails], this.loggedUser)
        : '',
      partnerLegalName: vars.dealCompany,
      companyFound: vars.companyFound,
      dealId: vars.dealId,
      sapId: vars.sapid
        ? vars.sapid
        : vars.sapIdVendor
        ? vars.sapIdVendor
        : vars.sapIdCustomer,
      sapIdType: vars.sapidtype ? vars.sapidtype : vars.sapIdVendor ? 'V' : 'C',
      processVariables: vars,
    };

    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.onSapIdAttach = this.onSapIdAttach;
    if (this.uploadableTypes) {
      modalRef.componentInstance.selectedDocCategories = this.uploadableTypes;
    }
    if (this.viewType == 'contract') {
      modalRef.componentInstance.selectedDocCategories = this.selectedDocTypes;
    }
    modalRef.componentInstance.docResp.subscribe((resp) => {
      if (!resp.doc.isOnEditMode) {
        this.taskActionSvc.onCommentSubmitted(
          resp.comment,
          this.taskDetails?.id,
          this.taskDetails?.businessKey || vars.businessKey,
          this.commentList,
          null,
          this.taskDetails
            ? this.taskActionSvc.setLevelInfo(
                [this.taskDetails],
                this.loggedUser
              )
            : ''
        );
        localStorage.removeItem(`comment-${this.loggedUser.userid}`);
        const data = resp.doc.data as TaskDocumentModel;
        this.filterType = resp.doc.data.foldername
          ? resp.doc.data.foldername
          : resp.doc.data.metadata.folderType;
        const docInd = this.allDocumentList.findIndex((i) => i.id === data.id);
        let docIndMap: number;
        if (this.taskDocMap[this.filterType]) {
          docIndMap = this.taskDocMap[this.filterType].findIndex(
            (i) => i.id === data.id
          );
        }

        if (docInd >= 0) {
          this.taskDocMap[this.filterType][docIndMap] = data;
          this.allDocumentList[docInd] = data;
        } else {
          if (this.taskDocMap[this.filterType]) {
            this.taskDocMap[this.filterType].unshift(data);
          } else {
            this.taskDocMap[this.filterType] = [data];
          }
          this.allDocumentList.unshift(data);
        }

        // if (this.docTypes.includes(this.filterType)) {
        this.selectedType = this.selectedType.filter(
          (a) => a !== this.filterType
        );
        //   this.filterDocument(this.filterType);
        // } else if (!this.docTypes.includes(this.filterType)) {
        //   this.docTypes.push(this.filterType);
        //   this.defaultDoc = this.taskActionSvc.getDefaultFile(this.docTypes) ;
        //   // this.filterDocument(this.filterType);
        // }
        this.taskSignalSvc.docList.next(this.allDocumentList);
        this.taskSignalSvc.docMap.next(this.taskDocMap);
      }
    });
  }

  filterDocument(type: string) {
    this.selectedType = this.selectedType.filter((a) => a !== undefined);
    if (type === 'All') {
      if (this.selectedType.includes('All')) {
        this.selectedType = [];
        this.selectedType.push(this.defaultDoc);
        this.documentList = this.allDocumentList.filter(
          (a) => a.foldername === this.defaultDoc
        );
      } else {
        this.selectedType = this.docTypes;
        this.documentList = this.allDocumentList;
      }
    }
    if (type !== 'All' && type) {
      this.selectedType.includes('All')
        ? (this.selectedType = this.selectedType.filter((a) => a !== 'All'))
        : (this.selectedType = this.selectedType);
      if (this.selectedType.includes(type)) {
        this.selectedType = this.selectedType.filter((a) => a !== type);
        this.selectedType.length === 0
          ? this.selectedType.push(this.defaultDoc)
          : (this.selectedType = this.selectedType);
      } else {
        this.selectedType.push(type);
      }

      this.documentList = this.allDocumentList.filter((a) =>
        this.selectedType.includes(a.foldername)
      );
      if (
        this.selectedType.length ===
        this.docTypes.filter((a) => a !== 'All').length
      ) {
        this.selectedType.push('All');
      }
    }
  }

  checkOut(doc: TaskDocumentModel): void {
    if (!doc.checkoutby) {
      this.taskInfoSvc.checkOutDoc(doc).subscribe((res) => {
        if (res.status) {
          this.taskInfoSvc.openDocument(res.data.contentid);
          const id = this.allDocumentList.findIndex((i) => i.id === doc.id);
          const visid = this.documentList.findIndex((i) => i.id === doc.id);
          const mapId = this.taskDocMap[doc.foldername].findIndex(
            (i) => i.id === doc.id
          );

          this.allDocumentList[id].checkoutby = res.data.checkoutby;
          this.allDocumentList[id].checkedoutusername =
            res.data.checkedoutusername;
          this.allDocumentList[id].checkedoutdate = res.data.checkedoutdate;
          const checkoutfile = this.allDocumentList[id];
          this.documentList[visid].checkoutby = res.data.checkoutby;
          this.documentList[visid].checkedoutusername =
            res.data.checkedoutusername;
          this.documentList[visid].checkedoutdate = res.data.checkedoutdate;

          this.documentList = this.orderDocs(this.allDocumentList);
          this.taskDocMap[doc.foldername][mapId].checkoutby =
            res.data.checkoutby;
          this.taskDocMap[doc.foldername][mapId].checkedoutusername =
            res.data.checkedoutusername;
          this.taskDocMap[doc.foldername][mapId].checkedoutdate =
            res.data.checkedoutdate;
          this.filterType = this.documentList[visid].foldername;
          this.selectedType = this.selectedType.filter(
            (a) => a !== this.filterType
          );

          this.taskSignalSvc.docList.next(this.allDocumentList);
          this.taskSignalSvc.docMap.next(this.taskDocMap);
        }
      });
    }
  }

  checkIn(doc: TaskDocumentModel): void {
    if (doc.checkoutby === this.loggedUser.userid) {
      const modalRef = this.modalService.open(CheckInFileModalComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.inputDoc = doc;
      modalRef.componentInstance.taskKeys = {
        taskid: this.taskDetails.id,
        businessKey: this.taskDetails.businessKey,
      };
      modalRef.componentInstance.emitCheckInFile.subscribe((resp) => {
        if (resp) {
          this.taskInfoSvc.checkInDoc(resp.doc, doc.id).subscribe((res) => {
            if (res.status) {
              this.taskActionSvc.onCommentSubmitted(
                resp.comment,
                this.taskDetails.id,
                this.taskDetails.businessKey,
                this.commentList,
                null,
                this.taskActionSvc.setLevelInfo(
                  [this.taskDetails],
                  this.loggedUser
                )
              );
              localStorage.removeItem(`comment-${this.loggedUser.userid}`);
              this.toastrSvc.success('Document Checked In Successfully');
              modalRef.close();
              const id = this.allDocumentList.findIndex((i) => i.id === doc.id);
              const visid = this.documentList.findIndex((i) => i.id === doc.id);
              const mapId = this.taskDocMap[doc.foldername].findIndex(
                (i) => i.id === doc.id
              );

              this.allDocumentList[id].checkoutby = null;
              this.allDocumentList[id].version = res.data.version;
              this.allDocumentList[id].mimetype = res.data.mimetype;
              this.allDocumentList[id].contentid = res.data.contentid;
              this.allDocumentList[id].updatebyname = res.data.updatebyname;
              this.allDocumentList[id].updateuserid = res.data.updateuserid;
              this.allDocumentList[id].modifieddate = res.data.modifieddate;
              this.allDocumentList[id].namedrangevalues =
                res.data.namedrangevalues;

              this.taskDocMap[doc.foldername][mapId].checkoutby = null;
              this.taskDocMap[doc.foldername][mapId].version = res.data.version;
              this.taskDocMap[doc.foldername][mapId].mimetype =
                res.data.mimetype;
              this.taskDocMap[doc.foldername][mapId].contentid =
                res.data.contentid;
              this.taskDocMap[doc.foldername][mapId].updatebyname =
                res.data.updatebyname;
              this.taskDocMap[doc.foldername][mapId].updateuserid =
                res.data.updateuserid;
              this.taskDocMap[doc.foldername][mapId].modifieddate =
                res.data.modifieddate;
              this.taskDocMap[doc.foldername][mapId].namedrangevalues =
                res.data.namedrangevalues;
              this.filterType = this.documentList[visid].foldername;
              this.selectedType = this.selectedType.filter(
                (a) => a !== this.filterType
              );

              this.taskSignalSvc.docList.next(this.allDocumentList);
              this.taskSignalSvc.docMap.next(this.taskDocMap);
              // this.documentList = this.orderDocs(this.allDocumentList) ;

              this.documentList = this.documentList.filter(
                (a) => a.id !== this.allDocumentList[id].id
              );
              this.documentList.unshift(this.allDocumentList[id]);
              this.updateVariablesOnCheckin(res.data.namedrangevalues, id);
            }
          });
        }
      });
    } else {
      this.toastrSvc.error('You can not check in this file');
    }
  }

  cancelCheckout(doc: TaskDocumentModel): void {
    if (doc.checkoutby === this.loggedUser.userid) {
      this.taskInfoSvc.cancelCheckout(doc).subscribe((resp) => {
        if (resp.status) {
          const id = this.allDocumentList.findIndex((i) => i.id === doc.id);
          const visid = this.documentList.findIndex((i) => i.id === doc.id);
          const mapId = this.taskDocMap[doc.foldername].findIndex(
            (i) => i.id === doc.id
          );

          this.allDocumentList[id].checkoutby = null;
          this.allDocumentList[id].checkedoutusername = null;
          this.documentList[visid].checkoutby = null;
          this.documentList[visid].checkedoutusername = null;
          this.taskDocMap[doc.foldername][mapId].checkoutby = null;
          this.taskDocMap[doc.foldername][mapId].checkedoutusername = null;

          this.toastrSvc.success('Check out cancelled');
          this.filterType = this.documentList[visid].foldername;
          this.selectedType = this.selectedType.filter(
            (a) => a !== this.filterType
          );

          this.taskSignalSvc.docList.next(this.allDocumentList);
          this.taskSignalSvc.docMap.next(this.taskDocMap);
        }
      });
    } else {
      this.toastrSvc.error('Check out done by another user');
    }
  }

  countDoc(docname: string): number {
    return this.documentList.filter((a) => a.foldername === docname).length;
  }

  getDocTypefromFolder(doc: TaskDocumentModel): string {
    return this.taskActionSvc.getDocTypefromFolder(doc.foldername, doc);
  }

  determineView(doc: TaskDocumentModel): boolean {
    let createduser = '';
    if (this.taskDetails) {
      createduser = this.taskDetails.initiator;
    } else if (this.contractInfo) {
      createduser = this.contractInfo.initiatedby;
    }

    if (doc.foldername === this.documentCategoryName.executedCont) {
      return this.taskActionSvc.checkConfidential(doc, createduser);
    } else {
      return true;
    }
  }

  checkFormName() {
    return this.taskDetails.formKey === 'legalReview' ||
      this.taskDetails.formKey === 'contractSigIbasisSig'
      ? true
      : false;
  }

  checkUploadable(name) {
    // if (name === this.documentCategoryName.other) {
    //   name = this.documentCategoryName.misc;
    // }
    // console.log(this.uploadableTypes, 'YOOOOOOOOOOOOOO');
    // return this.uploadableTypes && this.uploadableTypes.length > 0
    //   ? this.uploadableTypes.find((a) => a.name === name)
    //     ? true
    //     : false
    //   : true;

    return true;
  }

  checkAuth(doc: TaskDocumentModel): boolean {
    return this.taskDetails?.reviewTask
      ? doc.foldername === this.documentCategoryName.businessCase
        ? false
        : true
      : doc.metadata &&
        doc.metadata.folderType == this.documentCategoryName.inProcess
      ? this.loggedUser.roles.some((r) =>
          this.inProcessCheckOutPermission.includes(r)
        )
        ? true
        : this.loggedUser.roles.some((r) =>
            this.bcCheckOutPermission.includes(r)
          )
      : true;
  }

  openVersionModal(doc) {
    let docInfo: any = {
      foldername: doc.foldername,
      type: this.getDocTypefromFolder(doc),
    };
    if (this.selectedProcess?.key === 'Initiation_contentCreationProcess') {
      docInfo.course = this.getCourse();
      docInfo.module = this.getModule();
    }
    const modalRef = this.modalService.open(VersionHistoryModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.contentid = doc.contentid;
    modalRef.componentInstance.docInfo = docInfo;
  }

  print() {
    const refMod = this.modalService.open(PrintProcessDocumentModalComponent, {
      size: 'lg',
    });
    refMod.componentInstance.docs = this.allDocumentList;
    refMod.componentInstance.partnerLegalName = this.taskDetails
      ? this.taskDetails.partnerLegalName
      : this.taskVariables.find((a) => a.name === 'partnerLegalName').value;
    refMod.componentInstance.product = this.taskDetails
      ? this.taskDetails.product
      : this.taskVariables.find((a) => a.name === 'product').value;
    refMod.componentInstance.contractType = this.taskDetails
      ? this.taskDetails.contractType
      : this.taskVariables.find((a) => a.name === 'contractType').value;
    refMod.componentInstance.printEmitter.subscribe((p) => {
      if (p) {
        let bKey = this.taskVariables.find(
          (a) => a.name === 'businessKey'
        ).value;
        this.taskActionSvc.processDocumentDownload(p.processDocs);
        // p.supportingDocs.forEach(s => {
        //   this.taskActionSvc.downloadReport(this.taskDetails.id, s, 'task') ;
        // });

        this.completedContract
          ? this.taskActionSvc.downloadZipSupportingDoc(undefined, bKey)
          : this.taskActionSvc.downloadZipSupportingDoc(
              this.taskDetails.id,
              this.taskDetails.businessKey
            );
        refMod.close();
      }
    });
  }

  updateVariablesOnCheckin(obj, id) {
    if (obj) {
      Object.keys(obj).forEach((o) => {
        this.taskModel[o] = obj[o];
        this.procForm.variables.find((p) => p.name == o)
          ? (this.procForm.variables.find((p) => p.name == o).value =
              this.taskModel[o])
          : null;
      });

      this.taskSignalSvc.model.next(this.taskModel);
      this.taskSignalSvc.procForm.next(this.procForm);
      this.taskSvc
        .saveTaskForm(this.taskDetails.id, obj, this.taskDetails.businessKey)
        .subscribe((a) => {
          let varsNameValueMap = this.taskDetails.variables.reduce(
            (acc, cur) => {
              acc[cur.name] = cur.value;
              return acc;
            },
            {}
          );
          let body = varsNameValueMap || {};

          this.taskSvc
            .saveVariables(this.taskDetails.businessKey, {
              ...body,
              ...obj,
            })
            .subscribe();
        });
    }
  }

  getDocumentListByAadhaarId(): void {
    this.taskInfoSvc.getEmployeeDocs(this.aadhaarId).subscribe((a) => {
      this.documentList = a.data['KYC Documents'];
      console.log('DOCS', this.documentList);

      // const documentTypeMatrix: InitiateDocMatrixModel[] = [];
      // Object.keys(a.data).forEach((i) => {
      //   const obj: InitiateDocMatrixModel = {
      //     key: i,
      //     list: a.data[i],
      //   };
      //   documentTypeMatrix.push(obj);
      // });
      // this.signalSvc.documentTypeMatrix.next(documentTypeMatrix);
    });
  }

  getTabsettingsForDocument(): void {
    let processDefTabSettings = JSON.parse(
      localStorage.getItem('selected-process')
    ).tabSettings;
    this.documentTabSettings = processDefTabSettings.find(
      (x) => x.id === 'document'
    );
  }
}

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  FileUploadService,
  RefDataService,
  UserService,
} from 'src/app/core/_services';
import {
  DocumentCategoryEnum,
  TemplateMetaRequestModel,
  TasksAutoFillTaskInfo,
  ContractProductEnum,
  ContractTypeEnum,
} from '../../_models';
import {
  TaskInfoService,
  TaskService,
  TaskSignalService,
} from '../../_services';

import {
  LoggedUserModel,
  ProcessVariableModel,
  TagType,
  TypeAheadModel,
} from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';
import { CommentBoxOptions } from 'src/app/core/_models';
import { CreateCompanyModalComponent } from 'src/app/shared/_modals';

@Component({
  selector: 'app-file-uploader-modal',
  templateUrl: './file-uploader-modal.component.html',
  styleUrls: ['./file-uploader-modal.component.scss'],
})
export class FileUploaderModalComponent implements OnInit {
  @Input() inputData;
  @Input() selectedDocCategories;

  @Output() docResp: EventEmitter<any> = new EventEmitter();
  @Input() onSapIdAttach;

  mobileSofForm = 'uploadSOF';
  mobileSOF = 'Mobile SOF';

  documentCategoryEnum = DocumentCategoryEnum;
  docCategories: any[] = [];
  acceptList: string = '*';
  taskName = TasksAutoFillTaskInfo;
  contractProductEnum = ContractProductEnum;
  contractTypeEnum = ContractTypeEnum;
  metadatas = [];
  templates: TypeAheadModel[] = [];
  isOnEditMode = false;
  readonly = false;
  isFirstFocusOutOnMulitiSelect;
  isFirstFocusOutOnTemplateMulitiSelect;
  isCompanyCodePresent = true;
  bcType: string;
  loggedUser: LoggedUserModel;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));

  cdocRefdataFormModel;
  cdocOptions = {
    isFirstLevelTypeahead: false,
    isFirstLevelRequired: true,
    isFirstLevelMultiSelect: false,
    showSecondLevel: false,
    isSecondLevelMultiSelect: false,
    isSecondLevelTypeahead: false,
    isSecondLevelRequired: false,
  };
  compDocRefData = {
    code: 'CO_DOC_TYPE',
    name: 'Company Document Type',
  };
  businessCaseRefData = {
    code: 'BC_TYPE',
    name: 'Business Case Type',
  };
  kycRefData = {
    code: 'KYC_DOC_TYPE',
    name: 'KYC Document Types',
  };
  ofacDocRefData = {
    code: 'ODT',
    name: 'OFAC Document Type',
  };
  dropdownSettings = {
    singleSelection: true,
    closeDropDownOnSelection: true,
    idField: 'code',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };
  dropdownSettingsTemplate = {
    singleSelection: true,
    closeDropDownOnSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };

  multiMentionConfig = {
    mentions: [],
  };
  @ViewChild('commentBox') commentBox;
  commentBoxOptions: CommentBoxOptions = {
    allowFullScreen: false,
    height: 172,
    clearAfterSubmit: false,
  };
  tagUsers;
  tagGroups;
  showdocs = false;
  constructor(
    public activeModal: NgbActiveModal,
    private fileUploaderSvc: FileUploadService,
    private taskInfoSvc: TaskInfoService,
    private toastrSvc: ToastrService,
    private refDataSvc: RefDataService,
    private userSvc: UserService,
    private modalSvc: NgbModal,
    private taskSvc: TaskService
  ) {}

  save() {
    let api = 'uploadDocument';
    let selectedProcessKey = JSON.parse(
      localStorage.getItem('selected-process')
    )?.key;

    if (this.isOnEditMode) {
      api = 'editDocument';
    }
    let addSvc = this.inputData.taskVariables.find(
      (i) => i.name == 'additionalSvcType'
    );
    let iotCtType = this.inputData.taskVariables.find(
      (i) => i.name == 'iotContractType'
    );
    let productSecondLevel = this.inputData.taskVariables.find(
      (i) => i.name == 'productSecondLevel'
    );
    let ctSecondLevel = this.inputData.taskVariables.find(
      (i) => i.name == 'contractTypeSecondLevel'
    );

    const rcmPracticeName = this.inputData.taskVariables.find(
      (i) => i.name === 'rcmPracticeName'
    );

    const processName = JSON.parse(
      localStorage.getItem('selected-process')
    )?.name;
    console.log(
      'INPUT DATA',
      'rcmPracticeName,,processName',
      rcmPracticeName,
      this.inputData,
      processName
    );

    const rcmObj = {
      rcmPracticeName: rcmPracticeName?.value,
      processName: processName,
    };
    let data =
      selectedProcessKey === 'Initiation_contentCreationProcess'
        ? {
            metadata: {
              docCategory: this.inputData.doccat[0].code,
              businessKey: this.inputData.businessKey,
              courseName: this.inputData.taskVariables?.find(
                (varible) => varible.name === 'course'
              ).value,
              moduleName: this.inputData.taskVariables?.find(
                (varible) => varible.name === 'module'
              ).value,
              processName: selectedProcessKey,
            },
            name: this.inputData.filename,
            comment: this.commentBox.getComment(),
          }
        : selectedProcessKey === 'Initiation_vMTProcess'
        ? {
            metadata: {
              docCategory: this.inputData.doccat[0].code,
              businessKey: this.inputData.businessKey,
              sapid: this.inputData.sapId,
              sapidtype: this.inputData.sapIdType,
            },
            docmeta: null,
            products: [{ name: this.inputData.product }],
            contracttype: [{ name: this.inputData.contractType }],
            name: this.inputData.filename,
            comment: this.commentBox.getComment(),
          }
        : {
            metadata: {
              partnerLegalName: this.inputData.companyLegalName,
              ibasisContractingEntity: this.inputData.ibasisContractingEntity,
              docCategory: this.inputData.doccat[0].code,
              businessKey: this.inputData.businessKey,
              companyCode: this.inputData.companyCode,
              employeeName: this.inputData.employeeName,
              sapid: this.inputData.sapId,
              sapidtype: this.inputData.sapIdType,
              additionalSvcType: addSvc ? addSvc.value : '',
              iotContractType: iotCtType ? iotCtType.value : '',
              productSecondLevel: productSecondLevel
                ? productSecondLevel.value
                : '',
              contractTypeSecondLevel: ctSecondLevel ? ctSecondLevel.value : '',
              initiatorName: this.inputData.initiatorname,
            },
            docmeta: null,
            products: [{ name: this.inputData.product }],
            contracttype: [{ name: this.inputData.contractType }],
            name: this.inputData.filename,
            comment: this.commentBox.getComment(),
          };

    if (processName == 'Initiation RCM Billing Process') {
      data.metadata = { ...data.metadata, ...rcmObj };
    }

    if (
      this.inputData.doccat[0].code ==
        this.documentCategoryEnum.companyDocuments ||
      this.inputData.doccat[0].code == this.documentCategoryEnum.ofac ||
      this.inputData.doccat[0].code == this.documentCategoryEnum.kyc
    ) {
      data.docmeta = this.inputData.cdoc.firstLevelInstance;
    } else {
      data.docmeta = this.inputData.cdoc;
    }

    if (
      this.inputData.doccat[0].code ===
        this.documentCategoryEnum.executedContracts &&
      this.inputData.selectedDocument.type !== 'application/pdf'
    ) {
      this.toastrSvc.warning('Please select pdf in executed contracts');
    } else if (
      this.inputData.doccat[0].code ===
        this.documentCategoryEnum.businessCase &&
      !this.inputData.selectedDocument.type
        .toLowerCase()
        .includes(
          'application/vnd.ms-excel.sheet.macroEnabled.12'.toLowerCase()
        ) &&
      !this.inputData.selectedDocument.type
        .toLowerCase()
        .includes(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.toLowerCase()
        )
    ) {
      this.toastrSvc.warning('Please upload .xlsm or .xlsx format only');
    } else {
      let formdata = new FormData();
      if (this.inputData.selectedDocument instanceof File) {
        formdata.append('file', this.inputData.selectedDocument);
      }
      formdata.append('others', JSON.stringify(data));
      // formdata.append('comment', this.commentBox.getComment());
      this.fileUploaderSvc[api](formdata).subscribe((resp) => {
        if (resp.status) {
          this.docResp.emit({
            doc: { data: resp.data, isOnEditMode: this.isOnEditMode },
            comment: data.comment,
          });
          this.activeModal.close('');
        } else {
          alert(resp.message);
        }
      });
    }
  }

  onItemSelect(e): void {
    this.inputData.cdoc = [];
    this.cdocRefdataFormModel = [];

    if (
      this.inputData.doccat[0].code ==
        this.documentCategoryEnum.executedContracts ||
      this.inputData.doccat[0].code == this.documentCategoryEnum.inprocess
    ) {
      if (this.inputData.taskForm === this.mobileSofForm) {
        setTimeout(() => {
          this.templates = [{ id: '56', name: 'Mobile SOF' }];
          this.inputData.cdoc = this.templates;
        }, 0);
      } else {
        this.getTemplates();
      }
    } else if (
      this.inputData.doccat[0].code == this.documentCategoryEnum.businessCase
    ) {
      this.getBusinessCaseTypes();
    }
    if (
      this.inputData.doccat[0].code ==
      this.documentCategoryEnum.executedContracts
    ) {
      this.acceptList = '.pdf';
    } else if (
      this.inputData.doccat[0].code == this.documentCategoryEnum.businessCase
    ) {
      this.acceptList = '.xlsm, .xlsx';
    } else {
      this.acceptList = '*';
    }
    this.readonly = !(
      this.inputData.doccat[0].code ===
        this.documentCategoryEnum.companyDocuments ||
      this.inputData.doccat[0].code ===
        this.documentCategoryEnum.miscellaneous ||
      this.inputData.doccat[0].code === this.documentCategoryEnum.ofac ||
      this.inputData.doccat[0].code ===
        this.documentCategoryEnum.opportunityDocuments
    );
  }

  handleFileInput(e): void {
    let files = e.target.files as File[];
    if (files.length > 0) {
      this.inputData.selectedDocument = files[0];

      if (
        this.inputData.doccat[0] &&
        (this.inputData.doccat[0].code ===
          this.documentCategoryEnum.companyDocuments ||
          this.inputData.doccat[0].code ===
            this.documentCategoryEnum.miscellaneous ||
          this.inputData.doccat[0].code === this.documentCategoryEnum.ofac)
      ) {
        this.inputData.filename = this.inputData.filename
          ? this.inputData.filename
          : this.inputData.selectedDocument.name.substr(
              0,
              this.inputData.selectedDocument.name.lastIndexOf('.')
            );
      } else {
        this.inputData.filename = this.inputData.selectedDocument.name.substr(
          0,
          this.inputData.selectedDocument.name.lastIndexOf('.')
        );
      }
    }
  }

  getDocCategories() {
    // if(!this.docCategories && this.docCategories.length===0) {
    let processName = JSON.parse(localStorage.getItem('selected-process'));
    this.fileUploaderSvc
      .getAllDocCategory(processName?.key)
      .subscribe((resp) => {
        if (resp.status) {
          if (this.selectedDocCategories) {
            this.selectedDocCategories.forEach((s) => {
              const cat = resp.data.find((o) => o.code === s.code);
              if (cat) {
                this.docCategories.push(cat);
              }
            });
            this.setDocOptions();
          } else {
            this.docCategories = resp.data;
            this.docCategories = this.docCategories.filter(
              (i) => i.code !== this.documentCategoryEnum.executedContracts
            );
            this.setDocOptions();
          }
        }
      });

    //  } else {
    //    this.setDocOptions() ;
    // }
  }

  filterDocFromSelectedDoc(obj) {}

  setDocOptions() {
    // if (this.taskName.initiateNda === this.inputData.taskForm ||
    //   this.taskName.initiateIOTNda === this.inputData.taskForm) {
    //   this.docCategories = this.docCategories.filter(i => i.code !== this.documentCategoryEnum.inprocess);
    // }
    // if (!(this.inputData.product !== this.contractProductEnum.other &&
    //   (this.inputData.contractType == this.contractTypeEnum.service ||
    //   this.inputData.contractType == this.contractTypeEnum.additionalSvc ))) {
    //   this.docCategories = this.docCategories.filter(i => i.code !== this.documentCategoryEnum.businessCase);
    // }
    if (
      this.inputData.contractType !== this.contractTypeEnum.ofac &&
      this.inputData.taskForm !== this.taskName.signatoryOfac &&
      this.inputData.taskForm !== this.taskName.additionalInfoPartner
    ) {
      this.docCategories = this.docCategories.filter(
        (i) => i.code !== this.documentCategoryEnum.ofac
      );
    } else if (this.inputData.contractType === this.contractTypeEnum.ofac) {
      this.docCategories = this.docCategories.filter(
        (i) => i.code !== this.documentCategoryEnum.inprocess
      );
    }

    if (
      !this.loggedUser.roles.some((r) =>
        this.inputData.inProcessAllowed.includes(r)
      )
    ) {
      this.docCategories = this.docCategories.filter(
        (i) => i.code !== this.documentCategoryEnum.inprocess
      );
    }
    if (
      !this.loggedUser.roles.some((r) => this.inputData.bcAllowed.includes(r))
    ) {
      this.docCategories = this.docCategories.filter(
        (i) => i.code !== this.documentCategoryEnum.businessCase
      );
    }
    this.showdocs = true;
  }

  getBusinessCaseTypes(): void {
    let additionalSvcType = this.inputData.taskVariables.find(
      (i) => i.name === 'additionalSvcType'
    );
    additionalSvcType = additionalSvcType
      ? additionalSvcType.value.split(' ')[0]
      : null;

    this.refDataSvc
      .getInstances(this.businessCaseRefData.code, true)
      .subscribe((a) => {
        if (a.status) {
          this.inputData.cdoc = a.data.filter((i) => {
            if (
              this.inputData.contractType.toLowerCase() == 'amendment' &&
              this.inputData.contractTypeSecondLevel.toLowerCase() ==
                'additional services' &&
              additionalSvcType
            ) {
              return i.name
                .toLowerCase()
                .includes(additionalSvcType.toLowerCase());
            } else {
              return i.name
                .toLowerCase()
                .includes(this.inputData.product.toLowerCase());
            }
          });
          this.bcType = this.inputData.cdoc[0].name;
        }
      });
  }

  getTemplates(): void {
    let obj: TemplateMetaRequestModel = {
      metadata: this.createVarMap(),
      contracttype: [{ name: this.inputData.contractType }],
      products: [{ name: this.inputData.product }],
    };
    this.taskInfoSvc.getTemplatesUsingVars(obj).subscribe((a) => {
      this.templates = a.data.sort((a, b) => (a.name > b.name ? 1 : -1));
      if (this.templates.length === 1) {
        this.inputData.cdoc = this.templates;
      }
    });
  }

  createVarMap(): any {
    let obj = {};
    this.inputData.taskVariables.map(
      (i: ProcessVariableModel) => (obj[i.name] = i.value)
    );
    return obj;
  }

  ngOnInit(): void {
    this.isCompanyCodePresent = this.inputData.companyFound;
    this.cdocRefdataFormModel = this.inputData.cdoc;
    this.loggedUser = JSON.parse(localStorage.getItem('user'));

    this.getDocCategories();

    if (this.inputData.docid) {
      this.isOnEditMode = true;
    }

    this.getUsers();
    this.getAllGroup();
  }

  getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.tagUsers = a.data;
      this.multiMentionConfig.mentions.push({
        items: this.tagUsers,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
    });
  }

  public insertUserTagHtml(user) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${user.userid}" data-tagtype="${TagType.USER}"
      contenteditable="false"
      >${user.fullname}</span>`;
  }

  public insertGroupTagHtml(group) {
    return `<span
      class="mention group-mention" style="color: #2aa89b"  id="${group.id}" data-tagtype="${TagType.GROUP}"
      contenteditable="false"
      >${group.name}</span>`;
  }

  getAllGroup() {
    this.userSvc.getUserGroups().subscribe((a) => {
      this.tagGroups = a.data;
      this.multiMentionConfig.mentions.push({
        items: this.tagGroups,
        triggerChar: '#',
        insertHtml: true,
        labelKey: 'name',
        mentionSelect: this.insertGroupTagHtml,
      });
    });
  }

  close() {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.removeItem(`comment-${user.userid}`);
    this.activeModal.close();
  }

  clearCompany() {
    this.inputData.companyCode = '';
  }
  selectCompany(e: TypeAheadModel): void {
    e.id = e.id.toString();
    if (!e.id.includes('create')) {
      this.inputData.companyCode = e.code;
    } else {
      this.openCreateCompanyModal(e.param);
    }
  }

  saveCompany() {
    this.taskSvc
      .attachCompanySapId(
        this.inputData.businessKey,
        this.inputData.companyCode
      )
      .subscribe((data) => {
        // console.log(data);
        this.isCompanyCodePresent = true;

        this.taskSvc
          .saveVariables(this.inputData.businessKey, {
            ...this.inputData.processVariables,
            dealCompany: this.inputData.partnerLegalName,
          })
          .subscribe();
        this.onSapIdAttach.emit();
      });
  }

  openCreateCompanyModal(companyName?: string): void {
    const modalRef = this.modalSvc.open(CreateCompanyModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.userRole = 'accountmanager';
    modalRef.componentInstance.companyName = companyName;
    // this.subscription.push(
    modalRef.componentInstance.addCompanyEvent.subscribe((a) => {
      if (a) {
        this.inputData.companyCode = a.code;
      }
    });
    // );
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { StartProcessSignalService } from '../../../_services';
import {
  InitiationTaskModel,
  InitiationTaskViewModel,
  InitiationTaskCheckModel,
  InitiateDocMatrixModel,
  AmendmentType,
} from '../../../_models';
import {
  CompanyManagementService,
  SharedService,
} from 'src/app/core/_services';
import {
  AddressType,
  CompanyFlagsModel,
  CompanyModel,
  CommentBoxConstants,
  LoggedUserModel,
  UserGroupsEnum,
} from 'src/app/core/_models';
import {
  TaskInfoService,
  TaskService,
  TaskActionService,
} from '../../../../layout/_services';
import {
  ContractProductEnum,
  ContractTypeEnum,
  IotContractType,
  TaskDocumentModel,
} from '../../../../layout/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateCompanyModalComponent,
  FullCommentBoxModalComponent,
} from 'src/app/shared/_modals';
import Swal from 'sweetalert2';
import { RestrictConstant } from '../../../_models/restrict.model';
import { ProcessFormsService } from 'src/app/feature/system/process-forms/_services';

@Component({
  selector: 'app-start-process-ibasis',
  templateUrl: './start-process.component.html',
  styleUrls: ['./start-process.component.scss'],
})
export class StartProcessIbasisComponent implements OnInit, OnDestroy {
  initiationData: InitiationTaskModel = {} as InitiationTaskModel;
  viewData: InitiationTaskViewModel = {} as InitiationTaskViewModel;
  ipDocumentList: TaskDocumentModel[] = [];
  ecDocumentList: TaskDocumentModel[] = [];
  showButton = false;
  companyFlags: CompanyFlagsModel = {} as CompanyFlagsModel;
  workflowNeedsToBeInitiated = true;
  subscription: Subscription[] = [];
  comment;
  userGroupEnum = UserGroupsEnum;

  constructor(
    private taskActionSvc: TaskActionService,
    private signalSvc: StartProcessSignalService,
    private companySvc: CompanyManagementService,
    private taskInfoSvc: TaskInfoService,
    private modalSvc: NgbModal,
    private taskSvc: TaskService,
    private toastrSvc: ToastrService,
    private sharedSvc: SharedService,
    private procFormSvc: ProcessFormsService
  ) {}

  ngOnInit(): void {
    this.subscribeToSignal();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  subscribeToSignal(): void {
    this.subscription.push(
      this.signalSvc.initToDetailsEmitter.subscribe((a) => this.eventAction(a))
    );
    this.subscription.push(
      this.signalSvc.companyAction.subscribe((a) => this.eventAction(a))
    );
  }

  eventAction(event: string): void {
    switch (event) {
      case 'companySelected':
        this.getCompanyDetails();
        break;

      case 'contractingEntSelected':
        this.getContractingEnt();
        break;

      case 'editCompany':
        this.openEditModal();
        break;

      case 'selectAddr':
        this.selectAddress();
        break;

      case 'productSelected':
        this.viewData.historicalMSAExists =
          this.initiationData.product === ContractProductEnum.mobile ||
          this.initiationData.product === ContractProductEnum.sms ||
          this.initiationData.product === ContractProductEnum.voice
            ? this.companyFlags.mobilemsa ||
              this.companyFlags.voicemsa ||
              this.companyFlags.smsmsa
            : this.initiationData.product === ContractProductEnum.iot
            ? this.companyFlags.iotmsa
            : false;
        this.viewData.historicalNDAExists =
          this.initiationData.product.toLowerCase() === 'iot'
            ? this.companyFlags.ndaiot
              ? true
              : false
            : this.companyFlags.nda
            ? true
            : false;
        break;
      default:
        break;
    }
  }

  getCompanyDetails(): void {
    this.subscription.push(
      this.companySvc
        .getCompanybyId(this.initiationData.companyId)
        .subscribe((a) => {
          this.viewData = this.mapCompModelToViewModel(a.data);
          this.companyFlags = a.data.flags
            ? a.data.flags
            : ({} as CompanyFlagsModel);
          this.signalSvc.viewData.next(this.viewData);
          this.showButton = true;
          this.getDocumentList();
        })
    );
  }

  getDocumentList(): void {
    this.taskInfoSvc
      .getExistingList(this.initiationData.companyCode)
      .subscribe((a) => {
        const documentTypeMatrix: InitiateDocMatrixModel[] = [];

        Object.keys(a.data).forEach((i) => {
          const obj: InitiateDocMatrixModel = {
            key: i,
            list: a.data[i],
          };
          documentTypeMatrix.push(obj);
        });

        this.signalSvc.documentTypeMatrix.next(documentTypeMatrix);
      });
  }

  getContractingEnt(): void {
    this.subscription.push(
      this.companySvc
        .getContractingEntityByID(this.initiationData.ibasisContractingEntityId)
        .subscribe((a) => {
          if (a.status) {
            this.initiationData.ibasisContractingEntityAddress =
              a.data.data.principaladdress.friendlyaddress;
            this.initiationData.ibasisContractingEntityName =
              a.data.data.entityname;
            this.initiationData.ibasisContractingEntityCode = a.data.code;
            this.initiationData.ibasisContractingEntityLegalName =
              a.data.data.entitylegalname;
            this.initiationData.ibasisContractingEntityType =
              a.data.data.companytype;
            this.initiationData.ibasisContractingEntityRegistration =
              a.data.data.registration;
            this.initiationData.ibasisContractingEntityCorpId =
              a.data.data.corporateidnumber;
          }
        })
    );
  }

  mapCompModelToViewModel(data: CompanyModel): InitiationTaskViewModel {
    const obj: InitiationTaskViewModel = {} as InitiationTaskViewModel;

    const group = data.group as any;
    const princAddr = data.addresses.find(
      (i) => i.type === AddressType.PRINCIPAL
    );

    obj.companyLegalName = data.name;
    obj.companyName = data.friendlyname;
    obj.companyGroup = group ? group.name : '';
    obj.aliases = data.aliases;
    obj.addresses = data.addresses;
    obj.companyPrincipalAddr = princAddr ? princAddr : data.addresses[0];
    obj.selectedAddr = obj.companyPrincipalAddr.id;
    obj.companyCountry = obj.companyPrincipalAddr.country;

    this.initiationData.partnerAddress =
      obj.companyPrincipalAddr.friendlyaddress;
    this.initiationData.partnerAddressId = obj.companyPrincipalAddr.id;
    this.initiationData.selectedPartnerAddress =
      obj.companyPrincipalAddr.friendlyaddress;
    this.initiationData.country = obj.companyPrincipalAddr.country;
    this.initiationData.countryCode = obj.companyPrincipalAddr.countrycode;
    this.initiationData.companyCode = data.code;
    this.initiationData.partnerLegalName = data.name;
    this.initiationData.initiateOfac = data.ofacrequired
      ? !data.ofacdone && data.ofacs.length === 0
      : false;
    this.initiationData.registered = data.registered;

    return obj;
  }

  selectAddress(): void {
    const addr = this.viewData.addresses.find(
      (i) => i.id === this.initiationData.partnerAddressId
    );
    this.viewData.selectedAddr = this.initiationData.partnerAddressId;
    this.viewData.companyCountry = addr.country;
    this.viewData.companyPrincipalAddr = addr;

    this.signalSvc.viewData.next(this.viewData);
  }

  openEditModal(): void {
    const modalRef = this.modalSvc.open(CreateCompanyModalComponent, {
      keyboard: false,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.userRole = 'accountmanager';
    modalRef.componentInstance.companyId = this.initiationData.companyId;
    this.subscription.push(
      modalRef.componentInstance.addCompanyEvent.subscribe((a) => {
        if (a) {
          this.getCompanyDetails();
        }
      })
    );
  }

  formValid(): boolean {
    return (
      this.initiationData.companyId > 0 &&
      this.initiationData.ibasisContractingEntityId > 0 &&
      this.initiationData.product &&
      this.initiationData.contractType &&
      this.initiationData.contractType.length > 0 &&
      this.checkContractTypeSecondLevel() &&
      this.checkContractTypeThirdLevel()
    );
  }

  checkContractTypeSecondLevel(): boolean {
    if (
      this.initiationData.contractType[0].name
        .toLowerCase()
        .includes('other') ||
      this.initiationData.contractType[0].name
        .toLowerCase()
        .includes('amendment')
    ) {
      return (
        this.initiationData.contractTypeSecondLevel &&
        this.initiationData.contractTypeSecondLevel.length > 0
      );
    } else {
      return true;
    }
  }

  checkContractTypeThirdLevel() {
    if (this.initiationData.product.toLowerCase().includes('other')) {
      return (
        this.initiationData.productSecondLevel &&
        this.initiationData.productSecondLevel.length > 0
      );
    } else if (
      this.initiationData.product.toLowerCase().includes('iot') &&
      this.initiationData.contractType[0].name.toLowerCase().includes('service')
    ) {
      return (
        this.initiationData.iotContractType &&
        this.initiationData.iotContractType?.length > 0
      );
    } else if (
      this.initiationData.contractType[0].name
        .toLowerCase()
        .includes('amendment')
    ) {
      if (
        this.initiationData.contractTypeSecondLevel ===
        AmendmentType.additionalSvc
      ) {
        return (
          this.initiationData.additionalSvcType &&
          this.initiationData.additionalSvcType?.length > 0
        );
      }

      if (
        this.initiationData.contractTypeSecondLevel ===
        AmendmentType.currencyAmendment
      ) {
        return (
          this.initiationData.currencyAmendmentType &&
          this.initiationData.currencyAmendmentType?.length > 0
        );
      }
      return true;
    } else {
      return true;
    }
  }
  checkCasePriority(): boolean {
    if (
      this.initiationData.contractType[0].name
        .toLowerCase()
        .includes('service') &&
      (this.initiationData.product.toLowerCase().includes('iot') ||
        this.initiationData.product.toLowerCase().includes('mobile') ||
        this.initiationData.product.toLowerCase().includes('voice'))
    ) {
      return (
        this.initiationData.casePriority &&
        this.initiationData.casePriority.length > 0
      );
    } else {
      return true;
    }
  }

  trimInitiationData(): void {
    if (this.initiationData.product !== ContractProductEnum.other) {
      this.initiationData.productSecondLevel = '';
    }
    if (
      this.initiationData.contractType[0].name !== ContractTypeEnum.amendment &&
      this.initiationData.contractType[0].name !== ContractTypeEnum.other
    ) {
      this.initiationData.contractTypeSecondLevel = '';
    }
    if (
      this.initiationData.product !== ContractProductEnum.iot ||
      this.initiationData.contractType[0].name !== ContractTypeEnum.service
    ) {
      this.initiationData.iotContractType = '';
    }
    if (
      this.initiationData.contractType[0].name !== ContractTypeEnum.amendment ||
      this.initiationData.contractTypeSecondLevel !==
        AmendmentType.additionalSvc
    ) {
      this.initiationData.additionalSvcType = '';
    }
    if (
      this.initiationData.contractType[0].name !== ContractTypeEnum.amendment ||
      this.initiationData.contractTypeSecondLevel !==
        AmendmentType.currencyAmendment
    ) {
      this.initiationData.currencyAmendmentType = '';
    }
  }

  swalAlert(
    title: string,
    btnText: string,
    acceptCallback: Function,
    text?: string
  ): void {
    Swal.fire({
      title: title,
      text: text,
      confirmButtonText: btnText,
      showLoaderOnConfirm: true,
      showCancelButton: true,
      allowOutsideClick: () => true,
    }).then((result) => {
      if (result.value !== undefined) {
        acceptCallback();
      }
    });
  }

  checkHistoricalContracts(): boolean {
    if (
      this.initiationData.contractType.find(
        (i) => i.name === ContractTypeEnum.nda
      )
    ) {
      return this.initiationData.product === ContractProductEnum.iot
        ? this.companyFlags.ndaiot
        : this.companyFlags.nda;
    } else if (
      !this.initiationData.contractType.find(
        (i) => i.name === ContractTypeEnum.other
      ) &&
      this.initiationData.product !== ContractProductEnum.other
    ) {
      if (
        this.initiationData.product === ContractProductEnum.mobile ||
        this.initiationData.product === ContractProductEnum.voice ||
        this.initiationData.product === ContractProductEnum.sms
      ) {
        return (
          this.companyFlags.voicemsa ||
          this.companyFlags.smsmsa ||
          this.companyFlags.mobilemsa
        );
      } else if (this.initiationData.product === ContractProductEnum.iot) {
        return this.initiationData.iotContractType ===
          IotContractType.commercial ||
          this.initiationData.contractType[0].name ===
            ContractTypeEnum.amendment
          ? this.companyFlags[`${this.initiationData.product.toLowerCase()}msa`]
          : false;
      } else {
        return this.companyFlags[
          `${this.initiationData.product.toLowerCase()}msa`
        ];
      }
    }
    return false;
  }

  formSubmit(): void {
    this.trimInitiationData();

    const restriction = RestrictConstant[window.location.host];
    if (
      restriction &&
      restriction[this.initiationData.product.toLowerCase()][
        this.initiationData.contractType[0].name
      ]
    ) {
      this.toastrSvc.error(
        `${this.initiationData.contractType[0].name} for ${this.initiationData.product} is currently not allowed`
      );
    } else {
      const obj: InitiationTaskCheckModel = {} as InitiationTaskCheckModel;
      obj.product = this.initiationData.product;
      obj.contractType = this.initiationData.contractType;
      obj.partnerLegalName = this.initiationData.partnerLegalName;
      obj.ibasisContractingEntity =
        this.initiationData.ibasisContractingEntityName;
      obj.ibasisContractingEntityLegalName =
        this.initiationData.ibasisContractingEntityLegalName;
      obj.companyCode = this.initiationData.companyCode;
      obj.additionalSvcType = this.initiationData.additionalSvcType;
      obj.contractTypeSecondLevel = this.initiationData.contractTypeSecondLevel;
      obj.iotContractType = this.initiationData.iotContractType;
      obj.productSecondLevel = this.initiationData.productSecondLevel;
      //  -------------------------------------------------------
      const loggedUser: LoggedUserModel = JSON.parse(
        localStorage.getItem('user')
      );
      const groupIds = loggedUser.groupnames.filter(
        (i) =>
          i !== this.userGroupEnum.GUEST &&
          i !== this.userGroupEnum.CAMUNDA_ADMIN
      );
      console.log('GROUP ID ', groupIds[0], loggedUser.groupnames);
      obj.processName = JSON.parse(this.sharedSvc.selectedProcess).name;
      obj.groupId = groupIds[0];
      obj.groupIds = loggedUser.groupnames;
      console.log('TEST', obj);

      this.subscription.push(
        this.taskSvc.checkProcess(obj).subscribe((a) => {
          if (a.status) {
            let text;
            this.initiationData.msaExists = a.data.msaExists;
            this.initiationData.legalDecisionType = '';
            this.initiationData.additionalContReq = false;
            this.initiationData.additionalContReq2 = false;
            this.initiationData.additionalContReq3 = false;
            this.initiationData.ndaExists = a.data.ndaExists;
            this.initiationData.historicalContracts =
              this.checkHistoricalContracts() ? true : false;
            this.initiationData.ibasisTemplateAvailable = a.data.templateExists;
            this.initiationData.requestMsa = false;
            if (
              this.initiationData.contractType[0].name
                .toLowerCase()
                .includes('other') ||
              this.initiationData.product.toLowerCase().includes('other')
            ) {
              this.initiationData.requestMsa = true;
              this.initiationData.legalDecisionType = 'contEnt';
              this.initiationData.contractType[0].name
                .toLowerCase()
                .includes('other')
                ? (this.initiationData.otherContractType =
                    this.initiationData.contractTypeSecondLevel)
                : null;
            } else if (
              !a.data.runningInstance &&
              this.initiationData.contractType[0].name
                .toLowerCase()
                .includes('amendment') &&
              (a.data.msaExists || this.initiationData.historicalContracts)
            ) {
              this.initiationData.additionalContReq =
                this.initiationData.historicalContracts;
              if (
                !a.data.msaExists &&
                this.initiationData.historicalContracts
              ) {
                this.initiationData.requestMsa = true;
                this.initiationData.legalDecisionType = 'contEnt';
                this.initiationData.amendmentType =
                  this.initiationData.contractTypeSecondLevel;
              }
              if (
                this.initiationData.contractTypeSecondLevel ===
                'Additional Services'
              ) {
                this.initiationData.legalDecisionType = 'contEnt';
              }
            } else if (a.data.runningInstance) {
              this.toastrSvc.warning(
                `A contract for ${a.data.runningInstance.product} is already in progress`
              );
              this.swalAlert('Open Contract', 'Open', () =>
                this.taskActionSvc.viewMyContract(
                  a.data.runningInstance.contractid
                )
              );
              this.workflowNeedsToBeInitiated = false;
            } else if (
              this.initiationData.contractType[0].name
                .toLowerCase()
                .includes('nda') &&
              (a.data.ndaExists || this.initiationData.historicalContracts)
            ) {
              this.toastrSvc.warning(
                'A contract with these parameters already exists'
              );
              this.swalAlert('Request for New NDA', 'Yes', () => {
                this.initiationData.requestMsa = true;
                this.initiationData.legalDecisionType = 'ndaExec';
                this.initiationData.additionalContReq = !a.data.ndaExists;
                this.addCommentsPriorInititation();
              });
              this.workflowNeedsToBeInitiated = false;
            } else if (
              this.initiationData.contractType[0].name
                .toLowerCase()
                .includes('service') &&
              (a.data.msaExists || this.initiationData.historicalContracts)
            ) {
              this.toastrSvc.warning(
                'A contract with these parameters already exists'
              );
              this.swalAlert(
                'Request for New MSA',
                'Yes',
                () => {
                  this.initiationData.requestMsa = true;
                  this.initiationData.legalDecisionType = 'svcExec';
                  this.initiationData.additionalContReq = !a.data.msaExists;
                  // this.initiationData.amendmentType = this.initiationData.contractTypeSecondLevel ;
                  // this.initiateWorkflow();
                  // text = 'The Partner already has an MSA in the DMS. Clicking YES will send a request to Legal to approve a replacement MSA'
                  this.addCommentsPriorInititation();
                },
                'The Partner already has an MSA in the contract repository (DMS). Clicking YES will send a request to Legal to approve a replacement MSA before you can initiate the workflow. If you want to add an additional service to an existing MSA then select "Cancel" and change "Contract Type" to Amendment'
              );
              this.workflowNeedsToBeInitiated = false;
            } else if (
              this.initiationData.contractType[0].name
                .toLowerCase()
                .includes('amendment') &&
              !a.data.msaExists &&
              !this.initiationData.historicalContracts
            ) {
              this.toastrSvc.warning(
                'MSA with these parameters does not exist'
              );

              this.swalAlert(
                'Request MSA Search',
                'Yes',
                () => {
                  this.initiationData.requestMsa = true;
                  this.initiationData.legalDecisionType = 'amendExec';
                  this.initiationData.standardContractingEntity = false;
                  this.initiationData.amendmentType =
                    this.initiationData.contractTypeSecondLevel;
                  // this.initiateWorkflow();
                  // text = 'TheThe MSA is not in the contract repository (DMS). Clicking YES will send a req'
                  this.addCommentsPriorInititation();
                },
                'The MSA is not in the contract repository (DMS).  Clicking YES will send a request to Legal to locate the MSA before the workflow is initiated.'
              );

              this.workflowNeedsToBeInitiated = false;
            } else if (
              !a.data.runningInstance &&
              (this.initiationData.contractType[0].name
                .toLowerCase()
                .includes('other') ||
                this.initiationData.product.toLowerCase().includes('other'))
            ) {
              this.swalAlert(
                'Request Contracting Entity Check',
                'Yes',
                () => {
                  this.initiationData.requestMsa ||
                  this.initiationData.legalDecisionType === 'contEnt'
                    ? this.addCommentsPriorInititation()
                    : this.initiateWorkflow();
                },
                'Legal will confirm the contracting entity before you can initiate the workflow'
              );
              // this.initiationData.requestMsa || this.initiationData.legalDecisionType === 'contEnt' ?
              //       this.addCommentsPriorInititation() : this.initiateWorkflow() ;
            }

            this.workflowNeedsToBeInitiated
              ? this.initiationData.requestMsa ||
                this.initiationData.legalDecisionType === 'contEnt' ||
                !this.initiationData.standardContractingEntity
                ? this.swalAlert(
                    'Request Contracting Entity Check',
                    'Yes',
                    () => {
                      this.addCommentsPriorInititation();
                    },
                    'Legal will confirm the contracting entity before you can initiate the workflow'
                  )
                : this.initiateWorkflow()
              : null;
          }
        })
      );
    }
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

    this.initiationData.processname = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    // this.initiationData.contractType = this.initiationData.contractType[0].name

    let obj = JSON.parse(JSON.stringify(this.initiationData));
    obj.contractType = obj.contractType[0].name;

    this.subscription.push(
      this.taskSvc
        .startWorkflow({
          ...this.initiationData,
          contractType: obj.contractType,
        })
        .subscribe((a) => {
          if (a.status && a.data.length > 0) {
            obj.businesskey = a.data[0].businessKey;
            // need to break up the following code in smaller chunks
            this.procFormSvc
              .getProcDefbyName(obj.processname)
              .subscribe((r) => {
                if (r.data?.key?.variablename) {
                  obj[r.data?.key?.variablename] = a.data[0].businessKey;
                }
                this.taskSvc
                  .saveVariables(a.data[0].businessKey, obj)
                  .subscribe();
              });
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
                this.taskActionSvc.nextTask(nextProc, true);
              } else {
                this.toastrSvc.warning(
                  'Not able to initiate process. Please try again'
                );
              }
            } else {
              // ================temporary workaround for ofac=======================
              // const ofacProc = a.data.find((i) => i.ofac && i.status);
              // const nextProc = a.data.find((i) => i.status && !i.ofac);

              const ofacProc = a.data.find(
                (i) => i.contractType === 'Process_companyOfacProcess'
              );
              const nextProc = a.data.find(
                (i) => i.contractType !== 'Process_companyOfacProcess'
              );
              // ================temporary workaround for ofac=======================

              if (ofacProc && nextProc) {
                const ct = this.initiationData.contractType
                  .map((i) => i.name)
                  .join(', ');
                this.toastrSvc.success(`OFAC Process Initiated`);
                this.toastrSvc.success(
                  `${ct} Process Initiated for ${this.initiationData.product}`
                );
                this.taskActionSvc.nextTask(
                  {
                    businessKey: ofacProc.businessKey,
                    processId: ofacProc.id,
                  },
                  true
                );
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
                this.taskActionSvc.nextTask(
                  {
                    businessKey: nextProc.businessKey,
                    processId: nextProc.id,
                  },
                  true
                );
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

  back(): void {
    this.taskActionSvc.viewMyQueue();
  }

  addCommentsPriorInititation(text?) {
    const refMod = this.modalSvc.open(FullCommentBoxModalComponent, {
      keyboard: false,
      backdrop: 'static',
    });
    let mentionConfig = this.taskActionSvc.getMultiMentionConfig();
    refMod.componentInstance.mentionConfig = mentionConfig;
    // if(text) {
    //   refMod.componentInstance.commenttype = text ;
    // }
    refMod.componentInstance.commentBoxOptions = {
      allowFullScreen: false,
      height: 300,
      plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
      toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
    };
    refMod.componentInstance.closeOnSubmit = false;
    refMod.componentInstance.onSubmitted.subscribe((r) => {
      if (r) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(r, 'text/html');
        let check = htmlDoc?.children[0]['innerText'].trim();
        check.length > 0
          ? this.initiateWorkflow(r)
          : this.toastrSvc.warning('Please enter comment prior to initiation');
        check.length > 0 ? refMod.close() : null;
      }
    });
  }
}

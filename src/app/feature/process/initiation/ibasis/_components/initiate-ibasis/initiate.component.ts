import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  InitiationTaskModel,
  InitiationTaskConfigModel,
  InitiationTaskViewModel,
  AmendmentType,
} from '../../../_models';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCompanyModalComponent } from 'src/app/shared/_modals';
import {
  TypeAheadModel,
  ReferenceDataModel,
  CompanyAddressModel,
  LoggedUserModel,
  UserGroupsEnum,
  ProductTypeEnum,
} from 'src/app/core/_models';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import {
  CompanyManagementService,
  RefDataService,
  SharedService,
} from 'src/app/core/_services';
import { GroupModel } from 'src/app/feature/user-management/_models';
import { RestrictCTConst } from '../../../_models/restrict.model';
import {
  ContractProductEnum,
  ContractTypeEnum,
} from '../../../../layout/_models';
import { StartProcessSignalService } from '../../../_services';

@Component({
  selector: 'app-initiate-ibasis',
  templateUrl: './initiate.component.html',
  styleUrls: ['./initiate.component.scss', '../../../../form.module.scss'],
})
export class InitiateIbasisComponent implements OnInit, OnDestroy {
  @Input() initiation: InitiationTaskModel;
  @Input() form: NgForm;

  initiationConfig: InitiationTaskConfigModel = {} as InitiationTaskConfigModel;
  lastSelectedCT: TypeAheadModel = {} as TypeAheadModel;
  viewData: InitiationTaskViewModel;
  selectedPartnerAddr: CompanyAddressModel;
  selectedContractingEnt: TypeAheadModel;
  ibasisContractingEntities: TypeAheadModel[] = [];
  contractTypes: TypeAheadModel[] = [];
  ibasisContractingEntMap: any[] = [];
  additionalSvcs = ['Mobile Services', 'SMS Services', 'Voice Services'];
  initGroup: string[] = [];
  showList: TypeAheadModel[] = [];
  amendmentList: TypeAheadModel[] = [];
  iotCt: TypeAheadModel[] = [];
  userGroupEnum = UserGroupsEnum;
  refCompObj = { amendment: null, other: null };

  focusAddress$ = new Subject<string>();
  standardCE;
  searchAddressFormatter = (x) => x.friendlyaddress;
  localAddressArrayFn = () =>
    this.focusAddress$.pipe(map(() => this.viewData.addresses));

  focusCE$ = new Subject<string>();
  searchCEFormatter = (x) => x.name;
  localCEArrayFn = () => this.focusCE$.pipe(map(() => this.showList));

  selectedContractType: TypeAheadModel;
  focusContractType$ = new Subject<string>();
  searchCTFormatter = (x) => x.name;
  localCTArrayFn = () =>
    this.focusContractType$.pipe(map(() => this.contractTypes));

  selectedAmendmentList: TypeAheadModel;
  focusAmendmentList$ = new Subject<string>();
  searchALFormatter = (x) => x.name;
  localALArrayFn = () =>
    this.focusAmendmentList$.pipe(map(() => this.filteredAmendmentList()));

  selectedAdditionalSvc: string;
  focusAddtnlSvc$ = new Subject<string>();
  localAddtnlSvcFn = () =>
    this.focusAddtnlSvc$.pipe(map(() => this.additionalSvcs));

  selectedIotContractType: string;
  focusIotCT$ = new Subject<string>();
  localIotCTFn = () => this.focusIotCT$.pipe(map(() => this.iotCt));

  selectedInitGroup: string;
  focusInitGroup$ = new Subject<string>();
  localInitGroupFn = () => this.focusInitGroup$.pipe(map(() => this.initGroup));

  subscription: Subscription[] = [];

  constructor(
    private modalSvc: NgbModal,
    private componentSignalSvc: StartProcessSignalService,
    private companySvc: CompanyManagementService,
    private refDataSvc: RefDataService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    this.initiateVars();
    this.getContractingEntities();
    this.getCountryContractingEntMap();
    this.subscribeInitiateData();
    this.populateUserGroup();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  initiateVars(): void {
    this.initiationConfig = {
      ...this.initiationConfig,
      showCompany: true,
    };
  }

  getContractTypes(): void {
    this.refDataSvc.getInstances('CONT_TYPE', true).subscribe((a) => {
      if (a.status) {
        const restrictCt = RestrictCTConst[window.location.host];
        if (restrictCt) {
          this.contractTypes = a.data.filter((i) => !restrictCt[i.name]);
        } else {
          this.contractTypes = a.data;
        }
      }
    });
  }

  getContractingEntities(): void {
    this.companySvc.getContractingEntities().subscribe((a) => {
      this.ibasisContractingEntities = a.data;
    });
  }

  getIotContractType(type: string): void {
    this.refDataSvc.getInstances(type, false).subscribe((a) => {
      this.iotCt = a.data;
      // this.selectIotType({ item: this.iotCt[0] });
    });
  }

  getCountryContractingEntMap(): void {
    this.companySvc.getAllContractingEnities().subscribe((a) => {
      if (a.status) {
        this.ibasisContractingEntMap = a.data;
      }
    });
  }

  populateUserGroup(): void {
    this.sharedSvc.groups$.subscribe((a: GroupModel[]) => {
      if (a && a.length > 0) {
        const loggedUser: LoggedUserModel = JSON.parse(
          localStorage.getItem('user')
        );
        const groupIds = loggedUser.groupnames.filter(
          (i) =>
            i !== this.userGroupEnum.GUEST &&
            i !== this.userGroupEnum.CAMUNDA_ADMIN
        );
        this.initGroup = a
          .filter((i) => groupIds.some((j) => j === i.id))
          .map((k) => k.name);
        this.initiation.initiationGroup = this.initGroup.find(
          (g) => g.toLowerCase() === this.userGroupEnum.SALES
        );
        this.selectedInitGroup = this.initGroup.find(
          (g) => g.toLowerCase() === this.userGroupEnum.SALES
        );
      } else {
        this.sharedSvc.getGroups();
      }
    });
  }

  getAmendmentList(type: string, isCat: boolean = false): void {
    this.refDataSvc.getInstances(type, isCat).subscribe((a) => {
      this.amendmentList =
        this.initiation.product === ContractProductEnum.other
          ? a.data.filter((a) => a.name !== AmendmentType.additionalSvc)
          : a.data;
      this.initiationConfig.showAmendmentOpt = true;
    });
  }

  subscribeInitiateData(): void {
    this.subscription.push(
      this.componentSignalSvc.viewData.subscribe((a) => {
        if (a) {
          this.viewData = a;
          this.selectedPartnerAddr = this.viewData.companyPrincipalAddr;
          this.filterContractingEnt();
        }
      })
    );
  }

  clearCompany(e: boolean): void {
    this.initiation.companyId = -1;
  }

  selectCompany(e: TypeAheadModel): void {
    e.id = e.id.toString();

    if (!e.id.includes('create')) {
      this.initiation.partnerLegalName = e.name;
      this.initiation.companyId = parseInt(e.id);
      this.initiation.companyFound = true;
      this.initiationConfig.showProduct = true;
      this.emitData('companySelected');
    } else {
      this.initiation.companyFound = false;
      this.initiationConfig.showProduct = false;
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
          this.addCompany(a);
        }
      })
    );
  }

  addCompany(e): void {
    this.initiation.partnerLegalName = e.resource.name;
    this.initiation.companyId = e.resource.id;
    this.initiationConfig.showProduct = true;
    this.emitData('companySelected');
  }

  selectCompanyAddr(e): void {
    this.initiation.selectedPartnerAddress = e.item.friendlyaddress;
    this.initiation.partnerAddress = e.item.friendlyaddress;
    this.initiation.country = e.item.country;
    this.initiation.partnerAddressId = e.item.id;
    this.initiation.countryCode = e.item.countrycode;
    this.emitData('selectAddr');
  }

  selectProduct(e: TypeAheadModel): void {
    this.getContractTypes();
    this.initiation.product = e.name;
    this.initiationConfig.showIotOpt = false;
    this.initiationConfig.showAdditionalOpt = false;
    this.initiationConfig.showCurrAmend = false;
    this.initiationConfig.showAmendmentOpt = false;
    this.initiationConfig.showOtherOpt = false;
    this.initiation.contractTypeSecondLevel = '';
    this.selectedContractType = null;
    this.selectedAmendmentList = null;
    this.selectedAdditionalSvc = null;
    this.initiation.contractType = [];
    this.initiation.additionalSvcType = '';
    this.initiation.currencyAmendmentType = '';

    if (e.name.toLowerCase().includes('other')) {
      this.initiationConfig.showOtherProduct = true;
    } else {
      this.initiationConfig.showContractType = true;
      this.initiationConfig.showOtherProduct = false;
      this.initiationConfig.showRequestMsa = false;
      this.emitData('productSelected');
      if (e.name.toLowerCase().includes('iot')) {
        this.getIotContractType('IOT_CON_TYPE');

        if (
          this.initiation.contractType &&
          this.initiation.contractType[0].name.toLowerCase().includes('service')
        ) {
          this.initiationConfig.showIotOpt = true;
        }
      }
    }
  }

  selectOtherProduct(e: TypeAheadModel): void {
    this.initiation.productSecondLevel = e.name;
    this.initiationConfig.showContractType = true;
    this.initiationConfig.showRequestMsa = false;
    this.emitData('productSelected');
  }

  selectIotType(e): void {
    this.initiation.iotContractType = e.item.name;
  }

  selectContractEnt(e): void {
    this.initiation.ibasisContractingEntity = e.item.name;
    this.initiation.ibasisContractingEntityId = parseInt(e.item.id);
    if (
      this.initiation.contractType &&
      (this.initiation.contractType[0].name
        .toLowerCase()
        .includes('amendment') ||
        this.initiation.contractType[0].name.toLowerCase().includes('other'))
    ) {
      this.initiation.standardContractingEntity = true;
    } else if (
      this.initiation.contractType &&
      (this.initiation.contractType[0].name.toLowerCase().includes('service') ||
        this.initiation.contractType[0].name.toLowerCase().includes('nda'))
    ) {
      this.initiation.standardContractingEntity =
        this.initiation.ibasisContractingEntity.toLowerCase() ===
        this.standardCE?.name?.toLowerCase()
          ? true
          : false;
    }
    this.emitData('contractingEntSelected');
  }

  selectContractType(e: any): void {
    e = e.item;
    this.initiationConfig.showAmendmentOpt = false;
    this.initiationConfig.showOtherOpt = false;
    this.initiationConfig.showAdditionalOpt = false;
    this.initiationConfig.showIotOpt = false;
    this.initiationConfig.showCurrAmend = false;
    this.initiation.contractTypeSecondLevel = '';

    if (e.name.toLowerCase().includes('other')) {
      this.refCompObj.other = {
        code: e.id,
        name: 'Other Type',
      };
      this.initiationConfig.showOtherOpt = true;
      this.initiation.contractType = [e];
    } else if (e.name.toLowerCase().includes('amendment')) {
      this.getAmendmentList(e.id);
      this.refCompObj.amendment = {
        code: e.id,
        name: 'Amendment Type',
      };
      this.initiation.contractType = [e];
    } else {
      this.initiation.contractType = [e];
      this.emitData('contractSelected');
    }

    if (
      e.name.toLowerCase().includes('service') &&
      this.initiation.product === 'IOT'
    ) {
      this.initiationConfig.showIotOpt = true;
    } else {
      this.initiationConfig.showIotOpt = false;
    }

    if (this.initiation.companyFound) {
      this.initiationConfig.showRequestMsa = this.initiation.msaExists
        ? true
        : false;
    }
    this.initiationConfig.showCEOpt = true;
    this.filterContractingEnt();
    this.initiationConfig.showCasePriority = true;
  }

  selectSecondLevel(e: ReferenceDataModel) {
    this.initiation.contractTypeSecondLevel = e.name;
    this.emitData('contractSelected');
  }

  filteredAmendmentList(): TypeAheadModel[] {
    return this.amendmentList.filter((i) => {
      if (i.name === AmendmentType.additionalSvc) {
        return (
          this.initiation.product === ContractProductEnum.mobile ||
          this.initiation.product === ContractProductEnum.sms ||
          this.initiation.product === ContractProductEnum.voice ||
          this.initiation.product === ContractProductEnum.other
        );
      } else if (
        i.name === AmendmentType.voiceDeal ||
        i.name === AmendmentType.rateAmendment
      ) {
        return this.initiation.product === ContractProductEnum.voice;
      } else if (i.name === AmendmentType.pricingChange) {
        return (
          this.initiation.product !== ContractProductEnum.voice &&
          this.initiation.product !== ContractProductEnum.sms
        );
      } else {
        return true;
      }
    });
  }

  selectAmendmentType(e) {
    this.initiation.contractTypeSecondLevel = e.item.name;
    this.initiationConfig.showAdditionalOpt = false;
    this.initiationConfig.showCurrAmend = false;
    this.initiation.additionalSvcType = '';
    this.initiation.currencyAmendmentType = '';

    if (
      e.item.name === AmendmentType.additionalSvc &&
      this.initiation.product !== ProductTypeEnum.OTHER
    ) {
      this.initiationConfig.showAdditionalOpt = true;
    } else if (
      e.item.name === AmendmentType.currencyAmendment &&
      this.initiation.product !== ProductTypeEnum.OTHER
    ) {
      this.initiationConfig.showCurrAmend = true;
    }
    this.emitData('contractSelected');
  }

  selectAdditionalSvc(e) {
    this.initiation.additionalSvcType = e.item;
  }

  selectInitGroup(e): void {
    this.initiation.initiationGroup = e.item;
  }

  selectRefData(e: ReferenceDataModel, key: string) {
    this.initiation[key] = e.name;
  }

  filterContractingEnt(): void {
    if (
      this.initiation.contractType &&
      (this.initiation.contractType[0].name === ContractTypeEnum.amendment ||
        this.initiation.contractType[0].name === ContractTypeEnum.other)
    ) {
      this.showList = [...this.ibasisContractingEntities];

      // } else if (this.initiation.product === ContractProductEnum.iot) {
      //   this.showList = [this.ibasisContractingEntities.find(i => i.name.toLowerCase().includes('global'))];
    } else if (this.initiation.product === ContractProductEnum.other) {
      this.showList = [...this.ibasisContractingEntities];
    } else {
      // const contEnt = this.ibasisContractingEntMap.find(i => i.code === this.initiation.countryCode);
      // this.showList = this.ibasisContractingEntities.filter(i =>
      //   i.name.toLowerCase() === contEnt.name.toLowerCase() ||
      //   i.name.toLowerCase().includes(this.initiation.country.toLowerCase())
      // );

      this.showList = [...this.ibasisContractingEntities];
    }
    // const selectContEnt = this.showList.find(i => i.name.toLowerCase().includes('global'));
    let selectContEnt;
    this.companySvc
      .getMappedCountryProductCE(
        this.initiation.countryCode,
        this.initiation.product
      )
      .subscribe((r) => {
        if (r.status) {
          let name = r.data[0].cename;
          if (name && name.length == 0) {
            name = 'global';
          }
          selectContEnt = this.showList.find((i) =>
            i.name.toLowerCase().includes(name.toLowerCase())
          );

          this.selectedContractingEnt = selectContEnt;
          this.standardCE = this.selectedContractingEnt;
          this.selectContractEnt({ item: this.selectedContractingEnt });
        }
      });
  }

  checkConfidential(ev) {
    this.initiation.confidential = ev;
  }
  emitData(event: string): void {
    this.componentSignalSvc.initiationData.next(this.initiation);
    this.componentSignalSvc.initToDetailsEmitter.emit(event);
  }
}

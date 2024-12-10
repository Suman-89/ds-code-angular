import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { InitiationTaskModel, InitiationTaskConfigModel, InitiationTaskViewModel, AmendmentType } from '../../../_models';
import { Subject, Subscription } from 'rxjs';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCompanyModalComponent } from 'src/app/shared/_modals';
import { TypeAheadModel, ReferenceDataModel, CompanyAddressModel, LoggedUserModel, UserGroupsEnum } from 'src/app/core/_models';
import { StartProcessSignalService } from '../../../_services';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { CompanyManagementService, RefDataService, SharedService } from 'src/app/core/_services';
import { GroupModel } from 'src/app/feature/user-management/_models';
import { RestrictCTConst } from '../../../_models/restrict.model';
import { ContractProductEnum, ContractTypeEnum } from '../../../../layout/_models';
import { DisputeInitiateModel } from '../../_models/dispute-initiate.model.';


@Component({
  selector: 'app-initiate-dispute',
  templateUrl: './initiate-dispute.component.html',
  styleUrls: ['./initiate-dispute.component.scss']
})
export class InitiateDisputeComponent implements OnInit {

  @Input() initiation: DisputeInitiateModel;
  @Input() form: NgForm;

  initiationConfig: InitiationTaskConfigModel = {} as InitiationTaskConfigModel;
  lastSelectedCT: TypeAheadModel = {} as TypeAheadModel;
  viewData: InitiationTaskViewModel;
  selectedPartnerAddr: CompanyAddressModel;

  initGroup: string[] = [];
  showList: TypeAheadModel[] = [];


  userGroupEnum = UserGroupsEnum;
  refCompObj = {amendment: null, other: null};
  
  focusAddress$ = new Subject<string>();

  searchAddressFormatter = x => x.friendlyaddress;
  localAddressArrayFn = () => this.focusAddress$.pipe(map(() => this.viewData.addresses));


  selectedInitGroup: string;
  focusInitGroup$ = new Subject<string>();
  localInitGroupFn = () => this.focusInitGroup$.pipe(map(() => this.initGroup));

  subscription: Subscription[] = [];

  constructor(
    private modalSvc: NgbModal, private componentSignalSvc: StartProcessSignalService,
    private companySvc: CompanyManagementService, private refDataSvc: RefDataService,
    private sharedSvc: SharedService, private ngbDateParserFormatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
    this.initiateVars();
    this.subscribeInitiateData();
    this.populateUserGroup();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(i => i.unsubscribe());
  }

  initiateVars(): void {
    this.initiationConfig = {
      ...this.initiationConfig,
      showCompany: true
    };
  }


  populateUserGroup(): void {
    this.sharedSvc.groups$.subscribe((a: GroupModel[]) => {
      if (a && a.length > 0) {
        const loggedUser: LoggedUserModel = JSON.parse(localStorage.getItem('user'));
        const groupIds = loggedUser.groupnames.filter(i => i !== this.userGroupEnum.GUEST && i !== this.userGroupEnum.CAMUNDA_ADMIN);
        this.initGroup = a.filter(i => groupIds.some(j => j === i.id)).map(k => k.name);
        this.initiation.initiationGroup = this.initGroup[0];
        this.selectedInitGroup = this.initGroup[0];
      } else {
        this.sharedSvc.getGroups();
      }
    });
  }



  subscribeInitiateData(): void {
    this.subscription.push(this.componentSignalSvc.viewData.subscribe(a => {
      if (a) {
        this.viewData = a;
        this.selectedPartnerAddr = this.viewData.companyPrincipalAddr;

      }
    }));
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
    const modalRef = this.modalSvc.open(CreateCompanyModalComponent, { size: 'lg'});
    modalRef.componentInstance.userRole = 'accountmanager';
    modalRef.componentInstance.companyName = companyName;
    this.subscription.push(modalRef.componentInstance.addCompanyEvent.subscribe(a => {
      if (a) {
        this.addCompany(a);
      }
    }));
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
    this.initiation.partnerAddressId = e.item.id;
    this.emitData('selectAddr');
  }

  selectProduct(e: TypeAheadModel): void {
   
    this.initiation.product = e.name;
    this.emitData('productSelected');
  }


  selectInitGroup(e): void {
    this.initiation.initiationGroup = e.item;
  }

  selectRefData(e: ReferenceDataModel, key: string) {
    this.initiation[key] = e.name;
  }


  selectTypes(e, prop) {
   this.initiation[prop] = e.name
  }

  setDates(date, prop) {
    this.initiation[prop] =  this.ngbDateParserFormatter.format(date); ;
  }
  emitData(event: string): void {
    this.componentSignalSvc.initiationData.next(this.initiation);
    this.componentSignalSvc.initToDetailsEmitter.emit(event);
  }

}

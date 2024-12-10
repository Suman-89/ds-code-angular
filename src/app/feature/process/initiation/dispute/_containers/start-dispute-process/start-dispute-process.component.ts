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
import { CompanyManagementService } from 'src/app/core/_services';
import {
  AddressType,
  CompanyFlagsModel,
  CompanyModel,
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
import Swal from 'sweetalert2';
import { RestrictConstant } from '../../../_models/restrict.model';
import { DisputeInitiateModel } from '../../_models/dispute-initiate.model.';
import { ProcessFormsService } from 'src/app/feature/system/process-forms/_services';

@Component({
  selector: 'app-start-dispute-process',
  templateUrl: './start-dispute-process.component.html',
  styleUrls: ['./start-dispute-process.component.scss'],
})
export class StartDisputeProcessComponent implements OnInit {
  initiationData = {} as DisputeInitiateModel;
  viewData = {} as any;

  showButton = true;
  companyFlags: CompanyFlagsModel = {} as CompanyFlagsModel;

  subscription: Subscription[] = [];

  constructor(
    private taskActionSvc: TaskActionService,
    private signalSvc: StartProcessSignalService,
    private companySvc: CompanyManagementService,
    private taskInfoSvc: TaskInfoService,
    private modalSvc: NgbModal,
    private taskSvc: TaskService,
    private toastrSvc: ToastrService,
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
        break;

      case 'editCompany':
        break;

      case 'selectAddr':
        this.selectAddress();
        break;

      case 'productSelected':
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
    // obj.aadhaar = data.aadhaarId;
    obj.addresses = data.addresses;
    obj.companyPrincipalAddr = princAddr ? princAddr : data.addresses[0];
    obj.selectedAddr = obj.companyPrincipalAddr.id;
    this.initiationData.partnerAddress =
      obj.companyPrincipalAddr.friendlyaddress;
    this.initiationData.companyCode = data.code;
    this.initiationData.partnerLegalName = data.name;
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

  formValid(): boolean {
    return true;
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

  formSubmit(): void {
    // form check methods temporarily removed
    this.initiateWorkflow();
  }

  initiateWorkflow(): void {
    this.initiationData.processname = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;

    // let obj = JSON.parse(JSON.stringify(this.initiationData)) ;
    this.subscription.push(
      this.taskSvc.startWorkflow(this.initiationData).subscribe((a) => {
        if (a.status && a.data.length > 0) {
          this.procFormSvc
            .getProcDefbyName(this.initiationData.processname)
            .subscribe((r) => {
              if (r.data?.key?.variablename) {
                this.initiationData[r.data?.key?.variablename] =
                  a.data[0].businessKey;
              }
              this.taskSvc
                .saveVariables(a.data[0].businessKey, {
                  ...this.initiationData,
                  businesskey: a.data[0].businessKey,
                  contractType: a.data[0].contractType,
                })
                .subscribe();
            });
          const nextProc = a.data.find((i) => i.status);
          if (nextProc) {
            this.taskActionSvc.nextTask(nextProc);
          } else {
            this.toastrSvc.warning(
              'Not able to initiate process. Please try again'
            );
          }
          if (!nextProc) {
            this.toastrSvc.warning(
              'Not able to initiate process. Please try again'
            );
          }
        }
      })
    );
  }

  back(): void {
    this.taskActionSvc.viewMyQueue();
  }
}

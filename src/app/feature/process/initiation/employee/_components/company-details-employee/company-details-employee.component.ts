import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { StartProcessSignalService } from '../../../_services';
import { Subscription } from 'rxjs';
import {
  InitiationTaskViewModel,
  InitiateDocMatrixModel,
} from '../../../_models';
import { TaskDocumentModel } from '../../../../layout/_models';
import {
  TaskInfoService,
  TaskActionService,
} from '../../../../layout/_services';

@Component({
  selector: 'app-company-details-employee',
  templateUrl: './company-details-employee.component.html',
  styleUrls: ['./company-details-employee.component.scss'],
})
export class CompanyDetailsEmployeeComponent implements OnInit, OnDestroy {
  showDetails = {} as any;
  viewData: InitiationTaskViewModel = {} as InitiationTaskViewModel;
  documentMatrix: InitiateDocMatrixModel[] = [];
  subscription: Subscription[] = [];
  @Input() checkHistoryData;

  constructor(
    private componentSignalSvc: StartProcessSignalService,
    private taskInfoSvc: TaskInfoService,
    private taskActionSvc: TaskActionService
  ) {}

  ngOnInit(): void {
    this.initVars();
    this.subscribeToSignal();
    this.subscribeInitiateData();
    this.subscribeDocumentList();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  initVars(): void {
    this.showDetails = {
      company: false,
      nda: false,
      msa: false,
      docs: true,
    };
  }

  subscribeToSignal(): void {
    this.subscription.push(
      this.componentSignalSvc.initToDetailsEmitter.subscribe((a) =>
        this.eventAction(a)
      )
    );
  }

  subscribeInitiateData(): void {
    this.subscription.push(
      this.componentSignalSvc.viewData.subscribe((a) => {
        this.viewData = a;
      })
    );
  }

  subscribeDocumentList(): void {
    this.subscription.push(
      this.componentSignalSvc.documentTypeMatrix.subscribe(
        (a) => (this.documentMatrix = a)
      )
    );
  }

  eventAction(event: string): void {
    switch (event) {
      case 'companySelected':
        this.showDetails.company = true;
        break;

      case 'productSelected':
        this.showDetails.nda = true;
        this.showDetails.msa = true;
        this.showDetails.docs = true;
        break;

      default:
        break;
    }
  }

  download(doc: TaskDocumentModel): void {
    this.taskInfoSvc.openDocument(doc.contentid);
  }

  companyAction(action: string): void {
    this.componentSignalSvc.companyAction.emit(action);
  }

  checkConfidentiality(doc: TaskDocumentModel): boolean {
    return this.taskActionSvc.checkConfidential(doc);
  }
  getDocTypefromFolder(foldername: string, doc: TaskDocumentModel): string {
    return this.taskActionSvc.getDocTypefromFolder(foldername, doc);
  }
}

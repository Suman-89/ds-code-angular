import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { InitiationTaskModel, InitiationTaskViewModel, InitiateDocMatrixModel } from '../_models';


@Injectable()
export class StartProcessSignalService {

  initToDetailsEmitter: EventEmitter<string> = new EventEmitter();

  initiationData: Subject<InitiationTaskModel> = new Subject();
  viewData: Subject<InitiationTaskViewModel> = new Subject();
  documentTypeMatrix: Subject<InitiateDocMatrixModel[]> = new Subject();

  companyAction: EventEmitter<string> = new EventEmitter();


  constructor() { }
}

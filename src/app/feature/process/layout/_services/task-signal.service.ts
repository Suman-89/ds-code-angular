import { ContractModel } from './../_models/contract.model';
import { Injectable } from '@angular/core';
import {
  TaskInfoModel,
  TaskDocumentResponseModel,
  TaskDocumentModel,
} from '../_models';
import { BehaviorSubject } from 'rxjs';
import {
  ProcessVariableModel,
  ProcFormDoclistDropdownModel,
} from 'src/app/core/_models';

@Injectable({ providedIn: 'root' })
export class TaskSignalService {
  taskInfo: BehaviorSubject<TaskInfoModel> = new BehaviorSubject(null);
  contractInfo: BehaviorSubject<ContractModel> = new BehaviorSubject(null);
  taskVariables: BehaviorSubject<ProcessVariableModel[]> = new BehaviorSubject(
    []
  );
  businessKey: BehaviorSubject<string> = new BehaviorSubject(null);
  defaultTab: BehaviorSubject<String> = new BehaviorSubject(null);
  docMap: BehaviorSubject<TaskDocumentResponseModel> = new BehaviorSubject(
    null
  );
  docList: BehaviorSubject<TaskDocumentModel[]> = new BehaviorSubject([]);
  model: BehaviorSubject<any> = new BehaviorSubject(null);
  saved: BehaviorSubject<boolean> = new BehaviorSubject(false);
  formValid: BehaviorSubject<boolean> = new BehaviorSubject(null);
  selectedDocTypes: BehaviorSubject<ProcFormDoclistDropdownModel[]> =
    new BehaviorSubject([]);
  requiredVariableList = new BehaviorSubject<ProcessVariableModel[]>(null);
  procForm = new BehaviorSubject(null);
  ongoingTasks = new BehaviorSubject(null);
  constructor() {}
}

import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { TaskInfoModel } from '../_models';
import { TaskService } from './task.service';
import { GlobalUpdateConstant } from '../_models/global-update.constant';
import { SourceTypes } from 'src/app/core/_models';
import { map } from 'rxjs/operators';

@Injectable()
export class TaskFormSaveService {
  globalVars = new GlobalUpdateConstant().variableNames;
  requiredFields;
  constructor(private taskSvc: TaskService) {}

  checkTaskValidation(taskDetails: TaskInfoModel, model: any) {
    if (this[taskDetails.formKey]) {
      const temp = this[taskDetails.formKey](taskDetails, model);
      if (!temp.valid && temp.reason === 'update') {
        return of(temp);
      }
    } else {
      const temp = this.defaultValidations(taskDetails, model);
      if (!temp.valid && temp.reason === 'update') {
        return of(temp);
      }
    }
    let gvCheck = 0;
    let str = '';
    Object.keys(model).forEach((i) => {
      if (typeof model[i] === 'string') {
        model[i] = model[i].trim();
      }
      if (i.startsWith('taskDecision') && !i.endsWith('Other')) {
        this.taskSvc
          .saveTaskDecision(
            taskDetails.formKey,
            taskDetails.businessKey,
            model[i]
          )
          .subscribe();
      }
      if (i === 'status') {
        this.taskSvc
          .saveStatus(taskDetails.formKey, taskDetails.businessKey, model[i])
          .subscribe();
      }
      this.globalVars.includes(i) ? (gvCheck = gvCheck + 1) : null;
      model[i] =
        this.globalVars.includes(i) && model[i] === str ? null : model[i];
    });

    let varsNameValueMap = taskDetails.variables.reduce((acc, cur) => {
      acc[cur.name] = cur.value;
      return acc;
    }, {});
    let body = varsNameValueMap || {};

    return this.taskSvc
      .saveVariables(taskDetails.businessKey, {
        ...body,
        ...model,
      })
      .pipe((res) => {
        res.subscribe();
        return gvCheck > 0
          ? this.taskSvc.saveTaskForm(
              taskDetails.id,
              model,
              taskDetails.businessKey
            )
          : this.taskSvc.saveTaskForm(taskDetails.id, model);
      });
  }

  defaultValidations = (taskDetails: TaskInfoModel, model: any) => {
    let vars: any = {};
    taskDetails.variables.forEach((i) => (vars[i.name] = i.value));

    if (
      model.ibasisContractingEntity &&
      model.ibasisContractingEntity !== vars.ibasisContractingEntity
    ) {
      return { valid: false, reason: 'update' };
    } else if (
      model.partnerAddress &&
      model.partnerAddress !== vars.partnerAddress
    ) {
      return { valid: false, reason: 'update' };
    } else {
      return { valid: true };
    }
  };

  checkforMandatoryFields(reqfields, model) {
    let res = 0;
    reqfields.forEach((rf) => {
      // res = model[rf.name] == null || model[rf.name] === '' ? res + 1 : res
      // previously there was a check on mandatory field now added a condition for dependent variable 
      // either mandatory or non-mandatory it will not efect compelte task button
      if(!rf.mandetory && !rf.isDependantVar){
      res = model[rf.name] == null || model[rf.name] === '' ? res + 1 : res;
      }

      if (rf.valuesource === SourceTypes.REFDATA && rf.mandetory) {
        res = rf.options.find((a) => a.name == model[rf.name]) ? res : res + 1;
      }
      model[rf.name];
    });
    return res > 0 ? false : true;
  }
}

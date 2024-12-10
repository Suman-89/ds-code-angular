import { Component, Input, OnInit } from '@angular/core';
import {
  TaskSignalService,
  TaskInfoService,
  MapToFormlyService,
  TaskService,
  TaskFormSaveService,
  TaskActionService,
} from '../../_services';
import {
  ProcessFormModel,
  UIElementTypes,
  ProcessVariableModel,
  DataTypesEnum,
  TypeAheadModel,
} from 'src/app/core/_models';
import { of, Subscription } from 'rxjs';
import {
  TaskInfoModel,
  TemplateMetaResponseModel,
  TasksAutoFillTaskInfo,
} from '../../_models';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { SharedService } from 'src/app/core/_services';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  formVarsWithValues: any[] = [];
  form: ProcessFormModel;
  taskInfo: TaskInfoModel = {} as TaskInfoModel;
  dmsReviewBookmarkFormKey = TasksAutoFillTaskInfo;
  templateMetaDat: TemplateMetaResponseModel[] = [];
  formlyVars: FormlyFieldConfig[] = [];
  model: any = {};
  prevModel: any = {};
  formGroup = new FormGroup({});
  options: FormlyFormOptions = {};
  saved = false;
  reqFields;
  allApplicableFields;
  subscription: Subscription[] = [];
  partnerLegalName;
  isEmailProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_emailProcess';

  isAgroAdvisory =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_agroAdvisoryProcess';

  constructor(
    private taskSignalSvc: TaskSignalService,
    private taskInfoSvc: TaskInfoService,
    private mapToFormlySvc: MapToFormlyService,
    private toastrSvc: ToastrService,
    private taskFormSaveSvc: TaskFormSaveService,
    private taskActionSvc: TaskActionService,
    private taskSvc: TaskService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    this.partnerLegalName = this.taskInfoSvc.partnerLegalNameObj;
    console.log('ON FORM INIT', this.partnerLegalName);
    this.subscribeToTaskSignal();
    // this.subscribeToFormValueChange();
    console.log(this.formlyVars, this.form, 'FORMLYVARRRRRRRRRRRS');
    this.expressionCalculator();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  //fn's for new expression feature(start)

  expressionCalculator(): void {
    this.formlyVars.forEach((i) => {
      if (i.templateOptions.expression) {
        let expression = i.templateOptions.expression;
        const variables = this.extractVariables(expression);
        this.makingExtractedVariablesObject(variables);

        console.log(this.formVarsWithValues, variables, 'VAAAAAAAAAAARIABLES');

        this.evalExpresseion(expression, this.formVarsWithValues, i);
      }
    });
  }

  evalExpresseion(exp: string, obj: any[], singleFormlyVars): void {
    obj.forEach((e) => {
      window[e.key] = e.defaultValue;
    });
    console.log(eval(exp)); // target result
    singleFormlyVars.defaultValue = null;
    singleFormlyVars.defaultValue = eval(exp);
  }

  extractVariables(expressionString) {
    const variableRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g; // Regular expression to match variable names
    const variables = expressionString.match(variableRegex);
    return variables ? [...variables] : [];
  }

  makingExtractedVariablesObject(variables: string[]): void {
    this.formlyVars.forEach((e) => {
      let obj = { key: null, defaultValue: null };
      variables.forEach((i) => {
        if (i === e.key) {
          obj.key = e.key;
          obj.defaultValue = e.defaultValue;
          this.formVarsWithValues.push(obj);
        }
      });
    });
  }

  //fn's for new expression feature(end)

  subscribeToTaskSignal(): void {
    this.subscription.push(
      this.taskSignalSvc.procForm.subscribe((p) => {
        if (p) {
          this.form = p;
          let formLegalName = this.form.variables.find(
            (i) => i.name === 'partnerLegalName'
          );
          this.partnerLegalName = formLegalName;
          if (this.taskInfoSvc.partnerLegalNameObj?.value) {
            this.partnerLegalName = this.taskInfoSvc.partnerLegalNameObj;
          }
          console.log(
            'PROCESS FORM API',
            this.form,
            this.taskInfoSvc.partnerLegalNameObj
          );
        }
      })
    );
    this.subscription.push(
      this.taskSignalSvc.taskInfo.subscribe((a) => {
        if (a) {
          this.taskInfo = a;

          if (
            !this.taskInfo.formKey?.includes(
              this.dmsReviewBookmarkFormKey.bookmarkReview
            ) &&
            !this.taskInfo.formKey?.includes(
              this.dmsReviewBookmarkFormKey.metadataReview
            )
          ) {
            this.getFormVariables();
          } else {
            this.getTemplateMeta();
          }
        }
      })
    );
    this.subscription.push(
      this.taskSignalSvc.requiredVariableList.subscribe((v) => {
        if (v) {
          this.reqFields = v;
        }
      })
    );
    // console.log('MODEL=================\n',
    //   this.formlyVars, "\n",
    //   // this.model, "\n",
    //   // this.form
    // );
    this.form.variables.forEach((i) => {
      if (i.value == '""') {
        i.value = '';
      }
      // console.log("VAR VALUE -----",i,i.value = '""')
    });
  }

  applyAnyOneToggleForSendToPartnerForReview() {
    if (this.form.key === 'sendToPartnerForReview') {
      if (this.prevModel.userAction) {
        let currentlyChanged =
          this.prevModel.commonSendToPartner !== this.model.commonSendToPartner
            ? 'commonSendToPartner'
            : 'sendToLegalForReview';
        let currentlyUnchanged =
          currentlyChanged === 'commonSendToPartner'
            ? 'sendToLegalForReview'
            : 'commonSendToPartner';

        this.model[currentlyUnchanged] = !this.model[currentlyChanged];
        this.options.resetModel(this.model);
        this.prevModel = { ...this.model, userAction: false };
      } else {
        this.prevModel = { ...this.model, userAction: true };
      }
    }
  }

  subscribeToFormValueChange(): void {
    this.formGroup.valueChanges
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((a) => {
          // console.log("task form changes" , a)
          this.applyAnyOneToggleForSendToPartnerForReview();
          // console.log("formgroup", this.form)
          // console.log("fdirty", this.formGroup.dirty)
          // console.log("formlyvars" , this.formlyVars)
          // console.log("a", a)
          for (let i of this.form.variables) {
            if (i.isDropdownDependent && a[i.parentDropdownName] !== null) {
              let existingChildOpt = i.options;
              // console.log("iiii" , a[i.parentDropdownName])

              let dependentDropdownVar = this.formlyVars.find(
                (el) => el.key === i.name
              );
              let prevOptions: any[] = Array.isArray(
                dependentDropdownVar.templateOptions.options
              )
                ? dependentDropdownVar.templateOptions.options
                : [dependentDropdownVar.templateOptions.options];
              let options: any = existingChildOpt;
              let filteredOptions: any[] = Array.isArray(options)
                ? options
                : [options];
              filteredOptions = filteredOptions.filter((el) => {
                return el.instanceParentName === a[i.parentDropdownName];
              });
              // console.log("revoptions" , prevOptions , filteredOptions)
              // console.log("flteredlenggthhhhh", existingChildOpt.length , options.length)
              if (prevOptions.length === 0) {
                // alert("fisrt time")
                dependentDropdownVar.templateOptions.options = filteredOptions;
              } else if (filteredOptions.length === 0) {
                dependentDropdownVar.templateOptions.options = [];
              }

              // console.log("checkpoint", filteredOptions.some(obj => obj.name === a[i.name]))
              if (filteredOptions.some((obj) => obj.name === a[i.name])) {
                // alert(" m thisssss")
                // console.log("previousOptions", prevOptions)
                dependentDropdownVar.templateOptions.options = filteredOptions;
                // console.log("previousoption before", prevOptions);
                prevOptions = dependentDropdownVar.templateOptions.options;
                // console.log("previosuoption after", prevOptions)
              } // console.log("revoptions" , prevOptions , filteredOptions)
              else if (
                prevOptions[0].instanceParentName !==
                filteredOptions[0].instanceParentName
              ) {
                //  console.log("name" ,dependentDropdownVar)
                // console.log("PREVOPTION  FILTEREDOPTION", prevOptions , filteredOptions)
                dependentDropdownVar.templateOptions.options = filteredOptions;
                this.formGroup.get(i.name).setValue(null);
              }
              // console.log("filtered" ,dependentDropdownVar.templateOptions.options)
            }
            if (i.isDropdownDependent && a[i.parentDropdownName] === null) {
              let dependentDropdownVar = this.formlyVars.find(
                (el) => el.key === i.name
              );

              dependentDropdownVar.templateOptions.options = [];
            }

            if (i.isDependantVar && i.parentVars) {
              let rules = i.parentVars;
              let hidden = this.rulesCheck(rules, a);
              // console.log("hidden", hidden)
              for (let j of this.formlyVars) {
                if (i.name === j.key) {
                  if (i.name === j.key) {
                    if (hidden === true) {
                      a[j.key] = '';
                      // j.templateOptions.required = false;
                      // console.log("hiddeeen jjjjjj" , j)
                      this.model = a;
                      // console.log("model", this.model)
                      // console.log("fields" , this.formlyVars)
                      // console.log("options" , this.options)
                      // console.log("required fields" , this.reqFields)
                    }
                    j.hide = hidden;
                  }
                }
              }
            }
          }
          if (this.formGroup.dirty) {
            this.saved = false;
            this.saveModel();
            return this.saveForm();
          } else {
            this.saveModel();
            if (this.formGroup.valid) {
              this.taskSignalSvc.formValid.next(true);
              return this.saveForm();
            }
            return [];
          }
        })
      )
      .subscribe(
        (a) => {
          if (a.status && a.data.length == 0) {
            this.saved = true;
            this.savedForm(true);
          } else {
            this.savedForm(false);
          }
          if (
            this.formGroup.valid &&
            (a.status !== undefined || (a.status === undefined && a.valid))
          ) {
            this.taskSignalSvc.formValid.next(true);
          } else if (this.taskSignalSvc.formValid.value) {
            this.taskSignalSvc.formValid.next(false);
          }
          if (a.reason !== undefined && a.reason === 'update') {
            this.taskActionSvc.saveModelUpdateContract(
              this.taskInfo,
              this.model,
              () => {
                window.location.reload();
              }
            );
          }
        },
        (err) => {
          this.subscribeToFormValueChange();
        }
      );
  }

  rulesCheck(rulesArr, formObj) {
    // console.log("rulesArr", rulesArr);
    // console.log("formobj", formObj);

    for (let i of rulesArr) {
      // console.log("i.operator", i.operator);
      // console.log("i", i)
      for (let key in formObj) {
        if (formObj[i.operand] === undefined) {
          return true;
        }
        if (i.operand === key) {
          switch (i.operator) {
            case 'Contains':
              if (formObj[key] === null || !formObj[key].includes(i.value[0])) {
                return true;
              }
              break;
            case 'Does Not Contain':
              if (formObj[key] && formObj[key].includes(i.value[0])) {
                return true;
              }
              break;
            case 'Equals':
              if (formObj[key] !== i.value[0]) {
                return true;
              }
              break;
            case 'Does Not Equal':
              if (formObj[key] === i.value[0]) {
                return true;
              }
              break;
            case 'Greater Than':
              // console.log("checkinggggggggggggg", isNaN(Number(i.value[0])))
              if (isNaN(Number(i.value[0]))) {
                if (new Date(formObj[key]) < new Date(i.value[0])) {
                  return true;
                } else {
                  if (Number(formObj[key]) < Number(i.value[0])) {
                    return true;
                  }
                }
              }

              break;
            case 'Less Than':
              if (isNaN(Number(i.value[0]))) {
                if (new Date(formObj[key]) > new Date(i.value[0])) {
                  return true;
                } else {
                  if (Number(formObj[key]) > Number(i.value[0])) {
                    return true;
                  }
                }
              }
              break;
            case 'Between':
              const lowerBound = new Date(i.value[0]) || Number(i.value[0]);
              const upperBound = new Date(i.value[1]) || Number(i.value[1]);

              const valueToCompare =
                new Date(formObj[key]) || Number(formObj[key]);

              if (valueToCompare < lowerBound || valueToCompare > upperBound) {
                return true;
              }

              break;

            default:
              break;
          }
        }
      }
    }
    return false;
  }

  getFormVariables(): void {
    if (this.form && this.form.variables.length > 0) {
      this.resetForm();
      this.setDefaultVals(this.form.variables);
    } else {
      this.taskSignalSvc.formValid.next(true);
      this.savedForm(true);
    }
  }

  getTemplateMeta(): void {
    this.taskInfoSvc.getTemplateMetaFromDMS(this.taskInfo.id).subscribe((a) => {
      if (a.status && a.data.length > 0) {
        this.resetForm();

        this.templateMetaDat = a.data;
        this.templateMetaDat.forEach((i) => {
          if (
            this.taskInfo.formKey.includes(
              this.dmsReviewBookmarkFormKey.bookmarkReview
            )
          ) {
            i.bookmarks = i.bookmarks.sort(
              (a: ProcessVariableModel, b: ProcessVariableModel) =>
                // a.name > b.name ? 1 : -1
                a.priority > b.priority ? 1 : -1
            );
            this.setDefaultVals(i.bookmarks, 1, i.shortname);
          } else if (
            this.taskInfo.formKey.includes(
              this.dmsReviewBookmarkFormKey.metadataReview
            )
          ) {
            i.metadata = i.metadata.sort(
              (a: ProcessVariableModel, b: ProcessVariableModel) =>
                a.name > b.name ? 1 : -1
            );
            this.setDefaultVals(i.metadata, 2, i.shortname);
          }
        });
        if (
          this.taskInfo.formKey.includes(
            this.dmsReviewBookmarkFormKey.metadataReview
          )
        ) {
          let purgeOld = [
            {
              name: 'purgeOldDocs',
              label: 'Purge Old Documents',
              displaylabel: 'Purge Old Documents',
              datatype: 'Boolean',
              uielementtype: 'RADIO',
              categoryname: null,
              valuesource: 'EMPTY',
              value: true,
              visible: true,
              system: false,
            },
          ];
          this.setDefaultVals(purgeOld, 2, 'default');
        }
      } else if (a.status && a.data.length === 0) {
        this.toastrSvc.warning('No template found');
      }
    });
  }

  setDefaultVals(
    variables: ProcessVariableModel[],
    opt: number = 0,
    header?: string
  ): void {
    // alert(" inside setdefault variables")
    // console.log("vaiables" , variables)
    // console.log("varsss", variables, opt, header)
    // console.log("taskvars", this.taskInfo)
    if (variables && variables.length > 0 && opt === 0) {
      variables.forEach((i) => {
        // console.log("taskform i" , i)
        if (!i.value) {
          let val = this.taskInfo.variables.find((v) => v.name === i.name);
          if (i.uielementtype == UIElementTypes.DATEFIELD && val && val.value) {
            let dateStr;
            let date;

            dateStr = moment(val.value).utcOffset('+0530').format('YYYY-MM-DD');
            // date = new Date(val.value);
            // let dateStr2 = `${date.getFullYear()}-${date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
            i.value = dateStr;
          } else {
            i.value = val ? val.value : null;
          }
        } else if (i.uielementtype == UIElementTypes.DATEFIELD && i.value) {
          let date = new Date(i.value);
          let dateStr = `${date.getFullYear()}-${
            date.getMonth() < 9
              ? `0${date.getMonth() + 1}`
              : date.getMonth() + 1
          }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
          i.value = dateStr;
        }
        if (i.visible) {
          this.formlyVars = [
            ...this.formlyVars,
            ...this.mapToFormlySvc.covertToFormlyInput(i, this.form),
          ];
        } else {
          this.model[i.name] = i.value;
        }
      });
    } else if (variables && variables.length > 0 && (opt == 1 || opt == 2)) {
      let response = this.mapToFormlySvc.wrapWithHeaders(
        variables,
        header,
        this.form
      );
      this.formlyVars.push(response.formlyVar);
      this.model = { ...this.model, ...response.model };
      // console.log("ASSIGNING MODEL-----",this.model, "\nRESPONSE************",response.model)
    }
    this.allApplicableFields = this.formlyVars;

    if (
      this.formlyVars.find((item) => item.key == 'bookingdate') &&
      !this.formlyVars.find((item) => item.key == 'bookingdate').defaultValue
    ) {
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key !== 'bookingdate'
      );
    }
    if (
      this.form.key == 'Form_resolveTicketOperations' &&
      this.formlyVars.find((item) => item.key == 'resolved').defaultValue
    ) {
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key != 'needMoreDetails'
      );
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key != 'needmoredetailsdescription'
      );
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key !== 'clientfeedback'
      );
    }
    if (
      this.form.key == 'Form_resolveTicketOperations' &&
      !this.formlyVars.find((item) => item.key == 'resolved').defaultValue
    ) {
      // this.formlyVars = this.formlyVars.filter(item => (item.key != 'needMoreDetails'))
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key != 'needmoredetailsdescription'
      );
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key !== 'clientfeedback'
      );
    }
    if (
      this.form.key == 'Form_resolveTicketOperations' &&
      !this.formlyVars.find((item) => item.key == 'resolved').defaultValue &&
      this.formlyVars.find((item) => item.key == 'needMoreDetails').defaultValue
    ) {
      // this.formlyVars = this.formlyVars.filter(item => (item.key != 'needMoreDetails'))
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key != 'needmoredetailsdescription'
      );
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key !== 'clientfeedback'
      );
    }
    if (
      this.isEmailProcess &&
      this.formlyVars.find((i) => i.key == 'partnerLegalName')
    ) {
      this.formlyVars.find((i) => i.key == 'partnerLegalName').hide = true;
    }
  }

  emitData() {
    console.log('MODEL ', this.formlyVars, this.model, this.taskInfo);
    // console.log('allApplicableFields', this.allApplicableFields);

    if (
      this.form.key == 'Form_resolveTicketOperations' &&
      this.model.resolved
    ) {
      // console.log(1);
      this.formlyVars = this.allApplicableFields
        .filter((i) => i.key != 'needMoreDetails')
        .filter((i) => i.key !== 'needmoredetailsdescription')
        .filter((i) => i.key != 'needmoredetailsdescript')
        .filter((i) => i.key != 'clientfeedback');
    }
    if (
      this.form.key == 'Form_resolveTicketOperations' &&
      !this.model.resolved &&
      this.model.needMoreDetails
    ) {
      this.formlyVars = [...this.allApplicableFields];
    }
    if (
      this.form.key == 'Form_resolveTicketOperations' &&
      !this.model.resolved &&
      !this.model.needMoreDetails
    ) {
      this.formlyVars = this.allApplicableFields
        .filter((item) => item.key != 'needmoredetailsdescript')
        .filter((i) => i.key !== 'needmoredetailsdescription')
        .filter((i) => i.key != 'clientfeedback');
    }
    if (
      this.allApplicableFields.find((item) => item.key == 'bookingdate') &&
      !this.allApplicableFields.find((item) => item.key == 'bookingdate')
        .defaultValue
    ) {
      this.formlyVars = this.formlyVars.filter(
        (item) => item.key !== 'bookingdate'
      );
    }
    if (this.isAgroAdvisory) {
      this.model = {
        ...this.model,
        lastMessageUniqueUserIdentifier: this.taskInfo.variables.find(
          (x) => x.name === 'lastMessageUniqueUserIdentifier'
        ).value,
        lastMessage: this.taskInfo.variables.find(
          (x) => x.name === 'lastMessage'
        ).value,
        lastMessageTimestamp: this.taskInfo.variables.find(
          (x) => x.name === 'lastMessageTimestamp'
        ).value,
      };
    }
  }

  saveForm() {
    // console.log('SAVE FORM ', this.taskInfo, this.model);
    let check = this.taskFormSaveSvc.checkforMandatoryFields(
      this.reqFields,
      this.model
    );
    // console.log("check" , check  , this.reqFields)
    return check
      ? this.taskFormSaveSvc.checkTaskValidation(this.taskInfo, this.model)
      : of({ valid: false, reason: '' });
  }

  saveModel(): void {
    this.taskSignalSvc.model.next(this.model ?? {});
  }

  savedForm(opt): void {
    this.taskSignalSvc.saved.next(opt);
  }

  resetForm(): void {
    this.formlyVars = [];
    this.formGroup = new FormGroup({});
    this.model = {};
    this.subscribeToFormValueChange();
  }

  clearCompany(e: boolean): void {
    // this.initiation.companyId = -1;
  }

  selectCompany(e): any {
    // console.log("COMPANY",e)
    let amUserName;
    let amUser;
    const salesUsers = this.sharedSvc.allUsers
      .filter((i) => i.groupnames.includes('sales'))
      .sort((a, b) => (a.fname < b.fname ? -1 : 1));
    console.log(e);
    if (e?.accountManagers?.length) {
      amUserName = e.accountManagers?.[0]?.fullName;
      amUser = e.accountManagers?.[0]?.id;
      // console.log("ADDED COMPANY ",amUserName,amUser)
    } else if (
      !e?.accountManagers?.length &&
      this.taskInfo.variables.find((i) => i.name === 'amUser')?.value
    ) {
      amUserName = this.taskInfo.variables.find(
        (i) => i.name === 'amUserName'
      )?.value;
      amUser = this.taskInfo.variables.find((i) => i.name === 'amUser')?.value;
    } else {
      amUserName = salesUsers?.[0]?.fullname;
      amUser = salesUsers?.[0]?.accountid;
    }
    let partnerLevel = e.partnerLevel
      ? e.partnerLevel
      : this.model.partnerLevel;
    // console.log("TASK INFO ", this.taskInfoSvc.partnerLegalNameObj,this.taskInfo.businessKey, e.code,amUserName,amUser,partnerLevel)
    this.taskSvc
      .saveCompanyEmail(
        this.taskInfo.businessKey,
        e.code,
        amUserName,
        amUser,
        partnerLevel
      )
      .subscribe((a) => {
        if (a.status) {
          this.taskInfo.variables.forEach((i) => {
            if (i.name === 'partnerLegalName') {
              i.value = e.name;
            }
            if (i.name === 'partnerLevel' && e.partnerLevel) {
              i.value = e.partnerLevel;
            }
            if (i.name === 'amUserName') {
              i.value = amUserName;
            }
            if (i.name === 'amUser') {
              i.value = amUser;
            }
          });

          this.model.amUser = amUser;
          this.model.amUserName = amUserName;

          this.partnerLegalName.value = e.name;
          this.model.partnerLegalName = e.name;
          this.taskInfo.partnerLegalName = e.name;

          if (e.partnerLevel) {
            this.model.partnerLevel = e.partnerLevel;
            this.taskInfo.partnerLevel = e.partnerLevel;
          }

          this.formlyVars.forEach((i) => {
            if (i.key == 'partnerLegalName') {
              i.defaultValue = e.name;
            }
            if (i.key === 'partnerLevel' && e.partnerLevel) {
              i.defaultValue = e.partnerLevel;
            }
            if (i.key === 'amUserName') {
              i.defaultValue = amUserName;
            }
            if (i.key === 'amUser') {
              i.defaultValue = amUser;
            }
            // if(i.templateOptions.expression){
            //   i.defaultValue =
            // }
            // console.log("KEY--------------->",i.key,i.defaultValue)
          });
          // console.log("FORMLY",this.formlyVars, this.taskInfo)

          this.saveModel();
          this.saveForm().subscribe((a) => {
            // console.log("SAVE FORM ",a)
            window.location.reload();
          });
        }
      });
  }
}

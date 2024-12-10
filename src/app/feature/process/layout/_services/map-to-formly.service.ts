import { Injectable } from '@angular/core';
import {
  UIElementTypes,
  ProcessVariableModel,
  ProcessFormModel,
  VariableDataTypes,
} from 'src/app/core/_models';
import { Field, FormlyFieldConfig } from '@ngx-formly/core';

@Injectable()
export class MapToFormlyService {
  constructor() {}

  covertToFormlyInput(
    input: ProcessVariableModel,
    form: ProcessFormModel
  ): FormlyFieldConfig[] {
    let type = '';
    let inp = {
      label: '',
      displaylabel: '',
      name: '',
      datatype: '',
      categoryname: '',
      uielementtype: '',
      valuesource: '',
    };

    if (!input) {
      input = inp;
    }
    
    input.uielementtype = input?.uielementtype
      ? input?.uielementtype
      : 'TEXTBOX';
    switch (input.uielementtype) {
      // case UIElementTypes.DATEFIELD:
      case UIElementTypes.TIMEFIELD:
      case UIElementTypes.NUMBER:
      case UIElementTypes.TEXT: {
        type = 'input';
        break;
      }
      case UIElementTypes.DATEFIELD: {
        type = 'custom-date';
        break;
      }
      case UIElementTypes.TEXTAREA: {
        type = 'textarea';
        break;
      }
      case UIElementTypes.RADIO: {
        //type = 'radio';
        type = 'toggle-switch';
        break;
      }
      case UIElementTypes.CHECKBOX: {
        type = 'checkbox';
        break;
      }
      case UIElementTypes.DROPDOWN: {
        type = 'select';
        break;
      }
    }

    let formlyInput: FormlyFieldConfig = {
      className: 'formlyField',
      key: input.name,
      type: type,
      // hideExpression: input.expression,

      wrappers:
        form.labelalignment == 0
          ? ['form-field-horizontal']
          : ['form-field-vertical'],
      defaultValue: input.value,
      templateOptions: {
        expression: input.expression,
        rows: 3,
        required: input.mandetory,
        readonly: input.readonly,
        label: input.displaylabel ? input.displaylabel : input.label,
        tooltip: input.description,
        step: input.name === 'creditLimit' ? 5000 : 1,
        maxLength:
          input.name === 'businessEntityName' || input.name === 'sapId'
            ? 10
            : 1000000,
      },
      hide:input.value ? false : input.isDependantVar
    };
    //added allowpastdate props in temolate option when choosing datefield
    if (input.uielementtype === "DATEFIELD") {
      formlyInput.templateOptions.allowPastDate = input.allowPastDate;
    }
    if(input.uielementtype === UIElementTypes.DROPDOWN && input.readonly){
      formlyInput.className="formlyField dropdownPointer"
    }
    console.log("input",  input)
    // if (input.uielementtype === UIElementTypes.DROPDOWN) {
    //   formlyInput.templateOptions.disabled = input.readonly;
    // }
    let inputType;

    if (type == 'input') {
      switch (input.uielementtype) {
        case UIElementTypes.DATEFIELD: {
          inputType = 'date';
          break;
        }
        case UIElementTypes.TIMEFIELD: {
          inputType = 'time';
          break;
        } 
        case UIElementTypes.NUMBER: {
          inputType = 'number';
          formlyInput.templateOptions.min = 0;
          formlyInput.templateOptions.max = 10000000;
          break;
        }
        case UIElementTypes.TEXT: {
          inputType = 'text';
          break;
        }
      }
      formlyInput.templateOptions['type'] = inputType;
    } else {
      if (input.uielementtype == UIElementTypes.RADIO) {
        formlyInput.defaultValue = formlyInput.defaultValue
          ? formlyInput.defaultValue
          : false;
      }
      if (input.uielementtype != UIElementTypes.TEXTAREA) {
        if (input.datatype === VariableDataTypes.NUMBER) {
          formlyInput.templateOptions['options'] = input.options
            ? input.options.map((i: any) => {
                i.name = parseInt(i.name);
                return i;
              })
            : [];
        } else {
          formlyInput.templateOptions['options'] = input.options
            ? input.options.sort((a, b) =>
                a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
              )
            : [];

            console.log("formlyinputetemplateotions" , formlyInput.templateOptions["options"])
        }
        formlyInput.templateOptions['valueProp'] = 'name';
        if (input.options?.[0] && 'label' in input.options?.[0]) {
          formlyInput.templateOptions['labelProp'] = 'label';
        } else {
          formlyInput.templateOptions['labelProp'] = 'name';
        }
      }
    }

    // if(formlyInput.templateOptions.required){
    //   formlyInput.validators= {
    //     [input.name] : {
    //       expression: c => !c.value || c.value === '' || /()/.test(c.value)
    //     }
    //   }
    // }
    
    if (
      input.uielementtype === UIElementTypes.DROPDOWN &&
      input.datatype === VariableDataTypes.STRING
    ) {
      // return [formlyInput, this.addOtherInput(input, form)];
      return [formlyInput];
    } else {
      return [formlyInput];
    }
  }

  addOtherInput(
    input: ProcessVariableModel,
    form: ProcessFormModel
  ): FormlyFieldConfig {
    let field: FormlyFieldConfig = {
      className: 'formlyField',
      key: `${input.name}Other`,
      type: 'input',
      hideExpression: `!model['${input.name}'] || model['${input.name}'].toLowerCase() !== 'other'`,
      wrappers:
        form.labelalignment == 0
          ? ['form-field-horizontal']
          : ['form-field-vertical'],
      defaultValue: null,
      templateOptions: {
        required: input.mandetory,
        readonly: input.readonly,
        label: input.displaylabel ? input.displaylabel : input.label,
        tooltip: input.description,
        type: 'text',
      },
    };
    return field;
  }

  wrapWithHeaders(
    input: ProcessVariableModel[],
    header: string,
    form: ProcessFormModel
  ): { formlyVar: FormlyFieldConfig; model: any } {
    let obj = { formlyVar: {}, model: {} };

    let vars = [];

    input.forEach((c) => {
      if (c.visible) {
        vars = [...vars, ...this.covertToFormlyInput(c, form)];
      } else {
        obj.model[c.name] = c.value;
      }
    });

    obj.formlyVar = {
      key: '',
      wrappers: ['metadata-collapse'],
      templateOptions: { label: header || 'default' },
      /* className: 'row', */
      fieldGroupClassName: 'formlyGroup',
      fieldGroup: vars,
    };

    return obj;
  }
}

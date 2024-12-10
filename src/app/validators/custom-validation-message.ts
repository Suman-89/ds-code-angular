import { FormlyFieldConfig } from '@ngx-formly/core';

// custom validation message
export function requiredMessage(error, field: FormlyFieldConfig) {
  return 'This is a required field';
}

export function emailValidMessage(err, field: FormlyFieldConfig) {
  return `${field.formControl.value} is not a valid email`;
}

export function passwordMatchMessage(err, field: FormlyFieldConfig) {
  return 'The password fields dont match';
}

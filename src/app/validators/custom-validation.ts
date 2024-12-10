import { FormControl, ValidationErrors, AbstractControl } from '@angular/forms';


// custom validation
export function emailValid(form: FormControl): ValidationErrors {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(form.value).toLowerCase()) ? null : {emailValid: true};
}

export function passwordMatch(control: AbstractControl): ValidationErrors {
    const { password, passwordConfirm } = control.value;

    return (passwordConfirm === password) ? null : { passwordMatch: true };
}


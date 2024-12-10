import { FormDataConstants } from 'src/app/core/_models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contract-entity-email-list',
  templateUrl: './contract-entity-email-list.component.html',
  styleUrls: ['./contract-entity-email-list.component.scss'],
})
export class ContractEntityEmailListComponent implements OnInit {
  @Input() emailList;
  @Input() isEdit?;
  @Output() emailListEmitter: EventEmitter<any> = new EventEmitter<any>();
  expandPanel = false;
  emailForm: FormGroup;
  emitEmailModel = { type: '', value: '' };
  emailPattern;
  errMsg = '';
  submit = false;
  constructor() {}

  ngOnInit(): void {
    this.emailPattern = new FormDataConstants().emailPattern;
    this.emailForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(this.emailPattern),
      ]),
    });
  }
  get f() {
    return this.emailForm.controls;
  }

  selectionChange(data) {
    this.emitEmailModel.type = this.emailList.filter(
      (a) => a.label === data
    )[0].value;
  }

  removeEmail(added, email) {
    this.emailList.find((a) => a.value === added.value).emails = this.emailList
      .find((a) => a.value === added.value)
      .emails.filter((a) => a !== email);
    const emitval = { type: added.value, value: email };
    this.emailListEmitter.emit({ type: 'del', data: emitval });
  }

  checkForDuplicates() {
    if (
      this.emailList
        .find((a) => a.label === this.emailForm.value.type)
        .emails.includes(this.emailForm.value.email.toLowerCase())
    ) {
      return false;
    } else {
      if (!this.isEdit) {
        this.emailList
          .find((a) => a.label === this.emailForm.value.type)
          .emails.push(this.emailForm.value.email.toLowerCase());
      }
      return true;
    }
  }

  emitForm() {
    if (
      this.emailForm.value.type.length > 0 &&
      this.emailForm.value.email.length > 0
    ) {
      this.emitEmailModel.value = this.emailForm.value.email.toLowerCase();
      this.submit = this.checkForDuplicates();
      if (this.submit) {
        this.errMsg = '';
        this.emailListEmitter.emit({ type: 'add', data: this.emitEmailModel });
        this.emailForm.reset();
      } else {
        this.errMsg = 'Email Exists';
      }
    } else {
      this.errMsg = 'Please provide value for both fields';
    }
  }

  togglepanel() {
    this.expandPanel = !this.expandPanel;
  }
}

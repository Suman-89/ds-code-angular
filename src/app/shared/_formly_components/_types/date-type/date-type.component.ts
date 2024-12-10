// import { Component, OnInit } from '@angular/core';
// import { FieldType } from '@ngx-formly/core';


// @Component({
//   selector: 'app-date-type',
//   templateUrl: './date-type.component.html',
//   styleUrls: ['./date-type.component.scss']
// })
// export class DateTypeComponent extends FieldType{}

import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-type',
  templateUrl: './date-type.component.html',
  styleUrls: ['./date-type.component.scss']
})
export class DateTypeComponent extends FieldType implements OnInit {
  minDate: NgbDate;
  @Input() field: any;
  allowPastDate: boolean;

  constructor() {
    super();

    const today = new Date();
    today.setDate(today.getDate());

    this.minDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  }

  ngOnInit() {
    // Access and set the `allowPastDate` property from the templateOptions in ngOnInit
    this.allowPastDate = this.field.templateOptions.allowPastDate;
    console.log('allowPastDate:', this.allowPastDate);
  }

  onDateChange(newDate: NgbDateStruct): void {
    const formControl = this.field.formControl;
    console.log('this.field', this.field.templateOptions.allowPastDate);

    const currentDate = new Date();
    const eventDate = new Date(`${newDate}`);
    
    if (eventDate < currentDate) {
      formControl.setValue(null);
    }
  }
}



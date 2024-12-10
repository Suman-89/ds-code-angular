import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @ViewChild(DaterangepickerDirective, { static: false })
  pickerDirective: DaterangepickerDirective;

  @Input() type: string;
  @Input() range?: boolean = false;
  // @Input() onDateSelect: (args: any) => void;
  @Input() required?: boolean = false;
  @Input() search?: string = 'local';
  @Input() value?: any;

  @Output() onDateChange = new EventEmitter<any>();
  ngOnInit(): void {}

  onDateSelect() {
    if (this.range && typeof this.value?.startDate === 'string') return;
    if (!this.range && typeof this.value === 'string') return;

    let val;

    if (this.range) {
      val = this.onDateChange.emit({
        startDate: new Date(this.value?.startDate?._d),
        endDate: new Date(this.value?.endDate?._d),
      });
    } else {
      val = new Date(this.value?.startDate?._d);
    }

    this.onDateChange.emit(val);
  }
  openDatepicker() {
    this.pickerDirective.open();
  }
}

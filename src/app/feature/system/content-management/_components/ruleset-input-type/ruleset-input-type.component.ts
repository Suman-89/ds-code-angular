import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  OperatorTypes,
  ProcessVariableModel,
  SourceTypes,
  UIElementTypes,
} from 'src/app/core/_models';
import {ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ruleset-input-type',
  templateUrl: './ruleset-input-type.component.html',
  styleUrls: ['./ruleset-input-type.component.scss'],
})
export class RulesetInputTypeComponent implements OnInit, OnChanges {
  @Input() variable: any;
  @Input() value: any;
  @Input() options: any[];
  @Input() singleSelect: boolean;
  @Output() emitVal = new EventEmitter();

  rulesetValue;
  uitype: UIElementTypes;
  dropdownSettings: IDropdownSettings;
  bubbleOpt: boolean;
  constructor(private changeDetector: ChangeDetectorRef){
    if (this.options && this.options.length > 0) {
      this.options = this.options.map((a) => a.name);
      this.options.length > 5 ? (this.bubbleOpt = false) : true;
    }
    //  if(this.singleSelect) {
    //    this.rulesetValue = this.value[0] ;
    //  }
    //  this.rulesetValue = this.variable.value ;
  }

  ngOnInit(): void {
    if ((this.variable && this.variable.value) || this.value) {
      // this.rulesetValue = this.singleSelect ?
      //                        this.variable.value ?
      //                        this.variable.value[0] :
      //                        this.value[0] : this.variable.value ;
    }
    this.dropdownSettings = {
      singleSelection: this.singleSelect,
      closeDropDownOnSelection: true,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      enableCheckAll: false,
      allowSearchFilter: true,
    };
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  onInputChange(value) {
    this.emitVal.emit(value);
  }
  ngOnChanges() {
    typeof this.rulesetValue !== 'string' && this.emitValue();
    if (this.options && this.options.length > 0) {
      this.options = this.options.map((a) => (a.name ? a.name : a));
      this.options.length > 5 ? (this.bubbleOpt = false) : true;
    }
    this.rulesetValue = this.singleSelect
      ? this.value && typeof this.value === 'object'
        ? this.value[0]
        : this.value
        ? this.value
        : this.variable.value
      : this.value
      ? this.value
      : this.variable.value;
  }

  emitValue() {
    let obj;
    if (
      this.variable.valuesource === SourceTypes.REFDATA &&
      this.rulesetValue
    ) {
      obj = this.rulesetValue;
      this.emitVal.emit(obj);
    } else if (this.rulesetValue !== undefined && this.rulesetValue !== null) {
      obj =
        typeof this.rulesetValue !== 'object'
          ? [this.rulesetValue]
          : this.rulesetValue;
      this.emitVal.emit(obj);
    }
  }

  setDate(ev) {
    this.emitValue();
  }

  returnType() {
    switch (this.variable.datatype) {
      case 'String':
        return 'text';
      case 'Number':
        return 'number';
      default:
        return 'text';
    }
  }

  setBubbleOption(opt) {
    if (opt.name) {
      opt = opt.name;
    }
    if (!this.rulesetValue) {
      this.rulesetValue = [];
    }
    if (
      this.variable.operator === OperatorTypes.EQUALS ||
      this.variable.operator === OperatorTypes.DOES_NOT_EQUALS
    ) {
      this.rulesetValue.includes(opt)
        ? (this.rulesetValue = this.rulesetValue.filter((r) => r !== opt))
        : this.rulesetValue.push(opt);
    } else {
      this.rulesetValue = [opt];
    }
    this.emitValue();
  }

  checkOptLength(op) {
    return op && op.length < 11 ? true : false;
  }
}

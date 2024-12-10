import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import {
  DataTypesEnum,
  OperatorTypes,
  ProcessVariableModel,
  SourceTypes,
  UIElementTypes,
} from 'src/app/core/_models';
import { RefDataService, SharedService } from 'src/app/core/_services';
import { RuleSetModel } from '../../_models';
import { Constants } from '../../_models/constants.model';

@Component({
  selector: 'app-rule-set',
  templateUrl: './rule-set.component.html',
  styleUrls: ['./rule-set.component.scss'],
})
export class RuleSetComponent implements OnInit {
  @Input() ruleset: RuleSetModel[];
  @Input() procVars: ProcessVariableModel[];
  displayProcVars: ProcessVariableModel[];
  @Input() edit: boolean;
  @Output() ruleSetEmit = new EventEmitter();

  operatorList = Constants.operatorList;
  constructor(
    private refSvc: RefDataService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    this.displayProcVars = this.procVars;
    if (this.ruleset?.length && this.ruleset[0].operand) {
      this.ruleset.map((r) => {
        if (r.operator === OperatorTypes.BETWEEN) {
          r.firstValue = JSON.parse(JSON.stringify(r.operand));
          r.firstValue.value =
            (r.operand.datatype.toLowerCase() === 'date' ||
              r.operand.datatype.toLowerCase() === 'string' ||
              r.operand.datatype.toLowerCase() === 'boolean') &&
            r.operand.uielementtype.toLowerCase() !== 'dropdown'
              ? r.value[0]
              : [r.value[0]];
          r.secondValue = JSON.parse(JSON.stringify(r.operand));
          r.secondValue.value = [r.value[1]];
        } else {
          r.firstValue = this.procVars.find((p) => p.name === r.operand.name);
          r.firstValue.value =
            (r.operand.datatype.toLowerCase() === 'date' ||
              r.operand.datatype.toLowerCase() === 'string' ||
              r.operand.datatype.toLowerCase() === 'boolean') &&
            r.operand.uielementtype.toLowerCase() !== 'dropdown'
              ? r.value[0]
              : r.value;
        }
        r.firstValue.operator = r.operator;
        return r;
      });
    }
    // alert("ruleset")
    // console.log("this.edit", this.edit)
    if (this.edit) {
      this.checkforoption();
      // alert(" i m in ")
    }
  }

  checkforoption() {
    this.ruleset.map((op) => {
      if (op.operand.valuesource === SourceTypes.REFDATA) {
        this.refSvc
          .getInstances(op.operand.refdatacode, true)
          .subscribe((r) => {
            if (r.status) {
              op.options = r.data;
            }
          });
      }
      op.operand.value = op.value;
      op.firstValue.value = op.value;
      return op;
    });
  }

  emitRuleSet() {
    let obj = this.ruleset?.map((r) => {
      // let objVal = r.operator === OperatorTypes.BETWEEN ?
      //                 [r.firstValue.value, r.secondValue.value] : r.firstValue.value ;
      let data;
      data = r.value && typeof r.value !== 'object' ? [r.value] : r.value;
      let o = { operand: r.operand, operator: r.operator, value: data };
      return o;
    });
    this.ruleSetEmit.emit(obj);
  }

  setOperand(v, i) {
    this.ruleset[i].operand = v;
    this.ruleset[i].firstValue = v;
    this.ruleset[i].secondValue = v;
    // this.ruleset[i].operand.value = null ;
    this.ruleset[i].value = [];
    this.ruleset[i].firstValue.value = [];
    this.ruleset[i].secondValue.value = [];
    this.selectOperand(v, i);
    this.ruleset[i].operator = '';
  }

  getOperators(m) {
    // return this.operatorList[m.datatype] ;
    switch (m.datatype) {
      case 'String':
        return m.uielementtype === UIElementTypes.DROPDOWN
          ? this.operatorList['Dropdown']
          : this.operatorList[m.datatype];
      case 'Date':
        return this.operatorList[m.datatype];
      case 'Number':
        return this.operatorList[m.datatype];
      default:
        return this.operatorList['Default'];
    }
  }

  setSecondVal(id) {
    if (this.ruleset[id].operator === OperatorTypes.BETWEEN) {
      this.ruleset[id].secondValue = this.ruleset[id].operand;
    }
  }

  selectOperand(op, id) {
    // this.ruleset[id].operand = op ;
    // this.ruleset[id].firstValue = op ;
    if (op.valuesource === SourceTypes.REFDATA) {
      this.refSvc.getInstances(op.refdatacode, true).subscribe((r) => {
        if (r.status) {
          this.ruleset[id].options = r.data;
          this.ruleset[id].firstValue.options = r.data;

          if (op.name === 'country') {
            this.sharedSvc.countryList$.subscribe((ct) => {
              if (ct) {
                ct.map((a) => {
                  this.ruleset[id].options.push({ name: a.countryname });
                });
              } else {
                this.sharedSvc.getCountries();
              }
            });
            // this.sharedSvc.countryList.map(a => {
            //   this.ruleset[id].options.push({name: a.countryname}) ;
            // }) ;
          }
        }
      });
    }
    if (op === '') {
      this.ruleset[id].operator = '';
      this.ruleset[id].value = [];
      this.ruleset[id].firstValue.value = [];
      this.ruleset[id].secondValue.value = [];
    }
  }

  addRuleSet() {
    if (this.ruleset === undefined || this.ruleset.length === undefined) {
      this.ruleset = [] as RuleSetModel[];
    }
    this.ruleset.push({
      operand: '',
      operator: '',
      value: [],
      firstValue: {} as ProcessVariableModel,
      secondValue: {} as ProcessVariableModel,
    });
  }

  deleteRuleSet(idx) {
    this.ruleset.splice(idx, 1);
  }

  getRuleSetValue(ev, i, opt?) {
    if (
      this.ruleset[i].operand.uielementtype === UIElementTypes.DROPDOWN &&
      this.ruleset[i].operator !== OperatorTypes.BETWEEN
    ) {
      this.ruleset[i].value = ev;
    } else if (typeof ev =='string') {
      this.ruleset[i].value = [ev];
    }else {
      if (this.ruleset[i].operator === OperatorTypes.BETWEEN) {
        let val = this.ruleset[i].operand.datatype === 'Date' ? ev : ev[0];
        opt
          ? (this.ruleset[i].value[1] = val)
          : (this.ruleset[i].value[0] = val);
        opt
          ? (this.ruleset[i].secondValue.value = val)
          : (this.ruleset[i].firstValue.value = val);
      } else {
        // this.ruleset[i].value = [] ;
        this.ruleset[i].value = ev;
        this.ruleset[i].firstValue.value = ev;
      }
    }
  }

  setOperator(op, i) {
    // if(this.ruleset[i].operator !== op) {
    //   this.ruleset[i].value= [] ;
    //   this.ruleset[i].firstValue.value= [] ;
    //   this.ruleset[i].secondValue? this.ruleset[i].secondValue.value= [] : null ;
    //  }
    this.ruleset[i].operator = op;
    this.ruleset[i].firstValue.operator = op;
    if (
      this.ruleset[i].operand.datatype.toLowerCase() === 'boolean' &&
      this.ruleset[i].value.length === 0
    ) {
      this.ruleset[i].value.push(false);
    }
  }

  getSelectionType(i) {
    // this.ruleset[i].operator === 'Between' ||
    return this.ruleset[i].firstValue.uielementtype !== 'DROPDOWN' ? true : false;
  }

  filterVariableList(val) {
    this.displayProcVars = this.procVars.filter((l) =>
      l.name.toLowerCase().includes(val.toLowerCase())
    );
  }
}

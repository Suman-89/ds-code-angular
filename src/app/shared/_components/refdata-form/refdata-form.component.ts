import { Component, OnInit, Input, OnChanges, SimpleChanges, forwardRef, Output, EventEmitter } from '@angular/core';
import { Form, NgForm, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RefDataService } from 'src/app/core/_services';
import { RefdataFormModel, Refdata, RefOptions } from 'src/app/core/_models';



@Component({
  selector: 'app-refdata-form',
  templateUrl: './refdata-form.component.html',
  styleUrls: ['./refdata-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RefdataFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RefdataFormComponent),
      multi: true
    }
  ]
})
export class RefdataFormComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Output() onRefdataChange = new EventEmitter();
  @Input() parentForm: NgForm;
  @Input() refdataFormModel : RefdataFormModel = {} as RefdataFormModel;
  @Input() selRef: Refdata;
  
  defaultOptions: RefOptions = {
    isFirstLevelTypeahead : false,
    isFirstLevelRequired : false,
    isFirstLevelMultiSelect: true,
    showSecondLevel : false,
    isSecondLevelMultiSelect : false,
    isSecondLevelTypeahead : false,
    isSecondLevelRequired : false
  };
  @Input() options : RefOptions = this.defaultOptions;
  firstLevelInstances:any[];
  secondLevelInstances:any[];
  dropdownSettings = {
    singleSelection: true,
    closeDropDownOnSelection:true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false
  };
  dropdownSettingsTwo = {
    singleSelection: true,
    closeDropDownOnSelection:true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false
  };
  isFirstFocusOutOnMulitiSelect;
  isFirstFocusOutOnMulitiSelectTwo;
  selFrstLvlInstance;

  constructor(private refdataSvc: RefDataService) { }

  onModelChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    this.onModelChange(value);
  }

  onChange(value){
    this.onModelChange(value);
    setTimeout( _ => {
      this.onRefdataChange.emit({...this.refdataFormModel});
    })
  }

  

  // communicate the inner form validation to the parent form
  validate() {
    let isValid = false;
    if(this.options.isFirstLevelRequired && this.options.isSecondLevelRequired){
      if(this.options.showSecondLevel && !this.options.isFirstLevelMultiSelect){
        if(this.refdataFormModel.firstLevelInstance && this.refdataFormModel.firstLevelInstance.length && this.refdataFormModel.secondLevelInstance && this.refdataFormModel.secondLevelInstance.length){
          isValid = true;
        }
      } else{
        if(this.refdataFormModel.firstLevelInstance && this.refdataFormModel.firstLevelInstance.length){
          isValid = true;
        }
      }
    } else if(this.options.isFirstLevelRequired){
      if(this.refdataFormModel.firstLevelInstance && this.refdataFormModel.firstLevelInstance.length){
        isValid = true;
      }
    }else if(this.options.isSecondLevelRequired){
      if(this.refdataFormModel.secondLevelInstance && this.refdataFormModel.secondLevelInstance){
        isValid = true;
      }
    } else{
      isValid = true
    }
    return isValid ? null : { refValidator:{valid: false } } ;
  }

  getAllXLevelInstances(refCode,variableName,setFistLvlMdl?){
    this.refdataSvc.getInstances(refCode, false).subscribe(resp => {
      if(resp.status){
        this[variableName] = resp.data;
        if(setFistLvlMdl){
          this.setSelFrstLvlInstance();
        }
      } else{
        alert(resp.message)
      }
    })
  }

  onFirstLevelInstanceChange(){
    this.onChange(this.refdataFormModel);
    if(this.options.showSecondLevel && !this.options.isFirstLevelMultiSelect){
      this.refdataFormModel.secondLevelInstance = null;
      this.getAllXLevelInstances(this.refdataFormModel.firstLevelInstance[0].id,'secondLevelInstances');
      this.setSelFrstLvlInstance();
    }
  }

  setSelFrstLvlInstance(){
    this.selFrstLvlInstance = this.firstLevelInstances.find(inst => inst.id == this.refdataFormModel.firstLevelInstance[0].id);
  }

  onFirstItemSelect(e){
    this.onFirstLevelInstanceChange();
  }

  onFirstSelectAll(e){
    this.refdataFormModel.firstLevelInstance=e;
    this.onChange(this.refdataFormModel);
  }

  onFirstDeSelect(e){
    this.onChange(this.refdataFormModel);
  }

  onFirstDeSelectAll(e){
    this.refdataFormModel.firstLevelInstance = e;
    this.onChange(this.refdataFormModel);
  }

  onItemSelect(e){
    this.onChange(this.refdataFormModel);
  }

  onSelectAll(e){
    this.refdataFormModel.secondLevelInstance = e;
    this.onChange(this.refdataFormModel);
  }

  onDeSelect(e){
    this.onChange(this.refdataFormModel);
  }

  onDeSelectAll(e){
    this.refdataFormModel.secondLevelInstance = e;
    this.onChange(this.refdataFormModel);
  }

  ngOnInit(): void {
    this.options = { ...this.defaultOptions, ...this.options };
    if (this.options.isFirstLevelMultiSelect) {
      this.dropdownSettings.singleSelection = false;
      this.dropdownSettings.closeDropDownOnSelection = false;
    }
    if (this.options.isSecondLevelMultiSelect) {
      this.dropdownSettingsTwo.singleSelection = false;
      this.dropdownSettingsTwo.closeDropDownOnSelection = false;
    }
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.selRef){
      this.getAllXLevelInstances(this.selRef.code,'firstLevelInstances')
    }
    if(changes.refdataFormModel){
      if(!changes.refdataFormModel.firstChange){
        this.onChange(this.refdataFormModel);
      }
      if(this.refdataFormModel.firstLevelInstance && this.refdataFormModel.firstLevelInstance.length && this.options.showSecondLevel && !this.options.isFirstLevelMultiSelect){
        this.getAllXLevelInstances(this.refdataFormModel.firstLevelInstance[0].id,'secondLevelInstances',true);
      }
    }
    if(changes.options){
      this.options = {...this.defaultOptions,...this.options};
      if(this.options.isFirstLevelMultiSelect){
        this.dropdownSettings.singleSelection = false;
        this.dropdownSettings.closeDropDownOnSelection = false;
      }
      if(this.options.isSecondLevelMultiSelect){
        this.dropdownSettingsTwo.singleSelection = false;
        this.dropdownSettingsTwo.closeDropDownOnSelection = false;
      }
    }
  }

}

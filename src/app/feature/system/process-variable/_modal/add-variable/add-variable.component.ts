import { ToastrService } from 'ngx-toastr';
import { AddVarDropdownModel } from './../../_models/add-var-dropdown.model';
import { RefDataService, SharedService } from 'src/app/core/_services';
import { ProcessVariableService } from './../../_services/process-variable.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RuleSetModel } from '../../../content-management/_models';
import {
  ProcessVariableModel,
  SourceTypes,
  UIElementTypes,
} from 'src/app/core/_models';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  delay,
} from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-add-variable',
  templateUrl: './add-variable.component.html',
  styleUrls: ['./add-variable.component.scss'],
})
export class AddVariableComponent implements OnInit {
  @Input() addEditVar: ProcessVariableModel;
  @Input() header: any;
  @Input() dropDownData: AddVarDropdownModel;
  @Output() emitVar = new EventEmitter<any>();
  @ViewChild('ruleSet') ruleSetInst;
  ruleSetModel :RuleSetModel[];
  isExpressionEnabled: boolean = false;
  parentVar = [];
  isDependent = false;
  refData = [];
  allSources = [];
  allUIeleTypes = [];
  isEdit = false;
  groups;
  groupDropdownSettings = {
    singleSelection: true,
    closeDropDownOnSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };

  isMultiLevel:boolean=false;
  isDropdownDependant:boolean=false;
  levels;
  levelOptions;
  parentVarDropdown;
  // expression:string = '';
  operator: string = '';

  mappedReviewGroup;
  allProcesses;
  variableSetting = { label: 'name', value: 'value', position: 'top' };
  referenceDataList = [];
  searchArray = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((term) => {
        if (term.length > 1 && this.dropDownData.category.length > 0) {
          const temp = this.dropDownData.category
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10);
          return temp.length > 0 ? temp : [`Create ${term}`];
        }
        return [];
      })
    );

  searchNamesArray = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((term) => {
        // console.log(term)
        const lastLetter = term.slice(-1);
        const containsLetter = /[a-zA-Z]/.test(lastLetter);
        const lastPart = term.match(/[^a-zA-Z]+([a-zA-Z]+)$/)?.[1];
        // console.log(containsLetter, lastPart);

        // Capture the last sequence of non-letter characters at the end
        const lastNonLetterSequence = term.match(/[a-zA-Z]*([^a-zA-Z]+)$/)?.[1];
        if (lastNonLetterSequence) {
          this.operator = lastNonLetterSequence;
        }
        console.log('seq', lastNonLetterSequence);

        if (containsLetter && lastPart !== undefined) {
          console.log('in');
          const temp = this.varNames
            .filter((v) => v.toLowerCase().indexOf(lastPart.toLowerCase()) > -1)
            .slice(0, 10);
          return temp.length > 0 ? temp : '';
        } else if (term != '') {
          const temp = this.varNames
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10);
          return temp.length > 0 ? temp : '';
        }

        //   if (term.length > 1 && this.varNames.length > 0) {
        //     const temp = this.varNames
        //       .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
        //       .slice(0, 10);
        //     return temp.length > 0 ? temp : [` ${term}`];
        //   }
        // return [];
      })
    );
  procVars: any;
  rulesetArr: RuleSetModel[];

  addVarNames(event) {
    console.log('thisoperator', this.operator);
    let bag = this.addEditVar.expression + this.operator;
    bag += event.item;
    this.addEditVar.expression = bag;
  }

  handleExpressionChange(event) {
    let text = event.target.value;
    const lastPart = text.match(/[^a-zA-Z]+([a-zA-Z]+)$/)?.[1];
    // console.log("lp",lastPart,text)
    let flag;
    if (lastPart) {
      flag = this.varNames.filter((item) => {
        return item === lastPart;
      });
    } else {
      flag = this.varNames.filter((item) => {
        return item === text;
      });
    }

    // console.log("flag",flag)
    if (text === '') {
      this.addEditVar.expression = text;
      // console.log("!",this.addEditVar.expression)
      this.operator = '';
    } else if (text !== '' && flag.length > 0) {
      this.addEditVar.expression = text;
      // console.log("2",this.addEditVar.expression)
    } else if (text !== '' && flag.length === 0) {
      const matches = text.match(/.*[^a-zA-Z]+/g);
      // console.log("object",matches)

      if (matches) {
        const lastMatch = matches[matches.length - 1];
        const lastCharInput = text.charAt(text.length - 1);
        // console.log("5",lastCharInput)
        this.operator = '';
        this.addEditVar.expression = lastMatch;
        // console.log("4",this.addEditVar.expression)
      } else {
        this.operator = '';
        this.addEditVar.expression = '';
      }
    }
  }

  varFormatter = (x) => x;
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private actModal: NgbActiveModal,
    private varSvc: ProcessVariableService,
    private refDataSvc: RefDataService,
    private toastrSvc: ToastrService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
      
    if(this.addEditVar.refdatacode!==null){
      let data=this.dropDownData.refData.find((item)=> {
        if(item.code === this.addEditVar.refdatacode){
          return item;
        }
      })
       if(data){
        this.levelOptions = data.levels
        this.levelOptions = Array.from({ length: data.levels }, (_, index) => index + 1);
       }
    }
    
    // console.log("refdatalevel" , this.addEditVar.refDataLevel)
    if(this.addEditVar.refDataLevel!==undefined && this.addEditVar.refDataLevel>1){
      console.log("addeditvar refdatlevel" , this.addEditVar.refDataLevel)
      this.isMultiLevel=true
    }
  
     
         if(this.addEditVar.allowPastDate===null){
      this.addEditVar.allowPastDate=true
     }     
    console.log("alowpastdate", this.addEditVar.allowPastDate);
    this.getAllProcVars();

    
    this.ruleSetModel = [{ operand: '', operator: '', value: []  }];
    //

    this.addEditVar.valuesource = this.addEditVar.valuesource;
    this.allSources = this.dropDownData.sources;
    this.allUIeleTypes = this.dropDownData.uiElementTypes;
    this.addEditVar.applicableToAll =
      this.addEditVar.applicableToAll == null
        ? false
        : this.addEditVar.applicableToAll;
    this.checkOnInitForEdit();
    this.getAllDefinitionForms();
    console.log('EDIT???', this.isEdit);
    if(this.isEdit && this.addEditVar.parentVars){
      // console.log("prentvar" ,this.addEditVar.parentVars)
       this.ruleSetModel = [];
      for(let i of this.addEditVar.parentVars){
        this.ruleSetModel.push(i)
      }
      // console.log("rulesetmodel" , this.ruleSetModel)
    }
 
    this.createdRefData();
    console.log(
      'addEditVar&&&&&&&&&&&&&&',
      this.addEditVar,
      this.dropDownData.uiElementTypes
    );
    this.getVariableData();
    console.log("adeditvar", this.addEditVar)
  }

  getAllDefinitionForms() {
    this.varSvc.getAllDefinitionForm().subscribe((r) => {
      if (r.status) {
        this.allProcesses = r.data
          .filter((i) => i.processDef.isVisible)
          .map((process) => process.processname);
      }
    });
  } 
  addRuleSet(event){
    // console.log(event)
    this.addEditVar.parentVars = event;
  }


  getParentVars(){

    let data = this.procVars
  
    data = data.map((obj) => {
      return {
        name: `${obj.name}`,
        value: obj.name,
      };
    });
    // console.log("data", data);
    this.parentVarDropdown = data;
  }
  getAllProcVars() {
   
      this.varSvc.getAllProcessVariables().subscribe((r) => {
        this.procVars = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
        // console.log("procFormModel.variables",this.procFormModel.variables)
  
        let process = JSON.parse(localStorage.getItem('selected-process'));
        let allVariables = [];
        for (const array of this.procVars) {
            if (array.processNames && array.processNames.includes(process.name)) {
              allVariables.push(array);
            }
        }
        this.procVars = allVariables;
        this.procVars = allVariables.sort((a, b) =>
              a.displaylabel.toLowerCase() > b.displaylabel.toLowerCase() ? 1 : -1
            );
            this.ruleSetModel.map((r) => {
              r.operand = this.procVars.find((p) => p.name === r.operand);
              return r;
            });
           this.getParentVars()
          // console.log("procvars", this.procVars)
        // console.log("ddvar afer getting procform variables" , this.ddvars)
      });
    
  }
  varData: ProcessVariableModel[];
  varNames: any;
  getVariableData() {
    this.varSvc.getAllProcessVariables().subscribe((resp) => {
      this.varData = resp.data.sort((a, b) => (a.name > b.name ? 1 : -1));

      let names = this.varData.map((el, i) => {
        return el.name;
      });
      this.varNames = names;
    });
  }

  getGroups() {
    this.sharedSvc.groups$.subscribe((g) => {
      if (g && g.length > 0) {
        this.groups = g;
        this.mappedReviewGroup = this.addEditVar.mappedgroupwithreview
          ? this.groups.filter(
              (g) => g.name === this.addEditVar.mappedgroupwithreview
            )
          : [];
      } else {
        this.sharedSvc.getGroups();
      }
    });
  }

  doctypeDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };
  checkOnInitForEdit() {
    if (this.addEditVar.name.length > 0) {
      // edit variable check
      if (this.addEditVar.parentname) {
        this.isDependent = true;
      }
      this.isEdit = true;
      this.datatypeSelect();
      this.selectSource();
      // this.fetchSource();
      this.getGroups();
      this.getAllDefinitionForms();
    }
    if (this.header === 'Copy Variable') {
      this.isEdit = false;
    }
  }

  handleCheckboxChange(event: any) {
    // Get the checked value from the event object
    this.addEditVar.allowPastDate = event.target.checked;
    console.log("addediteevar.LLOWoastdate", this.addEditVar)
    // Now, this.addEditVar.allowpastdate contains the checked value
    console.log('Checkbox checked value:', this.addEditVar.allowPastDate);
  }

  transfromRefdata(code): string {
    const obj = this.dropDownData.refData.find((a) => a.code === code);
    return `${obj.name} (${obj.code})`;
  }

  createdRefData() {
    this.referenceDataList = this.dropDownData.refData.map((obj) => {
      return {
        name: `${obj.name} (${obj.code})`,
        value: obj.code,
      };
    });
    console.log('referenceDataList', this.referenceDataList);
  }

  close() {
    this.actModal.close();
  }

  save() {


    if(!this.isMultiLevel){
      this.addEditVar.refDataLevel="";
    }

    if(!this.addEditVar.isDropdownDependent){
       this.addEditVar.parentDropdownName="";
    }
    
    if(this.addEditVar.isDependantVar){
      this.ruleSetInst.emitRuleSet();
    }else{
      this.ruleSetModel=[];
    }
    
     if(this.isEdit && this.addEditVar.isDependantVar && this.ruleSetModel.length>0){
      this.ruleSetInst.emitRuleSet();
    }

    this.addEditVar.parentVars = this.ruleSetModel?.map((r) => {
      if (r.operand) {
        let obj = {
          operand: r.operand ? r.operand.name : r.firstValue.name,
          operator: r.operator,
          value: r.value,
        };
        return obj;
      } else return;
    });
    // console.log("rulesetmodel 3" , this.ruleSetModel)

    this.addEditVar.parentVars = this.addEditVar?.parentVars?.filter((i) => i);
    this.mappedReviewGroup && this.mappedReviewGroup?.length > 0
      ? (this.addEditVar.mappedgroupwithreview = this.mappedReviewGroup[0].id)
      : null;
    this.varSvc.getFieldName(this.addEditVar.label).subscribe((res) => {
      this.addEditVar.name = res.data;
      if (this.addEditVar.valuesource !== SourceTypes.REFDATA) {
        this.addEditVar.refdatacode = '';
      }
      
      if (this.header === 'Copy Variable') {
        const keys = [
          'displaylabel',
          'label',
          'name',
          'datatype',
          'categoryname',
          'uielementtype',
          'valuesource',
          'linkedtometadata',
          'description',
          'processNames',
        ];
        const editedObj = this.keepSelectedKeys(this.addEditVar, keys);
        this.emitVar.emit(editedObj);
      } else {
        this.emitVar.emit(this.addEditVar);
        console.log("editedadeditvar", this.addEditVar)
      }

      if (!this.isEdit) {
        this.close();
      }
      // this.emitVar.emit(this.addEditVar);
      // if (!this.isEdit) {
      //   this.close();
      // }
      this.close();
    });
  }

  keepSelectedKeys(obj, keys) {
    const newObj = {};
    for (const key in obj) {
      if (keys.includes(key)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  setOperand(val) {
    this.addEditVar.refdatacode = val;
  }
  addCategory(event) {
    if (event.item.includes('Create')) {
      event.item = event.item.substring(7);
      this.varSvc.addCategoryForVariable(event.item).subscribe((resp) => {
        this.addEditVar.categoryname = event.item;
        this.toastrSvc.success('Variable Family Added');
      });
      return event.item;
    } else {
      this.addEditVar.categoryname = event.item;
    }
  }

  selectSource() {
    if (this.addEditVar.valuesource === SourceTypes.REFDATA) {
      //  this.fetchRefData() ;
    } else {
      return;
    }
  }

  datatypeSelect() {
    if (this.addEditVar.datatype === 'boolean') {
      this.allUIeleTypes = this.dropDownData.uiElementTypes.filter(
        (a) => a === UIElementTypes.CHECKBOX || a === UIElementTypes.RADIO
      );
    } else {
      this.allUIeleTypes = this.dropDownData.uiElementTypes;
    }
  }

  checkboxToggle() {
    this.isDependent = !this.isDependent;
        if (!this.isDependent) {
      this.addEditVar.parentname = '';
    } else {
      this.addEditVar.refdatacode = '';
      this.addEditVar.isDependantVar=false;
      this.ruleSetModel = [{ operand: '', operator: '', value: []  }];
      // this.addEditVar.valuesource = '' ;
    }
    this.fetchSource();
  }

  onLevelChange(event){
    this.addEditVar.refDataLevel=event.target.value;
    // this.addEditVar.levels=this.levels
  }
  selectParentDropdown(event){
    this.addEditVar.parentDropdownName = event.value;
    // console.log("object " , event)
    // console.log("vlaueeeeeeeeeeee", this.addEditVar.parentname)
    
  }

  checkboxToggleisDependant(){
    this.addEditVar.isDependantVar = !this.addEditVar.isDependantVar;
    // if(this.addEditVar.isDependantVar){
    //   this.ruleSetModel = [{ operand: '', operator: '', value: []  }];
    // }
  }

  checkboxToggleIsMultilevel(e){
    this.isMultiLevel=!this.isMultiLevel
  }

  checkboxToggleIsDropdownDependant(){
    this.addEditVar.isDropdownDependent = !this.addEditVar.isDropdownDependent
  }

  fetchSource() {
    let opt;
    this.changeSourcesValue();
    if (this.addEditVar.uielementtype === UIElementTypes.DROPDOWN) {
      this.addEditVar.valuesource = this.dropDownData.sources.find(
        (a) => a === SourceTypes.REFDATA
      );
      this.isDependent ? (opt = true) : (opt = false);
    }
    this.varSvc.getVariableNames(opt).subscribe((r) => {
      this.parentVar = r.data.sort((a, b) => (a < b ? -1 : 1));
      if (this.addEditVar.uielementtype === UIElementTypes.DROPDOWN) {
        //  this.fetchRefData() ;
      }
    });

    this.expressionEnabler();
  }

  //expression fn
  expressionEnabler(): void {
    if (this.addEditVar.uielementtype === UIElementTypes.EXPRESSION) {
      this.isExpressionEnabled = true;
    } else {
      this.isExpressionEnabled = false;
    }
  }

  changeSourcesValue() {
    if (this.addEditVar.uielementtype !== UIElementTypes.DROPDOWN) {
      this.allSources = this.dropDownData.sources.filter(
        (a) => a !== SourceTypes.REFDATA
      );
      this.addEditVar.refdatacode = '';
      // this.addEditVar.valuesource = '' ;
    } else if (
      this.addEditVar.uielementtype === UIElementTypes.DROPDOWN &&
      !this.isDependent
    ) {
      this.addEditVar.valuesource = SourceTypes.REFDATA;
      this.allSources = this.dropDownData.sources.filter(
        (a) =>
          a === SourceTypes.REFDATA ||
          a === SourceTypes.OTHERS ||
          a === SourceTypes.URL
      );
    }
  }
  changeRefDataCode(e) {
    console.log('VALUE ', e);
    this.addEditVar.refdatacode = e.value;
   
   let data=this.dropDownData.refData.find((item)=> {
      if(item.code === e.value){
        return item;
      }
    })
    //  this.levelOptions = data.levels
     this.levelOptions = Array.from({ length: data.levels }, (_, index) => index + 1);
    // console.log("leveloptions", this.levelOptions)

  }
  getFieldName(label) {
    this.addEditVar.label = label.trim();
    if (!this.isEdit) {
      this.varSvc.getFieldName(label).subscribe((res) => {
        this.addEditVar.name = res.data;
      });
      this.addEditVar.displaylabel = label;
    }
  }

  trimFields(field) {
    this.addEditVar[field] = this.addEditVar[field].trim();
  }
}

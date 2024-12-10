import { FileUploadService } from '../../../../../core/_services/file-upload.service';
import { RefDataService } from '../../../reference-data/_services/refdata/ref-data.service';
import {
  ProcessFormModel,
  ProcessVariableModel,
  InstanceModel,
  ProcFormDoclistDropdownModel,
  NameModel,
} from 'src/app/core/_models';

import { GroupModel } from '../../../../user-management/_models';
import { UserService } from 'src/app/core/_services/user.service';
import { FormLayoutTypeEnum } from '../../../../../core/_models/shared/types.enum';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AiAttributeService } from '../../_services/ai-attribute.service';
import { ProcessVariableService } from '../../../process-variable/_services/process-variable.service';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  ReviewTaskConstant,
  TaskDocumentModel,
} from 'src/app/feature/process/layout/_models';
import { SharedService } from 'src/app/core/_services';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-process-forms',
  templateUrl: './add-process-forms.component.html',
  styleUrls: ['./add-process-forms.component.scss'],
  providers: [NgbDropdownConfig],
})
export class AddProcessFormsComponent implements OnInit {
  allVars: ProcessVariableModel[];
  ddvars: ProcessVariableModel[];
  ddVarNames = [];
  reviewTaskEnum = new ReviewTaskConstant().reviewGroupMap;
  procFormModel: ProcessFormModel = {
    name: '',
    key: '',
    defaulttab: '',
    groupname: '',
    description: '',
    labelalignment: FormLayoutTypeEnum.HORIZONTAL,
    reviewable: false,
    reviewgroups: [],
    commentsneeded: false,
    selecteddoctypes: [],
    isreviewtask: false,
    revisable: false,
    revisegroups: [],
    rejectable: false,
    rejectgroups: [],
    emailenabled: true,
    variables: [],
    feedbackVariableMaps: [],
    formtype: '',
    workflowname: '',
    processNames: [],
  };
  routeId;
  selectedVariable;
  formVariable = {
    name: '',
    ismandatory: true,
    visible: true,
    defaultvalue: null,
    readonly: false,
  };
  groupSetting = { label: 'name', value: 'name' };
  variableSetting = { label: 'name', value: 'name', position: 'top' };
  allProcesses;
  formValue = '';
  vendorsapIds = [];

  groups = [] as GroupModel[];
  reviewingGroup = [] as GroupModel[];
  reviseGroup = [] as GroupModel[];
  rejectGroup = [] as GroupModel[];
  ////////////////////////////////
  assigningGroup = [] as GroupModel[];
  //////////////////////
  tabNames = [];
  labelAlignmentTypes = [];
  header = 'Add Process Form';
  groupDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };
  doctypeDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };
  documentTypes;
  formtypes: string[];
  processTypes;

  dropdownSettingsRecipient = {
    singleSelection: true,
    closeDropDownOnSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    enableCheckAll: false,
  };
  existingvariables = [];
  constructor(
    private procVarSvc: ProcessVariableService,
    private procFormSvc: AiAttributeService,
    private router: Router,
    private userSvc: UserService,
    private actRoute: ActivatedRoute,
    private toastrSvc: ToastrService,
    private refdataSvc: RefDataService,
    private sharedSvc: SharedService,
    private fileUplSvc: FileUploadService,
    config: NgbDropdownConfig
  ) {
    config.autoClose = false;
  }

  ngOnInit(): void {
    this.getDefaultTabNames();
    this.getDisplayTypes();
    this.getFormTypes();
    this.getAllDefinitionForms();
  }

  getAllDefinitionForms() {
    this.procVarSvc.getAllDefinitionForm().subscribe((r) => {
      if (r.status) {
        this.allProcesses = r.data
          .filter((i) => i.processDef.isVisible)
          .map((process) => process.processname);
      }
    });
  }
  getFormTypes() {
    this.refdataSvc.getInstances('FORM_TYPE', true).subscribe((res) => {
      if (res) {
        this.formtypes = res.data.map((a) => a.name);
      }
    });
    this.sharedSvc.getAllProcessDefinintion().subscribe((r) => {
      if (r.status) {
        let data = r.data;
        this.processTypes = [];
        Object.keys(data).forEach((a) => {
          this.processTypes.push(data[a]);
        });
      }
    });
  }

  getDocCategories() {
    let selectedProcessNeedToBeSent;
    if (
      this.procFormModel.processNames?.includes('Initiation Content Creation')
    ) {
      let selectedProcess = JSON.parse(
        localStorage.getItem('selected-process')
      );
      selectedProcessNeedToBeSent = selectedProcess?.key;
    }
    this.fileUplSvc
      .getAllDocCategory(selectedProcessNeedToBeSent)
      .subscribe((resp) => {
        if (resp.status) {
          this.documentTypes = resp.data.filter(
            (a) => a.foldername !== 'Executed Contracts'
          );
          if (
            !this.procFormModel.selecteddoctypes ||
            this.procFormModel.selecteddoctypes.length === 0
          ) {
            this.procFormModel.selecteddoctypes =
              [] as ProcFormDoclistDropdownModel[];
            this.documentTypes.forEach((e) => {
              e.selected = true;
              const obj = {
                code: e.code,
                name: e.foldername,
                selected: true,
                uploadable: true,
              };
              this.procFormModel.selecteddoctypes.push(obj);
            });
          } else {
            if (selectedProcessNeedToBeSent) {
              let allDocTypesArr = [];
              let selecteddoctypes = [];
              this.procFormModel.selecteddoctypes.forEach((e) => {
                this.documentTypes.find((a) => a.code === e.code).selected =
                  e.selected;
                this.documentTypes.find((a) => a.code === e.code).uploadable =
                  e.uploadable;
                let match = this.documentTypes.find((a) => a.code === e.code);
                if (match) {
                  match.selected = e.selected;
                  match.uploadable = e.uploadable;
                  allDocTypesArr.push(match);
                  selecteddoctypes.push(e);
                }
              });
              this.documentTypes = allDocTypesArr;
              this.procFormModel.selecteddoctypes = selecteddoctypes;
            } else {
              this.procFormModel.selecteddoctypes.forEach((e) => {
                this.documentTypes.find((a) => a.code === e.code).selected =
                  e.selected;
                this.documentTypes.find((a) => a.code === e.code).uploadable =
                  e.uploadable;
              });
            }
          }
        }
      });
  }

  getDisplayTypes() {
    this.labelAlignmentTypes = [
      { name: 'Horizontal', value: FormLayoutTypeEnum.HORIZONTAL },
      { name: 'Vertical', value: FormLayoutTypeEnum.VERTICAL },
    ];
  }

  getDefaultTabNames() {
    this.refdataSvc.getInstances('DTT', true).subscribe((resp) => {
      if (resp.status) {
        resp.data.forEach((a) => {
          this.tabNames.push(a.name);
        });
        this.getGroups();
      }
    });
  }

  addVendorSapId() {
    if (
      this.formValue &&
      this.formValue.length &&
      !this.vendorsapIds.includes(this.formValue)
    ) {
      this.vendorsapIds.push(this.formValue);
      this.formValue = '';
    }

    // console.log(this.vendorsapIds, this.formValue);
  }

  deleteAlias(al) {
    this.vendorsapIds = this.vendorsapIds.filter((a) => a !== al);
  }

  getGroups() {
    this.userSvc.getUserGroups().subscribe((r) => {
      if (r.status) {
        this.groups.push(...r.data);
        this.getProcFormKey();
      }
    });
  }
  // autoFillDisplayName(){
  //  if (this.procFormModel.displaytitle.length === 0) {
  //    this.procFormModel.displaytitle = this.procFormModel.name ;
  //  }
  // }

  selectDisplayTab(obj) {
    this.procFormModel.defaulttab = obj.value;
    // console.log('procFormModel.defaulttab', obj, this.procFormModel, 'VALID ');
  }
  selectGroup(obj) {
    this.procFormModel.groupname = obj.value;
  }
  variables = [];
  onSelectProcessRef(obj) {
    // console.log('onSelectProcessRef', obj);
    // this.procFormModel.variables = [...this.procFormModel.variables];
    if (this.variables.length) {
      this.variables = this.variables.map((x) => {
        if (x.name == obj.id) {
          return { ...x, values: obj.value };
        } else {
          return x;
        }
      });
    } else {
      this.variables = this.procFormModel.variables.map((x) => {
        if (x.name == obj.id) {
          return { ...x, values: obj.value };
        } else {
          return x;
        }
      });
    }
    // this.procFormModel = {...this.procFormModel,variables:this.variables};

    // console.log("JJJJJJJJJJJJJJJJJJJJ", this.procFormModel.variables)
  }

  selectProcessName(obj) {
    this.procFormModel.workflowname = obj.value;
  }
  getProcFormKey() {
    this.routeId = this.actRoute.snapshot.paramMap.get('key');
    if (this.routeId) {
      this.procFormSvc.getAllProcFormsbyId(this.routeId).subscribe((resp) => {
        this.procFormModel = resp.data;
        this.procFormModel.variables.forEach((a) => {
          a.defaultvalue = a.value;
          a.ismandatory = a.mandetory;
        });
        this.procFormModel.defaulttab
          ? (this.procFormModel.defaulttab = this.procFormModel.defaulttab)
          : (this.procFormModel.defaulttab = this.tabNames.find(
              (t) => t.name === 'Info'
            ));

        if (this.procFormModel.groupid) {
          this.procFormModel.groupname = this.groups.find(
            (a) => a.id === this.procFormModel.groupid
          )?.name;
        }

        !this.procFormModel.formtype
          ? (this.procFormModel.formtype = '')
          : null;
        this.getAllVars();
        this.reviewingGroup = this.populateReviewingGroup(
          this.procFormModel.reviewgroups
        );
        this.reviseGroup = this.populateReviewingGroup(
          this.procFormModel.revisegroups
        );
        this.rejectGroup = this.populateReviewingGroup(
          this.procFormModel.rejectgroups
        );
        ////////////////////////
        this.assigningGroup = this.populateReviewingGroup(
          this.procFormModel.assigngroups
        );
        ///////////////////////
        this.getDocCategories();
        this.header = 'Process Form ' + this.procFormModel.key;
      });
    } else {
      this.getAllVars();
      this.getDocCategories();
      this.procFormModel = {
        name: '',
        key: '',
        defaulttab: '',
        groupname: '',
        description: '',
        labelalignment: FormLayoutTypeEnum.HORIZONTAL,
        reviewable: false,
        reviewgroups: [],
        commentsneeded: false,
        selecteddoctypes: [],
        isreviewtask: false,
        revisable: false,
        revisegroups: [],
        rejectable: false,
        rejectgroups: [],
        emailenabled: true,
        variables: [],
        formtype: '',
        workflowname: '',
        assignable: false,
        assigngroups: [],
        processNames: [],
      };
    }
  }
  getAllVars() {
    this.procVarSvc.getAllProcessVariables().subscribe((r) => {
      this.allVars = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.ddvars = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
      if (this.procFormModel.variables.length > 0) {
        this.procFormModel.variables.forEach((v) => {
          this.ddvars = this.ddvars.filter((a) => a.name !== v.name);
        });
      }
      // console.log("procFormModel.variables",this.procFormModel.variables)
    });
  }
  populateReviewingGroup(grp) {
    // if (this.procFormModel.reviewgroups && this.procFormModel.reviewgroups.length > 0) {
    //   this.procFormModel.reviewgroups.forEach( g => {
    //     const obj = this.groups.find(a => a.id === g.id) ;
    //     this.reviewingGroup.push(obj) ;
    //   }) ;
    // }
    const retGrp = [];
    if (grp && grp.length > 0) {
      grp.forEach((g) => {
        const obj = this.groups.find((a) => a.id === g.id);
        retGrp.push(obj);
      });
      return retGrp;
    }
  }

  getChange(event) {
    // console.log(event);
  }
  mapToGroups(obj) {

    console.log("OBJECT ",obj)
    const gr = [];
    obj.map((a) => {
      const obj = { id: a.id, name: a.name };
      gr.push(obj);
    });
    return gr;
  }
  mapFeedbackVariables() {
    if (this.procFormModel.reviewable) {
      this.procFormModel.feedbackVariableMaps = [];
      this.procFormModel.reviewgroups
        .map((a) => a.id)
        .forEach((f) => {
          let obj = this.reviewTaskEnum[f];
          obj && this.procFormModel.feedbackVariableMaps.push(obj);
        });
    }
  }

  // mapFeedbackVariables() {
  //   if(this.procFormModel.reviewable) {
  //     // let feedbackVars = this.allVars.filter(a => a.name.startsWith('reviewWith')).map(v => {
  //     //   return { name: v.displaylabel, variable: v.name, }
  //     // }) ;
  //     this.procFormModel.feedbackVariableMaps = [] ;
  //     this.procFormModel.reviewgroups.map(a => a.id).forEach( f => {
  //       let obj = this.reviewTaskEnum[f] ;
  //       this.procFormModel.feedbackVariableMaps.push(obj)
  //     })
  //   }

  // }
  save() {
    if (this.variables.length) {
      this.procFormModel = { ...this.procFormModel, variables: this.variables };
    }

    // let electeddoctypes = this.procFormModel.selecteddoctypes;
    // electeddoctypes = electeddoctypes.filter((v, i, a) => a.findIndex(v2 => (v2.name === v.name)) === i);
    // console.log("ENNNNN", electeddoctypes);
    // this.procFormModel.selecteddoctypes = electeddoctypes;

    // console.log('VAR ', this.procFormModel.variables);
    let servName;
    this.procFormModel.reviewgroups = this.procFormModel.reviewable
      ? this.mapToGroups(this.reviewingGroup)
      : [];
    this.procFormModel.revisegroups = this.procFormModel.revisable
      ? this.mapToGroups(this.reviseGroup)
      : [];
    this.procFormModel.rejectgroups = this.procFormModel.rejectable
      ? this.mapToGroups(this.rejectGroup)
      : [];
    this.procFormModel.assigngroups = this.procFormModel.assignable
      ? this.mapToGroups(this.assigningGroup)
      : [];
    this.routeId ? (servName = 'editForm') : (servName = 'addProcessForm');
    this.procFormModel.groupid = this.groups.find(
      (a) => a.name === this.procFormModel.groupname
    ).id;
    this.mapFeedbackVariables();
    this.procFormSvc[servName](this.procFormModel).subscribe((resp) => {
      if (resp.status) {
        this.toastrSvc.success('Form Saved');
        this.back();
      }
    });
  }

  setReviewable(event) {
    this.procFormModel.reviewable = event.checked;
  }
  
  setAssignable(event) {
    this.procFormModel.assignable = event.checked;
  }

  filterDocument(type) {
    if (this.procFormModel.selecteddoctypes.find((a) => a.code === type.code)) {
      this.procFormModel.selecteddoctypes =
        this.procFormModel.selecteddoctypes.filter((a) => a.code !== type.code);
      this.documentTypes.find((a) => a.code === type.code).selected = false;
    } else {
      this.procFormModel.selecteddoctypes.push({
        name: type.foldername,
        code: type.code,
        selected: true,
        uploadable: true,
      });
    }
  }

  checkDocSelected(type) {
    let val;
    this.procFormModel.selecteddoctypes.find((a) => a.code === type.code)
      ? (val = true)
      : (val = false);
    return val;
  }
  selectDefault(event, code, field) {
    if (!this.procFormModel.selecteddoctypes.find((a) => a.code === code)) {
      this.documentTypes
        .filter((a) => a.code === code)
        .map((e) => {
          const obj = {
            code: e.code,
            name: e.foldername,
            selected: true,
            uploadable: true,
          };
          this.procFormModel.selecteddoctypes.push(obj);
        });
      this.procFormModel.selecteddoctypes.push();
    }
    this.procFormModel.selecteddoctypes.find((a) => a.code === code)[field] =
      event.checked;
  }

  fetchDefault(obj) {
    this.formVariable.name = obj.value;
    const v = this.allVars.find((a) => a.name === this.formVariable.name);
    this.selectedVariable = v;
    if (this.selectedVariable?.system) {
      this.toastrSvc.info(
        'You have selected a system variable. System variable will have fixed values'
      );
    }
    if (v?.datatype === 'Boolean') {
      return (this.formVariable.defaultvalue = true);
    } else {
      return (this.formVariable.defaultvalue = null);
    }
  }

  addVariables() {
    const obj = JSON.parse(JSON.stringify(this.formVariable));
    this.procFormModel.variables.push(obj);
    this.allVars = this.allVars.filter(
      (a) => a.name !== this.formVariable.name
    );
    this.formVariable = {
      name: '',
      ismandatory: true,
      defaultvalue: null,
      visible: true,
      readonly: false,
    };
  }

  deleteVariable(variable) {
    this.procFormModel.variables = this.procFormModel.variables.filter(
      (a) => a !== variable
    );
    const addVar = this.allVars.find((a) => a.name === variable.name);
    this.ddvars.push(addVar);
    this.ddvars = this.ddvars.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  changeVarField(event, opt, i) {
    this.procFormModel.variables[i][opt] = event.checked;
    if (opt == 'visible') {
      if (this.procFormModel.variables[i].varValues?.length) {
        this.procFormModel.variables[i].values = this.procFormModel.variables[i].varValues;
      } else if (this.procFormModel.variables[i].values?.length) {
        this.procFormModel.variables[i].varValues = this.procFormModel.variables[i].values;
      }

      this.procFormModel.variables[i].values = this.procFormModel.variables[i].varValues?this.procFormModel.variables[i].varValues:this.procFormModel.variables[i].values;
    }
    // console.log(">>>>>",this.procFormModel.variables[i],this.procFormModel.variables[i].varValues,this.procFormModel.variables[i].values)
  }

  moveup(id, data) {
    const obj = this.procFormModel.variables[id - 1];
    this.procFormModel.variables[id] = obj;
    this.procFormModel.variables[id - 1] = data;
  }

  back() {
    let path;
    this.routeId ? (path = '../../') : (path = '../');
    this.router.navigate([path], { relativeTo: this.actRoute });
  }

  checkForSystemVar(variable) {
    const sysVar = this.allVars.find((a) => a.name === variable).system;
    return sysVar !== undefined ? sysVar : false;
  }

  trimFields(field) {
    this.procFormModel[field] = this.procFormModel[field].trim();
  }
  unsetReviewable() {
    this.procFormModel.assignable = !this.procFormModel.assignable;
    this.procFormModel.reviewable = false;
    this.reviewingGroup = [];
  }
  unsetAssignable() {
    this.procFormModel.reviewable = !this.procFormModel.reviewable;
    this.procFormModel.assignable = false;
    this.assigningGroup = [];
  }
}

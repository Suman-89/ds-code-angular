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
import { GeneralSettingsService } from '../../../../../core/_services/general-settings.service';
import { ProcessVariableService } from '../../../process-variable/_services/process-variable.service';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  ReviewTaskConstant,
  TaskDocumentModel,
} from 'src/app/feature/process/layout/_models';
import { SharedService } from 'src/app/core/_services';

@Component({
  selector: 'app-add-process-forms',
  templateUrl: './add-process-forms.component.html',
  styleUrls: ['./add-process-forms.component.scss'],
  providers: [NgbDropdownConfig],
})
export class AddProcessFormsComponent implements OnInit {
  allVars: ProcessVariableModel[];
  ddvars: ProcessVariableModel[];
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
  groups: GroupModel[];
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

  constructor(
    private procVarSvc: ProcessVariableService,
    private procFormSvc: GeneralSettingsService,
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
    let selectedProcess = JSON.parse(localStorage.getItem('selected-process'));

    this.fileUplSvc
      .getAllDocCategory(selectedProcess?.key)
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
            this.procFormModel.selecteddoctypes.forEach((e) => {
              this.documentTypes.find((a) => a.code === e.code).selected =
                e.selected;
              this.documentTypes.find((a) => a.code === e.code).uploadable =
                e.uploadable;
            });
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

  getGroups() {
    this.userSvc.getUserGroups().subscribe((r) => {
      if (r.status) {
        this.groups = r.data;
        this.getProcFormKey();
      }
    });
  }
  // autoFillDisplayName(){
  //  if (this.procFormModel.displaytitle.length === 0) {
  //    this.procFormModel.displaytitle = this.procFormModel.name ;
  //  }
  // }
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
          ).name;
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
    console.log(event);
  }
  mapToGroups(obj) {
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
          this.procFormModel.feedbackVariableMaps.push(obj);
        });
    }
  }

  save() {
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
  /////////////////////////////
  setAssignable(event) {
    this.procFormModel.assignable = event.checked;
  }
  /////////////////////////////
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

  fetchDefault() {
    const v = this.allVars.find((a) => a.name === this.formVariable.name);
    this.selectedVariable = v;
    if (this.selectedVariable.system) {
      this.toastrSvc.info(
        'You have selected a system variable. System variable will have fixed values'
      );
    }
    if (v.datatype === 'Boolean') {
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

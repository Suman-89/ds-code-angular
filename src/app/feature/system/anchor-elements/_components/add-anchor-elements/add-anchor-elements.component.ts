import { FileUploadService } from '../../../../../core/_services/file-upload.service';
import { RefDataService } from '../../../reference-data/_services/refdata/ref-data.service';
import {
  AnchorFormModel,
  ProcessVariableModel,
  AnchorVariableModel,
  InstanceModel,
  ProcFormDoclistDropdownModel,
  NameModel,
  ProcessFormModel,
} from 'src/app/core/_models';

import { GroupModel } from '../../../../user-management/_models';
import { UserService } from 'src/app/core/_services/user.service';
import { FormLayoutTypeEnum } from '../../../../../core/_models/shared/types.enum';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AnchorElementService } from '../../_services/anchor-element.service';
import { ProcessVariableService } from '../../../process-variable/_services/process-variable.service';
import { Component, OnInit,OnChanges,SimpleChanges } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  ReviewTaskConstant,
  TaskDocumentModel,
} from 'src/app/feature/process/layout/_models';
import { SharedService } from 'src/app/core/_services';
import { FormControl, FormGroup } from '@angular/forms';
import { TaskActionService } from 'src/app/feature/process/layout/_services';

@Component({
  selector: 'app-add-anchor-elements',
  templateUrl: './add-anchor-elements.component.html',
  styleUrls: ['./add-anchor-elements.component.scss'],
  providers: [NgbDropdownConfig],
})
export class AddAnchorElementsComponent implements OnInit {
  allVars: ProcessVariableModel[];
  metaDataVars;
  ddvars: ProcessVariableModel[];
  ddVarNames = [];
  reviewTaskEnum = new ReviewTaskConstant().reviewGroupMap;

  anchorFormModel:AnchorFormModel={
	description: "",
	processNames: [],
	anchorType: "",
  anchorTypeDisplay: "",
  anchorConfigId:"",
  anchorConfigDisplayName: "",
	folderDisplayVar: null,
	searchMetadataVars: [],
	workflowDisplayVar: null,
  sections: [],
  basicSettingsVars: [],
  basicVarsDisplayType: '',
  toolTipMetaData:[],
	identifierGenParams: {},
  }

  multiMentionConfig = this.anchorEleSvc.multiMentionConfig;
  
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
  formVariable:AnchorVariableModel = {
    variableName: "",
		variableType: "",
		isVisible: true,
		isMandatory: true,
		isReadOnly: true,
		expiryTerm: ""
  };
  sectionVariable: AnchorVariableModel = {
    variableName: "",
		variableType: "",
		isVisible: true,
		isMandatory: true,
		isReadOnly: true,
		expiryTerm: ""
  }
  groupSetting = { label: 'name', value: 'name' };
  tabSettings = { label: 'variableName', value: 'variableName' };
  variableSetting = { label: 'name', value: 'name', position: 'top' };
  allProcesses;
  formValue = '';
  vendorsapIds = [];
  anchorTypesList=[
    { name: 'Employ', value: 'employ' },
    { name: 'Job Applicant', value: 'job applicant' },
    { name: 'Deals', value: 'deals' },
    { name: 'Company', value: 'company' }
  ];
  sections=[]
  groups = [] as GroupModel[];
  reviewingGroup = [] as GroupModel[];
  reviseGroup = [] as GroupModel[];
  rejectGroup = [] as GroupModel[];
  ////////////////////////////////
  assigningGroup = [] as GroupModel[];
  //////////////////////
  tabNames = [];
  labelAlignmentTypes = [];
  header = 'Add Anchor Element';
  metaDataSetting = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    idField: 'variableName',
    textField: 'variableName',
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
    private anchorEleSvc: AnchorElementService,
    private router: Router,
    private userSvc: UserService,
    private actRoute: ActivatedRoute,
    private toastrSvc: ToastrService,
    private refdataSvc: RefDataService,
    private sharedSvc: SharedService,
    private fileUplSvc: FileUploadService,
    private taskActionSvc: TaskActionService,
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
    this.allProcesses = this.sharedSvc.allProcessData.filter((i) => i.processDef.isVisible).map((process) => process.processname); 
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
      this.procFormModel.processNames?.includes('Initiation Content Creation') ||
      this.procFormModel.processNames?.includes('Initiation RCM Billing Process')
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

  onDropDownClose(item: any) {
    this.tabNames = this.sharedSvc.allProcessData.find(i=>i.processname == this.procFormModel.processNames?.[0])?.processDef?.tabSettings?.filter(i=>i.isVisible)
  }

  getDefaultTabNames() {
    this.tabNames = this.sharedSvc.allProcessData.find(i=>i.processname == this.procFormModel.processNames?.[0])?.processDef?.tabSettings?.filter(i=>i.isVisible)
    this.getGroups();
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
    const selectedVar = this.anchorFormModel.basicSettingsVars.find(i => i.variableName == obj.value)
    if (obj.id == 'folder') {
      this.anchorFormModel.folderDisplayVar = selectedVar;
    } else if (obj.id == 'workflow') {
      console.log("From workflowDisplayVar")
      this.anchorFormModel.workflowDisplayVar = selectedVar;
    }
    console.log('anchorFormModel', obj,selectedVar,this.anchorFormModel);
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
      this.anchorEleSvc.getAllProcFormsbyId(this.routeId).subscribe((resp) => {
        this.anchorFormModel = resp.data;
        // this.procFormModel.variables.forEach((a) => {
        //   a.defaultvalue = a.value;
        //   a.ismandatory = a.mandetory;
        // });
        // this.anchorFormModel.defaulttab
        //   ? (this.anchorFormModel.defaulttab = this.anchorFormModel.defaulttab)
        //   : (this.anchorFormModel.defaulttab = this.tabNames.find(
        //       (t) => t.name === 'Info'
        //     ));

        // if (this.anchorFormModel.groupid) {
        //   this.anchorFormModel.groupname = this.groups.find(
        //     (a) => a.id === this.anchorFormModel.groupid
        //   )?.name;
        // }

        // !this.anchorFormModel.formtype
        //   ? (this.anchorFormModel.formtype = '')
        //   : null;
        this.getAllVars();
        // this.reviewingGroup = this.populateReviewingGroup(
        //   this.anchorFormModel.reviewgroups
        // );
        // this.reviseGroup = this.populateReviewingGroup(
        //   this.anchorFormModel.revisegroups
        // );
        // this.rejectGroup = this.populateReviewingGroup(
        //   this.anchorFormModel.rejectgroups
        // );
        // ////////////////////////
        // this.assigningGroup = this.populateReviewingGroup(
        //   this.anchorFormModel.assigngroups
        // );
        ///////////////////////
        // this.getDocCategories();
        this.header = 'Anchor Elements ';
      });
    } else {
      this.getAllVars();
      // this.getDocCategories();
      this.anchorFormModel = {
        description: "",
        processNames: [],
        anchorConfigId:'',
        anchorConfigDisplayName:'',
        folderDisplayVar: null,
        searchMetadataVars: [],
        workflowDisplayVar: null,
        sections: [],
        basicSettingsVars: [],
        basicVarsDisplayType: '',
        toolTipMetaData:[],
        identifierGenParams: {},
      };
    }
  }
  getAllVars() {
    this.anchorEleSvc.getAllProcessVariables().subscribe((r) => {
      this.allVars = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.ddvars = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
      
      this.metaDataVars = this.ddvars.map(i => ({
				variableName: i.name,
				variableType: i.datatype,
				isVisible: i.visible,
				isMandatory: i.mandetory?i.mandetory:i.ismandatory,
				isReadOnly: i.readonly,
				expiryTerm: 0
      }));

      console.log("CONFIG ",this.multiMentionConfig)
      if (this.anchorFormModel.basicSettingsVars?.length > 0) {
        this.anchorFormModel.basicSettingsVars.forEach((v) => {
          this.ddvars = this.ddvars.filter((a) => a.name !== v.variableName);
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
    // this.procFormModel.groupid = this.groups.find(
    //   (a) => a.name === this.procFormModel.groupname
    // ).id;
    // this.mapFeedbackVariables();
    this.anchorFormModel.searchMetadataVars = this.metaDataVars.filter(i=> this.anchorFormModel.searchMetadataVars.map(i=>i.variableName).includes(i.variableName))
    this.anchorFormModel.toolTipMetaData = this.metaDataVars.filter(i => this.anchorFormModel.toolTipMetaData.map(i => i.variableName).includes(i.variableName))
    console.log("ANCHOR FORM MODEL ==>",this.anchorFormModel.searchMetadataVars,this.anchorFormModel.toolTipMetaData)
    this.anchorEleSvc[servName](this.anchorFormModel).subscribe((resp) => {
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
    this.formVariable.variableName = obj.value;
    const v = this.allVars.find((a) => a.name === this.formVariable.variableName);
    this.selectedVariable = v;
    this.formVariable.variableType = v.datatype;
    if (this.selectedVariable?.system) {
      this.toastrSvc.info(
        'You have selected a system variable. System variable will have fixed values'
      );
    }

    // if (v?.datatype === 'Boolean') {
    //   return (this.formVariable.defaultvalue = true);
    // } else {
    //   return (this.formVariable.defaultvalue = null);
    // }
  }

  fetchSelectionDefault(obj) {
    this.sectionVariable.variableName = obj.value;
    const v = this.allVars.find((a) => a.name === this.sectionVariable.variableName);
    this.selectedVariable = v;
    this.sectionVariable.variableType = v.datatype;
    if (this.selectedVariable?.system) {
      this.toastrSvc.info(
        'You have selected a system variable. System variable will have fixed values'
      );
    }
  }

  addVariables() {
    // const obj = JSON.parse(JSON.stringify(this.formVariable));
    if (!this.anchorFormModel.basicSettingsVars) {
      this.anchorFormModel.basicSettingsVars= []
    }
    this.anchorFormModel.basicSettingsVars.push(this.formVariable);
    console.log("VAR ",this.formVariable,this.anchorFormModel)
    this.allVars = this.allVars.filter(
      (a) => a.name !== this.formVariable.variableName
    );
    this.formVariable = {
      variableName: "",
      variableType: "",
      isVisible: true,
      isMandatory: true,
      isReadOnly: true,
      expiryTerm: ""
    } as AnchorVariableModel;
  }

  addSectionVariables(id) {
    if (!this.anchorFormModel.sections[id].sectionVariables) {
      this.anchorFormModel.sections[id].sectionVariables = []
    }
    this.anchorFormModel.sections[id].sectionVariables.push(this.sectionVariable);
    this.sectionVariable = {
      variableName: "",
      variableType: "",
      isVisible: true,
      isMandatory: true,
      isReadOnly: true,
      expiryTerm: ""
    } as AnchorVariableModel;
  }

  addSection() {
    const sectionItem = {
      sectionId: Math.floor(Math.random() * 10000000) + 100000,
      sectionName: "",
      sectionVariables: []
    };
    this.anchorFormModel.sections.push(sectionItem);
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
    const obj = this.anchorFormModel.searchMetadataVars[id - 1];
    this.anchorFormModel.searchMetadataVars[id] = obj;
    this.anchorFormModel.searchMetadataVars[id - 1] = data;
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

  trimFields(value) {
    // this.procFormModel[field] = this.procFormModel[field].trim();
    if (!this.routeId && value) {
      this.anchorEleSvc.lematizeId(value).subscribe((resp) => {
        this.anchorFormModel.anchorConfigId = resp.data;
      });
    }
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
  
  onUniqueIdSubmitted(htmlstring) {
    console.log("EVENT!")
  var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'].trim();
    const variablePattern = /[^{\}]+(?=})/g;
    const extractParams = subjectline.match(variablePattern);
    
    console.log("SUBJECTLINE----------",subjectline)
    console.log('**********************', htmlDoc,htmlstring);
    console.log('**********************extractParams', extractParams);
         
    let filteredVars = this.metaDataVars.filter(i => extractParams?.includes(i.variableName));
    console.log("FILTERED VARS ",filteredVars)
    this.anchorFormModel.identifierGenParams.varText = subjectline;
    this.anchorFormModel.identifierGenParams.varHtml = htmlstring;
    this.anchorFormModel.identifierGenParams.variables = filteredVars; 
  }
}

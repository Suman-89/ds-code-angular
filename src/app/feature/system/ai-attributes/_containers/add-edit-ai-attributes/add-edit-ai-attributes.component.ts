import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileUploadService } from '../../../../../core/_services/file-upload.service';
import { RefDataService } from '../../../reference-data/_services/refdata/ref-data.service';
import { UserService } from 'src/app/core/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AiAttributeService } from '../../_services/ai-attribute.service';
import { ProcessVariableService } from '../../../process-variable/_services/process-variable.service';
import { SharedService } from 'src/app/core/_services';
import { Subscription } from 'rxjs';
import {
  GridToolbarType,
  ProcessVariableModel,
  TagType,
  TemplateContentType,
} from 'src/app/core/_models';
import { GroupModel } from 'src/app/feature/user-management/_models';
import { ConfirmModalComponent } from '../../_modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-edit-ai-attributes',
  templateUrl: './add-edit-ai-attributes.component.html',
  styleUrls: ['./add-edit-ai-attributes.component.scss'],
})
export class AddEditAiAttributesComponent implements OnInit, OnDestroy {
  @ViewChild('commentBox') commentBox;
  procDefForm;
  DMSSettings;
  procDefs = [];
  variables = { allvars: [], filteredvars: [] };
  subscription: Subscription[] = [];
  selectedVars = {
    all: [] as ProcessVariableModel[],
    displaySelectedVars: [] as ProcessVariableModel[],
  };
  groups;
  tagUsers;
  editId;
  toolbarButtons;
  processName = '';
  activeTab = 'ticketTypes';
  sideNavItems = [];
  roles = [];
  rolesArray = ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'GUEST_USER'];
  businessKeyVariable = [];
  processButtonMap;
  newButtonCategory = '';
  settingTabs = [];
  applicableToAll;
  notificationTemplateSettings;
  processNameSetting = { label: 'value', value: 'value' };
  multiMentionConfig = {
    mentions: [],
  };
  showCommentBox = true;
  templateType = TemplateContentType;
  defaultEmailConfig = {};

  constructor(
    private procVarSvc: ProcessVariableService,
    private aiAttributeSvc: AiAttributeService,
    private router: Router,
    private userSvc: UserService,
    private actRoute: ActivatedRoute,
    private toastrSvc: ToastrService,
    private refdataSvc: RefDataService,
    private sharedSvc: SharedService,
    private fileUplSvc: FileUploadService,
    private modalSvc: NgbModal,
  ) {}

  ngOnInit(): void {

    // ai attribute init props 
    this.getRegionRefData();
    this.getGroups();
    this.getRoles();
    this.getAllVariables();
    this.getUsers();
    this.editId = this.actRoute.snapshot.paramMap.get('id');
    
    this.subscription.push(
      this.sharedSvc.groups$.subscribe((a) => {
        if (a.length > 0) {
          this.groups = a;
        } else {
          this.sharedSvc.getGroups();
        }
      })
    );
    this.aiAttributeSvc.getProcessMap().subscribe((value) => {
      this.settingTabs = value['aiAttributeTabs'];
    });
     
    this.getProcessDefinition();
    this.getTicketType();
    this.getRemedyGroups();
    this.getRemedyDelimiterFilter();
  }

  public getComment() {
    return this.commentBox.getComment();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.procDefForm.sideNavItemList,
      event.previousIndex,
      event.currentIndex
    );
  }

  mapProcessName(val) {
    return this.processButtonMap.find((item) => item.id == val)
      ? this.processButtonMap.find((item) => item.id == val).name
      : '';
  }
  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }
  getProcDefFormByName(name) {
    this.aiAttributeSvc.getProcDefbyName(name).subscribe((r) => {
      
      if (r.status) {
        let obj = r.data;
        this.aiGroups = obj.participatingGroups;
        console.log("Ai Groups",this.aiGroups)
        obj.variables.forEach((p) => {
          let obj = this.variables.allvars.find((a) => a.name === p);
          this.selectedVars.all.push(obj);
          this.selectedVars.displaySelectedVars.push(obj);
        });
        this.applicableToAll.forEach((item) => {
          this.selectedVars.all.includes(item) ||
            this.selectedVars.all.push(item);
        });
        this.selectedVars.displaySelectedVars =
          this.selectedVars.displaySelectedVars.filter(
            (item) => !item?.applicableToAll
          );
        this.selectedVars.displaySelectedVars =
          this.selectedVars.displaySelectedVars.filter((item) => item);
        this.selectedVars.all = this.selectedVars.all.filter((item) => item);
        this.selectedVars.displaySelectedVars.sort((a, b) =>
          a.displaylabel > b.displaylabel ? 1 : -1
        );
        this.selectedVars.all.sort((a, b) =>
          a.displaylabel > b.displaylabel ? 1 : -1
        );

        this.procDefForm = obj;

        if (
          !this.procDefForm?.gridsettings ||
          this.procDefForm?.gridsettings?.length === 0
        ) {
          this.procDefForm.gridsettings = [];
        }
       
        this.selectedVars.all == this.selectedVars.all.filter((item) => item);
        // console.log("ALL VARS-------------",  this.selectedVars.displaySelectedVars,this.selectedVars.all);
        // console.log("selectedVars----",this.selectedVars.all)
        this.businessKeyVariable = this.variables.filteredvars.filter(
          (i) =>
            (i.processNames &&
              i?.processNames?.includes(this.procDefForm.processname)) ||
            i.applicableToAll
        );
        this.getApplicableRoles();
      }
    });
  }

  getApplicableRoles() {
    this.roles.forEach((role) => {
      this.procDefForm.participatingGroups?.forEach((group) => {
        if (
          role.groups.includes(group.id) &&
          !this.rolesArray.includes(role.name)
        ) {
          this.rolesArray = [...this.rolesArray,role.name];
        }
      });
    });
    // console.log("ROLES>>>>>>>>>>>>>>>",this.rolesArray)
  }

  setVisibleTab(tab) {
    this.activeTab = tab;
  }



  getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.tagUsers = a.data;
      this.multiMentionConfig.mentions.push({
        items: this.tagUsers,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
    });
  }

  getAllVariables() {
    this.subscription.push(
      this.procVarSvc.getAllProcessVariables().subscribe((resp) => {
        if (resp.status) {
          this.variables.allvars = resp.data.sort((a, b) =>
            a.displaylabel > b.displaylabel ? 1 : -1
          );
          this.variables.filteredvars = resp.data.sort((a, b) =>
            a.displaylabel > b.displaylabel ? 1 : -1
          );
          this.applicableToAll = this.variables?.allvars.filter(
            (a) => a.applicableToAll
          );
          this.applicableToAll.sort((a, b) =>
            a.displaylabel > b.displaylabel ? 1 : -1
          );
          if (this.editId) {
            this.getProcDefFormByName(this.editId);
          }

          this.allDesVariables = this.variables.allvars.filter(p => p.processNames?.includes(this.editId) && p.datatype == "Boolean");
          console.log("ALL VARIABLES ",this.allDesVariables)
          this.multiMentionConfig.mentions.push({
            items: this.variables.allvars,
            triggerChar: '$',
            insertHtml: true,
            labelKey: 'name',
            mentionSelect: this.insertVariableTagHtml,
          });
        }
      })
    );
  }

  getProcessDefinition() {
    this.subscription.push(
      this.sharedSvc.getAllProcessDefinintion().subscribe((res) => {
        if (res.status) {
          Object.keys(res.data).forEach((r) => {
            this.procDefs.push({
              key: r.trim(),
              value: res.data[r.trim()].trim(),
            });
          });
          this.procDefs.sort((a, b) => (a.value > b.value ? 1 : -1));
        }
      })
    );
  }

  addGrpAuthRow() {
    this.procDefForm.authorization.groups.push({
      key: '',
      initiation: false,
      showgroupq: true,
    });
  }
 
  usergroups: GroupModel[];
  getGroups() {
    this.userSvc.getUserGroups().subscribe((r) => {
      if (r.status) {
        this.usergroups = r.data;
      }
    });
  }
 
  getRoles() {
    this.userSvc.getUserRoles().subscribe((r) => {
      this.roles = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }

  public insertVariableTagHtml(variable) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${variable.name}" data-tagtype="${TagType.VARIABLE}"
      contenteditable="false"
      >{${variable.name}}</span>`;
  }
  public insertUserTagHtml(user) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${user.userid}" data-tagtype="${TagType.USER}"
      contenteditable="false"
      >${user.fullname}</span>`;
  }

  /// ai properties ------------------->
   ticketDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    // idField: 'id',
    // textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };

  keywords = [];
  remedyGroup = [];
  newKeyword = '';
  aiGroups;
  ticketTypes;
  multiSelectTicketTypes;
  selectedAiGroup;
  selectedTicketType;
  selectedTicketTypes;
  selectedFilterType;
  selectedDecisionVariable;
  selectedDecisionVarObj;
  refDataSetting = { label: 'name', value: 'name' };
  desDataSetting = { label: 'displaylabel', value: 'name' };
  emailFilterTypes = [
    { name: 'DOMAIN', displaylabel: "Email Domain" },
    { name: 'EMAILIDS', displaylabel: "Unique Email" },
    { name: 'BODYKEYWORDS', displaylabel: "Keyword From Body" },
    {name:'SUBJECTKEYWORDS',displaylabel:"Keyword From Subject"}
  ]
  newDelimiter;
  newFilter;
  allDesVariables;
  allDelimiters = [];
  emptyFilterDelimiters = {
    "processName": this.actRoute.snapshot.paramMap.get('id'),
    "delimiters": [],
    "filterList": [
      {
        "filterType": "DOMAIN",
        "filterStrings": []
      },
      {
        "filterType": "EMAILIDS",
        "filterStrings": []
      },
      {
        "filterType": "BODYKEYWORDS",
        "filterStrings": []
      },
      {
        "filterType": "SUBJECTKEYWORDS",
        "filterStrings": []
      }
    ]
  }
  allFiltersDelimiters;
  activeFilters;
  activeKeyword;
  gridType = GridToolbarType;
  getTicketType(ticketType?) {
    this.aiAttributeSvc.getTicketType(this.editId).subscribe((resp) => {
      // console.log("RESPONSE ", resp.data)
      this.keywords = resp.data;
      if (ticketType) this.activeKeyword = this.keywords.find(i=>i.ticketType == ticketType)?.keywords
    });
  }
  getRemedyGroups() {
    this.aiAttributeSvc.getRemedyGroups(this.editId).subscribe((resp) => {
      // console.log("RESPONSE ", resp.data)
      this.remedyGroup = resp.data;
      
    });
  }

  getRemedyDelimiterFilter() {
    this.aiAttributeSvc.getRemedyDelimiterFilter(this.editId).subscribe((resp) => {
      console.log("getRemedyDelimiterFilter RESPONSE ", resp.data)
      if (!resp.data?.length) {
        console.log("EMPTY TEST")
        this.allFiltersDelimiters = this.emptyFilterDelimiters
      } else {
        this.allFiltersDelimiters = resp.data[0]
      }
       console.log("getRemedyDelimiterFilter RESPONSE ", this.allFiltersDelimiters)
      
    });
  }

  addKeyword() {
    const allKeywordsEntered = this.newKeyword.trim().replace("|",',').split(/,/).filter(i=>i);
    console.log("KWD ", this.keywords, this.newKeyword,allKeywordsEntered );
    if (this.newKeyword && this.selectedTicketType) {
      if (allKeywordsEntered) {
        const data = {
          "ticketType": this.selectedTicketType,
          "keywordsToBeAdded":allKeywordsEntered,
          "keywordsToBeRemoved":[],
          "processName":this.editId
        }
        console.log("DATA ",data)
        this.aiAttributeSvc.saveTicketType(data).subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Keyword Added!');
          this.getTicketType(this.selectedTicketType);
        }
        });
      } 
      this.newKeyword = '';
    }
  }
  
  deleteKeyword(al) {
     if (al) {
      const data = {
        "ticketType": this.selectedTicketType,
        "keywordsToBeAdded":[],
        "keywordsToBeRemoved":[al],
        "processName":this.editId
      }
      console.log("DATA ",data)
      this.aiAttributeSvc.saveTicketType(data).subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Keyword Removed!');
          this.getTicketType(this.selectedTicketType);
        }
      });
    }
    
  }

  deleteTicketType(ticketType) {
     console.log(
      'DLT ',
     ticketType
    );
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = {name:ticketType};
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      if (r.name) {
        this.aiAttributeSvc.deleteTicketType(r.name,this.editId).subscribe((resp) => {
          console.log("RESPONSE ", resp.data)
          if (resp.status) {
            this.toastrSvc.warning(`Deleted ${r.name}!`);
            this.activeKeyword=[]
            this.getTicketType();
          }
        });
      }
      modalRef.close();
    });
  }
  
  
  getRegionRefData() {
    this.refdataSvc.getInstances('ETT',true).subscribe((resp) => {
      this.ticketTypes = resp.data;
      this.multiSelectTicketTypes = resp.data.map(i => i.name);
    });
    
  }
  setTicketTypes(obj) {
    // const [type, id] = obj.id.split('-');
    this.selectedTicketType = obj.value;
    this.activeKeyword = this.keywords.find(i=>i.ticketType == this.selectedTicketType)?.keywords
  }
  
  setAiGroupTypes(obj) {
    this.selectedAiGroup = obj.value
  }
  setDecisionVariable(obj) {
    if (obj.value) {
      const slectedVar = this.allDesVariables.find(i => i.name == obj.value);
      this.selectedDecisionVariable = obj.value;
      this.selectedDecisionVarObj = {id:slectedVar.name,name:slectedVar.displaylabel}
    }
  }
  addRemedyGroup() {
    if (this.selectedAiGroup && this.selectedTicketTypes && this.selectedDecisionVariable) {
      const data = {
        "groupName":this.selectedAiGroup,
        "ticketTypesToBeAdded":this.selectedTicketTypes,
		    "ticketTypesToBeRemoved":[],
        "decisionVariable":this.selectedDecisionVarObj.id,
        "decisionVariableName": this.selectedDecisionVarObj.name,
        "processName":this.editId
        }
        this.aiAttributeSvc.saveRemedyGroups(data).subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Remedy Group Added!');
          this.getRemedyGroups();
        }
        });
    }
  }
  deleteRemedyGroup(groupName) {
    console.log(
      'DLT ',
     groupName
    );
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = {name:groupName};
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      if (r.name) {
        this.aiAttributeSvc.deleteRemedyGroup(r.name,this.editId).subscribe((resp) => {
          console.log("RESPONSE ", resp.data)
          if (resp.status) {
            this.toastrSvc.warning(`Deleted ${r.name}!`);
            this.getRemedyGroups();
          }
        });
      }
      modalRef.close();
    });
  }
  addDelimiter() {
    
    if (this.newDelimiter) {
      this.allFiltersDelimiters.delimiters.push(this.newDelimiter);
      this.newDelimiter = '';
      console.log("AADDDD", this.newDelimiter, this.allFiltersDelimiters.delimiters)
      this.saveRemedyDelimiterFilter();
    }
    
  }
  deleteDelimiter(item) {
    console.log("ON DEL DELETED ", item)
    this.allFiltersDelimiters.delimiters = this.allFiltersDelimiters.delimiters.filter(i => i != item);
    this.saveRemedyDelimiterFilter();
  }
  setFilterTypes(obj) {
    this.selectedFilterType = obj.value;
    this.activeFilters = this.allFiltersDelimiters.filterList.find(i=> i.filterType == this.selectedFilterType ).filterStrings;
  }
  addFilters() {
    const allKeywordsEntered = this.newFilter.trim().replace("|", ',').split(/,/).filter(i => i.trim());
    let valid = true
    console.log("KWD ", this.keywords, this.newFilter,allKeywordsEntered );
    if (allKeywordsEntered && this.selectedFilterType) {
      if (this.selectedFilterType == "DOMAIN") {
        allKeywordsEntered.forEach(email => {
          const urlRegex = /^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g;
          if (!email.trim().match(urlRegex)) {
            this.toastrSvc.warning(email + ' is not a valid Domain ');
            valid = false;
            return;
          }
        })
        
      }
      
      if (this.selectedFilterType == 'EMAILIDS') {
        allKeywordsEntered.forEach(email => {
          if (!email.trim().match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
            this.toastrSvc.warning(email + ' is not a valid Email ID ');
            valid = false;
            return;
          }
        })
      } 
      
      if (valid) {
        this.allFiltersDelimiters.filterList.forEach((filterItem) => {
        if (filterItem.filterType == this.selectedFilterType) {
          filterItem.filterStrings =[...filterItem.filterStrings,...allKeywordsEntered]
        }
      })
      console.log("DATA ", this.allFiltersDelimiters);
      this.saveRemedyDelimiterFilter();
      this.activeFilters = this.allFiltersDelimiters.filterList.find(i=> i.filterType == this.selectedFilterType ).filterStrings;
       
      this.newFilter = '';
      }
      
      
    }
  }
  deleteFilterItem(item) {
    this.allFiltersDelimiters.filterList.forEach(i => {
        if (i.filterType == this.selectedFilterType) {
          i.filterStrings = i.filterStrings.filter(i=>i != item)
        }
      }
    );
    console.log("DATA ", this.allFiltersDelimiters);
    this.saveRemedyDelimiterFilter();
    this.activeFilters = this.allFiltersDelimiters.filterList.find(i=> i.filterType == this.selectedFilterType ).filterStrings;
  }
  deleteFilterType(filterType) {
    this.allFiltersDelimiters.filterList.forEach(i => {
        if (i.filterType == filterType) {
          i.filterStrings = []
        }
      }
    );
    this.saveRemedyDelimiterFilter();
  }

  saveRemedyDelimiterFilter() {
    this.aiAttributeSvc.saveRemedyDelimiterFilter(this.allFiltersDelimiters).subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Saved!');
          console.log("SAVED ",a.data)
          // this.getRemedyGroups();
        }
        });
  }
}

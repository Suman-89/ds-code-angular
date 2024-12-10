import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileUploadService } from './../../../../../core/_services/file-upload.service';
import { RefDataService } from './../../../reference-data/_services/refdata/ref-data.service';
import { UserService } from 'src/app/core/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcessFormsService } from './../../_services/process-forms.service';
import { ProcessVariableService } from './../../../process-variable/_services/process-variable.service';
import { GeneralSettingsService, SharedService } from 'src/app/core/_services';
import { Subscription } from 'rxjs';
import {
  ProcessVariableModel,
  TagType,
  TemplateContentType,
} from 'src/app/core/_models';
import {
  GridSetterColumnModel,
  GridTypeSetterEnum,
} from '../../_models/procdef.model';
import { GroupModel } from 'src/app/feature/user-management/_models';
import { ConfirmModalComponent } from './../../_modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-procdef-form',
  templateUrl: './add-edit-procdef-form.component.html',
  styleUrls: ['./add-edit-procdef-form.component.scss'],
  providers: [NgbDropdownConfig],
})
export class AddEditProcdefFormComponent implements OnInit, OnDestroy {
  @ViewChild('commentBox') commentBox;
  @ViewChild('gqSetInst') gqSetInst;
  @ViewChild('qSetInst') qSetInst;
  uploadableChecked: boolean = false;
  selectedChecked: boolean = false;

  //used to make themes(start)

  files = { logo: File, loginLogo: File, favicon: File, reportLogo: File };

  previewImageUrls = {
    favicon: '',
    logo: '',
    loginLogo: '',
    reportLogo: '',
  };

  DMSpreviewImageUrls = {
    dmsFavicon: '',
    dmsLogo: '',
    dmsLoginLogo: '',
  };

  DMSfiles = {
    dmsLogo: File,
    dmsLoginLogo: File,
    dmsFavicon: File,
  };

  //used to make themes(end)
  documentList;
  docTypeSettingData;
  documentCalled: boolean;
  docTypeSetting: {
    uploadable: boolean;
    selected: boolean;
    isVisible: boolean;
    name: string;
    code: string;
  }[] = [];
  selectedDocument: Number;
  procDefForm;
  obscurePassword = true;
  DMSSettings;
  procDefs = [];
  variables = { allvars: [], filteredvars: [] };
  subscription: Subscription[] = [];
  myQCols;
  grpQCols;
  qCols = [];
  selectedVars = {
    all: [] as ProcessVariableModel[],
    displaySelectedVars: [] as ProcessVariableModel[],
  };
  groups;
  tagUsers;
  editId;
  toolbarButtons;
  processName = '';
  activeTab = 'descriptions';
  sideNavItems = [];
  roles = [];
  rolesArray = ['SYSTEM_ADMIN', 'SUPER_ADMIN', 'GUEST_USER'];
  screenTypes = ['view', 'list', 'all'];
  businessKeyVariable = [];
  buttonTypes;
  processButtonMap;
  showAddButton = true;
  newButtonCategory = '';
  showAddNotificationButton = true;
  newButtonNotificationCategory;
  settingTabs = [];
  defaultTabSettings = [];
  taskTitleDefaults = [];
  applicableToAll;
  allButtons;
  notificationButtonTypes;
  notificationTemplateSettings;
  processNameSetting = { label: 'value', value: 'value' };
  businessKeySetting = {
    label: 'displaylabel',
    value: 'name',
    position: 'top',
  };

  multiMentionConfig = {
    mentions: [],
  };
  defaultVars = [
    '{frmusername}',
    '{frmuserid}',
    '{taskname}',
    '{loggeduser}',
    '{groupname}',
  ];
  showCommentBox = true;
  templateType = TemplateContentType;
  iconList;
  defaultEmailConfig = {};
  allPrfix: string[] = [];
  // Define the modules array with updated structure
  modules = [
    {
      moduleName: '',
      actions: [
        {
          name: 'add',
          visibleForRoles: [],
        },
        {
          name: 'view',
          visibleForRoles: [],
        },
        {
          name: 'edit',
          visibleForRoles: [],
        },
        {
          name: 'delete',
          visibleForRoles: [],
        },
      ],
    },
  ];

  constructor(
    private procVarSvc: ProcessVariableService,
    private procFormSvc: ProcessFormsService,
    public generalSettingsSvc: GeneralSettingsService,
    private router: Router,
    private userSvc: UserService,
    private actRoute: ActivatedRoute,
    private toastrSvc: ToastrService,
    private refdataSvc: RefDataService,
    private sharedSvc: SharedService,
    private fileUplSvc: FileUploadService,
    private modalSvc: NgbModal,
    config: NgbDropdownConfig
  ) {
    config.autoClose = false;
  }

  ngOnInit(): void {
    this.getGroups();
    this.getRoles();
    this.getDefaultEmailConfig();
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
    this.procFormSvc.getProcessMap().subscribe((value) => {
      // console.log('value', value);
      value.tabs.push({ id: 'theme', name: 'Theme ' });
      this.processButtonMap = value['buttons'];
      this.settingTabs = value['tabs'];
      this.notificationButtonTypes = value['notificationButtons'];
      this.defaultTabSettings = value['tabSettings'];
      this.taskTitleDefaults = value['taskTitleDefaults'];
      console.log('Tab Settings', this.defaultTabSettings);
    });
    this.getDefaultSettings();
    this.getProcessDefinition();
  }

  getDefaultEmailConfig() {
    this.procFormSvc.getGeneralSetting().subscribe((r) => {
      if (r.status) {
        let obj = r.data;
        if (obj) {
          this.defaultEmailConfig = obj.emailConfiguration;
        }
      }
    });
  }
  setDefaultEmailConfig() {
    this.procDefForm.emailConfiguration = this.defaultEmailConfig;
  }
  setDefaultTabSettings() {
    this.procDefForm.tabSettings = this.defaultTabSettings;
    console.log('TAB SETTINGS-------------', this.procDefForm);
  }
  setDefaultTaskTitle() {
    this.procDefForm.titleSettings = this.taskTitleDefaults;
    console.log('TAB SETTINGS-------------', this.procDefForm);
  }

  setDefaultToolbarButton() {
    this.procDefForm.toolBarButtons = this.allButtons;
    this.buttonTypes = Object.keys(this.procDefForm.toolBarButtons);
  }
  setDefaultNotificationEmailConfig(type) {
    this.procDefForm.notificationTemplateSettings[type].emailConfiguration = {
      ...this.procDefForm.emailConfiguration,
      from: null,
      fromname: null,
      host: null,
      maildomain: null,
      password: null,
      port: null,
    };
  }

  getDefaultSettings() {
    this.sharedSvc.getToolbarButtonsAll().subscribe((a) => {
      this.allButtons = a;
    });
    this.procFormSvc.getDMSSettings().subscribe((value) => {
      this.DMSSettings = value.dms_settings;
    });
    this.sharedSvc.getNewSideNav('sideNav').subscribe((resp) => {
      this.sideNavItems = resp;
    });
    this.procFormSvc.getGeneralSettingData().subscribe((value) => {
      this.notificationTemplateSettings = value['notification_content'];
    });
    this.sharedSvc.getAllIcons().subscribe((favIcons) => {
      this.sharedSvc.getCustomIcons().subscribe((customIcons) => {
        this.iconList = [...favIcons.icons, ...customIcons.data];
      });
    });
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

  setDefaultTheme(obj): void {
    this.procFormSvc.editProcDefForm(obj, true).subscribe((res) => {
      if (res.status) {
        this.toastrSvc.success('Default Theme Fetched');
      }
    });
  }

  getProcDefFormByName(name) {
    this.procFormSvc.getProcDefbyName(name).subscribe((r) => {
      if (r.status) {
        let obj = r.data;
        // console.log('Hello', obj.docTypeSettings);
        this.docTypeSettingData = obj.docTypeSettings;

        if (this.docTypeSettingData.length>0) {
          this.getDocumentTypes(true);
        } else {
          this.getDocumentTypes(false);
        }
        
        if (obj.processtype === 'RecA') {
          this.settingTabs.push({
            id: 'jrms',
            name: 'JRMS Setting',
            type: null,
          });
        }

        obj.jrmsSettings !== null
          ? (this.modules = obj.jrmsSettings)
          : this.modules;
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

        //if process definition api 'themes' key is null
        if (!obj.themes) {
          this.generalSettingsSvc.getGeneralSetting().subscribe((res) => {
            obj.themes = [res.data.themes[0]];

            this.previewImageUrls.logo = obj?.themes[0].logoUrl;
            this.previewImageUrls.loginLogo = obj?.themes[0].loginLogoUrl;
            this.previewImageUrls.favicon = obj?.themes[0].faviconUrl;
          });
        } else {
          this.previewImageUrls.logo = obj?.themes[0].logoUrl;
          this.previewImageUrls.loginLogo = obj?.themes[0].loginLogoUrl;
          this.previewImageUrls.favicon = obj?.themes[0].faviconUrl;
        }

        //for themes
        // if (obj?.themes) {
        //   this.previewImageUrls.logo = obj?.themes[0].logoUrl;
        //   this.previewImageUrls.loginLogo = obj?.themes[0].loginLogoUrl;
        //   this.previewImageUrls.favicon = obj?.themes[0].faviconUrl;
        //   // this.DMSpreviewImageUrls.dmsLogo =
        //   //   this.procDefForm.dmsThemes[0].logoUrl;
        //   // this.DMSpreviewImageUrls.dmsLoginLogo =
        //   //   this.procDefForm.dmsThemes[0].loginLogoUrl;
        //   // this.DMSpreviewImageUrls.dmsFavicon =
        //   //   this.procDefForm.dmsThemes[0].faviconUrl;
        //   // this.DMSpreviewImageUrls.dmsFavicon =
        //   //   this.procDefForm.dmsThemes[0].reportLogoUrl;
        // } else {
        //   let { themes, ...others } = obj;
        //   others.themes = this.procDefForm?.themes;
        //   this.procDefForm = others;
        // }

        this.procDefForm = obj;

        if (
          !this.procDefForm?.gridsettings ||
          this.procDefForm?.gridsettings?.length === 0
        ) {
          this.procDefForm.gridsettings = [];
        }
        // console.log("TOOLBAR ", this.procDefForm.toolBarButtons);
        this.buttonTypes = Object.keys(this.procDefForm.toolBarButtons);
        this.notificationButtonTypes = Object.keys(
          this.procDefForm.notificationTemplateSettings
        );
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
        console.log('rolesssss', this.roles);
        console.log('rarray', this.rolesArray);
        console.log(
          'participatingcgroup',
          this.procDefForm.participatingGroups
        );
        this.roles.forEach((role) => {
          // console.log("rolegroup",el.groups)
          this.procDefForm.participatingGroups.forEach((el) => {
            if (role.groups.includes(el.id)) {
              console.log('role', role.name);
            }
          });
        });
        this.procDefForm.participatingGroups.forEach((el) => {
          console.log('formprocdef', el.id, el.name);
        });
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
          this.rolesArray = [...this.rolesArray, role.name];
        }
      });
    });
    // console.log("ROLES>>>>>>>>>>>>>>>",this.rolesArray)
  }

  setVisibleTab(tab) {
    this.activeTab = tab;
  }

  isVisibleToggle() {
    this.procDefForm.isVisible = this.procDefForm.isVisible ? false : true;
  }

  isOfacCheckToggle() {
    this.procDefForm.ofacCheck = this.procDefForm.ofacCheck ? false : true;
  }

  newProcDefForm() {
    this.procDefForm = {
      processkey: '',
      processname: '', // from camunda procs
      description: '',
      processlabel: '', // initiate process label /* help

      variables: [],
      key: {
        // bizkey
        variablename: '',
        prefix: {
          prefixconst: '',
          variable1: '',
          variable2: '',
          variable3: '',
        },
      },
      gridsettings: [
        {
          type: 'MYQ',
          columns: [{ header: '', key: '', width: '', filtertype: '' }],
        },
        {
          type: 'GROUPQ',
          columns: [{ header: '', key: '', width: '', filtertype: '' }],
        },
        {
          type: 'COMPARE',
          columns: [{ header: '', key: '', width: '', filtertype: '' }],
        },
        {
          type: 'INFO',
          columns: [{ header: '', key: '', width: '', filtertype: '' }],
        },
      ],
      authorization: {
        groups: [
          {
            key: '',
            initiation: false,
            showgroupq: true,
          },
        ],
      },
    };
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
          this.variables.allvars = resp.data
            .filter(
              (i) => i.applicableToAll || i.processNames?.includes(this.editId)
            )
            .sort((a, b) => (a.displaylabel > b.displaylabel ? 1 : -1));
          // console.log("ALLLL",this.editId,this.variables.allvars)
          this.variables.filteredvars = this.variables.allvars;
          this.applicableToAll = this.variables?.allvars.filter(
            (a) => a.applicableToAll
          );
          this.applicableToAll.sort((a, b) =>
            a.displaylabel > b.displaylabel ? 1 : -1
          );
          if (this.editId) {
            this.getProcDefFormByName(this.editId);
          } else {
            this.newProcDefForm();
          }

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

  assignProcNameAndKey(value) {
    this.procDefForm.processkey = this.procDefs.find(
      (a) => a.value == value
    ).key;
    this.procDefForm.processname = value;
  }
  addProcDefVars(vars) {
    !this.procDefForm.variables.includes(vars.name)
      ? this.procDefForm.variables.push(vars.name)
      : null;
    !this.selectedVars.all.includes(vars)
      ? this.selectedVars.all.push(vars)
      : null;
    if (!this.selectedVars.displaySelectedVars.includes(vars)) {
      this.selectedVars.displaySelectedVars = [
        ...this.selectedVars.displaySelectedVars.filter((item) => item),
        vars,
      ];
    }
  }

  removeVariables(variable) {
    this.procDefForm.variables = this.procDefForm.variables.filter(
      (a) => a !== variable.name
    );
    this.procDefForm.gridsettings.forEach((element, id) => {
      this.procDefForm.gridsettings[id].columns = element.columns
        .filter((col) => col)
        .filter((col) => col.key != variable.name);
    });
    this.selectedVars.all = this.selectedVars.all.filter(
      (a) => a.name !== variable.name
    );
    this.selectedVars.displaySelectedVars =
      this.selectedVars.displaySelectedVars.filter(
        (a) => a.name !== variable.name
      );
  }

  searchVariables(value, opt) {
    value = value.toLowerCase();
    switch (opt) {
      case 1:
        this.variables.filteredvars = this.variables.allvars.filter((a) =>
          a.displaylabel.toLowerCase().includes(value)
        );
        break;
      case 2:
        this.selectedVars.displaySelectedVars = this.selectedVars.all
          .filter((a) => a.displaylabel.toLowerCase().includes(value))
          .filter((item) => !item?.applicableToAll);
    }
  }

  displayVarLabel(opt) {
    return this.variables.filteredvars.find((a) => a.name == opt).displaylabel;
  }

  selectasBkey(isChecked, vars) {
    this.procDefForm.key.variablename = isChecked ? vars : '';
  }

  grpPropToggle(isChecked, idx, opt) {
    this.procDefForm.authorization.groups[idx][opt] = isChecked;
  }

  addGrpAuthRow() {
    this.procDefForm.authorization.groups.push({
      key: '',
      initiation: false,
      showgroupq: true,
    });
  }
  setGroupKey(ev, idx) {
    this.procDefForm.authorization.groups[idx].key = ev;
  }

  assignVariable(obj) {
    const pvar = 'variable' + obj.id;
    this.procDefForm.key.prefix[pvar] = obj.value;
  }
  setQueryParamVariableName(obj) {
    this.procDefForm.emailConfiguration.queryParamVariableName = obj.value;
  }

  setQueryParamVariableNameNotify(obj) {
    const type = obj.id;
    console.log('NOTIFICATION TYPE ', type);
    this.procDefForm.notificationTemplateSettings[
      type
    ].emailConfiguration.queryParamVariableName = obj.value;
  }
  setScreenTypes(obj) {
    const [type, id] = obj.id.split('-');
    console.log('NOTIFICATION TYPE ', obj, type, id);
    this.procDefForm.toolBarButtons[type][id].forScreens = obj.value;
  }
  setDefaultDMSSetting() {
    this.procDefForm.dmsSettings = this.DMSSettings;
  }
  defaultNotificationForm() {
    var notifyType = Object.keys(this.notificationTemplateSettings);
    this.procDefForm.notificationTemplateSettings =
      this.notificationTemplateSettings;
    this.notificationButtonTypes = Object.keys(
      this.procDefForm.notificationTemplateSettings
    );
    notifyType.forEach((i) => {
      if (
        !this.procDefForm.notificationTemplateSettings[i].emailConfiguration ||
        this.procDefForm.notificationTemplateSettings[i].emailConfiguration
          ?.appurl == null
      ) {
        this.procDefForm.notificationTemplateSettings[i].emailConfiguration =
          this.defaultEmailConfig;
      }
    });
  }
  // save(){
  //   console.log("this.modules", this.modules)
  //   if(this.modules[0].moduleName === ""){
  //   }
  //   console.log("this.modules", this.modules)

  // }
  save() {
    console.log(this.docTypeSetting);
    this.procDefForm.docTypeSettings = [...this.docTypeSetting];

    if (this.modules[0].moduleName === '') {
      this.procDefForm.jrmsSettings = null;
    } else {
      this.procDefForm.jrmsSettings = this.modules;
    }
    let basic =
      Array.isArray(this.procDefForm.gridsettings) &&
      this.procDefForm.gridsettings.find((grid) => grid.type === 'BASIC');
    if (!!basic && Array.isArray(basic?.columns)) {
      if (basic.columns.some((col) => !col.key))
        return this.toastrSvc.warning(
          'Make sure to select a variable for every grid column'
        );
    }

    //filter duplicates
    this.procDefForm.gridsettings.reverse();
    this.procDefForm.gridsettings = this.procDefForm.gridsettings.filter(
      (item, index) =>
        index ===
        this.procDefForm.gridsettings.findIndex((t) => t.type === item.type)
    );
    console.log('gridsettings2', this.procDefForm.dmsSettings);
    console.log(typeof this.procDefForm);

    this.procDefForm.gridsettings?.forEach((type) => {
      // console.log("TYPE ", type);
      type.columns = type.columns?.filter(
        (column) => column.key || column.header
      );
      // console.log("TYPE AFTER FILTER ", type);
    });

    this.procDefForm.accessProcessGroups =
      this.procDefForm?.accessProcessGroups?.map((group) => ({
        id: group.id,
        name: group.name,
        type: group.type,
      }));
    this.procDefForm.accessGroupQueue = this.procDefForm?.accessGroupQueue?.map(
      (group) => ({ id: group.id, name: group.name, type: group.type })
    );

    if (!this.procDefForm?.processname?.length && !this.editId) {
      console.log('PROCESS NAME ', this.procDefForm);
      this.toastrSvc.warning('Select a Process name');
      return;
    }

    // this.procDefForm.notificationTemplateSettings = this.notificationTemplateSettings;
    // this.procDefForm.toolBarButtons = this.allButtons;
    // this.procDefForm.dmsSettings = this.DMSSettings;

    // this.procDefForm.toolBarButtons = {...this.procDefForm.toolbarButtons,"ALLPROCESS":this.allButtons.ALLPROCESS}

    !this.procDefForm.notificationTemplateSettings &&
      this.defaultNotificationForm();
    !this.procDefForm.dmsSettings && this.setDefaultDMSSetting();
    !this.procDefForm.sideNavItemList && this.getNewSideNavData();
    !this.procDefForm.toolBarButtons && this.setDefaultToolbarButton();
    !this.procDefForm.tabSettings && this.setDefaultTabSettings();
    !this.procDefForm.titleSettings && this.setDefaultTaskTitle();

    if (
      !this.procDefForm.emailConfiguration ||
      this.procDefForm.emailConfiguration?.appurl == null
    ) {
      this.setDefaultEmailConfig();
    }

    this.procDefForm.processname = this.procDefForm.processname.trim();
    console.log('PROCESS FORM ', this.procDefForm);
    this.sharedSvc.getWorkflowTypeMaps().subscribe((data) => {
      data.forEach((x) => {
        this.allPrfix.push(x.prefix);
      });
      //add form
      if (!this.editId) {
        if (this.allPrfix.includes(this.procDefForm.key.prefix.prefixconst)) {
          this.toastrSvc.warning('Please give a different prefix');
          return;
        }
        this.procFormSvc.saveProcDefForm(this.procDefForm).subscribe((a) => {
          if (a.status) {
            localStorage.setItem(
              'procDefOfacCheck',
              this.procDefForm.ofacCheck
            );
            this.toastrSvc.success('Created');
            // window.location.reload();
          }
        });
        this.getProcessDefinition();
      }
      //copy form
      if (
        this.actRoute.snapshot.routeConfig.path.search('copy') !== -1 &&
        this.editId
      ) {
        if (this.allPrfix.includes(this.procDefForm.key.prefix.prefixconst)) {
          this.toastrSvc.warning('Please give a different prefix');
          return;
        }
        this.procFormSvc.saveProcDefForm(this.procDefForm).subscribe((a) => {
          if (a.status) {
            this.toastrSvc.success('Created');
          }
        });
      }
      //edit form
      if (
        this.actRoute.snapshot.routeConfig.path.search('edit') !== -1 &&
        this.editId
      ) {
        this.allPrfix = this.allPrfix.filter(
          (x) => x !== this.procDefForm.key.prefix.prefixconst
        );

        if (this.allPrfix.includes(this.procDefForm.key.prefix.prefixconst)) {
          this.toastrSvc.warning('Please give a different prefix');
          return;
        }
        if (
          this.procDefForm.processname === 'Initiation Process Pre-Screening'
        ) {
          let compColumns = this.procDefForm.gridsettings?.find(
            (i) => i.type == 'COMPARE'
          )?.columns;
          compColumns = compColumns.filter((i) => !i.disabled);
          let compHidden = 0;
          compColumns.forEach((el) => {
            if (el.hidden) {
              compHidden++;
            }
          });
          if (compHidden === compColumns.length) {
            this.toastrSvc.warning('Please unhide atleast one variable');
            return;
          }
          // console.log("comphidden" , compHidden)
        }

        this.procFormSvc
          .editProcDefForm(this.procDefForm, false)
          .subscribe((a) => {
            if (a.status) {
              const existingProcessName = JSON.parse(
                localStorage.getItem('selected-process')
              ).name;
              if (existingProcessName == a.data.processname) {
                let tempObj = {
                  key: a.data.processkey,
                  name: a.data.processname,
                  label: a.data.processlabel,
                  sidenavsuffix: a.data.processkey,
                  iconName: a.data.iconColor,
                  cardColor: a.data.cardColor,
                  businessKeyPrefix: a.data.key.prefix.prefixconst,
                  isVisible: a.data.isVisible,
                  participatingGroups: a.data.participatingGroups,
                  tabSettings: a.data.tabSettings,
                };
                localStorage.setItem(
                  'selected-process',
                  JSON.stringify(tempObj)
                );
              }
              localStorage.setItem(
                'procDefOfacCheck',
                this.procDefForm.ofacCheck
              );
              this.toastrSvc.success('Saved');
            }
          });
      }
    });
  }

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
  singleDropdownSettings = {
    singleSelection: true,
    closeDropDownOnSelection: false,
    itemsShowLimit: 1,
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
  usergroups: GroupModel[];
  getGroups() {
    this.userSvc.getUserGroups().subscribe((r) => {
      if (r.status) {
        this.usergroups = r.data;
      }
    });
  }

  getNewSideNavData() {
    console.log('SIDENAV ', this.sideNavItems);
    this.procDefForm.sideNavItemList = this.sideNavItems;
  }
  addNewMenu() {
    let newMenuItem = {
      itemId: Math.floor(Math.random() * 100000) + 10000,
      itemName: '',
      itemIconPath: 'fa fa-pie-chart',
      forRoles: [],
      routePath: '',
      isExactRouteMatch: false,
      itemChildren: [],
    };
    this.procDefForm.sideNavItemList = [
      newMenuItem,
      ...this.procDefForm.sideNavItemList,
    ];
  }
  removeMenu(menuId) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element =
      this.procDefForm.sideNavItemList[menuId];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      r.itemId && this.procDefForm.sideNavItemList.splice(menuId, 1);
      this.toastrSvc.warning(`Deleted ${r.itemName}!`);
      modalRef.close();
    });
  }
  addSubMenu(menuId) {
    let subMenuStructure = {
      itemId: Math.floor(Math.random() * 10000) + 1000,
      itemName: '',
      itemIconPath: 'fa fa-tasks',
      forRoles: [],
      routePath: '',
      isExactRouteMatch: true,
    };
    console.log(
      'CATEGORY NAME --->',
      this.procDefForm.sideNavItemList[menuId].itemChildren
    );
    if (!this.procDefForm.sideNavItemList[menuId].itemChildren) {
      this.procDefForm.sideNavItemList[menuId].itemChildren = [];
      this.procDefForm.sideNavItemList[menuId].itemChildren.push(
        subMenuStructure
      );
    } else {
      this.procDefForm.sideNavItemList[menuId].itemChildren.unshift(
        subMenuStructure
      );
    }
  }
  removeSubMenu(menuId, subMenuId) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element =
      this.procDefForm.sideNavItemList[menuId].itemChildren[subMenuId];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      this.procDefForm.sideNavItemList[menuId].itemChildren.splice(
        subMenuId,
        1
      );
      this.toastrSvc.warning(`Deleted ${r.itemName}!`);
      modalRef.close();
    });
  }

  getRoles() {
    this.userSvc.getUserRoles().subscribe((r) => {
      this.roles = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }
  showCategoryForm() {
    this.showAddButton = !this.showAddButton;
    this.newButtonCategory = '';
  }

  addNewJrmsModule() {
    this.toastrSvc.success(`Added new module`);
    this.modules.push({
      moduleName: '',
      actions: [
        {
          name: 'add',
          visibleForRoles: [],
        },
        {
          name: 'view',
          visibleForRoles: [],
        },
        {
          name: 'edit',
          visibleForRoles: [],
        },
        {
          name: 'delete',
          visibleForRoles: [],
        },
      ],
    });
  }
  removeJrmsModule(index: number) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = this.modules[index];
    modalRef.componentInstance.eventEmitter.subscribe((r: any) => {
      console.log('rrr', r);
      if (r) {
        this.modules.splice(index, 1);
        this.toastrSvc.warning(`Deleted ${r.name}!`);
        modalRef.close();
      }
    });
  }

  addButtonCategory() {
    this.procDefForm.toolBarButtons[this.newButtonCategory] = [];
    this.buttonTypes.unshift(this.newButtonCategory);
    console.log(
      'CATEGORY NAME --->',
      this.newButtonCategory,
      this.procDefForm.toolBarButtons,
      this.buttonTypes
    );
    this.showCategoryForm();
  }
  addButton(type) {
    let newButtonStructure = {
      label: '',
      action: '',
      forRoles: [],
      cssClass: 'primarybtnstyle',
      disabled: false,
      forScreens: 'list',
      singleSelect: true,
    };
    console.log('TYPE ', type);
    this.procDefForm.toolBarButtons[type].unshift(newButtonStructure);
    console.log('ON ADD ', this.procDefForm.toolBarButtons[type]);
  }
  removeButtonCategory(type) {
    console.log(
      'DLT ',
      type,
      this.procDefForm.toolBarButtons,
      this.buttonTypes
    );
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = { label: type };
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      delete this.procDefForm.toolBarButtons[type];
      this.buttonTypes = this.buttonTypes.filter((ele) => ele != type);
      this.toastrSvc.warning(`Deleted ${r.label}!`);
      modalRef.close();
    });
  }
  removeButton(type, id) {
    console.log('DLT ', this.procDefForm.toolBarButtons[type][id], id);
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element =
      this.procDefForm.toolBarButtons[type][id];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      this.procDefForm.toolBarButtons[type].splice(id, 1);
      this.toastrSvc.warning(`Deleted ${r.label}!`);
      modalRef.close();
    });
  }

  addNewFolder() {
    let newFolder = {
      itemId: Math.floor(Math.random() * 100000) + 10000,
      itemName: '',
      itemChildren: [],
    };

    this.procDefForm.dmsSettings = [newFolder, ...this.procDefForm.dmsSettings];
  }
  removeFolder(menuId) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = this.procDefForm.dmsSettings[menuId];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      r.itemId && this.procDefForm.dmsSettings.splice(menuId, 1);
      this.toastrSvc.warning(`Deleted ${r.itemName}!`);
      modalRef.close();
    });
  }
  addSubFolder(menuId) {
    let subMenuStructure = {
      itemId: Math.floor(Math.random() * 10000) + 1000,
      itemName: '',
    };
    console.log(
      'CATEGORY NAME --->',
      this.procDefForm.dmsSettings[menuId].itemChildren
    );
    if (!this.procDefForm.dmsSettings[menuId].itemChildren) {
      this.procDefForm.dmsSettings[menuId].itemChildren = [];
      this.procDefForm.dmsSettings[menuId].itemChildren.push(subMenuStructure);
    } else {
      this.procDefForm.dmsSettings[menuId].itemChildren.unshift(
        subMenuStructure
      );
    }
  }
  removeSubFolder(menuId, subMenuId) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element =
      this.procDefForm.dmsSettings[menuId].itemChildren[subMenuId];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      r.itemId &&
        this.procDefForm.dmsSettings[menuId].itemChildren.splice(subMenuId, 1);
      this.toastrSvc.warning(`Deleted ${r.itemName}!`);
      modalRef.close();
    });
  }

  public selectProcessName(obj): void {
    this.procDefForm.processname = obj.value;
  }

  selectProcessIcon(obj) {
    console.log('PROCESS', obj, this.procDefForm);
    this.procDefForm.iconColor = isNaN(obj.value)
      ? `fa ${obj.value}`
      : obj.value;
  }

  selectMenuIcon(obj) {
    this.procDefForm.sideNavItemList[obj.id].itemIconPath = isNaN(obj.value)
      ? `fa ${obj.value}`
      : obj.value;
  }
  selectSubMenuIcon(obj) {
    const ids = obj.id.split('**');
    // console.log("IIII", obj, ids)
    // console.log("IIII", obj, this.procDefForm.sideNavItemList[ids[0]].itemChildren[ids[1]].itemIconPath)
    this.procDefForm.sideNavItemList[ids[0]].itemChildren[ids[1]].itemIconPath =
      isNaN(obj.value) ? `fa ${obj.value}` : obj.value;
  }
  selectBusinessKey(obj): void {
    console.log(obj); //will log 'something1234 when child button is clicked
    this.procDefForm.key.variablename = obj.value;
  }

  showNotificationForm() {
    this.showAddNotificationButton = !this.showAddNotificationButton;
    this.newButtonNotificationCategory = '';
  }

  addNotificationContent() {
    this.procDefForm.notificationTemplateSettings[
      this.newButtonNotificationCategory
    ] = {
      emailBody: null,
      emailConfiguration: null,
      isEmailActive: null,
      nottext: '',
      defaulttemplate: '',
      excludeinitiator: false,
      othertemplates: [],
      subjectLine: null,
      subprefixtext: '',
    };
    this.notificationButtonTypes.unshift(this.newButtonNotificationCategory);
    console.log(
      'CATEGORY NAME --->',
      this.newButtonNotificationCategory,
      this.procDefForm.notificationTemplateSettings,
      this.notificationButtonTypes
    );
    this.showNotificationForm();
  }
  removeNotificationContent(type) {
    console.log(
      'DLT ',
      type,
      this.procDefForm.notificationTemplateSettings,
      this.notificationButtonTypes
    );
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = { label: type };
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      delete this.procDefForm.notificationTemplateSettings[type];
      this.notificationButtonTypes = this.notificationButtonTypes.filter(
        (ele) => ele != type
      );
      this.toastrSvc.warning(`Deleted ${r.label}!`);
      modalRef.close();
    });
  }

  addOtherTemplate(type) {
    let newButtonStructure = {
      subprefixtext: '',
      roles: [],
      template: '',
      toinitiator: false,
    };
    console.log('TYPE ', type);
    if (this.procDefForm.notificationTemplateSettings[type].othertemplates) {
      this.procDefForm.notificationTemplateSettings[type].othertemplates.push(
        newButtonStructure
      );
    } else {
      this.procDefForm.notificationTemplateSettings[type].othertemplates = [];
      this.procDefForm.notificationTemplateSettings[type].othertemplates.push(
        newButtonStructure
      );
    }
    console.log(
      'ON ADD ',
      this.procDefForm.notificationTemplateSettings[type].othertemplates
    );
  }

  removeOtherTemplate(type, id) {
    console.log(
      'DLT ',
      this.procDefForm.notificationTemplateSettings[type][id]
    );
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element =
      this.procDefForm.notificationTemplateSettings[type][id];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      r.label &&
        this.procDefForm.notificationTemplateSettings[type].splice(id, 1);
      this.toastrSvc.warning(`Deleted ${r.label}!`);
      modalRef.close();
    });
  }
  onContentSubjectSubmitted(htmlstring, type, id?) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'].trim();
    const paramsPattern = /[^{\}]+(?=})/g;
    let extractParams = subjectline.match(paramsPattern);
    // console.log('**********************extractParams', extractParams);

    if (!isNaN(id) && id >= 0) {
      this.procDefForm.notificationTemplateSettings[type].othertemplates[
        id
      ].subprefixtext = subjectline;
      this.procDefForm.notificationTemplateSettings[type].othertemplates[
        id
      ].subjectLine = htmlstring;
      this.procDefForm.notificationTemplateSettings[type].othertemplates[
        id
      ].prefixVars = extractParams;
    } else {
      this.procDefForm.notificationTemplateSettings[type].subprefixtext =
        subjectline;
      this.procDefForm.notificationTemplateSettings[type].subjectLine =
        htmlstring;
      this.procDefForm.notificationTemplateSettings[type].prefixVars =
        extractParams;
    }
  }

  onContentBodySubmitted(htmlstring, type, id?) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'].trim();
    const paramsPattern = /[^{\}]+(?=})/g;
    let extractParams = subjectline.match(paramsPattern);
    // console.log('**********************', "ID", id,!isNaN(id) && id>=0 ,"TYPE",type, extractParams,htmlstring);

    if (!isNaN(id) && id >= 0) {
      console.log('OTHER');
      this.procDefForm.notificationTemplateSettings[type].othertemplates[
        id
      ].emailBody = htmlstring;
      this.procDefForm.notificationTemplateSettings[type].othertemplates[
        id
      ].bodyVars = extractParams;
    } else {
      console.log('MAIN');
      this.procDefForm.notificationTemplateSettings[type].emailBody =
        htmlstring;
      this.procDefForm.notificationTemplateSettings[type].bodyVars =
        extractParams;
    }
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

  moveSubMenuUp(menuId, subMenuId) {
    let subMenu = this.procDefForm.sideNavItemList[menuId].itemChildren;
    let upperItem =
      this.procDefForm.sideNavItemList[menuId].itemChildren[subMenuId - 1];
    subMenu[subMenuId - 1] =
      this.procDefForm.sideNavItemList[menuId].itemChildren[subMenuId];
    subMenu[subMenuId] = upperItem;
    this.procDefForm.sideNavItemList[menuId].itemChildren = subMenu;
    console.log('MOVE UP << ', subMenu);
  }

  moveSubMenuDown(menuId, subMenuId) {
    let subMenu = this.procDefForm.sideNavItemList[menuId].itemChildren;
    let lowerItem =
      this.procDefForm.sideNavItemList[menuId].itemChildren[subMenuId + 1];
    subMenu[subMenuId + 1] =
      this.procDefForm.sideNavItemList[menuId].itemChildren[subMenuId];
    subMenu[subMenuId] = lowerItem;
    this.procDefForm.sideNavItemList[menuId].itemChildren = subMenu;
  }
  moveButton(type, id, direction) {
    let subMenu = this.procDefForm.toolBarButtons[type];
    if (direction == 'up') {
      let upperItem = this.procDefForm.toolBarButtons[type][id - 1];
      subMenu[id - 1] = this.procDefForm.toolBarButtons[type][id];
      subMenu[id] = upperItem;
      this.procDefForm.toolBarButtons[type] = subMenu;
      console.log('MOVE UP << ', subMenu);
    } else {
      let lowerItem = this.procDefForm.toolBarButtons[type][id + 1];
      subMenu[id + 1] = this.procDefForm.toolBarButtons[type][id];
      subMenu[id] = lowerItem;
      this.procDefForm.toolBarButtons[type] = subMenu;
    }
  }
  selectTabSettingIcon(obj) {
    const ids = obj.id.split('**');
    console.log('IIII', obj, ids);
    this.procDefForm.tabSettings[ids[0]].icon = isNaN(obj.value)
      ? `fa ${obj.value}`
      : obj.value;
  }
  selectChannelSettingIcon(obj) {
    const ids = obj.id.split('**');
    console.log('IIII', obj, ids);
    this.procDefForm.tabSettings[ids[0]].channels[ids[1]].icon = isNaN(
      obj.value
    )
      ? `fa ${obj.value}`
      : obj.value;
    console.log('Channnels icon change', this.procDefForm.tabSettings[ids[0]]);
  }

  onChannelTextSubmitted(htmlstring, settingId, id, type) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText']
      .trim()
      .replaceAll(',', ' ')
      .replaceAll(';', ' ');
    const variablePattern = /[^{\}]+(?=})/g;
    const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/g;
    const numberPattern = /[0-9]{10}/g;
    const emailList = subjectline.match(emailPattern);
    const numberList = subjectline.match(numberPattern);
    const extractParams = subjectline.match(variablePattern);

    const emailObjs = emailList?.map((i) => ({
      defaultValue: i,
      defaultType: 'email',
    }));
    const variableObjs = extractParams?.map((i) => ({
      defaultValue: i,
      defaultType: 'variable',
    }));
    const phoneNumberObjs = numberList?.map((i) => ({
      defaultValue: i,
      defaultType: 'phoneNumber',
    }));
    let reqdata = {
      message: htmlstring,
      users: [],
      groups: [],
      documents: [],
    };

    let mentions = htmlDoc.getElementsByClassName('mention');
    console.log('m: ', mentions);
    for (var i = 0; i < mentions.length; i++) {
      console.log(mentions[i].id); //second console output
      if (mentions[i]['dataset'].tagtype == TagType.USER) {
        reqdata.users.push(mentions[i].id);
      } else if (mentions[i]['dataset'].tagtype == TagType.GROUP) {
        reqdata.groups.push(mentions[i].id);
      } else if (mentions[i]['dataset'].tagtype == TagType.DOCUMENT) {
        let version = mentions[i]['dataset'].version;
        reqdata.documents.push({
          name: mentions[i].id,
          version,
        });
      }
    }
    console.log(
      '**********************type, id, htmlDoc',
      type,
      id,
      htmlDoc,
      reqdata
    );
    // console.log('**********************extractParams,emailList,numberList', extractParams,emailList,numberList);
    // console.log('**********************subjectline', subjectline, );

    if (type == 'channelText') {
      this.procDefForm.tabSettings[settingId].channels[id].channelText =
        htmlDoc?.children[0]['innerText'].trim();
      this.procDefForm.tabSettings[settingId].channels[id].channelDefaults = [];
      if (emailObjs?.length) {
        this.procDefForm.tabSettings[settingId].channels[
          id
        ].channelDefaults.push(...emailObjs);
      }
      if (phoneNumberObjs?.length) {
        this.procDefForm.tabSettings[settingId].channels[
          id
        ].channelDefaults.push(...phoneNumberObjs);
      }
      if (variableObjs?.length) {
        this.procDefForm.tabSettings[settingId].channels[
          id
        ].channelDefaults.push(...variableObjs);
      }
    } else {
      this.procDefForm.tabSettings[settingId].channels[id].emailSubjectText =
        htmlDoc?.children[0]['innerText'].trim();
      this.procDefForm.tabSettings[settingId].channels[id].emailSubjectHtml =
        htmlstring;
      this.procDefForm.tabSettings[settingId].channels[id].emailSubjectVars =
        [];
      if (variableObjs?.length) {
        this.procDefForm.tabSettings[settingId].channels[
          id
        ].emailSubjectVars.push(...extractParams);
      }
      if (reqdata.users?.length) {
        this.procDefForm.tabSettings[settingId].channels[
          id
        ].emailSubjectVars.push(...reqdata.users);
      }
    }
  }

  setDefaultChannelEmailConfig(id, channel_id) {
    console.log(
      'ID ',
      id,
      'Channel id',
      channel_id,
      this.procDefForm.tabSettings[id].channels[channel_id].emailConfiguration
    );
    this.procDefForm.tabSettings[id].channels[channel_id].emailConfiguration =
      this.procDefForm.emailConfiguration;
    console.log(
      'ID ',
      id,
      'Channel id',
      channel_id,
      this.procDefForm.tabSettings[id].channels[channel_id].emailConfiguration
    );
  }

  setQueryParamVariableNameChannel(obj) {
    const type = obj.id;
    this.procDefForm.tabSettings[0].channels[
      type
    ].emailConfiguration.queryParamVariableName = obj.value;
    console.log(
      'NOTIFICATION TYPE ',
      type,
      obj,
      this.procDefForm.tabSettings[0].channels[type].emailConfiguration
        .queryParamVariableName
    );
  }

  onTaskTitleSubmitted(htmlstring, settingId) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'].trim();
    const variablePattern = /[^{\}]+(?=})/g;
    const extractParams = subjectline.match(variablePattern);

    console.log('SUBJECTLINE----------', subjectline);
    console.log('**********************', settingId, htmlDoc, htmlstring);
    console.log('**********************extractParams', extractParams);

    this.procDefForm.titleSettings[settingId].titleText = subjectline;
    this.procDefForm.titleSettings[settingId].titleHTML = htmlstring;
    this.procDefForm.titleSettings[settingId].titleVariables = [];
    if (extractParams?.length) {
      this.procDefForm.titleSettings[settingId].titleVariables.push(
        ...extractParams
      );
    }
  }

  //functions for theme

  getDoctypeid = (fileFieldName) => {
    if (fileFieldName === 'dmsLogo') return 3;
    if (fileFieldName === 'dmsLoginLogo') return 2;
    if (fileFieldName === 'dmsFavicon') return 1;
    if (fileFieldName === 'logo') return 3;
    if (fileFieldName === 'loginLogo') return 2;
    if (fileFieldName === 'favicon') return 1;
    if (fileFieldName === 'reportLogo') return 4;
  };

  isImageSizeValid(imageDimentions, fileFieldName) {
    if (fileFieldName === 'logo') {
      if (imageDimentions.width > 200 || imageDimentions.height > 50) {
        this.toastrSvc.error(
          'Logo width must be within 200px and height must be within 50px'
        );
        return false;
      }
    }
    return true;
  }

  onLogoInputClick(inputId) {
    document.getElementById(inputId).click();
  }

  getImageSize(url: File | string) {
    let imageUrl = typeof url === 'string' ? url : URL.createObjectURL(url);
    const img = document.createElement('img');
    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        resolve({ width, height });
      };
      img.onerror = reject;
    });
    img.src = imageUrl;
    return promise;
  }

  async onFileChange(e, fileFieldName, type = '') {
    let imageDimentions = await this.getImageSize(e.target.files[0]);
    // console.log(imageDimentions, fileFieldName);
    if (
      !e.target.files[0]?.name?.includes('svg') &&
      !this.isImageSizeValid(imageDimentions, fileFieldName)
    ) {
      return;
    }

    fileFieldName;
    let fileName;
    if (type) {
      this.DMSfiles[fileFieldName] = e.target.files[0];
      fileName = this.DMSfiles.dmsLogo.name;
    } else {
      this.files[fileFieldName] = e.target.files[0];
      fileName = this.files.logo.name;
    }

    console.log(
      // 'FILE',
      // fileFieldName,
      // fileName,
      e.target.files[0].name,
      this.getDoctypeid(fileFieldName)
    );

    let formdata = new FormData();
    // if (this.files[fileFieldName] instanceof File) {
    formdata.append('file', e.target.files[0]);
    // }

    let data = {
      name: e.target.files[0].name,
      doctypeid: this.getDoctypeid(fileFieldName),
      type: 'logo',
      context: 'workflow',
      docSource: type ? 'Dms' : 'Workflow',
    };

    formdata.append('others', JSON.stringify(data));

    this.fileUplSvc
      .uploadAsset(
        formdata,
        JSON.parse(localStorage.getItem('selected-process')).name
      )
      .subscribe((resp) => {
        this.generalSettingsSvc
          .getAllLogoIds(
            JSON.parse(localStorage.getItem('selected-process')).name
          )
          .subscribe((res) => {
            let fileFieldKey = fileFieldName + 'Url';
            if (type) {
              let apiKey = fileFieldKey.replace('dms', '');
              apiKey = apiKey[0].toLowerCase() + apiKey.slice(1, apiKey.length);
              // console.log(
              //   '********',
              //   fileFieldKey,
              //   apiKey,
              //   this.procDefForm.dmsThemes[0][apiKey]
              // );

              //new comment
              this.DMSpreviewImageUrls[fileFieldName] =
                this.procDefForm.dmsThemes[0][
                  apiKey
                ] = `${this.generalSettingsSvc.dmsUrl}/file/${res.data[fileFieldKey]}`;
            } else {
              this.previewImageUrls[fileFieldName] = this.procDefForm.themes[0][
                fileFieldKey
              ] = `${this.generalSettingsSvc.dmsUrl}/file/${res.data[fileFieldKey]}`;
            }
          });
      });
  }
  // Document types
  getDocumentTypes(check) {
    let selectedProcess = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    let selectedProcessNeedToBeSent = selectedProcess?.key;
    this.fileUplSvc
      .getAllDocCategory(selectedProcessNeedToBeSent)
      .subscribe((resp) => {
        if (resp.status) {
          // console.log('new resp', resp.data);
          let respData = resp.data;
          this.documentList = respData.map((data) => {
            return data;
          });

          this.documentList = resp.data.filter(
            (a) => a.foldername !== 'Executed Contracts'
          );

          // creating doctypesetting payload
          if (!check) {
            this.docTypeSetting = this.documentList.map((document) => {
              let obj = {
                code: document.code,
                name: document.name,
                foldername: document.foldername,
                selected: false,
                uploadable: false,
                isVisible: false,
              };
              return obj;
            });
          } else {
            this.documentList = this.docTypeSettingData;
            this.docTypeSetting = this.docTypeSettingData;
          }
        }
      });
  }

  handleDocumentChange(documentType: string, checkboxType: string, event: any) {
    const isChecked = event.target.checked;
    // console.log(documentType);
    const existingIndex = this.docTypeSetting.findIndex((item) => {
      return item.name === documentType;
    });
    if (existingIndex !== -1) {
      if (checkboxType === 'Uploadable') {
        this.docTypeSetting[existingIndex].uploadable = isChecked;
      } else if (checkboxType === 'Selected') {
        this.docTypeSetting[existingIndex].selected = isChecked;
      } else if (checkboxType === 'IsVisible') {
        this.docTypeSetting[existingIndex].isVisible = isChecked;
      }
    }
    console.log(this.docTypeSetting);
  }
  //files

  //general settings

  // procDefForm = {
  //   dmsSettings: [],
  //   gridsettings: [
  //     { type: 'MYQ', columns: [] },
  //     { type: 'GROUPQ', columns: [] },
  //     { type: 'ALLPROCESS', columns: [] },
  //     { type: 'ALLTASKS', columns: [] },
  //   ],
  //   emailConfiguration: {
  //     appurl: '',
  //     from: '',
  //     fromname: '',
  //     maildomain: '',
  //     host: '',
  //     password: '',
  //     port: '',
  //     queryParam: '',
  //     queryParamVariableName: '',
  //   },
  //   dmsThemes: [
  //     {
  //       primaryColor: '#2aa89b',
  //       primaryColor1: '#ceebe8',
  //       secondaryColor: '#ff9900',
  //       tertiarycolor: '#f8f9fa',
  //       quaternaryColor: '#000',
  //       dangerColor: '#c32121',
  //       faviconUrl: '',
  //       logoUrl: '',
  //       loginLogoUrl: '',
  //       reportLogoUrl: '',
  //       documentTitle: 'DS | iFlow',
  //     },
  //   ],
  //   activeDirectorySettings: {
  //     itemId: '',
  //     url: '',
  //     base: '',
  //     userDN: '',
  //     password: '',
  //     auth: '',
  //     domain: '',
  //     userid: '',
  //   },
  //   notificationTemplateSettings: {},
  //   themes: [
  //     {
  //       primaryColor: '#2aa89b',
  //       primaryColor1: '#ceebe8',
  //       secondaryColor: '#ff9900',
  //       tertiarycolor: '#f8f9fa',
  //       quaternaryColor: '#000',
  //       dangerColor: '#c32121',
  //       faviconUrl: '',
  //       logoUrl: '',
  //       loginLogoUrl: '',
  //       reportLogoUrl: '',
  //       documentTitle: 'DS | iFlow',
  //       workflowOverlayTitle: '',
  //     },
  //   ],
  // };
}

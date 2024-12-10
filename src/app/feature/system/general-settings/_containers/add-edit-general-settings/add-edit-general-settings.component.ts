import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileUploadService } from '../../../../../core/_services/file-upload.service';
import { RefDataService } from '../../../reference-data/_services/refdata/ref-data.service';
import { UserService } from 'src/app/core/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcessVariableService } from '../../../process-variable/_services/process-variable.service';
import { SharedService } from 'src/app/core/_services';
import { Subscription } from 'rxjs';
import { ProcessVariableModel } from 'src/app/core/_models';
import {
  GridSetterColumnModel,
  GridTypeSetterEnum,
} from '../../_models/procdef.model';
import { GroupModel } from 'src/app/feature/user-management/_models';
import { ConfirmModalComponent } from '../../_modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TaskCommentModel,
  TaskDocumentModel,
} from 'src/app/feature/process/layout/_models';
import { TagType, TemplateContentType } from 'src/app/core/_models';
import { EmailTemplateModel } from '../../../content-management/_models';
import { GeneralSettingsService } from 'src/app/core/_services/general-settings.service';
import { ImageEditorComponent } from '../../_modals/image-editor/image-editor.component';

@Component({
  selector: 'app-add-edit-general-settings',
  templateUrl: './add-edit-general-settings.component.html',
  styleUrls: ['./add-edit-general-settings.component.scss'],
})
export class AddEditGeneralSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('gqSetInst') gqSetInst;
  @ViewChild('qSetInst') qSetInst;
  showCommentBox = true;
  obscurePassword = true;
  // @Input() commentList: TaskCommentModel[] = [];
  @ViewChild('commentBox') commentBox;
  iconList;
  defaultGeneralGridSettings = [
    { type: 'MYQ', columns: [] },
    { type: 'GROUPQ', columns: [] },
    { type: 'ALLTASKS', columns: [] },
    { type: 'ALLPROCESS', columns: [] },
  ];
  storageSetting = { label: 'value', value: 'value' };
  businessKeySetting = {
    label: 'displaylabel',
    value: 'name',
    position: 'top',
  };
  commentObj: TaskCommentModel = {} as TaskCommentModel;
  procDefForm;
  allVars: ProcessVariableModel[];
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
  files = { logo: File, loginLogo: File, favicon: File, reportLogo: File };
  DMSfiles = {
    dmsLogo: File,
    dmsLoginLogo: File,
    dmsFavicon: File,
  };

  generalSettings = {
    dmsSettings: [],
    gridsettings: [
      { type: 'MYQ', columns: [] },
      { type: 'GROUPQ', columns: [] },
      { type: 'ALLPROCESS', columns: [] },
      { type: 'ALLTASKS', columns: [] },
    ],
    emailConfiguration: {
      appurl: '',
      from: '',
      fromname: '',
      maildomain: '',
      host: '',
      password: '',
      port: '',
      queryParam: '',
      queryParamVariableName: '',
    },
    dmsThemes: [
      {
        primaryColor: '#2aa89b',
        primaryColor1: '#ceebe8',
        secondaryColor: '#ff9900',
        tertiarycolor: '#f8f9fa',
        quaternaryColor: '#000',
        dangerColor: '#c32121',
        faviconUrl: '',
        logoUrl: '',
        loginLogoUrl: '',
        reportLogoUrl: '',
        documentTitle: 'DS | iFlow',
      },
    ],
    activeDirectorySettings: {
      itemId: '',
      url: '',
      base: '',
      userDN: '',
      password: '',
      auth: '',
      domain: '',
      userid: '',
    },
    notificationTemplateSettings: {},
    themes: [
      {
        primaryColor: '#2aa89b',
        primaryColor1: '#ceebe8',
        secondaryColor: '#ff9900',
        tertiarycolor: '#f8f9fa',
        quaternaryColor: '#000',
        dangerColor: '#c32121',
        sideNavColor: '#000',
        tabColor: '#f8f9fa',
        textColor: '#ff9900',
        faviconUrl: '',
        logoUrl: '',
        loginLogoUrl: '',
        reportLogoUrl: '',
        documentTitle: 'DS | iFlow',
        workflowOverlayTitle: '',
      },
    ],
  };

  id;
  template;
  ruleSetModel;
  procDefs;
  procDefsArr = [];
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
  editId;
  toolbarButtons;
  processName = '';
  activeTab = 'email-configuration';
  sideNavItems = [];
  roles = [];
  rolesArray = [];
  user;
  buttonTypes;
  processButtonMap;
  showAddButton = true;
  newButtonCategory = '';
  settingTabs = [];
  selectedProcess;
  docList: TaskDocumentModel[] = [];
  templateType = TemplateContentType;
  cmSvc;
  isEdit;
  header;
  selRecipient;
  tagUsers;
  enableEditContent;
  enableEditSubjectLine;
  procVars;
  multiMentionConfig = {
    mentions: [],
  };
  defaultEmailConfiguration;
  defaultActiveDirSettings;

  constructor(
    private procVarSvc: ProcessVariableService,
    public generalSettingsSvc: GeneralSettingsService,
    private router: Router,
    private userSvc: UserService,
    private actRoute: ActivatedRoute,
    private toastrSvc: ToastrService,
    private refdataSvc: RefDataService,
    private sharedSvc: SharedService,
    private fileUplSvc: FileUploadService,
    private modalSvc: NgbModal // private cmSvc: ContentManagementService,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
    this.getAllVariables();
    this.getDefaultValues();
    this.getProcessDefinition();
    this.getGroups();
    this.getRoles();
    this.getIcons();
    this.editId = this.actRoute.snapshot.paramMap.get('id');
    this.getAllVars();

    this.subscription.push(
      this.sharedSvc.groups$.subscribe((a) => {
        if (a.length > 0) {
          this.groups = a;
        } else {
          this.sharedSvc.getGroups();
        }
      })
    );
  }
  getDefaultValues() {
    this.generalSettingsSvc.getGeneralSettingData().subscribe((value) => {
      this.settingTabs = value['tabs'];
      //filtering the grid settings out from general settings it may be removed in future.
      this.settingTabs = this.settingTabs.filter(item => item.id !== "gridSettings");
      this.defaultEmailConfiguration = value.emailConfiguration;
    });
    this.generalSettingsSvc.getDMSSettings().subscribe((value) => {
      this.defaultActiveDirSettings = value.active_directory_settings;
    });
    this.generalSettingsSvc.getDMSSettings().subscribe((value) => {
      this.defaultActiveDirSettings = value.active_directory_settings;
    });
  }
  setDefaultActiveDirectorySettings() {
    this.generalSettings.activeDirectorySettings = {
      ...this.defaultActiveDirSettings,
    };
  }

  setDefaultEmailConfig() {
    this.generalSettings.emailConfiguration = {
      ...this.defaultEmailConfiguration,
    };
  }

  setDefaultDmsSettings() {
    this.generalSettingsSvc.getDMSSettings().subscribe((value) => {
      this.generalSettings.dmsSettings = value.dms_settings;
    });
  }

  getIcons() {
    this.sharedSvc.getCustomIcons().subscribe((value) => {
      this.iconList = value.data;
    });
  }

  public getComment() {
    return this.commentBox.getComment();
  }
  getAllVars() {
    this.procVarSvc.getAllProcessVariables().subscribe((r) => {
      this.allVars = r.data.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
  }
  mapProcessName(val) {
    return this.processButtonMap.find((item) => item.id == val)
      ? this.processButtonMap.find((item) => item.id == val).name
      : '';
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
    localStorage.removeItem(
      `${this.templateType.subject}-content-${this.user.userid}`
    );
    localStorage.removeItem(
      `${this.templateType.body}-content-${this.user.userid}`
    );
  }

  getGeneralSettings() {
    this.generalSettingsSvc.getGeneralSetting().subscribe((r) => {
      if (r.status) {
        let obj = r.data;
        if (obj) {
          if (obj.themes) {
            this.generalSettings = obj;
            this.previewImageUrls.logo = this.generalSettings.themes[0].logoUrl;
            this.previewImageUrls.loginLogo =
              this.generalSettings.themes[0].loginLogoUrl;
            this.previewImageUrls.favicon =
              this.generalSettings.themes[0].faviconUrl;
            this.DMSpreviewImageUrls.dmsLogo =
              this.generalSettings.dmsThemes[0].logoUrl;
            this.DMSpreviewImageUrls.dmsLoginLogo =
              this.generalSettings.dmsThemes[0].loginLogoUrl;
            this.DMSpreviewImageUrls.dmsFavicon =
              this.generalSettings.dmsThemes[0].faviconUrl;
            this.DMSpreviewImageUrls.dmsFavicon =
              this.generalSettings.dmsThemes[0].reportLogoUrl;
          } else {
            let { themes, ...others } = obj;
            others.themes = this.generalSettings.themes;
            this.generalSettings = others;
          }

          // if gridsetting is null or empty array set default
          if (
            !this.generalSettings?.gridsettings ||
            this.generalSettings?.gridsettings?.length === 0
          ) {
            this.generalSettings.gridsettings = this.defaultGeneralGridSettings;
          }
        }
      }
    });
  }

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
      .uploadAsset(formdata, 'General Settings')
      .subscribe((resp) => {
        // console.log('resp', resp);
        this.generalSettingsSvc
          .getAllLogoIds('General Settings')
          .subscribe((res) => {
            let fileFieldKey = fileFieldName + 'Url';
            if (type) {
              let apiKey = fileFieldKey.replace('dms', '');
              apiKey = apiKey[0].toLowerCase() + apiKey.slice(1, apiKey.length);
              // console.log(
              //   '********',
              //   fileFieldKey,
              //   apiKey,
              //   this.generalSettings.dmsThemes[0][apiKey]
              // );
              this.DMSpreviewImageUrls[fileFieldName] =
                this.generalSettings.dmsThemes[0][
                  apiKey
                ] = `${this.generalSettingsSvc.dmsUrl}/file/${res.data[fileFieldKey]}`;
            } else {
              this.previewImageUrls[fileFieldName] =
                this.generalSettings.themes[0][
                  fileFieldKey
                ] = `${this.generalSettingsSvc.dmsUrl}/file/${res.data[fileFieldKey]}`;
            }
          });
      });
  }

  setQueryParamVariableName(obj) {
    this.generalSettings.emailConfiguration.queryParamVariableName = obj.value;
  }

  setVisibleTab(tab) {
    this.activeTab = tab;
  }

  toggleEditContent() {
    this.enableEditContent = !this.enableEditContent;
  }
  onContentBodySubmitted(htmlstring, type, id) {
    if (id != '') {
      this.generalSettings.notificationTemplateSettings[type].othertemplates[
        id
      ].subprefixtext = htmlstring;
    } else {
      this.generalSettings.notificationTemplateSettings[type].subprefixtext =
        htmlstring;
    }
    // this.template.body = this.cmSvc.onContentTemplateSubmit(htmlstring, true);
    // this.toggleEditContent() ;
    // this.setContentComment(this.templateType.body, this.template.body.content) ;
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
      gridsettings: this.defaultGeneralGridSettings,
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

  public insertVariableTagHtml(variable) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${variable.name}" data-tagtype="${TagType.VARIABLE}"
      contenteditable="false"
      >{${variable.name}}</span>`;
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
          if (this.editId) {
            // this.getProcDefFormByName(this.editId) ;
          } else {
            this.newProcDefForm();
          }
          this.getGeneralSettings();
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
          this.procDefs = [];
          Object.keys(res.data).forEach((r) => {
            this.procDefs.push({ key: r, value: res.data[r] });
          });
          this.procDefs.sort((a, b) => (a.value > b.value ? 1 : -1));

          this.procDefsArr = this.procDefs.map((item) => item.value);
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
    !this.selectedVars.displaySelectedVars.includes(vars)
      ? this.selectedVars.displaySelectedVars.push(vars)
      : null;
  }

  removeVariables(variable) {
    this.procDefForm.variables = this.procDefForm.variables.filter(
      (a) => a !== variable.name
    );

    this.procDefForm.gridsettings.forEach((element, id) => {
      element.columns
        .filter((col) => col)
        .filter((col) => col.key != variable.name);
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
        this.selectedVars.displaySelectedVars = this.selectedVars.all.filter(
          (a) => a.displaylabel.toLowerCase().includes(value)
        );
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

  assignVariable(value, opt) {
    let pvar = 'variable' + [opt];
    this.procDefForm.key.prefix[pvar] = value;
  }

  save() {
    let first =
      Array.isArray(this.generalSettings.gridsettings) &&
      this.generalSettings.gridsettings[0];
    if (!!first && Array.isArray(first?.columns)) {
      if (first.columns.some((col) => !col.key))
        return this.toastrSvc.warning(
          'Make sure to select a variable for every grid column'
        );
    }
    this.generalSettingsSvc
      .saveGeneralSettings({ ...{ ...this.generalSettings } })
      .subscribe((a) => {
        if (a.status) {
          this.toastrSvc.success('Saved');
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
        // console.log("GROUPS ", this.usergroups);
      }
    });
  }

  getNewSideNavData() {
    this.sharedSvc.getNewSideNav('sideNav').subscribe((resp) => {
      this.sideNavItems = resp;
      console.log('SIDENAV ', this.sideNavItems);
      this.procDefForm.sideNavItemList = this.sideNavItems;
    });
  }
  addNewFolder() {
    let newDMSItem = {
      itemId: Math.floor(Math.random() * 100000) + 10000,
      itemName: '',
      storageSetting: '',
      itemChildren: [],
    };
    this.generalSettings.dmsSettings = [
      newDMSItem,
      ...this.generalSettings.dmsSettings,
    ];
  }
  removeFolder(menuId) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element =
      this.generalSettings.dmsSettings[menuId];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      r.itemId && this.generalSettings.dmsSettings.splice(menuId, 1);
      this.toastrSvc.warning(`Deleted ${r.itemName}!`);
      modalRef.close();
    });
  }
  addSubFolder(menuId) {
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
    if (!this.generalSettings.dmsSettings[menuId].itemChildren) {
      this.generalSettings.dmsSettings[menuId].itemChildren = [];
      this.generalSettings.dmsSettings[menuId].itemChildren.push(
        subMenuStructure
      );
    } else {
      this.generalSettings.dmsSettings[menuId].itemChildren.unshift(
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
      this.generalSettings.dmsSettings[menuId].itemChildren[subMenuId];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      r.itemId &&
        this.generalSettings.dmsSettings[menuId].itemChildren.splice(
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
      this.rolesArray = this.roles.map((role) => role.name);
    });
  }
  showCategoryForm() {
    this.showAddButton = !this.showAddButton;
    this.newButtonCategory = '';
  }

  addNotificationContent() {
    this.generalSettings.notificationTemplateSettings[this.newButtonCategory] =
      {
        defaulttemplate: 'jdlkfjasldfjal',
        excludeinitiator: false,
        subprefixtext: 'dflaksjdfla',
        othertemplates: [],
      };
    this.buttonTypes.unshift(this.newButtonCategory);
    console.log(
      'CATEGORY NAME --->',
      this.newButtonCategory,
      this.generalSettings.notificationTemplateSettings,
      this.buttonTypes
    );
    this.showCategoryForm();
  }
  addOtherTemplate(type) {
    let newButtonStructure = {
      subprefixtext: '',
      roles: [],
      template: '',
      toinitiator: false,
    };
    console.log('TYPE ', type);
    if (
      this.generalSettings.notificationTemplateSettings[type].othertemplates
    ) {
      this.generalSettings.notificationTemplateSettings[
        type
      ].othertemplates.push(newButtonStructure);
    } else {
      this.generalSettings.notificationTemplateSettings[type].othertemplates =
        [];
      this.generalSettings.notificationTemplateSettings[
        type
      ].othertemplates.push(newButtonStructure);
    }
    console.log(
      'ON ADD ',
      this.generalSettings.notificationTemplateSettings[type].othertemplates
    );
  }
  removeNotificationContent(type) {
    console.log(
      'DLT ',
      type,
      this.generalSettings.notificationTemplateSettings,
      this.buttonTypes
    );
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = { label: type };
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      delete this.generalSettings.notificationTemplateSettings[type];
      this.buttonTypes = this.buttonTypes.filter((ele) => ele != type);
      this.toastrSvc.warning(`Deleted ${r.label}!`);
      modalRef.close();
    });
  }
  removeOtherTemplate(type, id) {
    console.log(
      'DLT ',
      this.generalSettings.notificationTemplateSettings[type][id]
    );
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element =
      this.generalSettings.notificationTemplateSettings[type][id];
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      r.label &&
        this.generalSettings.notificationTemplateSettings[type].splice(id, 1);
      this.toastrSvc.warning(`Deleted ${r.label}!`);
      modalRef.close();
    });
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
  // preview(file, fileFieldName) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = (_event) => {
  //     this.previewImageUrls[fileFieldName] = reader.result;
  //   };
  // }
  onIconFile(e) {
    let formdata = new FormData();
    formdata.append('file', e.target.files[0]);
    this.fileUplSvc.uploadCustomIcons(formdata).subscribe((resp) => {
      this.iconList.push({
        uniqueId: resp.data.contentid,
        id: resp.data.id,
        fileName: resp.data.name,
      });
      e.target.value = '';
    });
  }
  deleteIcon(ele) {
    const modalRef = this.modalSvc.open(ConfirmModalComponent, {
      size: 'md',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.element = { label: ele.id };
    modalRef.componentInstance.eventEmitter.subscribe((r) => {
      this.generalSettingsSvc.deleteIcon(ele.id).subscribe((resp) => {
        this.iconList = this.iconList.filter((i) => i.id != ele.id);
      });
      modalRef.close();
    });
  }
}

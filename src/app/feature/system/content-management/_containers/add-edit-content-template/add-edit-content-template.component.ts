import { EmailTemplateModel, RuleSetModel } from '../../_models';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentManagementService } from '../../_services/content-management.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RefDataService, UserService } from 'src/app/core/_services';
import {
  LoggedUserModel,
  OperatorTypes,
  ProcessFormModel,
  ProcessVariableModel,
  SourceTypes,
  TagType,
  UIElementTypes,
  TemplateListErrorMsg,
  TemplateContentType,
} from 'src/app/core/_models';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProcessFormsService } from '../../../process-forms/_services';
import { ProcessVariableService } from '../../../process-variable/_services/process-variable.service';
import { Constants } from '../../_models/constants.model';

@Component({
  selector: 'app-add-edit-content-template',
  templateUrl: './add-edit-content-template.component.html',
  styleUrls: ['./add-edit-content-template.component.scss'],
})
export class AddEditContentTemplateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  procForms: ProcessFormModel[];
  procVars: ProcessVariableModel[];
  enableEditContent = true;
  enableEditSubjectLine = true;
  selRecipient;
  selPoints;
  selRoles;
  emailProcVars: ProcessVariableModel[];
  externalEmail = '';
  errMsg = TemplateListErrorMsg.ADD_ALL_FIELDS;
  rolesArray = [];
  isEdit = false;
  dropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: true,
    idField: 'key',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
  };

  dropdownSettingsRecipient = {
    singleSelection: false,
    closeDropDownOnSelection: true,
    idField: 'userid',
    textField: 'fullname',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
  };
  dropdownSettingsProcVars = {
    singleSelection: false,
    closeDropDownOnSelection: true,
    idField: 'name',
    textField: 'label',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
  };
  dropdownSettingsRole = {
    singleSelection: false,
    closeDropDownOnSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
  };

  // doctypeDropdownSettings = {
  //   singleSelection: false,
  //   closeDropDownOnSelection: false,
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 2,
  //   allowSearchFilter: true,
  // };

  multiMentionConfig = {
    mentions: [],
  };
  selProcvars;
  displayOtherRecipient = false;

  @ViewChild('contentBox') contentBox;
  @ViewChild('subjBox') subjBox;
  @ViewChild('ruleSet') ruleSetInst;
  template = {} as EmailTemplateModel;
  header = 'Add Email Template';
  id;
  types = [
    'Comment',
    'Task Assigned',
    'Task Completed',
    'Task Terminated',
    'New Task in Group Queue',
  ];
  tagUsers: LoggedUserModel[];
  recipientList;
  tagGroups: LoggedUserModel[];
  operatorList = Constants.operatorList;
  opType: OperatorTypes;
  templateType = TemplateContentType;
  user;
  ruleSetModel: RuleSetModel[];
  allProcesses;
  searchFormatter = (x) => x.fullname;
  triggerpointsFormatter = (x) => x.name;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  initiateRuleset: boolean;

  constructor(
    private cmSvc: ContentManagementService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private userSvc: UserService,
    private toastrSvc: ToastrService,
    private procFormSvc: ProcessFormsService,
    private procVarSvc: ProcessVariableService,
    private refSvc: RefDataService
  ) {}

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.paramMap.get('tid');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getUsers();
    this.getAllGroup();
    this.getRoles();
    this.template.processNames = this.selectedProcess.name;

    // this.getAllDefinitionForms();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    localStorage.removeItem(
      `${this.templateType.subject}-content-${this.user.userid}`
    );
    localStorage.removeItem(
      `${this.templateType.body}-content-${this.user.userid}`
    );
  }

  getAllDefinitionForms() {
    this.procVarSvc.getAllDefinitionForm().subscribe((r) => {
      if (r.status) {
        this.allProcesses = r.data.map((process) => process.processname);
      }
    });
  }

  formDecider() {
    if (this.id) {
      // alert("i m running 2nd")
      this.getTemplateById(this.id);
    } else {
      // this.template = {} as EmailTemplateModel;
      this.ruleSetModel = [{ operand: '', operator: '', value: [] }];
      localStorage.removeItem(
        `${this.templateType.subject}-content-${this.user.userid}`
      );
      localStorage.removeItem(
        `${this.templateType.body}-content-${this.user.userid}`
      );
    }
  }

  getTemplateById(id) {
    this.cmSvc.getTemplatesbyId(id).subscribe((a) => {
      if (a.status) {
        this.isEdit = true;
        this.initiateRuleset = true;
        // alert("edit becomes true here")
        this.template = a.data;
        // console.log("template" , this.template)
        this.template.processNames = this.selectedProcess.name;

        this.header = this.template.name;
        this.selRecipient = this.tagUsers
          ? this.tagUsers.filter((u) =>
              this.template.recipients?.includes(u.userid)
            )
          : [];
        if (this.selRecipient.length > 0) {
          this.selRecipient.forEach((y) => {
            this.recipientList = this.recipientList.filter((x) => x !== y);
            this.recipientList.unshift(y);
          });
        }
        this.selRoles = this.rolesArray
          ? this.rolesArray.filter((u) => this.template.roles?.includes(u.name))
          : [];
        this.selProcvars = this.emailProcVars
          ? this.emailProcVars.filter((u) =>
              this.template.emailProcVars?.includes(u.name)
            )
          : [];
        // console.log("selroles", this.selRoles)
        // if (this.selRoles?.length > 0) {
        //   this.selRoles.forEach((y) => {
        //     this.rolesArray = this.rolesArray.filter((x) => x !== y);
        //     this.rolesArray.unshift(y);
        //   });
        // }
        // this.selRoles=this.template.roles

        // this.selProcvars=this.template.emailProcVars;

        // this.selPoints = this.procForms ? this.procForms.filter(p => this.template.tasks.includes(p.key)): []  ;
        this.enableEditContent = false;
        this.enableEditSubjectLine = false;
        this.ruleSetModel = this.template.ruleset;
        this.ruleSetModel.map((r) => {
          r.operand = this.procVars.find((p) => p.name === r.operand);
          return r;
        });
        this.setContentComment(
          this.templateType.subject,
          this.template.subject.content
        );
        this.setContentComment(
          this.templateType.body,
          this.template.body.content
        );
      }
    });
  }

  save() {
    let actionname;
    actionname = this.id ? 'editTemplate' : 'addTemplate';
    //  this.template.body = this.contentBox.htmlstring ;
    // if(!this.template.body) {
    //   // this.contentBox.submitted.subscribe(s => te) ;
    //   this.onContentBodySubmitted(this.contentBox.htmlstring) ;
    // }
    //  this.subjBox.submitted() ;
    console.log('selrocvars', this.selProcvars);
    this.template.recipients = this.selRecipient?.map((r) => r.userid);
    this.template.emailProcVars = this.selProcvars?.map((r) => r.name);
    this.template.roles = this.selRoles?.map((r) => r.name);
    // this.template.tasks = this.selPoints.map(p => p.key) ;
    console.log('animeshhh', this.template);

    let valid = this.checkFormValidity();
    if (valid) {
      actionname === 'addTemplate'
        ? this.fetchCodeForAddinTemplate(actionname)
        : this.saveTemplate(actionname);
    } else if (!valid) {
      this.toastrSvc.warning(
        'Please make sure to enter all the mandatory fields'
      );
    }
  }

  saveTemplate(actionname) {
    this.template.subjectline = this.template.subject.subjectline
      ? this.template.subject.subjectline
      : this.template.subjectline;
    delete this.template.subject.subjectline;
    this.template.textbody = this.template.body.subjectline
      ? this.template.body.subjectline
      : this.template.textbody;
    delete this.template.body.subjectline;
    this.ruleSetInst.emitRuleSet();

    this.template.ruleset = this.ruleSetModel?.map((r) => {
      if (r.operand) {
        let obj = {
          operand: r.operand ? r.operand.name : r.firstValue.name,
          operator: r.operator,
          value: r.value,
        };
        return obj;
      } else return;
    });
    this.template.ruleset = this.template?.ruleset?.filter((i) => i);
    if (
      this.template.initiator === null ||
      this.template.initiator === undefined
    ) {
      this.template.initiator = false;
    }
    this.cmSvc[actionname](this.template, this.id).subscribe((a) => {
      if (a.status) {
        this.toastrSvc.success('Template Saved');
        this.back();
      }
    });
  }

  fetchCodeForAddinTemplate(actionname) {
    this.procVarSvc.getFieldName(this.template.name).subscribe((v) => {
      if (v.status) {
        this.template.code = v.data;
        this.saveTemplate(actionname);
      }
    });
  }
  // validateForm() {
  // if(this.template.ruleset.find(a => a.operator === '') ||
  // this.template.ruleset.find(a => a.operand === '') ||
  // this.template.ruleset.find(a => a.value.includes(null)) ) {
  //   return false ;
  // } else
  //   if(this.template.recipients.length === 0) {
  //     return false ;
  //   }
  // }

  back() {
    let nav = this.id ? '../../' : '../';
    this.router.navigate([nav], { relativeTo: this.actRoute });
  }

  onContentBodySubmitted(htmlstring) {
    // console.log(htmlstring) ;
    this.template.body = this.cmSvc.onContentTemplateSubmit(htmlstring, true);
    this.toggleEditContent();
    this.setContentComment(this.templateType.body, this.template.body.content);
  }

  onSubjectLineSubmitted(htmlstring) {
    this.template.subject = this.cmSvc.onContentTemplateSubmit(
      htmlstring,
      true
    );
    this.toggleEditSubject();
    this.setContentComment(
      this.templateType.subject,
      this.template.subject.content
    );
  }

  onOtherRecipientsSubmitted(htmlstring) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'].trim();
    const paramsPattern = /[^{\}]+(?=})/g;
    let extractVariables = subjectline.match(paramsPattern);
    // this.template.body = this.cmSvc.onContentTemplateSubmit(htmlstring, true) ;
    this.toggleOtherRecipient();
    //  if(!this.template.externalEmails) {
    this.template.externalEmails = [];
    // }
    // if (this.selectedProcess.name == "Initiation Process Impl" && !this.externalEmail.includes('@ibasis.net') ) {
    //   this.toastrSvc.warning('Mail Address must be in iBasis domain')
    // }

    subjectline.length > 5 &&
      subjectline.split(/,| |;/).forEach((email) => {
        if (
          email[0] != '{' &&
          email.trim().match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
        ) {
          !this.externalEmail.includes('@ibasis.net') &&
          this.selectedProcess.name == 'Initiation Process Impl'
            ? this.toastrSvc.warning('Mail Address must be in iBasis domain')
            : this.template.externalEmails.push(email);
        } else if (email[0] == '{') {
        } else if (!email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
          this.toastrSvc.warning(`${email} is not a valid email!`);
        }
      });

    this.template.recipientVars = extractVariables;
    this.template.recipientHtml = htmlstring;
    this.setContentComment(
      this.templateType.recipients,
      this.template.body.content
    );
  }

  setContentComment(templateType, content) {
    localStorage.setItem(
      `${templateType}-content-${this.user.userid}`,
      content
    );
  }

  getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.tagUsers = a.data;
      this.recipientList = a.data.sort((a, b) => (a.fname > b.fname ? 1 : -1));
      console.log('recepientlist', this.recipientList);
      this.getAllProcForms();
      this.getAllProcVars();
      this.multiMentionConfig.mentions.push({
        items: this.tagUsers,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
      // this.contentBox.defaultCommentBoxOptions.clearAfterSubmit = false ;
    });
  }

  getRoles(): void {
    this.userSvc.getUserRoles().subscribe((r) => {
      if (r.status) {
        let roles = r.data;
        this.procFormSvc
          .getProcDefbyName(this.selectedProcess.name)
          .subscribe((resp) => {
            console.log(resp.data.participatingGroups);
            resp.data.participatingGroups?.forEach((group) => {
              roles.forEach((role) => {
                if (
                  role.groups.includes(group.id) &&
                  !this.rolesArray.includes(role)
                ) {
                  this.rolesArray = [...this.rolesArray, role];
                }
              });
              // this.recipientList = this.recipientList.filter((el) =>
              //   el.groupnames.includes(group.id)
              // );
            });
          });
      }
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

  public insertGroupTagHtml(group) {
    return `<span
      class="mention group-mention" style="color: #2aa89b"  id="${group.id}" data-tagtype="${TagType.GROUP}"
      contenteditable="false"
      >${group.name}</span>`;
  }

  getAllGroup() {
    this.userSvc.getUserGroups().subscribe((a) => {
      this.tagGroups = a.data;
      this.multiMentionConfig.mentions.push({
        items: this.tagGroups,
        triggerChar: '#',
        insertHtml: true,
        labelKey: 'name',
        mentionSelect: this.insertGroupTagHtml,
      });
    });
  }

  public getComment() {
    return this.contentBox.getComment();
  }

  selectRecipient(event) {
    if (!this.template.recipients) {
      this.template.recipients = [];
    }
    !this.template.recipients?.includes(event.item.userid)
      ? this.template.recipients.push(event.item.userid)
      : this.toastrSvc.warning('User already added to recipient list');
    this.resetRecipient();
  }

  resetRecipient() {
    this.selRecipient = {};
  }

  selectTriggerPoints(ev) {
    if (!this.template.tasks) {
      this.template.tasks = [];
    }
    !this.template.tasks.includes(ev.item.key)
      ? this.template.tasks.push(ev.item.key)
      : 'Already Added Trigger Point';
    this.selPoints = {};
  }

  deleteTriggerpoints(tpoint) {
    // this.template.tasks = this.template.recipients.filter(t => t !== tpoint) ;
  }

  returnFormName(tpoint) {
    return this.procForms.find((f) => f.key === tpoint).name;
  }

  recipientsArray = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.tagUsers
              .filter(
                (v) => v.fullname.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  };

  procFormsArray = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.procForms
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );
  };

  deleteRecipient(recipient) {
    this.template.recipients = this.template.recipients.filter(
      (t) => t !== recipient
    );
  }

  getAllProcForms() {
    this.procFormSvc.getAllProcForms().subscribe((p) => {
      if (p.status) {
        this.procForms = p.data.sort((a, b) => (a.name > b.name ? 1 : -1));
      }
    });
  }

  getAllProcVars() {
    this.procVarSvc.getEmailVariables().subscribe((v) => {
      if (v.status) {
        //  this.procVars = v.data.filter(v => v.emailtemplatevariable)
        //  this.procVars.length === 0 ?
        this.procVars = v.data.sort((a, b) =>
          a.displaylabel.toLowerCase() > b.displaylabel.toLowerCase() ? 1 : -1
        );
        this.emailProcVars = this.procVars.filter((el) => {
          return el.name.toLowerCase().includes('email');
        });
        //  this.procVars.sort((a,b) => a.name > b.name ? 1 : -1) ;
        this.multiMentionConfig.mentions.push({
          items: this.procVars,
          triggerChar: '$',
          insertHtml: true,
          labelKey: 'name',
          mentionSelect: this.insertVariableTagHtml,
        });
        // alert("i m running 1st")
        this.formDecider();
      }
    });
  }

  returnUserFullname(userid) {
    return this.tagUsers.find((a) => a.userid === userid).fullname;
  }

  getOperators(m) {
    return this.operatorList[m.datatype];
    // switch(m.datatype) {
    //   case 'String':
    //     return m.uielementtype === UIElementTypes.DROPDOWN ? this.operatorList['Dropdown'] : this.operatorList[m.datatype] ;
    //   case 'Date':
    //     return this.operatorList[m.datatype] ;
    //   case 'Number':
    //     return this.operatorList[m.datatype] ;
    //   default:
    //     return this.operatorList['Default']  ;
    // }
  }

  // selectOperand(op, id) {
  //   this.template.ruleset[id].operand = op ;
  //   if(op.valuesource === SourceTypes.REFDATA) {
  //     this.refSvc.getInstances(op.refdatacode, true).subscribe(r => {
  //       if(r.status) {
  //         this.template.ruleset[id].options = r.data ;
  //       }
  //     }) ;
  //   }
  //   if(op === '') {
  //     this.template.ruleset[id].operator = '' ;
  //     this.template.ruleset[id].value = [] ;
  //   }
  // }

  addRuleSet(exp) {
    // this.template.ruleset.push({operand:'', operator: '', value:[]}) ;
    this.template.ruleset = exp;
  }

  deleteRuleSet(idx) {
    this.template.ruleset.splice(idx, 1);
  }

  // getRuleSetValue(ev, i, opt?) {
  //   if(this.template.ruleset[i].operand.uielementtype === UIElementTypes.DROPDOWN) {
  //     this.template.ruleset[i].value = ev ;
  //   }
  //   else {
  //     if(this.template.ruleset[i].operator === OperatorTypes.BETWEEN) {
  //       opt ?  this.template.ruleset[i].value[1] = ev : this.template.ruleset[i].value[0] = ev ;
  //     } else {
  //       this.template.ruleset[i].value = [] ;
  //       this.template.ruleset[i].value[0] = ev
  //     }
  //   }
  // }

  toggleEditContent() {
    this.enableEditContent = !this.enableEditContent;
  }
  toggleOtherRecipient() {
    this.displayOtherRecipient = !this.displayOtherRecipient;
  }

  toggleEditSubject() {
    this.enableEditSubjectLine = !this.enableEditSubjectLine;
  }

  checkFormValidity() {
    if (
      this.template &&
      this.template.name &&
      (this.template.recipients?.length ||
        this.template.initiator ||
        this.template?.externalEmails?.length ||
        this.template.recipientVars) &&
      this.template.subject &&
      this.template.tasks &&
      this.template.body
    ) {
      return this.template.name.length > 0 &&
        (this.template.recipients?.length ||
          this.template.initiator ||
          this.template?.externalEmails.length ||
          this.template.recipientVars) &&
        this.template.subject.content.length > 0 &&
        this.template.tasks.length > 0 &&
        this.template.body.content.length > 0
        ? true
        : false;
    } else {
      return false;
    }
  }

  submitOutsideEmail() {
    if (!this.template.externalEmails) {
      this.template.externalEmails = [];
    }

    !this.template.externalEmails.includes(this.externalEmail)
      ? !this.externalEmail.includes('@ibasis.net') &&
        this.selectedProcess.name == 'Initiation Process Impl'
        ? this.toastrSvc.warning('Mail Address must be in iBasis domain')
        : this.template.externalEmails.push(this.externalEmail)
      : console.log('Already added to other recipient list');
    this.externalEmail = '';
  }

  deleteextemail(email) {
    this.template.externalEmails = this.template.externalEmails.filter(
      (a) => a !== email
    );
  }

  addPoints(ev) {
    this.template.tasks = ev;
  }

  setInitiator(ev) {
    this.template.initiator = ev.checked;
  }
}

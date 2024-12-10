import { TaskSignalService } from '../../_services/task-signal.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TaskCommentModel, TaskDocumentModel } from '../../_models';
import { TaskActionService, TaskInfoService } from '../../_services';
import { UserService, WhatsappService } from 'src/app/core/_services';
import { LoggedUserModel, TagType } from 'src/app/core/_models';
import { Subscription } from 'rxjs';
import { timeStamp } from 'console';
import { TranscriptionModel } from '../../_models/transcription.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transcriptions',
  templateUrl: './transcriptions.component.html',
  styleUrls: ['./transcriptions.component.scss'],
})
export class TranscriptionsComponent implements OnInit, OnChanges {
  @Input() transcriptionList: TranscriptionModel[] = [];
  @Input() transcriptChannels;
  @Input() taskDetails;
  @Input() isShowHistory: boolean;

  displayCommentList;
  transcriptObj: TranscriptionModel = {} as TranscriptionModel;
  taskId: string;
  tagUsers: LoggedUserModel[] = [];
  tagGroups: LoggedUserModel[] = [];
  businessKey: string;
  user: LoggedUserModel;
  subscription: Subscription[] = [];
  docList: TaskDocumentModel[] = [];
  userFullName = 'DS-iFlow';
  searchTerm;
  selectedType = 'whatsapp';
  emamiRoles = [
    'EMAMI-MANAGER_ADMIN',
    'EMAMI-MANAGER_USER',
    'EMAMI_USER',
    'EMAMI_ADMIN',
  ];
  multiMentionConfig = {
    mentions: [],
  };
  showCommentBox = false;
  dontShowSendMessage = false;
  ongoingTasks;
  receivers;
  subject;
  candidateMobile;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'))?.key;

  @ViewChild('commentBox') commentBox;
  @Input() darkTheme: boolean;

  constructor(
    public taskInfoSvc: TaskInfoService,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private taskSignalSvc: TaskSignalService,
    private taskActionSvc: TaskActionService,
    private router: Router,
    private toastrSvc: ToastrService,
    private whatsappSvc: WhatsappService
  ) {}

  allReceivers(variable, selectedType) {
    function getReceivers(receiversStr, item) {
      if (item.defaultType == 'email') {
        return receiversStr + item.defaultValue + ' ; ';
      } else if (item.defaultType == 'variable' && variable) {
        let value = variable.find((a) => a.name === item.defaultValue).value;
        return receiversStr + value + ' ; ';
      }
    }
    if (this.taskDetails.variables.length) {
      this.receivers = this.transcriptChannels
        ?.find((i) => i.id == selectedType)
        .channelDefaults.reduce(getReceivers, '');
    }
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.selectedType = this.transcriptChannels?.find((i) => i.id == 'whatsapp')
      .isVisible
      ? 'whatsapp'
      : 'email';
    const obj = this.transcriptChannels?.find((i) => i.id == this.selectedType);
    this.subject = obj?.emailSubjectText;
    this.userFullName = obj?.defaultWhatsappName;
    const varArray = obj?.emailSubjectVars;
    // console.log(
    //   'CHANNELS ============>',
    //   this.transcriptChannels
    // this.transcriptChannels.find(i => i.id == this.selectedType).defaultWhatsappName
    // );
    this.getAllGroup();
    this.getUsers();
    this.getBusinessKey();
    this.getDocumentList();
    this.getOngoingTasks();
    this.displayCommentList = this.transcriptionList;
    this.subject = this.replaceVariables(this.subject, varArray);
    this.allReceivers(this.taskDetails.variables, this.selectedType);
    // this.readonlyMsgDeterminer();

    this.dontShowSendMessage = this.areItemsPresent(
      this.user.roles,
      this.emamiRoles
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transcriptionList) {
      if (this.selectedProcess === 'Initiation_preScreeningProcess') {
        this.readonlyMsgDeterminer();
      }
      this.displayCommentList = changes.transcriptionList.currentValue;
    }
    if (changes.taskDetails?.currentValue) {
      if (this.selectedProcess === 'Initiation_preScreeningProcess') {
        this.taskDetails = changes.taskDetails.currentValue;
        this.candidateMobile = this.taskDetails.variables.find(
          (i) => i.name == 'psCandidateMobile'
        )?.value;
      } else {
        this.taskDetails = changes.taskDetails.currentValue;
        this.candidateMobile = this.taskDetails.variables.find(
          (i) => i.name == 'phoneNumber'
        )?.value;
      }
    }
  }

  readonlyMsgDeterminer() {
    if (
      this.user?.roles.includes('RECRUITER_ADMIN') ||
      this.user?.roles.includes('RECRUITER_USER')
    ) {
      this.whatsappSvc
        .updateSingleSession({
          key: this.taskDetails.processvariables.psCandidateMobile,
          businessKey: this.taskDetails.processvariables.businessKey,
          data: {
            unreadMessageCount: 0,
          },
        })
        .subscribe((res) => {});
    }
  }

  replaceVariables(string, varArray) {
    let text = string;
    console.log('PROCESS FORM ', this.taskDetails);
    varArray?.forEach((item) => {
      let varValue = this.taskDetails.variables.find(
        (i) => i.name == item
      )?.value;
      if (!varValue) {
        console.log(
          'NOT FOUND--->',
          item,
          this.taskDetails[item],
          this.taskDetails.variables.find((i) => i.name == item)
        );
        text = text.replaceAll('{' + item + '}', this.taskDetails[item]);
      } else {
        text = text.replaceAll('{' + item + '}', varValue);
      }
    });
    // console.log("AFTER REPLACE", text,this.taskDetails.variables)
    return text;
  }
  selectMessageType(type) {
    this.selectedType = type;
    const obj = this.transcriptChannels?.find((i) => i.id == this.selectedType);
    this.subject = obj?.emailSubjectText;
    this.userFullName = obj?.defaultWhatsappName;
    const varArray = obj?.emailSubjectVars;
    this.subject = this.replaceVariables(this.subject, varArray);
    this.allReceivers(this.taskDetails.variables, this.selectedType);
  }
  getOngoingTasks() {
    this.taskSignalSvc.ongoingTasks.subscribe((a) => {
      if (a) {
        this.ongoingTasks = a;
      }
    });
  }
  setDetailsFromRoute() {
    let type = this.router.url.includes('view-contract')
      ? 'Contract Level'
      : 'Task-Level';
    this.taskSignalSvc.taskInfo.subscribe((t) => {
      this.taskDetails = t;
    });
  }
  getDocumentList() {
    this.subscription.push(
      this.taskSignalSvc.docList.subscribe((a) => {
        if (a) {
          this.docList = a;
          this.multiMentionConfig = this.taskActionSvc.getMultiMentionConfig(a);
        }
      })
    );
  }

  filterComments(val) {
    if (val) {
      this.searchTerm = val;
      this.displayCommentList = this.transcriptionList.filter(
        (comment) =>
          comment.userFullName?.toLowerCase().includes(val?.toLowerCase()) ||
          comment.sentText?.toLowerCase().includes(val?.toLowerCase()) ||
          comment.subject?.toLowerCase().includes(val?.toLowerCase())
      );
    }
  }

  getBusinessKey(): void {
    this.subscription.push(
      this.taskSignalSvc.businessKey.subscribe((a) => {
        if (a) {
          this.businessKey = a;
        }
      })
    );
  }

  getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.tagUsers = a.data;
    });
  }

  getAllGroup() {
    this.userSvc.getUserGroups().subscribe((a) => {
      this.tagGroups = a.data?.filter(
        (group) => group.id != 'camunda-admin' && group.id != 'guest'
      );
    });
  }

  sendComment(): void {
    console.log('Transcript >>', this.transcriptObj);
    // this.taskInfoSvc
    //   .postTranscript(this.transcriptObj, this.taskId, this.businessKey)
    //   .subscribe((a) => {
    //     if (a.status) {
    //       localStorage.removeItem(`comment-${this.user.userid}`);
    //       this.transcriptObj = { sentText: '', } as TranscriptionModel;
    //       this.transcriptionList.unshift(a.data);
    //     }
    //   });
  }

  public getComment() {
    // console.log("FROM TRANSCRIPTIONS ",this.commentBox.getComment())
    return this.commentBox.getComment();
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

  public insertDocTagHtml(doc) {
    return `<span
      class="mention doc-mention" style="color: #0275d8"  id="${doc.name}" data-tagtype="${TagType.DOCUMENT}"
      data-version="${doc.version}" contenteditable="false"
      >${doc.name}_v${doc.version}</span>`;
  }

  bytesToMegaBytes(bytes) {
    return bytes / (1024 * 1024);
  }

  onSubmitted(htmlstring) {
    // console.log('COMMNT------->', htmlstring);
    // let levelInfo = this.taskActionSvc.setLevelInfo(
    //   this.ongoingTasks,
    //   this.user
    // );

    let subject = '';
    let emailReceivers = this.transcriptChannels.find(
      (i) => i.id == this.selectedType
    ).channelDefaults;
    let emailData = htmlstring;
    if (htmlstring?.emailText) {
      emailData = htmlstring.emailText;
      emailReceivers = htmlstring.emailReceivers;
      subject = htmlstring.emailSubject;
    }
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(emailData, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'];
    console.log(
      'WHATSAPP MESSAGE ',
      this.selectedType,
      'emailData',
      subjectline
    );
    if (!htmlstring.emailText) {
      subject =
        this.selectedType == 'email'
          ? this.subject + ': ' + this.businessKey
          : null;
    }
    const userFullName = `${this.user.fullname}`;
    const attachments = this.taskActionSvc.emailSelectedFiles;
    const fileSize = attachments.reduce(
      (currValue, currentItem) => currValue + currentItem.size,
      0
    );
    // console.log("bytesToMegaBytes", attachments, fileSize);
    if (this.bytesToMegaBytes(fileSize) > 15) {
      this.toastrSvc.warning('Total File size exceeds 15MB limit!');
      return;
    }
    if (
      this.selectedType == 'email' &&
      (!this.receivers || !subjectline || !subject)
    ) {
      if (!this.receivers)
        this.toastrSvc.warning('Please enter receivers email ids.');
      if (!subjectline) this.toastrSvc.warning('Please enter a message.');
      if (!subject) this.toastrSvc.warning('Please enter the subject.');
    } else if (this.selectedType == 'whatsapp' && !subjectline) {
      this.toastrSvc.warning('Please enter a message.');
    } else {
      this.taskActionSvc.emailSelectedFiles = [];
      this.taskActionSvc.onTranscriptSubmitted(
        emailData,
        this.businessKey,
        this.transcriptionList,
        this.taskInfoSvc.emailRecipientId,
        userFullName,
        this.selectedType,
        () => this.filterComments(this.searchTerm),
        subject,
        emailReceivers,
        this.candidateMobile,
        attachments
      );
    }
  }

  areItemsPresent(arr, itemsToCheck) {
    for (let i = 0; i < itemsToCheck.length; i++) {
      if (arr.includes(itemsToCheck[i])) {
        return false;
      }
    }
    return true;
  }
}

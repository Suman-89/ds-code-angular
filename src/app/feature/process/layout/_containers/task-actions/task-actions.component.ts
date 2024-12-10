import {
  TaskSignalService,
  TaskInfoService,
  TaskActionService,
  TaskService,
} from './../../_services';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskCommentModel } from '../../_models';
import { SharedService, UserService } from 'src/app/core/_services';
import { TranscriptionModel } from '../../_models/transcription.model';
// import { GroupModel, UserModel } from 'src/app/feature/user-management/_models';
// import { LoggedUserModel } from 'src/app/core/_models';

@Component({
  selector: 'app-task-actions',
  templateUrl: './task-actions.component.html',
  styleUrls: ['./task-actions.component.scss'],
})
export class TaskActionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() actions = [];
  @Input() activeTab = '';
  @Input() tasks = [];
  @Input() taskId: string;
  @Input() viewtype: string;
  @Input() businessKey: string;
  @Input() comments: TaskCommentModel[] = [];
  @Input() transcriptions: TranscriptionModel[] = [];
  @Input() completedContract: boolean = false;
  @Input() emailSubject? = '';
  @Input() emailRecipientId? = '';
  @Input() taskDetails;
  @Input() darkTheme = false;
  @ViewChild('comment') commentBox;
  isShowHistory: boolean;
  transcriptChannels;
  genAgainSummary: boolean = false;

  summary: string;
  summaryBool: boolean = false;
  localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  selectedAction: any;
  subscription: Subscription[] = [];
  comCount = 1;
  receivers = '';
  isPreScreeningProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_preScreeningProcess';
  isContractProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Process_initiation_impl';
  isAgro_AdvisoryProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_agroAdvisoryProcess';

  constructor(
    private taskSignalSvc: TaskSignalService,
    private taskActionSvc: TaskActionService,
    private taskSvc: TaskService,
    private userSvc: UserService,
    public sharedSvc: SharedService,
    public taskInfoSvc: TaskInfoService
  ) {}

  ngOnInit(): void {
    this.isShowHistory = this.actions.find(
      (i) => i.id == 'transcript'
    )?.showHistory;

    this.transcriptChannels = this.actions.find(
      (i) => i.id == 'transcript'
    )?.channels;

    this.selectedAction = this.isPreScreeningProcess
      ? this.actions[0]
      : this.isAgro_AdvisoryProcess
      ? this.actions[0]
      : this.actions[this.actions.length - 1];
    console.log('selectedAction', this.selectedAction);

    this.subscribeToDefault();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {

    //Commenting this line to apply new logic.
    // if (changes.activeTab) {
    //   const activeTab = this.actions.find(
    //     (i) => i.id == changes?.activeTab?.currentValue
    //   );
    //   console.log("Active tab ", activeTab);
    //   this.selectedAction = activeTab ? activeTab : this.actions[0];
    //   console.log("Selected Action :: ", this.selectedAction);
    // }

    //new logic to show the information of first action.
    if (changes.actions) {
      if (changes.actions.currentValue.length > 0) {
        let size = changes.actions.currentValue.length;
        this.selectedAction = changes.actions.currentValue[size-1];
      }
    }
    this.hideSummery();
  }

  subscribeToDefault(): void {
    this.subscription.push(
      this.taskSignalSvc.defaultTab.subscribe((a) => {
        if (a && this.actions.length > 0) {
          this.selectAction(this.actions.find((i) => i.name == a));
        }
      })
    );
  }

  selectAction(e): void {
    if (e) {
      this.selectedAction = e;
      e.name === 'Comments' ? (this.comCount = 0) : (this.comCount = 1);
    }
  }

  downloadPDF(): void {
    if (!this.viewtype) {
      this.viewtype = 'task';
    }

    console.log(
      'DOWNLOAD PDF------------>',
      this.taskId,
      this.selectedAction.id,
      this.viewtype
    );
    this.taskActionSvc.downloadReport(
      this.taskId,
      this.selectedAction.id,
      this.viewtype,
      this.localTimeZone
    );
  }

  public postComment(callback) {
    if (this.selectedAction.id == 'comment' && this.viewtype == 'task') {
      let comment = this.commentBox.getComment();
      if (comment && comment.trim().length !== 0) {
        let parser = new DOMParser();
        let htmlDoc = parser.parseFromString(comment, 'text/html');
        if (htmlDoc?.children[0]['innerText'].trim()) {
          this.taskActionSvc.onCommentSubmitted(
            comment,
            this.taskId,
            this.businessKey,
            this.comments,
            callback
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  //to show summaryBool
  showSummery() {
    this.taskInfoSvc
      .getSummary(
        this.taskDetails.contractid
          ? this.taskDetails.contractid
          : this.taskDetails.businessKey,
        this.genAgainSummary
      )
      .subscribe((res) => {
        this.summary = res.data;
        this.summaryBool = true;
      });
  }
  hideSummery() {
    this.summaryBool = false;
  }

  generateAgainSummaryFn() {
    this.showSummery();
  }
}

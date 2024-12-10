import { TaskSignalService } from './../../_services/task-signal.service';
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
import { UserService } from 'src/app/core/_services';
import { LoggedUserModel, TagType } from 'src/app/core/_models';
import { Subscription } from 'rxjs';
import { timeStamp } from 'console';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() commentList: TaskCommentModel[] = [];
  @Input() darkTheme: boolean;
  displayCommentList;
  commentObj: TaskCommentModel = {} as TaskCommentModel;
  taskId: string;
  tagUsers: LoggedUserModel[] = [];
  tagGroups: LoggedUserModel[] = [];
  businessKey: string;
  user: LoggedUserModel;
  subscription: Subscription[] = [];
  docList: TaskDocumentModel[] = [];
  searchTerm;
  multiMentionConfig = {
    mentions: [
      /* {
          items: this.tagUsers,
          triggerChar: '@',
          insertHtml: true,
          labelKey:'fullname',
          mentionSelect: this.insertUserTagHtml,
      } ,
      {
          items: this.tagGroups,
          triggerChar: '#',
          insertHtml: true,
          mentionSelect: this.insertGroupTagHtml,
      }, */
    ],
  };
  showCommentBox = true;
  taskDetails;
  ongoingTasks;
  @ViewChild('commentBox') commentBox;

  constructor(
    private taskInfoSvc: TaskInfoService,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private taskSignalSvc: TaskSignalService,
    private taskActionSvc: TaskActionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getAllGroup();
    this.getUsers();
    this.getBusinessKey();
    this.getDocumentList();
    this.getOngoingTasks();
    this.displayCommentList = this.commentList;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.commentList) {
      this.displayCommentList = changes.commentList.currentValue;
    }
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
      this.displayCommentList = this.commentList.filter(
        (comment) =>
          comment.name?.toLowerCase().includes(val?.toLowerCase()) ||
          comment.message?.toLowerCase().includes(val?.toLowerCase())
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
      // if (!this.multiMentionConfig.mentions.includes(i => i.triggerChar == '@')) {
      //   this.multiMentionConfig.mentions.push({
      //   items: this.tagUsers,
      //   triggerChar: '@',
      //   insertHtml: true,
      //   labelKey: 'fullname',
      //   mentionSelect: this.insertUserTagHtml,
      // });
      // }
    });
  }

  getAllGroup() {
    this.userSvc.getUserGroups().subscribe((a) => {
      this.tagGroups = a.data?.filter(
        (group) => group.id != 'camunda-admin' && group.id != 'guest'
      );
      // if (!this.multiMentionConfig.mentions.includes(i => i.triggerChar == '#')) {
      //  this.multiMentionConfig.mentions.push({
      //   items: this.tagGroups,
      //   triggerChar: '#',
      //   insertHtml: true,
      //   labelKey: 'name',
      //   mentionSelect: this.insertGroupTagHtml,
      // });
      // }
    });
  }

  sendComment(): void {
    this.taskInfoSvc
      .postComment(this.commentObj, this.taskId, this.businessKey)
      .subscribe((a) => {
        if (a.status) {
          localStorage.removeItem(`comment-${this.user.userid}`);
          this.commentObj = { message: '', users: [] } as TaskCommentModel;
          this.commentList.unshift(a.data);
        }
      });
  }

  public getComment() {
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

  onSubmitted(htmlstring) {
    // console.log("COMMNT------->",htmlstring)
    let levelInfo = this.taskActionSvc.setLevelInfo(
      this.ongoingTasks,
      this.user
    );
    this.taskActionSvc.onCommentSubmitted(
      htmlstring,
      this.taskId,
      this.businessKey,
      this.commentList,
      () => this.filterComments(this.searchTerm),
      levelInfo
    );
  }
}

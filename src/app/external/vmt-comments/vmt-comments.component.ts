import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CommentBoxConstants,
  CommentBoxOptions,
  TagType,
} from 'src/app/core/_models';
import { MentionDirective } from '@tectes/angular-mentions';
import { ActivatedRoute } from '@angular/router';
import {
  TaskActionService,
  TaskInfoService,
  TaskService,
  TaskSignalService,
} from 'src/app/feature/process/layout/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullCommentBoxModalComponent } from 'src/app/shared/_modals';
import { GatekeeperService, UserService } from 'src/app/core/_services';
import { Subscription } from 'rxjs';

declare var tinymce;

const KEY_F = 70;

@Component({
  selector: 'app-vmt-comments',
  templateUrl: './vmt-comments.component.html',
  styleUrls: ['./vmt-comments.component.scss'],
})
export class VmtCommentsComponent implements OnInit, OnDestroy {
  commenttype = 'Comment';
  businesskey = '';
  comments = [];
  displayCommentList = [];
  tasks = [];
  showCommentBox = true;
  showSubmitBtn = true;
  showFullScreenIcon = true;
  defaultCommentBoxOptions: CommentBoxOptions = {
    allowFullScreen: true,
    height: 100,
    id: this.generateRandomId(),
    plugins: CommentBoxConstants.TINYMCE_SHORT_PLUGINS,
    toolbar: CommentBoxConstants.TINYMCE_SHORT_TOOLBAR,
    clearAfterSubmit: true,
  };
  ongoingTasks = [];
  commentList = [];
  docList = [];
  tagUsers;
  user = JSON.parse(localStorage.getItem('user'));
  taskId;
  subscription: Subscription[] = [];
  processName = 'Initiation VMT Process';
  searchTerm;
  clearAfterSubmit = true;
  documentList = [];
  @ViewChild('comment') comment: ElementRef;
  @ViewChild(MentionDirective, { static: true }) mention: MentionDirective;

  _commentBoxOptions = this.defaultCommentBoxOptions;

  set commentBoxOptions(opt: CommentBoxOptions) {
    this._commentBoxOptions = { ...this.defaultCommentBoxOptions, ...opt };
  }
  multiMentionConfig = {
    mentions: [],
  };

  contractInfo;

  constructor(
    private route: ActivatedRoute,
    private taskInfoSvc: TaskInfoService,
    private modalService: NgbModal,
    private taskActionSvc: TaskActionService,
    private taskSvc: TaskService,
    private taskSignalSvc: TaskSignalService,
    private gatekeeperSvc: GatekeeperService,
    private userSvc: UserService,
    private _zone: NgZone
  ) {}

  ngOnInit(): void {
    this.businesskey = this.route.snapshot.paramMap.get('businessKey');
    if (window.location !== window.parent.location) {
      this.subscribeToUserChange();
    } else this.init();
  }

  ngAfterViewInit() {
    tinymce.init({
      // mode: 'textareas',
      // theme: 'silver',
      mode: 'exact',
      height: this._commentBoxOptions.height,
      plugins: this._commentBoxOptions.plugins,
      toolbar: this._commentBoxOptions.toolbar,
      forced_root_block: 'div',
      menubar: false,
      statusbar: false,
      elements: this._commentBoxOptions.id,
      setup: this.tinySetup.bind(this),
    });
  }

  tinySetup(ed) {
    ed.on('init', (args) => {
      this.mention.setIframe(ed.iframeElement);
    });
    ed.on('keydown', (e) => {
      this.keyHandler(e, ed);
    });
    /* ed.addShortcut(
      'meta+alt+y', 'Add yellow highlight to selected text.', function () {
      ed.execCommand('hilitecolor', false , '#FFFF00');
    });
    ed.on('ExecCommand', function(e) {
      console.log('The ' + e.command + ' command was fired.');
    }); */
  }

  keyHandler(e, ed) {
    if (
      this._commentBoxOptions?.allowFullScreen &&
      e.altKey &&
      e.keyCode == KEY_F
    ) {
      this._zone.run(() => {
        this.showFullCommentBoxModal();
      });
    } else {
      let frame = <any>window.frames[ed.iframeElement.id];
      let contentEditable = frame.contentDocument.getElementById('tinymce');
      this._zone.run(() => {
        this.mention.keyHandler(e, contentEditable);
        // this.saveComments();
      });
    }
  }

  subscribeToUserChange(): void {
    this.subscription.push(
      this.gatekeeperSvc.loggedInUserEmitter.subscribe((user) => {
        if (user) {
          this.user = user;
          this.init();
        } else {
          this.user = null;
        }
      })
    );
  }

  init() {
    // this.subscribeToMultiMentionConfig();
    this.getContractInfo();
    this.getComments();
  }

  subscribeToMultiMentionConfig() {
    this.multiMentionConfig = this.taskActionSvc.getMultiMentionConfig(
      this.documentList
    );

    this.taskActionSvc.multiConfigMentionReady.subscribe((val) => {
      if (val.length === 3) {
        this.mention.updateConfig();
      }
    });
  }

  getContractInfo() {
    this.taskSvc.getContractById(this.businesskey).subscribe((a) => {
      if (a.status) {
        this.contractInfo = a.data;
        this.getCompanyDoc();
      }
    });
  }

  getCompanyDoc(): void {
    this.taskInfoSvc
      .getFilteredDocumentList('', this.businesskey)
      .subscribe((a) => {
        if (a.status) {
          if (
            this.contractInfo.completiondatetime &&
            !this.contractInfo.terminated
          ) {
            // a.data['Deal Documents'] = a.data['Other'];
            delete a.data['Final-unsigned'];
            delete a.data['Company Documents'];
            delete a.data['Other'];
          }
          // this.documentMap = a.data;
          // taskDocTypes = taskDocTypes.filter(d => d !== 'Final-unsigned') ;

          let taskDocTypes = Object.keys(a.data);
          taskDocTypes.forEach(
            (i) => (this.documentList = [...this.documentList, ...a.data[i]])
          );

          this.subscribeToMultiMentionConfig();
          // this.documentList = this.documentList.filter(d => d.foldername !== 'Final-unsigned') ;
          // this.taskSignalSvc.docList.next(this.documentList);
          // this.taskSignalSvc.docMap.next(a.data);
        }
      });
  }

  getComments() {
    this.taskInfoSvc
      .getCommentList(this.businesskey, this.processName)
      .subscribe((resp) => {
        this.commentList = resp.data;
        this.commentList.sort((a, b) =>
          new Date(a.createdtime) < new Date(b.createdtime) ? 1 : -1
        );
        this.displayCommentList = this.commentList;
      });
  }

  private generateRandomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  public getComment() {
    // console.log(this.mention.getComment().getComment());
    return this.mention.getComment();
  }

  clearComment() {
    localStorage.removeItem(`comment-${this.user.userid}`);
    if (this._commentBoxOptions.clearAfterSubmit) {
      this.mention.clearComment();
    }
  }
  save() {
    const comment = this.getComment();

    this.onSubmitted(comment);
    this.clearComment();
  }

  showFullCommentBoxModal() {
    const modalRef = this.modalService.open(FullCommentBoxModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.mentionConfig = this.multiMentionConfig;
    modalRef.componentInstance.commenttype = this.commenttype;

    modalRef.componentInstance.commentBoxOptions = {
      allowFullScreen: false,
      height: 300,
      plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
      toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
    };
    modalRef.componentInstance.onSubmitted.subscribe((e) => {
      this.onSubmitted(e);
    });
  }

  onSubmitted(htmlstring) {
    let levelInfo = this.taskActionSvc.setLevelInfo(
      this.ongoingTasks,
      this.user
    );
    this.taskActionSvc.onCommentSubmitted(
      htmlstring,
      this.taskId,
      this.businesskey,
      this.commentList,
      () => {
        this.displayCommentList = this.commentList.filter((comment) =>
          comment.message.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      },
      levelInfo,
      this.processName
    );
  }

  filterComments(val) {
    this.searchTerm = val;
    this.displayCommentList = this.commentList.filter((comment) =>
      comment.message.toLowerCase().includes(val.toLowerCase())
    );
  }

  getTasks(): void {
    this.taskSvc.getNextTask(null, this.businesskey).subscribe((a) => {
      if (a.status && a.data) {
        this.tasks = a.data.tasks;
        this.tasks.map(
          (i) => (i.readonly = !i.assignee || i.assignee !== this.user.userid)
        );

        let userTask = this.tasks.find((i) => i.assignee !== this.user.userid);

        this.taskId = userTask.id;
        this.taskSignalSvc.ongoingTasks.next(this.tasks);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }
}

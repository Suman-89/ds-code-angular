import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CommentBoxConstants,
  LoggedUserModel,
  TagType,
} from 'src/app/core/_models';
import {
  TaskActionService,
  TaskInfoService,
  TaskSignalService,
} from 'src/app/feature/process/layout/_services';
import { FullCommentBoxModalComponent } from 'src/app/shared/_modals';

@Component({
  selector: 'app-vmt-display-comment',
  templateUrl: './vmt-display-comment.component.html',
  styleUrls: ['./vmt-display-comment.component.scss'],
})
export class VmtDisplayCommentComponent implements OnInit {
  private _data;

  @Input('data')
  set data(data: any) {
    if (data) {
      this._data = {
        ...data,
        santizedMessage: this.sanitizer.bypassSecurityTrustHtml(data.message),
      };
    }
  }

  get data() {
    return this._data;
  }

  @Input() allowReply;
  @Input() docList;

  isTruncateNeeded;
  disabled;
  user: LoggedUserModel;
  ongoingTasks = [];
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private taskInfoSvc: TaskInfoService,
    private taskActionSvc: TaskActionService,
    private taskSignalSvc: TaskSignalService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getOngoingTasks();
  }
  getOngoingTasks() {
    this.taskSignalSvc.ongoingTasks.subscribe((a) => {
      if (a) {
        this.ongoingTasks = a;
      }
    });
  }

  toggleFullText() {
    this.disabled = !this.disabled;
  }

  handler(hasTruncated) {
    this.isTruncateNeeded = hasTruncated;
  }

  returnIsTruncated() {
    let doc = document.getElementById(`${this.data.id}`);
    if (doc.innerText.length > 100) {
      return true;
    } else {
      return false;
    }
  }

  replyComment() {
    const modalRef = this.modalService.open(FullCommentBoxModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.mentionConfig =
      this.taskActionSvc.getMultiMentionConfig(this.docList);
    modalRef.componentInstance.commentBoxOptions = {
      allowFullScreen: false,
      height: 300,
      plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
      toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
    };
    modalRef.componentInstance.commenttype = 'Reply';
    modalRef.componentInstance.onSubmitted.subscribe((e) => {
      this.onReplySubmit(e);
    });
  }

  toggleReply() {
    if (this.data.showReply) {
      this.data.showReply = false;
    } else {
      if (!this.data.replies) {
        this.taskInfoSvc.getAllReplies(this.data.id).subscribe((resp) => {
          if (resp.status) {
            this.data.replies = resp.data;
            this.data.showReply = true;
          }
        });
      } else {
        this.data.showReply = true;
      }
    }
  }

  onReplySubmit(e) {
    if (e) {
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(e, 'text/html');
      if (htmlDoc?.children[0]['innerText'].trim()) {
        let reqdata = {
          message: e,
          users: [],
          groups: [],
          documents: [],
          levelInfo: '',
        };
        let mentions = htmlDoc.getElementsByClassName('mention');

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
        reqdata.levelInfo = this.taskActionSvc.setLevelInfo(
          this.ongoingTasks,
          this.user
        );

        this.taskInfoSvc
          .replyComment(reqdata, this.data.id)
          .subscribe((resp) => {
            if (resp.status) {
              localStorage.removeItem(`comment-${this.user.userid}`);
              if (this.data.replies) {
                this.data.replies = [resp.data, ...this.data.replies];
              }
              this.data.replycount += 1;
            }
          });
      }
    }
  }
}

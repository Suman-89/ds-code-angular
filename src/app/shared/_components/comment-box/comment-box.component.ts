import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MentionDirective } from '@tectes/angular-mentions';
import { FullCommentBoxModalComponent } from '../../_modals';
import {
  CommentBoxConstants,
  CommentBoxOptions,
  LoggedUserModel,
  TagType,
} from 'src/app/core/_models';
import { SharedService } from 'src/app/core/_services';
import { EmailAttachmentComponent } from 'src/app/feature/process/layout/_modals';
import { TaskActionService } from 'src/app/feature/process/layout/_services';

declare var tinymce;

const KEY_F = 70;

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit, AfterViewInit {
  @Input() commenttype? = 'Comment';
  @Input() subject? = '';
  @Input() receivers? = '';
  @Input() fromFullScreen? = false;
  @Input() darkTheme: boolean;
  showFullScreenIcon = false;
  txtAreaLen;
  @Input() taskDetails;
  @Input() maxChar: number = 0;
  defaultCommentBoxOptions: CommentBoxOptions = {
    allowFullScreen: true,
    height: 100,
    id: this.generateRandomId(),
    plugins: CommentBoxConstants.TINYMCE_SHORT_PLUGINS,
    toolbar: CommentBoxConstants.TINYMCE_SHORT_TOOLBAR,
    clearAfterSubmit: true,
  };

  _commentBoxOptions = this.defaultCommentBoxOptions;
  user: LoggedUserModel;

  @Input() commentMentionConfig;
  @Input() clearAfterSubmit? = true;
  @Input()
  set commentBoxOptions(opt: CommentBoxOptions) {
    this._commentBoxOptions = { ...this.defaultCommentBoxOptions, ...opt };
  }
  @Input() isTemplate? = false;
  @Input() showSubmitBtn? = true;
  @Input() templateType;
  @Output() submitted = new EventEmitter();

  @ViewChild('comment') comment: ElementRef;
  @ViewChild('commentBox') commentBox;

  @ViewChild(MentionDirective, { static: true }) mention: MentionDirective;

  countTimeInSec = 0;
  enabledUpTo;

  constructor(
    private modalService: NgbModal,
    private _zone: NgZone,
    public sharedSvc: SharedService,
    public taskActionSvc: TaskActionService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this._commentBoxOptions.clearAfterSubmit = this.clearAfterSubmit;
    this.defaultCommentBoxOptions.clearAfterSubmit = this.clearAfterSubmit;
    if (this.commentMentionConfig.mentions.length <= 1) {
      this.commentMentionConfig.mentions.push({
        items: this.sharedSvc.allUsers,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
      //labelkey changed from email to fullname
      this.commentMentionConfig.mentions.push({
        items: this.sharedSvc.allGroups?.filter(
          (group) => group.id != 'camunda-admin' && group.id != 'guest'
        ),
        triggerChar: '#',
        insertHtml: true,
        labelKey: 'name',
        mentionSelect: this.insertGroupTagHtml,
      });
    }
    // console.log("CONFIGURATION TEST>>>>>",this.commentMentionConfig.mentions)
    if (
      this.commenttype === 'whatsapp' &&
      this.taskDetails?.processvariables?.psWaEnabledUpto
    ) {
      this.countTimeInSec =
        (new Date(
          this.taskDetails.processvariables?.psWaEnabledUpto
        ).getTime() -
          new Date().getTime()) /
        1000;
      this.enabledUpTo = this.taskDetails.processvariables?.psWaEnabledUpto
        .toString()
        .split('T')[0]
        .split('-')
        .reverse()
        .join('-');
    }

    // console.log('Animesh khamrui aaaaaaaaaaaaaaaa', this.countTimeInSec);
  }

  onSubmitted(e) {
    this.submitted.emit(e);
    this.clearComment(); // added for after submit commment removal reqmt
  }

  clearComment() {
    localStorage.removeItem(`comment-${this.user.userid}`);
    if (this._commentBoxOptions.clearAfterSubmit) {
      this.mention?.clearComment();
    }
  }
  save() {
    const comment = this.getComment();
    this.submitted.emit(comment);
    this.clearComment();
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

  showFullCommentBoxModal() {
    const modalRef = this.modalService.open(FullCommentBoxModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.mentionConfig = this.commentMentionConfig;
    modalRef.componentInstance.commenttype = this.commenttype;
    modalRef.componentInstance.receivers = this.receivers;
    modalRef.componentInstance.editSubject = this.subject;
    if (this.isTemplate) {
      modalRef.componentInstance.isTemplate = this.isTemplate;
      modalRef.componentInstance.templateType = this.templateType;
    }
    modalRef.componentInstance.commentBoxOptions = {
      allowFullScreen: false,
      height: 300,
      plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
      toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
    };
    modalRef.componentInstance.onSubmitted.subscribe((e) => {
      if (this.isTemplate) {
        localStorage.setItem(
          `${this.templateType}-content-${this.user.userid}`,
          e
        );
      }
      this.onSubmitted(e);
    });
  }

  saveComments(): void {
    setTimeout(() => {
      const commentMessage = this.getComment();
      !this.isTemplate
        ? localStorage.setItem(`comment-${this.user.userid}`, commentMessage)
        : localStorage.setItem(
            `${this.templateType}-content-${this.user.userid}`,
            commentMessage
          );
    }, 100);
  }

  fetchTemplateContent(): string {
    let comment = localStorage.getItem(
      `${this.templateType}-content-${this.user.userid}`
    );
    return comment;
  }

  fetchComment(): void {
    const commentMessage = this.isTemplate
      ? this.fetchTemplateContent()
      : localStorage.getItem(`comment-${this.user.userid}`);
    if (commentMessage) {
      tinymce.get(this._commentBoxOptions.id).setContent(commentMessage);
    }
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
        this.saveComments();
      });
    }
  }

  txtContentLen: any;

  public getComment() {
    // return this.comment.nativeElement.innerHTML;
    //let container = this.mention['iframe'].contentDocument.getElementById('tinymce');
    /* let commentHtml = container.firstChild.innerHTML;
    return commentHtml; */
    //return container;
    // console.log();
    console.log(
      'SUBJECT >>>>>>>>',
      this.commentBox?.getComment(),
      this.mention.getComment()
    );
    const response = this.mention.getComment(); // Replace with your actual response

    const parser = new DOMParser();
    const doc = parser.parseFromString(response, 'text/html');

    const divElement = doc.querySelector('div');
    if (divElement) {
      const textContent = divElement.textContent;
      console.log('Text Content:', textContent.length);
      this.txtContentLen = textContent.length;
    } else {
      console.log('No <div> element found in the response.');
    }

    this.txtAreaLen = this.mention.getComment().length - 11;
    return this.mention.getComment();
  }

  ngAfterViewInit() {
    tinymce.init({
      mode: 'exact',
      // mode: 'textareas',
      height: this._commentBoxOptions.height,
      // theme: 'silver',
      plugins: this._commentBoxOptions.plugins,
      toolbar: this._commentBoxOptions.toolbar,
      forced_root_block: 'div',
      menubar: false,
      statusbar: false,
      elements: this._commentBoxOptions.id,
      setup: this.tinySetup.bind(this),
    });

    this.fetchComment();
  }
  tinySetup(ed) {
    ed.on('init', (args) => {
      this.mention?.setIframe(ed.iframeElement);
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

  openEmailAttachment() {
    const ngbModalOpt: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static',
      size: 'lg',
    };
    const refMod = this.modalService.open(
      EmailAttachmentComponent,
      ngbModalOpt
    );
    refMod.componentInstance.taskDetails = null;
    refMod.componentInstance.opt = 1;
    refMod.componentInstance.emitUser.subscribe((r: any[]) => {
      refMod.close();
    });
  }
}

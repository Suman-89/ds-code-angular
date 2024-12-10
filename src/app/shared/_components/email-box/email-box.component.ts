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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MentionDirective } from '@tectes/angular-mentions';
import { FullCommentBoxModalComponent } from '../../_modals';
import {
  CommentBoxConstants,
  CommentBoxOptions,
  LoggedUserModel,
  TagType,
} from 'src/app/core/_models';
import { SharedService } from 'src/app/core/_services';

declare var tinymce;

const KEY_F = 70;

@Component({
  selector: 'app-email-box',
  templateUrl: './email-box.component.html',
  styleUrls: ['./email-box.component.scss'],
})
export class EmailBoxComponent implements OnInit, AfterViewInit {
  @Input() commenttype?= 'Comment';
  @Input() value ="" ;
  showFullScreenIcon = false;
  defaultCommentBoxOptions: CommentBoxOptions = {
    allowFullScreen: true,
    height: 50,
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
    this._commentBoxOptions = { ...this.defaultCommentBoxOptions, ...opt,height: 50, };
  }
  @Input() isTemplate?= false;
  @Input() label;
  @Input() showSubmitBtn? = true;
  @Input() templateType;
  @Output() submitted = new EventEmitter();
  @ViewChild('comment') comment: ElementRef;

  @ViewChild(MentionDirective, { static: true }) mention: MentionDirective;

  constructor(private modalService: NgbModal, private _zone: NgZone, public sharedSvc:SharedService) {}

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
    this.commentMentionConfig.mentions.find(i => i.triggerChar == '@').mentionSelect = this.insertUserTagHtml;
  }

  onSubmitted(e) {
    this.submitted.emit(e);
    this.clearComment(); // added for after submit commment removal reqmt
  }

  clearComment() {
    localStorage.removeItem(`comment-${this.user.userid}`);
    if (this._commentBoxOptions.clearAfterSubmit) {
      this.mention.clearComment();
    }
  }
  save() {
    const comment = this.getComment();
    // return;
    this.submitted.emit(comment);
    this.clearComment();
  }

  
  public insertUserTagHtml(user) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${user.userid}" data-tagtype="${TagType.USER}"
      contenteditable="false"
      >${user.email}</span>`;
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
        // localStorage.setItem(
        //   `${this.templateType}-content-${this.user.userid}`,
        //   e
        // );
      }
      this.onSubmitted(e);
    });
  }

  saveComments(): void {
    setTimeout(() => {
      const commentMessage = this.getComment();
      // !this.isTemplate
      //   ? localStorage.setItem(`comment-${this.user.userid}`, commentMessage)
      //   : localStorage.setItem(
      //       `${this.templateType}-content-${this.user.userid}`,
      //       commentMessage
      //     );
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

  public getComment() {
    // return this.comment.nativeElement.innerHTML;
    //let container = this.mention['iframe'].contentDocument.getElementById('tinymce');
    /* let commentHtml = container.firstChild.innerHTML;
    return commentHtml; */
    //return container;
    console.log(this.mention);

    return this.mention.getComment();
  }

  ngAfterViewInit() {
    tinymce.init({
      mode: 'exact',
      // mode: 'textareas',
      // height: this._commentBoxOptions.height,
       height : 48,
      // theme: 'silver',
      plugins: this._commentBoxOptions.plugins,
      toolbar: this._commentBoxOptions.toolbar,
      forced_root_block: 'div',
      menubar: false,
      statusbar: false,
      elements: this._commentBoxOptions.id,
      setup: this.tinySetup.bind(this),
    });

    // this.fetchComment();
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
}

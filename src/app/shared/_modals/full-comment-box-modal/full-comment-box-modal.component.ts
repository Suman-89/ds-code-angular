import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TaskActionService } from 'src/app/feature/process/layout/_services';

@Component({
  selector: 'app-full-comment-box-modal',
  templateUrl: './full-comment-box-modal.component.html',
  styleUrls: ['./full-comment-box-modal.component.scss'],
})
export class FullCommentBoxModalComponent implements OnInit, OnChanges {
  @Input() commenttype? = 'Write Comment';
  @Input() mentionConfig;
  @Input() commentBoxOptions;
  @Input() isTemplate? = false;
  @Input() templateType? = false;
  @Input() closeOnSubmit?: boolean = true;
  @Input() receivers?= '';
  @Input() editSubject?= '';
  @Output() onSubmitted = new EventEmitter();
  @ViewChild('commentBox') commentBox;
  @ViewChild('commentSubject') commentSubject;

  constructor(public activeModal: NgbActiveModal,public taskActionSvc:TaskActionService,private toastrSvc: ToastrService,) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.checkMentionCondtn();
  }

  ngOnInit(): void {
    console.log("TYPE on Init", this.commenttype, this.mentionConfig.mentions);
     console.log("RECEivers000000000000 ",this.receivers)
  }

  checkMentionCondtn() {
    let condtn;
    if (
      this.commenttype.toLowerCase() === 'comment' ||
      this.commenttype.toLowerCase() === 'reply'
    ) {
      condtn = this.mentionConfig.mentions.length > 0 ? true : false;
    } else {
      condtn = this.mentionConfig ? true : false;
    }
    return true;
  }

  createPlainText(htmlstring,type?) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlstring, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'].trim().replaceAll(',', " ").replaceAll(';', " ");
    const variablePattern = /[^{\}]+(?=})/g;
    const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/g;
    const emailList = subjectline.match(emailPattern);
    const extractParams = subjectline.match(variablePattern);
    const emailObjs = emailList?.map(i => ({ "defaultValue": i, "defaultType": "email" }))
    const variableObjs = extractParams?.map(i => ({ "defaultValue": i, "defaultType": "variable" }))
    let receivers=[];
    if (emailObjs?.length) {
      receivers.push(...emailObjs)
    } else if (variableObjs?.length) {
      receivers.push(...variableObjs);
    }
    console.log("TYPE======",type,receivers,subjectline)
    if (type) {
      return receivers;
    }
    return subjectline;
  }

  submitted(e) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(e, 'text/html');
    var subjectline = htmlDoc?.children[0]['innerText'];
    let receivers = this.createPlainText(this.commentBox?.getComment(),'list')
    let subject = this.createPlainText(this.commentSubject?.getComment())
    if (this.commenttype == 'email') {
      if (!subjectline || !receivers.length || !subject) {
        if (!receivers.length) this.toastrSvc.warning("Please enter receivers email ids.")
        if (!subjectline) this.toastrSvc.warning("Please enter a message.")
        if (!subject) this.toastrSvc.warning("Please enter the subject.")
        return;
      };
      this.onSubmitted.emit({ emailText: e, emailReceivers: receivers || [], emailSubject: subject });
    } else {
      if (!subjectline) {
        this.toastrSvc.warning("Please enter a message.")
        return;
      };
      this.onSubmitted.emit(e);
    }
   
    this.closeOnSubmit ? this.activeModal.close() : null;
  }
}

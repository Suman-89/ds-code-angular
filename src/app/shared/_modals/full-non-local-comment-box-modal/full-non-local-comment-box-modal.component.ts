import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-full-non-local-comment-box-modal',
  templateUrl: './full-non-local-comment-box-modal.component.html',
  styleUrls: ['./full-non-local-comment-box-modal.component.scss'],
})
export class FullNonLocalCommentBoxModalComponent implements OnInit, OnChanges {
  @Input() commenttype? = 'Write Comment';
  @Input() mentionConfig;
  @Input() value;
  @Input() commentBoxOptions;
  @Input() isTemplate? = false;
  @Input() templateType? = false;
  @Input() closeOnSubmit?: boolean = true;
  @Output() onSubmitted = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.checkMentionCondtn();
  }

  ngOnInit(): void {
    // console.log("TYPE ****************", this.commenttype);
  }

  checkMentionCondtn() {
    let condtn;
    if (
      this.commenttype.toLowerCase() === 'comment' ||
      this.commenttype.toLowerCase() === 'reply'
    ) {
      condtn = this.mentionConfig.mentions.length > 2 ? true : false;
    } else {
      condtn = this.mentionConfig ? true : false;
    }
    return true;
  }

  submitted(e) {
    this.onSubmitted.emit(e);
    this.closeOnSubmit ? this.activeModal.close() : null;
  }
}

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommentBoxOptions, TagType } from 'src/app/core/_models';
import { CheckInModel, DocumentCategoryEnum } from './../../_models';
import { UserService } from 'src/app/core/_services';

@Component({
  selector: 'app-check-in-file-modal',
  templateUrl: './check-in-file-modal.component.html',
  styleUrls: ['./check-in-file-modal.component.scss'],
})
export class CheckInFileModalComponent implements OnInit {
  @Input() inputDoc;
  @Input() taskKeys;

  @Output() emitCheckInFile = new EventEmitter<any>();

  acceptList = '*';
  inputData = new CheckInModel();
  documentCategoryEnum = DocumentCategoryEnum;

  tagUsers;
  tagGroups;
  multiMentionConfig = {
    mentions: [],
  };
  @ViewChild('commentBox') commentBox;
  commentBoxOptions: CommentBoxOptions = {
    allowFullScreen: false,
    height: 233,
    clearAfterSubmit: false,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private userSvc: UserService
  ) {}

  ngOnInit(): void {
    if (
      this.inputDoc.metadata?.folderCode ==
      this.documentCategoryEnum.executedContracts
    ) {
      this.acceptList = '.pdf';
    } else if (
      this.inputDoc.metadata?.folderCode ==
      this.documentCategoryEnum.businessCase
    ) {
      this.acceptList = '.xls, .xlsx, .xlsm';
    } else {
      this.acceptList = '*';
    }
    this.getUsers();
  }

  close() {
    this.activeModal.close();
  }

  handleFileInput(e) {
    const files = e.target.files;
    if (files.length) {
      this.inputData.selectedDocument = files[0];
    }
  }

  save() {
    const formdata = new FormData();
    const comm = this.commentBox.getComment();
    if (this.inputData.selectedDocument instanceof File) {
      formdata.append('file', this.inputData.selectedDocument);
    }
    // formdata.append('comment', this.inputData.comment);
    formdata.append('comment', comm);
    this.emitCheckInFile.emit({ doc: formdata, comment: comm });
  }

  getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.tagUsers = a.data;
      this.multiMentionConfig.mentions.push({
        items: this.tagUsers,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
    });
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
}

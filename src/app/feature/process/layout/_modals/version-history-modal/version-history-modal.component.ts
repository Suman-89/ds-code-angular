import { TaskDocumentModel } from './../../_models/task-document.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskInfoService } from './../../_services/task-info.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-version-history-modal',
  templateUrl: './version-history-modal.component.html',
  styleUrls: ['./version-history-modal.component.scss'],
})
export class VersionHistoryModalComponent implements OnInit {
  @Input() contentid: string;
  @Input() docInfo;
  docVersions;
  isContentCreationProcess =
    JSON.parse(localStorage.getItem('selected-process'))?.key ===
    'Initiation_contentCreationProcess';

  constructor(
    private taskInfoSvc: TaskInfoService,
    private ngbActmodal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.getVersions(this.contentid);
    console.log(this.docInfo);
  }

  getVersions(id) {
    this.taskInfoSvc.getVersionHistory(id).subscribe((r) => {
      if (r.status) {
        let obj = r.data;
        obj.forEach((a) => {
          a.comment = this.transformComment(a.comment);
        });
        this.docVersions = obj;
      }
    });
  }

  close() {
    this.ngbActmodal.close();
  }
  dismiss() {
    this.ngbActmodal.dismiss();
  }
  download(doc: TaskDocumentModel): void {
    this.taskInfoSvc.openDocument(doc.contentid, 1);
  }

  transformComment(comment) {
    return { message: comment };
  }
}

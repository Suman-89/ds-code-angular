import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbAccordion, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-terminate-reason',
  templateUrl: './terminate-reason.component.html',
  styleUrls: ['./terminate-reason.component.scss'],
})
export class TerminateReasonComponent implements OnInit {
  @Input() name;
  @Input() title;
  @Output() reasonEmit = new EventEmitter();

  reason = '';

  constructor(
    private actmodal: NgbActiveModal,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {}

  terminate() {
    if (this.reason.trim() === '') {
      return this.toastrSvc.warning('Reason is mandatory');
    }
    this.reasonEmit.emit(this.reason?.trim());
  }

  close() {
    this.actmodal.close();
  }
}

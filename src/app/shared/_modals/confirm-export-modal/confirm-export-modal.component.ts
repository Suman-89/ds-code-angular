import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _fromCoreSvc from 'src/app/core/_services';

@Component({
  selector: 'app-confirm-export-modal',
  templateUrl: './confirm-export-modal.component.html',
  styleUrls: ['./confirm-export-modal.component.scss'],
})
export class ConfirmExportModalComponent implements OnInit {
  constructor(
    public modal: NgbActiveModal,
    private repSvc: _fromCoreSvc.ReportsService,
    private toastrSvc: ToastrService
  ) {}
  wantsToSave: Boolean = false;
  error = '';

  changeWantsToSave = (bool: boolean) => {
    this.wantsToSave = bool;
  };
  removeError = (event) => {
    if (this.error) this.error = '';
  };

  saveReport = (term: String) => {
    let trimmedTerm = term.trim();
    if (trimmedTerm === '') {
      return this.toastrSvc.error('Please type a name for this report');
    }

    let regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (regex.test(trimmedTerm)) {
      return this.toastrSvc.error(
        `Special characters are not allowed i.e. \`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`
      );
    }

    this.repSvc.checkNameAvailability(trimmedTerm).subscribe((resp) => {
      if (!resp?.data?.ifExists) {
        return this.modal.close(trimmedTerm);
      }
      return this.toastrSvc.error(
        'This name is already in use, please try another'
      );
    });
  };

  fileName: String = '';
  ngOnInit(): void {}
}

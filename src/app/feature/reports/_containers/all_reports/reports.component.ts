import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GridToolbarType } from 'src/app/core/_models';
import { ReportsService } from 'src/app/core/_services';
import { DownloadReportModalComponent } from 'src/app/feature/reports/_modals/download-report-modal/download-report-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class UserReportsComponent implements OnInit {
  @ViewChild('gridinstance') gridInstance;
  reportsData;
  gridType = GridToolbarType.reports;
  reportSelected;
  selectedProcess;
  ready = false;
  constructor(
    private repSvc: ReportsService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private modalSvc: NgbModal,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
    this.repSvc.getAllReports().subscribe((res) => {
      this.reportsData = res?.data;
      this.ready = true;
    });
  }

  previewReport = () => {
    const modalRef = this.modalSvc.open(DownloadReportModalComponent, {
      keyboard: false,
      backdrop: 'static',
      size: 'lg',
      // windowClass: 'modal-xl',
    });
    modalRef.componentInstance.reportName = this.reportSelected.reportName;
    modalRef.result.then((result) => {
      // console.log('resultresult', result);

      this.router.navigate(['preview', this.reportSelected.reportName], {
        relativeTo: this.actRoute,
        state: {
          conditions: result,
        },
      });
    });
  };

  deleteReport = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Report!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.repSvc
          .deleteReport(this.reportSelected.reportName)
          .subscribe((res) => {
            if (res.status) {
              this.toastrSvc.success('Report deleted successfully');
              location.reload();
            } else {
              this.toastrSvc.error('Report could not be deleted');
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled');
      }
    });
  };
  navigateToEditReport() {
    this.router.navigate(['edit', this.reportSelected.reportName], {
      relativeTo: this.actRoute,
    });
  }
  selectRow(e) {
    this.reportSelected = e.row;
    switch (e.action) {
      case 'previewReport':
        this.previewReport();
        break;
      case 'deleteReport':
        this.deleteReport();
        break;
      case 'editReport':
        this.navigateToEditReport();
        break;
    }
  }
}

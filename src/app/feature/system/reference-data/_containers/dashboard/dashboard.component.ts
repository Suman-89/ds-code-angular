import { ToastrService } from 'ngx-toastr';
import { AddRefDataComponent } from '../../_modals/add-ref-data/add-ref-data.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _fromCoreModels from 'src/app/core/_models';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import * as _fromServices from 'src/app/core/_services';
import * as _fromRefServices from '../../_services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // @ViewChild('grid', { static: false }) grid: jqxGridComponent;

  refDataTypes: _fromCoreModels.ReferenceDataModel[] = [];
  allRefData = [];
  searchResult = '';
  selectedProcess;
  constructor(
    private sharedSvc: _fromServices.SharedService,
    private refDataSvc: _fromRefServices.RefDataService,
    private router: Router,
    private route: ActivatedRoute,
    private modalSvc: NgbModal,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.getRefDataTypes();
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
  }

  getRefDataTypes() {
    this.refDataSvc.getAllRefdataCategories().subscribe((resp) => {
      this.refDataTypes = this.allRefData = resp.data.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
      //  this.allRefData = resp.data ;
    });
  }

  addRefData(data) {
    this.refDataSvc.addRefData(data).subscribe((resp) => {
      if (resp.status) {
        this.refDataTypes.push(resp.data);
        this.toastrSvc.success('Reference Data Added');
      }
    });
  }

  cardEvent(event) {
    const isCat = true;
    switch (event.type) {
      case 1:
        this.routeToTypes(event.data);
        break;
      case 2:
        this.openRefDataModal();
        break;
      case 3:
        this.refDataSvc
          .editRefData(event.data.id, { name: event.params }, isCat)
          .subscribe((resp) => {
            if (resp.data) {
              this.refDataTypes.find((a) => a.id === event.data.id).name =
                event.params;
              this.toastrSvc.success('Reference Data Edited');
            }
          });
        break;
      case 4:
        //  this.refDataSvc.removeRefData(event.data.id, isCat).subscribe( resp => {
        //    if (resp.data) {
        //     this.refDataTypes = this.refDataTypes.filter( a => a.id !== event.data.id) ;
        //    }
        //  });
        this.openSweetalert(event, isCat);
        break;
    }
  }

  routeToTypes(event) {
    const path = event.name.toLowerCase() + '/' + event.code + '/' + event.id;
    this.router.navigate([path], { relativeTo: this.route });
  }

  openRefDataModal() {
    const modalref = this.modalSvc.open(AddRefDataComponent, { size: 'lg' });
    modalref.componentInstance.addRefDataEmitter.subscribe((res) => {
      if (res) {
        this.addRefData(res);
      }
    });
  }

  openSweetalert(event, isCat) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.refDataSvc
          .removeRefData(event.data.id, isCat)
          .subscribe((resp) => {
            if (resp.data) {
              this.refDataTypes = this.refDataTypes.filter(
                (a) => a.id !== event.data.id
              );
              Swal.fire('Deleted!', 'success');
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled');
      }
    });
  }
  searchRefData(term) {
    if (term.length > 0) {
      this.searchResult = `Showing Result for "${term}"`;
    } else if (term.length === 0) {
      this.searchResult = '';
    }
    term = term.toLowerCase();
    return (this.refDataTypes = this.allRefData.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.code.toLowerCase().includes(term)
    ));
  }
}

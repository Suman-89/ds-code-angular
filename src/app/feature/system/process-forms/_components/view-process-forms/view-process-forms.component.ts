import { Router, ActivatedRoute } from '@angular/router';
import { ProcessFormsService } from './../../_services/process-forms.service';
import { Component, OnInit } from '@angular/core';
import { GridToolbarType, ProcessFormModel } from 'src/app/core/_models';
import { FormGridColumns } from '../../_models/form-grid-columns.data';

@Component({
  selector: 'app-view-process-forms',
  templateUrl: './view-process-forms.component.html',
  styleUrls: ['./view-process-forms.component.scss']
})
export class ViewProcessFormsComponent implements OnInit {
  procForms: ProcessFormModel[] ;
  gridcolumns ;
  jqxSource ;
  selectedForm ;
  gridType = GridToolbarType.processform

  constructor(private procFormSvc: ProcessFormsService, private router: Router, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllForms() ;
    this.gridcolumns = new FormGridColumns().columns ;
  }


  getAllForms() {
  this.procFormSvc.getAllProcForms().subscribe( r => {
    this.procForms = r.data.sort( ( a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)) ;
    // this.setGridData(this.procForms) ;
  }) ;
  }
 setGridData(data) {
    this.jqxSource =  new jqx.dataAdapter({ localdata:  data }) ;
   }

   selectRow(event) {
    this.selectedForm = event.row ;
    switch (event.action) {
      case 'addprocform':
        this.addForms() ;
        break;
      case 'editprocform':
        this.editForm() ;
        break;
    }
   }
   addForms() {
    this.router.navigate(['add-forms'], {relativeTo: this.actRoute}) ;
   }
   editForm() {
     const path = 'edit-form/' + this.selectedForm.key ;
     this.router.navigate([path], {relativeTo: this.actRoute}) ;
   }
}

import { Router, ActivatedRoute } from '@angular/router';
import { AnchorElementService } from '../../_services/anchor-element.service';
import { Component, OnInit } from '@angular/core';
import { GridToolbarType, ProcessFormModel,AnchorFormModel } from 'src/app/core/_models';
import { FormGridColumns } from '../../_models/form-grid-columns.data';

@Component({
  selector: 'app-view-anchor-elements',
  templateUrl: './view-anchor-elements.component.html',
  styleUrls: ['./view-anchor-elements.component.scss'],
})
export class ViewAnchorElementsComponent implements OnInit {
  procForms: AnchorFormModel[];
  gridcolumns;
  jqxSource;
  selectedForm;
  // viewType;
  gridType = GridToolbarType;
  selectedProcess;

  constructor(
    private anchorEleSvc: AnchorElementService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) { }
  

  ngOnInit(): void {
    // if (!this.router.url.includes('definition-forms')) {
    //   this.viewType = this.gridType.process_form;
      
    //   this.gridcolumns = new FormGridColumns().columns;
    // } else {
    //   this.viewType = this.gridType.processdefinition;
    this.getAllProcessVariables();
    // }
    this.getAllForms();
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
  }

  getAllProcessVariables() {
    this.anchorEleSvc.getAllProcessVariables().subscribe((r) => {
      if (r.status) {
        console.log("r.data",r.data)
      }
    });
  }
  
  getAllForms() {
    this.anchorEleSvc.getAllProcForms().subscribe((r) => {
      console.log("DATA ",r.data)
      this.procForms = r.data.sort((a, b) =>
        a.anchorConfigDisplayName.toLowerCase() > b.anchorConfigDisplayName.toLowerCase() ? 1 : -1
      );
      // this.setGridData(this.procForms) ;
    });
  }
  setGridData(data) {
    this.jqxSource = new jqx.dataAdapter({ localdata: data });
  }
  doubleClick(e) {
    this.editForm();
  }
 

  selectRow(event) {
    this.selectedForm = event.row;
    switch (event.action) {
      case 'addanchorentity':
        this.addForms();
        break;
      case 'editanchorentity':
        this.editForm();
        break;
    }
  }
  addForms() {
    this.router.navigate(['add-anchor'], { relativeTo: this.actRoute });
  }
  editForm() {
    console.log("CONSOLE >LOG",this.selectedForm)
    const path = 'edit-anchor/' + this.selectedForm.anchorConfigId;
    this.router.navigate([path], { relativeTo: this.actRoute });
  }

  selectForm(form) {
    this.selectedForm = form;
  }

  // routeAction(opt) {
  //   switch (opt) {
  //     case 1:
  //       this.router.navigate([
  //         'landing/system/process-def-forms/definition-forms/add',
  //       ]);
  //       break;
  //     case 2:
  //       this.router.navigate([
  //         'landing/system/process-def-forms/definition-forms/edit/' +
  //           this.selectedForm.processname,
  //       ]);
  //   }
  // }
}

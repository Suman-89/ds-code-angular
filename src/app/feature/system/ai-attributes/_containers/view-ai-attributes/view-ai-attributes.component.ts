import { Router, ActivatedRoute } from '@angular/router';
import { AiAttributeService } from '../../_services/ai-attribute.service';
import { Component, OnInit } from '@angular/core';
import { GridToolbarType, ProcessFormModel } from 'src/app/core/_models';
import { FormGridColumns } from '../../_models/form-grid-columns.data';

@Component({
  selector: 'app-view-ai-attributes',
  templateUrl: './view-ai-attributes.component.html',
  styleUrls: ['./view-ai-attributes.component.scss'],
})
export class ViewAiAttributesComponent implements OnInit {
  procForms: ProcessFormModel[];
  gridcolumns;
  jqxSource;
  selectedForm;
  viewType;
  gridType = GridToolbarType;
  selectedProcess;

  constructor(
    private procFormSvc: AiAttributeService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getAllDefinitionForms();
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
  }

  getAllDefinitionForms() {
    this.procFormSvc.getAllDefinitionForm().subscribe((r) => {
      if (r.status) {
        this.procForms = r.data;
      }
    });
  }
  setGridData(data) {
    this.jqxSource = new jqx.dataAdapter({ localdata: data });
  }
  
  doubleClickDEF(e) {
    this.viewAttributes();
  }

  selectRow(event) {
    this.selectedForm = event.row;
    switch (event.action.toLowerCase()) {
      case "view":
        this.viewAttributes();
        break;
      // case 'editprocdef':
      //   this.editProcessDef();
      //   break;
    }
  }

  viewAttributes() {
    console.log("VIEW!");
    this.router.navigate([
          'landing/system/ai-attributes/change-attributes/view/'+this.selectedForm.processname,
        ]);
  }
  // editProcessDef() {
  //   this.router.navigate([
  //     'landing/system/process-def-forms/definition-forms/edit/' +
  //       this.selectedForm.processname,
  //   ]);
  // }

  selectForm(form) {
    this.selectedForm = form;
  }

  routeAction(opt) {
    switch (opt) {
      case 1:
        this.viewAttributes()
        break;
      // case 2:
      //   this.router.navigate([
      //     'landing/system/process-def-forms/definition-forms/edit/' +
      //       this.selectedForm.processname,
      //   ]);
    }
  }
}

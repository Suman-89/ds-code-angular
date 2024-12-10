import { Router, ActivatedRoute } from '@angular/router';
import { ProcessFormsService } from '../../_services/process-forms.service';
import { Component, OnInit } from '@angular/core';
import { GridToolbarType, ProcessFormModel } from 'src/app/core/_models';
import { FormGridColumns } from '../../_models/form-grid-columns.data';

@Component({
  selector: 'app-view-process-forms',
  templateUrl: './view-process-forms.component.html',
  styleUrls: ['./view-process-forms.component.scss'],
})
export class ViewProcessFormsComponent implements OnInit {
  procForms: ProcessFormModel[];
  gridcolumns;
  jqxSource;
  selectedForm;
  viewType;
  gridType = GridToolbarType;
  selectedProcess;

  constructor(
    private procFormSvc: ProcessFormsService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('definition-forms')) {
      this.viewType = this.gridType.process_form;
      this.getAllForms();
      this.gridcolumns = new FormGridColumns().columns;
    } else {
      this.viewType = this.gridType.processdefinition;
      this.getAllDefinitionForms();
    }
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
  getAllForms() {
    this.procFormSvc.getAllProcForms().subscribe((r) => {
      this.procForms = r.data.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
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
  doubleClickDEF(e) {
    this.editProcessDef();
  }

  selectRow(event) {
    this.selectedForm = event.row;
    switch (event.action) {
      case 'addprocform':
        this.addForms();
        break;
      case 'editprocform':
        this.editForm();
        break;
        case 'copyProcessForm':
          this.copyForm();
          break;
      case 'addprocdef':
        this.addProcessDef();
        break;
      case 'editprocdef':
        this.editProcessDef();
        break;
      case 'copyprocdef':
        this.copyProcDef();
    }
  }
  addForms() {
    this.router.navigate(['add-forms'], { relativeTo: this.actRoute });
  }
  editForm() {
    const path = 'edit-form/' + this.selectedForm.key;
    this.router.navigate([path], { relativeTo: this.actRoute });
  }
  copyForm() {
    const path = 'copy-form/' + this.selectedForm.key;
    this.router.navigate([path], { relativeTo: this.actRoute });
  }
  addProcessDef() {
    this.router.navigate([
      'landing/system/process-def-forms/definition-forms/add',
    ]);
  }
  editProcessDef() {
    this.router.navigate([
      'landing/system/process-def-forms/definition-forms/edit/' +
        this.selectedForm.processname,
    ]);
  }
  copyProcDef() {
    this.router.navigate([
      'landing/system/process-def-forms/definition-forms/copy/' +
        this.selectedForm.processname,
    ]);
  }

  selectForm(form) {
    this.selectedForm = form;
  }

  routeAction(opt) {
    switch (opt) {
      case 1:
        this.router.navigate([
          'landing/system/process-def-forms/definition-forms/add',
        ]);
        break;
      case 2:
        this.router.navigate([
          'landing/system/process-def-forms/definition-forms/edit/' +
            this.selectedForm.processname,
        ]);
    }
  }
}

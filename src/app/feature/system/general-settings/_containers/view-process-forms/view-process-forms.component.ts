import { Router, ActivatedRoute } from '@angular/router';
import { GeneralSettingsService } from '../../../../../core/_services/general-settings.service';
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
    private procFormSvc: GeneralSettingsService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('definition-forms')) {
      this.viewType = this.gridType.process_form;
      this.getAllForms();
      this.gridcolumns = new FormGridColumns().columns;
      console.log('GRID COLS--', this.gridcolumns);
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
      console.log('PROCESS FROMS ---------', this.procForms);
    });
  }
  setGridData(data) {
    this.jqxSource = new jqx.dataAdapter({ localdata: data });
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
    }
  }
  addForms() {
    this.router.navigate(['add-forms'], { relativeTo: this.actRoute });
  }
  editForm() {
    const path = 'edit-form/' + this.selectedForm.key;
    this.router.navigate([path], { relativeTo: this.actRoute });
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

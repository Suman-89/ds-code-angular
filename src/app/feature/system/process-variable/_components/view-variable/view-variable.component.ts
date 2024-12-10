import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AddVariableComponent } from '../../_modal/add-variable/add-variable.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProcessVariableService } from '../../_services/process-variable.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcessVariableConstants } from '../../_models';
import { GridToolbarType, ProcessVariableModel } from 'src/app/core/_models';
import Swal from 'sweetalert2';
import { RefDataService } from 'src/app/core/_services';
import { AddProcNamesComponent } from '../../_modal/add-proc-names/add-proc-names.component';

@Component({
  selector: 'app-view-variable',
  templateUrl: './view-variable.component.html',
  styleUrls: ['./view-variable.component.scss'],
})
export class ViewVariableComponent implements OnInit {
  @ViewChild('gridinstance') gridInstance;
  varData: ProcessVariableModel[];
  varDataAll: ProcessVariableModel[];
  searchResult = { show: false, msg: '' };
  varDataSelected: ProcessVariableModel;
  varColumn;
  dataTypes = [];
  jqxSource;
  clearSelect = false;
  gridType = GridToolbarType.processvariable;
  selectedProcess;
  dropDownData = {
    category: [],
    uiElementTypes: [],
    sources: [],
    dataTypes: [],
    refData: [],
  };
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private varSvc: ProcessVariableService,
    private modalSvc: NgbModal,
    private toastrSvc: ToastrService,
    private refSvc: RefDataService
  ) {}

  ngOnInit(): void {
    this.getVariableData();
    // this.getDataTypes() ;
    this.getDropDownData();
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
  }

  getColumnData() {
    //  this.varColumn = this.varSvc.getProcessVariablesColumn() ;
    this.varColumn = new ProcessVariableConstants().procVarGridColumns;
  }

  getVariableData() {
    this.varSvc.getAllProcessVariables().subscribe((resp) => {
      this.varData = this.varDataAll = resp.data.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
      this.setGridData(this.varData);
    });
  }

  sortGrid(data: ProcessVariableModel[]) {}
  addEditProcVar(data?: ProcessVariableModel) {
    let header;
    let opt;
    if (!data) {
      opt = false;
      data = {
        displaylabel: '',
        label: '',
        name: '',
        datatype: '',
        categoryname: '',
        uielementtype: '',
        valuesource: '',
        linkedtometadata: false,
        description: '',
        allowPastDate:true,
      };
      header = 'Add Variable';
      this.openModal(data, header, opt);
    } else {
      header = 'Edit Variable ' + data.displaylabel;
      opt = 1;
      // this.varDataSelected
      this.varSvc.getProcessVariablebyId(data.id).subscribe((res) => {
        this.varDataSelected = res.data;
        console.log("vardaaselected", this.varDataSelected)
        this.openModal(this.varDataSelected, header, opt);
      });
    }
  }

  openModal(data, header, opt) {
    const ngbModalOpt: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static',
      size: 'lg',
    };
    const modalRef = this.modalSvc.open(AddVariableComponent, ngbModalOpt);
    // console.log("************",data.valuesource)
    modalRef.componentInstance.addEditVar = data;
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.dropDownData = this.dropDownData;
    modalRef.componentInstance.emitVar.subscribe((resp) => {
      if (!opt) {
        this.varSvc.addProcessVariable(resp).subscribe((r) => {
          if (r.status) {
            let obj: ProcessVariableModel;
            obj = resp;
            obj.id = r.data;
            this.getVariableData();
            this.toastrSvc.success('Variable Added');
          }
        });
      } else if (opt === 1) {
        this.varSvc.editProcessVariable(resp).subscribe((r) => {
          if (r.status) {
            let obj: ProcessVariableModel;
            obj = resp;
            obj.id = r.data;
            this.getVariableData();
            this.toastrSvc.success('Variable Edited');
          }
        });
      } else if (opt === 1) {
        this.varSvc.editProcessVariable(resp).subscribe((r) => {
          if (r.status) {
            this.varDataSelected = null;
            const idx = this.varData.findIndex((a) => a.id === r.data);
            this.varData[idx] = resp;
            this.gridInstance.updateRow(idx, resp);
            this.toastrSvc.success('Variable Edited');
          }
        });
      }
    });
  }
  getDropDownData() {
    this.varSvc.getCategoryForVariables().subscribe((resp) => {
      this.dropDownData.category = resp.data;
    });
    console.log("dropdownData", this.dropDownData)
    this.varSvc.getUIElementTypes().subscribe((res) => {
      this.dropDownData.uiElementTypes = [
        ...res.data,
        'MULTIVALUE',
        'EXPRESSION',
      ];
      console.log('UI ELEMENT--->', res.data);
    });
    this.varSvc.getSource().subscribe((res) => {
      this.dropDownData.sources = res.data;
    });
    this.varSvc.getDataTypes().subscribe((resp) => {
      this.dropDownData.dataTypes = resp.data;
    });
    this.refSvc.getAllRefdataCategories().subscribe((resp) => {
      this.dropDownData.refData = resp.data.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    });
  }

  doubleClick(e) {
    this.addEditProcVar(e);
  }

  selectRow(e) {
    if (e.rows.length === 1) {
      this.varDataSelected = e.rows[0];
    }
    switch (e.action) {
      case 'addvar':
        this.addEditProcVar();
        break;
      case 'editvar':
        this.addEditProcVar(this.varDataSelected);
        break;
      case 'syncmeta':
        this.syncMetadata();
        break;
      case 'delvar':
        this.deleteVar(this.varDataSelected);
        break;
      case 'selectprocessname':
        this.selectProcessName(e.rows);
        break;
      case 'copyprocvar':
        this.copyProcVar(this.varDataSelected);
    }
  }

  copyProcVar(row): void {
    const header = 'Copy Variable';
    this.openModal(row, header, false);
  }

  deleteVar(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Variable!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.varSvc.removeProcessVariable(data).subscribe((r) => {
          if (r) {
            this.varData = this.varData.filter((a) => a.id !== data.id);
            Swal.fire('Variable Deleted', 'success');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled');
      }
    });
  }

  syncMetadata() {
    this.varSvc.syncMetadata().subscribe((resp) => {
      if (resp.status) {
        this.toastrSvc.success('Metadata Sync Completed Successfully');
      }
    });
  }

  setGridData(data) {
    this.jqxSource = new jqx.dataAdapter({ localdata: data });
  }

  filterVariables(name) {
    debounceTime(100), distinctUntilChanged();
    if (name.length > 0) {
      this.varData = this.varDataAll.filter((a) =>
        a.displaylabel.toLowerCase().includes(name.toLowerCase())
      );
      this.searchResult.show = true;
      this.searchResult.msg = `Showing Results for "${name}"`;
    } else if (name.length === 0) {
      this.varData = this.varDataAll;
      this.searchResult.show = false;
      this.searchResult.msg = '';
    }
  }

  openProcNameModal(data): void {
    const ngbModalOpt: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static',
      size: 'lg',
    };
    const modalRef = this.modalSvc.open(AddProcNamesComponent, ngbModalOpt);
    modalRef.componentInstance.vars = data;
    modalRef.componentInstance.emitProcesses.subscribe((resp) => {
      console.log(resp);
      this.varSvc.editMultipleProcessVariables(resp).subscribe((r) => {
        if (r.status) {
          this.toastrSvc.success('New Processess Mapped');
        }
      });
    });
  }

  selectProcessName(data) {
    // this.varDataSelected
    // this.varSvc.getProcessVariablebyId(data.id).subscribe((res) => {
    //   this.varDataSelected = res.data;
    //   this.openModal(this.varDataSelected, header, opt);
    this.openProcNameModal(data);
  }
}

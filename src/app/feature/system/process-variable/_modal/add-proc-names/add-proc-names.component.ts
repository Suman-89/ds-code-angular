import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProcessVariableService } from '../../_services/process-variable.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-proc-names',
  templateUrl: './add-proc-names.component.html',
  styleUrls: ['./add-proc-names.component.scss'],
})
export class AddProcNamesComponent implements OnInit {
  constructor(
    private varSvc: ProcessVariableService,
    private actModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.log(this.vars, 'VARRRRRRRRRRRS');
    this.isOpenProcessDefiner();
    this.getAllDefinitionForms();
  }

  @Input() vars: any[];
  @Output() emitProcesses = new EventEmitter();

  unchangedVars: any[];
  allProcesses;
  isopenProcessess: boolean[] = [];

  doctypeDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };

  getAllDefinitionForms() {
    this.varSvc.getAllDefinitionForm().subscribe((r) => {
      if (r.status) {
        this.allProcesses = r.data
          .filter((i) => i.processDef.isVisible)
          .map((process) => process.processname);
      }
    });
  }

  save(): void {
    this.emitProcesses.emit(this.vars);
    this.actModal.close();
    setTimeout(()=>{
      window.location.reload();
    },1000)

  }

  close(): void {
    window.location.reload();
    this.actModal.close();
  }

  itemSelect(ev): void {
    this.vars.map((i) => {
      if (!i.processNames.includes(ev)) {
        i.processNames.push(ev);
      }
    });
  }

  isOpenProcessDefiner(): void {
    this.vars.forEach((i) => {
      this.isopenProcessess.push(false);
    });
  }

  processOpener(i): void {
    this.isopenProcessess[i] = !this.isopenProcessess[i];
  }

  deleteProcess(process, singleVar): void {
    this.vars.forEach((i) => {
      if (i === singleVar) {
        i.processNames = i.processNames.filter((e) => {
          return e !== process;
        });
      }
    });
  }
}

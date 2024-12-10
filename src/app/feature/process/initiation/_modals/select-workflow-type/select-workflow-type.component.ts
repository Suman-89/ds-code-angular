import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-select-workflow-type',
  templateUrl: './select-workflow-type.component.html',
  styleUrls: ['./select-workflow-type.component.scss']
})
export class SelectWorkflowTypeComponent implements OnInit {
@Input() workflowtypes: any[] ;
@Output() selWorkflowEmitter = new EventEmitter() ;
selectedType; 
  constructor(private actMod: NgbActiveModal) { }

  ngOnInit(): void {
    this.selectedType = this.workflowtypes[0] ;
  }

  save() {
    this.selWorkflowEmitter.emit(this.selectedType) ;
  }

  setSelectedType(ev) {
   this.selectedType = this.workflowtypes.find(w => w.key === ev) ;
   }

  close() {
   this.actMod.close() ;
  }

}

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _fromCoreModels from 'src/app/core/_models';

@Component({
  selector: 'app-add-ref-data',
  templateUrl: './add-ref-data.component.html',
  styleUrls: ['./add-ref-data.component.scss'],
})
export class AddRefDataComponent implements OnInit {
  @Input() type: any;
  @Output()
  addRefDataEmitter: EventEmitter<_fromCoreModels.ReferenceDataModel> = new EventEmitter<_fromCoreModels.ReferenceDataModel>();
  refDataForm: _fromCoreModels.ReferenceDataModel = {
    name: '',
    code: '',
    description: '',
    levels: 1,
  };
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  close() {
    this.activeModal.close();
  }
  addRefData() {
    this.addRefDataEmitter.emit(this.refDataForm);
    this.close();
  }
}

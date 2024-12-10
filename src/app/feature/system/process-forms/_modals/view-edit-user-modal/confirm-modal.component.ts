import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
@Input() element;
@Input() roles;
@Input() groups;
@Output() eventEmitter = new EventEmitter<any>() ;
selectedRoles = [];
selectedGroups = [];

dropdownSettings: IDropdownSettings = {
  singleSelection: false,
  closeDropDownOnSelection: false,
  idField: 'id',
  textField: 'name',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  itemsShowLimit: 3,
  allowSearchFilter: true,
  enableCheckAll: false 
};

  constructor(private activeModal: NgbActiveModal, ) { }

  ngOnInit(): void {}


  close() {
    this.activeModal.dismiss() ;
  }

  save() {
    this.eventEmitter.emit(this.element) ;
  }
  
}

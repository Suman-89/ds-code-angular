import { InstanceModel } from './../../../core/_models/instance.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
@Input() data: any;
@Input() addData: boolean;
@Input() addInstance: boolean;
@Output() clickEventEmit: EventEmitter<any> = new EventEmitter<any>() ;


replaceImageStr = './assets/images/icon-service.png' ;
enableEdit = false ;
editParam = '' ;
constructor() { }

  ngOnInit(): void {
  }

  enableEditing() {
    this.enableEdit = !this.enableEdit ;
    this.editParam = this.data.name ;
  }
  emitCard(inp) {
    let obj ;
    switch (inp) {
     case 1: // route to children instances event
      obj = {data: this.data, type: inp} ;
      this.clickEventEmit.emit(obj) ;
      break;
     case 2: // add entity event, open modal
      obj = {type: inp} ;
      this.clickEventEmit.emit(obj) ;
      break;
     case 3: // edit instances
      obj = {data: this.data, type: inp, params: this.editParam} ;
      this.clickEventEmit.emit(obj) ;
      this.enableEdit = false ;
      break;
     case 4:  // Delete event
       obj = {data: this.data, type: inp} ;
       this.clickEventEmit.emit(obj) ;
       break;
     case 5:  // close card event
       obj = {type: inp} ;
       this.clickEventEmit.emit(obj) ;
       break;
    }
  }

}

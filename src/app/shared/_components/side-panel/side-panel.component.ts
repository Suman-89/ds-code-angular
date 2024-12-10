import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SideNavElementModel } from '../../../core/_models';


@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  @Input() sidenavEl: SideNavElementModel[];
  @Output() clickEvent: EventEmitter<SideNavElementModel> = new EventEmitter<SideNavElementModel>();

  hidepanel = false ;

  constructor() { }

  ngOnInit(): void {
  }

  emitEvent(input: SideNavElementModel): void {
    input.selected = true;
    this.clickEvent.emit(input) ;
  }

}

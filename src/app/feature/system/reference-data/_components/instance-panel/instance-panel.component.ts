import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _fromCoreModels from 'src/app/core/_models';
@Component({
  selector: 'app-instance-panel',
  templateUrl: './instance-panel.component.html',
  styleUrls: ['./instance-panel.component.scss'],
})
export class InstancePanelComponent implements OnInit {
  @Input() parentInstance: _fromCoreModels.InstanceModel;
  @Input() instances: _fromCoreModels.InstanceModel[];
  @Input() type: string;
  @Input() isEditable? = true;
  @Output() emitInstanceEvent: EventEmitter<any> = new EventEmitter<any>();
  firstLevelChildName = '';
  editInstanceName = '';
  editParams = '';
  activeTab = '';
  constructor() {}

  ngOnInit(): void {
    console.log("instances" , this.instances)
    this.instances.sort((a, b) =>
      a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
    );
  }

  emitEvent(event, opt) {
    const obj = { data: event, type: opt, params: '' };
    switch (opt) {
      case 'post':
        obj.params = this.firstLevelChildName;
        this.emitInstanceEvent.emit(obj);
        break;
      case 'edit':
        obj.params = this.editParams;
        this.editInstanceName = '';
        this.emitInstanceEvent.emit(obj);
        break;
      case 'view':
        this.activeTab = event.name;
        this.type !== 'children'
          ? this.emitInstanceEvent.emit(obj)
          : (this.activeTab = event.name);
        break;
      case 'delete':
        this.emitInstanceEvent.emit(obj);
        break;
    }
  }

  getColor(i: number) {
    let color;
    i % 2 === 0 ? (color = '#fdfdfd') : (color = '#f7f7f7');
    return color;
  }

  enableEdit(ins) {
    if (this.editInstanceName === ins.name) {
      this.disableEdit();
    } else {
      this.editInstanceName = ins.name;
      this.editParams = ins.name;
    }
  }
  disableEdit() {
    this.editInstanceName = '';
  }
}

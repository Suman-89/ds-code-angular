import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProcessFormModel } from 'src/app/core/_models';
import { TriggerPointsModel } from '../../_models';

@Component({
  selector: 'app-multiselect-toggle',
  templateUrl: './multiselect-toggle.component.html',
  styleUrls: ['./multiselect-toggle.component.scss'],
})
export class MultiselectToggleComponent implements OnInit {
  @Input() list: any[];
  @Input() selectedList? = [] as TriggerPointsModel[];
  @Output() selectedListEmit = new EventEmitter<TriggerPointsModel[]>();
  dispList;
  constructor() {}

  ngOnInit(): void {
    this.transformSelList();
  }

  transformSelList() {
    // console.log('LIST -----------', this.list, this.selectedList);
    if (!this.selectedList) {
      this.selectedList = [] as TriggerPointsModel[];
      this.list.map((l) => {
        l.when = true;
        return l;
      });
    } else {
      this.list.map((l) => {
        l.when = this.selectedList.find((s) => s.name === l.key)
          ? this.selectedList.find((s) => s.name === l.key).when
          : true;
        return l;
      });
    }
    this.dispList = this.list;
  }

  selectPoint(point) {
    if (this.selectedList.find((a) => a.name === point.key)) {
      this.selectedList = this.selectedList.filter((a) => a.name !== point.key);
    } else {
      let obj = { name: point.key, when: point.when ? 1 : 0 };
      this.selectedList.push(obj);
    }
    this.selectedListEmit.emit(this.selectedList);
  }

  returnDispLabel(name) {
    let l = this.list.find((a) => a.key === name);
    return l
      ? `${l?.name} (${l?.groupname})`
      : 'Task Not found in Selected Workflow.';
  }

  filterList(val) {
    this.dispList = this.list.filter((l) =>
      l.name.toLowerCase().includes(val.toLowerCase())
    );
  }

  selectWhenPoint(ev, l) {
    this.list.find((a) => a.key === l.key).when = ev.checked;
    this.dispList.find((a) => a.key === l.key).when = ev.checked;
    this.selectedList.find((a) => a.name === l.key)
      ? (this.selectedList.find((a) => a.name === l.key).when = ev.checked
          ? 1
          : 0)
      : this.selectPoint(l);
  }

  checkForSelection(l) {
    return this.selectedList &&
      this.selectedList.length > 0 &&
      this.selectedList.find((a) => a.name === l.key)
      ? true
      : false;
  }

  // checkForWhen(l) {
  //   return this.selectedList && this.selectedList.find(a => a.name ==l.key) ?
  //    this.selectedList.find(a => a.name ==l.key).when : true ;
  // }
}

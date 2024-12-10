import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vmt-tabs-view',
  templateUrl: './vmt-tabs-view.component.html',
  styleUrls: ['./vmt-tabs-view.component.scss'],
})
export class VmtTabsViewComponent implements OnInit {
  actions = [
    { icon: 'fa fa-commenting-o', id: 'comment', name: 'Comments' },
    { icon: 'fa fa-file', id: 'document', name: 'Documents' },
  ];
  selectedAction = {
    icon: 'fa fa-commenting-o',
    id: 'comment',
    name: 'Comments',
  };

  constructor() {}

  ngOnInit(): void {}
  selectAction(e): void {
    if (e) {
      this.selectedAction = e;
    }
  }
}

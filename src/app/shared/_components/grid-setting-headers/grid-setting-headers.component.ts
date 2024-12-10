import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  GridSetterColumnModel,
  GridSettingTypeEnum,
} from 'src/app/feature/system/process-forms/_models/procdef.model';

@Component({
  selector: 'app-grid-setting-headers',
  templateUrl: './grid-setting-headers.component.html',
  styleUrls: ['./grid-setting-headers.component.scss'],
})
export class GridSettingHeadersComponent implements OnInit {
  constructor(private toastSvc: ToastrService) {}
  @Output() addColumnEmitter = new EventEmitter();
  @Input() gridSettingType: GridSettingTypeEnum;
  gridSettingTypeEnum = GridSettingTypeEnum;

  ngOnInit(): void {}

  addNewCol() {
    this.addColumnEmitter.emit('');
    this.toastSvc.success('Column Added');
  }
}

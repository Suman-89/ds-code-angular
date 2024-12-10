import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { SharedService } from 'src/app/core/_services';

@Component({
  selector: 'app-custom-icon-picker',
  templateUrl: './custom-icon-picker.component.html',
  styleUrls: ['./custom-icon-picker.component.scss'],
})
export class CustomIconPickerComponent implements OnInit, OnChanges {
  @Output() $onSelectItem = new EventEmitter<any>();
  @Input() value: any;
  @Input() iconList;
  @Input() type;
  @Input() placeholder: any;
  @Input() id: any;
  filterList;
  filterImageList;
  selecting = false;
  typeOfNaN(x) {
    return isNaN(x);
  }

  addressText: string;

  ngOnInit(): void {
    this.filterList = this.iconList;
    this.filterImageList = this.filterList?.filter((i) => i?.id);
    // console.log("Filter Image List ",this.value,this.iconList,this.filterImageList)
  }

  constructor(public sharedSvc: SharedService) {}
  ngOnChanges() {
    this.iconList = [].concat(this.iconList);
    this.filterList = this.iconList;
    this.filterImageList = this.filterList?.filter((i) => i?.id);
  }

  showList() {
    this.selecting = !this.selecting;
    console.log('SHOW LIST ', this.selecting);
  }

  applyFilter(value) {
    this.filterList = this.iconList
      .filter((i) => !i.id)
      .filter((element) => element.toLowerCase().includes(value.toLowerCase()));
    this.filterImageList = this.iconList
      ?.filter((i) => i.id)
      .filter((element) =>
        element.fileName.toLowerCase().includes(value.toLowerCase())
      );
  }

  onSimpleSelect(value) {
    console.log('SELECTED VALUE ', value, 'ID ', this.id);
    this.value = value;
    this.$onSelectItem.emit({ value: value, id: this.id });
    this.showList();
  }
}

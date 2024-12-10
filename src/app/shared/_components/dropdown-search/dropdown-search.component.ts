import { CompanyAddressModel } from 'src/app/core/_models';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, Renderer2,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.scss'],
})
export class DropdownSearchComponent implements OnInit, OnChanges {
  @Output() $onSelectItem = new EventEmitter<any>();
  @Input() value: any;
  @Input() placeholder: any;
  @Input() dataList: any;
  @Input() setting: any;
  @Input() id: any;
  @Input() disabled = false;
  displayValue;
  filterStr;
  filterList;
  selecting = false;
  elementRefId = '';
  addressText: string;
  top = '28px';
  ngOnInit(): void {
    this.filterList = this.dataList;
    if (this.setting) {
      this.displayValue =
        this.dataList?.find((item) => item[this.setting.value] == this.value) &&
        this.dataList?.find((item) => item[this.setting.value] == this.value)[
          this.setting.label
        ];
    } else {
      this.displayValue =
        this.dataList?.find((item) => item == this.value) &&
        this.dataList?.find((item) => item == this.value);
    }

    this.elementRefId = 'gridcolumndropdown_' + this.id;
    // console.log("LIST ---->",this.displayValue,this.value,this.placeholder, this.dataList,this.setting);
  }

  constructor(private renderer: Renderer2) {
    // this.renderer.listen('window', 'click', (e: Event) => {
    //   if (this.selecting) {
    //     this.selecting = false;
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filterList = this.dataList;
    if (this.setting) {
      // console.log("ONCHANGE",this.dataList,changes)
      // console.log(this.dataList,this.filterList)
      this.displayValue =
        this.dataList?.find((item) => item[this.setting.value] == this.value) &&
        this.dataList?.find((item) => item[this.setting.value] == this.value)[
          this.setting.label
        ];
    } else {
      this.displayValue =
        this.dataList?.find((item) => item == this.value) &&
        this.dataList?.find((item) => item == this.value);
    }
  }

  showList() {
    let elementPosition = document
      .getElementById(this.elementRefId)
      .getBoundingClientRect();
    this.top =
      window.innerHeight / 2 + 80 > elementPosition?.top ? '28px' : '-227px';
    this.selecting = !this.selecting;
  }
  // setting.label
  applyFilter(value) {
    if (this.setting) {
      this.filterList = this.dataList.filter(
        (element) =>
          element[this.setting.value]
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          element[this.setting.label]
            .toLowerCase()
            .includes(value.toLowerCase())
      );
    } else {
      this.filterList = this.dataList.filter((element) =>
        element.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
  onSelect(value) {
    // console.log('SELECTED VALUE ', value, 'ID ', this.id);
    this.value = value;
    this.$onSelectItem.emit({ value: value, id: this.id });
    this.displayValue = this.dataList?.find(
      (item) => item[this.setting.value] == this.value
    )
      ? this.dataList?.find((item) => item[this.setting.value] == this.value)[
          this.setting.label
        ]
      : '';
    this.showList();
  }

  onSimpleSelect(value) {
    // console.log('SELECTED VALUE ', value, 'ID ', this.id);
    this.value = value;
    this.$onSelectItem.emit({ value: value, id: this.id });
    this.displayValue = this.dataList.find((item) => item == this.value)
      ? this.dataList.find((item) => item == this.value)
      : '';
    this.showList();
  }
}

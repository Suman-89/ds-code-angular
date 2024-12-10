import { Component, OnInit, Input, Output, EventEmitter, OnChanges  } from '@angular/core';
import { RefDataService } from 'src/app/core/_services';

@Component({
  selector: 'app-ref-data-selector',
  templateUrl: './ref-data-selector.component.html',
  styleUrls: ['./ref-data-selector.component.scss']
})
export class RefDataSelectorComponent implements OnInit, OnChanges {

  @Output() $onSelectItem = new EventEmitter<any>();
  @Input() value: any;
  @Input() placeholder: any ;
  @Input() id: any;
  @Input() code: any ;
  displayValue;
  filterList;
  selecting = false;
  groupDropdownSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };
  addressText: string ;

  ngOnInit(): void {  
    this.displayValue = this.value;
    this.getInstances(this.code);
  }
 
  constructor(
    private refdataSvc: RefDataService,
  ) {}

  ngOnChanges() {}
  
  getInstances(id) {
    this.refdataSvc.getInstances(id, true).subscribe((res) => {
       this.filterList = res.data;
      // console.log("REF COMPONENT ======", this.filterList, id)
    });
  }

  onSelectItem(e) {
    // console.log("SELECT ITEM ",this.displayValue)
    this.$onSelectItem.emit({value:this.displayValue,id:this.id});

  }

  onSelectItemAll(e) {
    this.displayValue = this.filterList;
    // console.log("SELECT AL ITEM ",this.displayValue)
    this.$onSelectItem.emit({value:this.displayValue,id:this.id});
  }

  onDeSelectAll(e) {
    this.displayValue = [];
    // console.log("***** DESELECTED *****",this.displayValue)
    this.$onSelectItem.emit({value:this.displayValue,id:this.id});
  }

}

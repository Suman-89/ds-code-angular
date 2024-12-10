import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { GridColumnModel, GridToolbarType } from 'src/app/core/_models';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() darkTheme: boolean = true;
  @Input() rowIndex: number[] = [];
  @Input() selectFirstRow: boolean;
  @Input() type: string = '';
  @Input() columns: GridColumnModel[];
  @Input() source: any;
  @Input() updateData: any;
  @Input() config: any;
  @Input() ready: any;
  @Input() pageable: string = 'true';
  @Input() groups: string[] = [];
  @Input() selectionMode? = 'checkbox';
  @Input() pageSizeOpt = [10, 20, 50];
  @Input() clearSelection? = false;
  @Input() autoHeight? = true;
  @Input() showRowDetails? = false;
  @Input() nestedSourceData? = [];
  @Input() initRowDetailsFn;
  @Input() width;
  @Input() height;
  @Input() editable? = false;
  @Input() contracttypeoperator: 'and';
  @Input() filterable? = true;
  @Input() sortable? = true;
  @Input() groupable? = true;
  @Input() columnsreorder? = true;
  @Input() localization = {};
  @Input() statePredefined = false;
  @Input() predefinedState;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  @Output() lengthOfFilterData: EventEmitter<any> = new EventEmitter();
  @Output() filterData: EventEmitter<any> = new EventEmitter();
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
  @Output() onRowUnselect: EventEmitter<any> = new EventEmitter();
  @Output() onRowDoubleClick: EventEmitter<any> = new EventEmitter();
  @Output() emitRowForNesting = new EventEmitter();
  @Output() celldblClickEvent = new EventEmitter();
  @Output() singleClickEvent = new EventEmitter();
  @Output() cellValueChangeEmit = new EventEmitter();
  toolbarType = GridToolbarType;

  @ViewChild('grid', { static: false }) grid: jqxGridComponent;

  readyFn: any;
  viewInit = false;
  rowdetailstemplate: any = {
    rowdetails:
      '<div id="nestedGrid" style="margin: 2px 10px 2px 2px; "></div>',
    rowdetailsheight: 200,
    rowdetailshidden: true,
  };

  nestedGrids: any[] = new Array();

  constructor() {}

  ngOnInit(): void {
    this.readyFn = this.ready();
  }

  ngAfterViewInit(): void {
    this.viewInit = true;

    if (this.statePredefined) {
      // console.log(this.predefinedState);

      let state = this.grid.getstate();
      // console.log(this.columns);

      // console.log('state', { ...state, ...this.predefinedState });
      return this.loadState({ ...state, ...this.predefinedState });
    }

    let state = localStorage.getItem(`grid-state-${this.type}`);

    if (state) {
      if (this.type !== this.toolbarType.allProcess) {
        let gridState = JSON.parse(state);
        this.editState(gridState);
        this.loadState(gridState);
      }
    } else {
      let gridRefreshState = this.getState();
      localStorage.setItem(
        `grid-refresh-${this.type}`,
        JSON.stringify(gridRefreshState)
      );
    }
    this.height = this.height
      ? this.height
      : this.autoHeight
      ? 'unset'
      : '100%';
    localStorage.setItem(
      `grid-columns-${this.type}`,
      JSON.stringify(this.columns)
    );

    // to select first row automatically after reload
    if (this.selectFirstRow) {
      this.grid.selectrow(0);
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.selectFirstRow) {
  //     if (this.grid) {
  //       if (this.rowIndex.length <= 2) {
  //         this.grid.unselectrow(0);
  //       } else {
  //         this.grid.unselectrow(this.rowIndex[this.rowIndex.length - 3]);
  //       }
  //       this.grid.selectrow(this.rowIndex[this.rowIndex.length - 1]);
  //       console.log(this.rowIndex.length, 'row index lenth');
  //     }
  //   }
  // }

  initRowDetails = (
    index: number,
    parentElement: any,
    gridElement: any,
    record: any
  ): void => {
    if (this.showRowDetails) {
      let rowDetailsObj = {
        index: index,
        parentElement: parentElement,
        gridElement: gridElement,
        record: record,
      };
      this.emitRowForNesting.emit(rowDetailsObj);
    }
  };

  fillRowDetails(
    index: number,
    parentElement: any,
    gridElement: any,
    record: any
  ) {
    let id = record.contractid;
    let nestedGridContainer = parentElement.children[0];
    this.nestedGrids[index] = nestedGridContainer;
    let filtergroup = new jqx.filter();
    let filter_or_operator = 1;
    let filtervalue = id;
    let filtercondition = 'equal';
    let filter = filtergroup.createfilter(
      'stringfilter',
      filtervalue,
      filtercondition
    );
    // fill the orders depending on the id.
    let nesteddata = this.nestedSourceData;
    let nesteddatabyid = [];
    for (let i = 0; i < nesteddata.length; i++) {
      let result = filter.evaluate(nesteddata[i]['contractid']);
      if (result) nesteddatabyid.push(nesteddata[i]);
    }
    let nestedSource = {
      sortcolumn: 'starttime',
      sortdirection: 'desc',
      datafields: [
        { name: 'taskname', type: 'string' },
        { name: 'assignedgroupname', type: 'string' },
        { name: 'assignedusername', type: 'string' },
        // { name: 'taskstatus', type: 'string' },
        { name: 'starttime', type: 'date' },
        // { name: 'endtime', type: 'date' },
        // { name: 'elapsedtime', type: 'string' }
      ],
      id: 'contractid',
      localdata: nesteddatabyid,
    };
    let nestedGridAdapter = new jqx.dataAdapter(nestedSource);
    if (nestedGridContainer != null) {
      let settings = {
        width: 650,
        autoHeight: true,
        source: nestedGridAdapter,
        sortable: true,
        columnsresize: true,
        columns: [
          {
            text: 'In-process Tasks',
            datafield: 'taskname',
            width: 150,
            cellclassname: this.contractschildcellclassname,
          },
          {
            text: 'Group',
            datafield: 'assignedgroupname',
            width: 150,
            cellclassname: this.contractschildcellclassname,
          },
          {
            text: 'User',
            datafield: 'assignedusername',
            width: 150,
            cellclassname: this.contractschildcellclassname,
          },
          // { text: 'Status', datafield: 'taskstatus', width: 150 },
          {
            text: 'Start Time',
            datafield: 'starttime',
            width: 200,
            cellsformat: 'dd-MMM-yyyy HH:mm:ss',
            cellclassname: this.contractschildcellclassname,
          },
          // { text: 'End Time', datafield: 'endtime', width: 200, cellsformat: 'dd-MMM-yyyy HH:mm:ss'},
          // { text: 'Elapsed Time', datafield: 'elapsedtime', width: 200,  cellsformat: 'HH:mm:ss'  }
        ],
      };

      jqwidgets.createInstance(
        `#${nestedGridContainer.id}`,
        'jqxGrid',
        settings
      );
    }
  }

  contractschildcellclassname = (
    row,
    column,
    value,
    defaultHtml,
    columnSettings,
    rowData
  ) => {
    //  return `<div style="margin-left: 5px; margin-top:10px; color: #2aa89b; font-weight: 400">${value}</div>`
    return 'childrowcolor';
  };

  editState(gridState) {
    gridState.width = this.getWidth();
    gridState.selectedrowindexes = [];
    gridState.selectedrowindex = -1;
  }

  getWidth(): number {
    if (this.width) {
      return this.width;
    } else {
      return document.getElementById('gridCont').offsetWidth;
    }
  }

  onGridRowSelect(e): void {
    if (!e.target.id.includes('nestedGrid')) {
      this.onRowSelect.emit(e);
    } else {
      this.onGridRowUnselect(e);
    }
  }

  rowdoubleclick(e): void {
    if (!e.target.id.includes('nestedGrid')) {
      this.onRowDoubleClick.emit(e);
    } else {
      this.onGridRowUnselect(e);
    }
  }

  singleClick(event) {
    this.singleClickEvent.emit(event);
    setTimeout(() => {
      this.grid.clearselection();
      this.grid.selectrow(event.args.rowindex);
    }, 270);
  }

  cellClickEvent(event) {
    this.celldblClickEvent.emit(event);
  }

  onGridRowUnselect(e): void {
    this.onRowUnselect.emit(e);
  }

  cellValueChange(event) {
    this.cellValueChangeEmit.emit(event);
  }
  updateRow(id, row) {
    this.grid.updaterow(id, row);
    this.deSelectRow();
  }

  deleteRow(id: string[]): void {
    this.grid.deleterow(id);
    // console.log('DELETE ID ', id);
    this.deSelectRow();
  }

  deSelectRow() {
    this.grid.clearselection();
  }

  exportXls(name: string) {
    this.grid.exportdata('xls', name);
  }

  hideColumn(datafield: string) {
    this.grid.hidecolumn(datafield);
    this.saveGridState();
  }

  showColumn(datafield: string) {
    this.grid.showcolumn(datafield);
    this.saveGridState();
  }

  getState() {
    return this.grid.getstate();
  }

  refreshState() {
    let state = localStorage.getItem(`grid-refresh-${this.type}`);
    if (state) {
      state = JSON.parse(state);
      this.loadState(state);
      localStorage.removeItem(`grid-refresh-${this.type}`);
      window.location.reload();
    }
  }

  loadState(state) {
    if (this.type !== this.toolbarType.allProcess && state.groups?.length) {
      state.groups = [];
    }
    // console.dir(this.grid);
    this.grid.loadstate(state);
    if (this.type === this.toolbarType.allProcess) {
      state.groups = [];
    }
  }

  onFilter(event) {
    if (this.statePredefined) {
      this.onFilterChange.emit(event.args.filters);
    }
    this.saveGridState();
    const filterValue = this.grid.getrows().length;
    this.filterData.emit(this.grid.getrows());
    this.lengthOfFilterData.emit(filterValue);
  }

  saveGridState() {
    if (!this.predefinedState && this.viewInit) {
      const state = this.grid.getstate();
      localStorage.setItem(`grid-state-${this.type}`, JSON.stringify(state));
    }
  }

  beginUpdate() {
    this.grid.beginupdate();
  }

  endUpdate() {
    this.grid.endupdate();
  }

  updateBoundData(savedState?) {
    this.source = new jqx.dataAdapter(
      {
        localdata: this.updateData,
        ...this.config,
      },
      {
        loadComplete: () => {
          let currentState = this.grid.getstate();
          if (this.statePredefined) {
            console.log(this.predefinedState);
            this.grid.loadstate({
              ...currentState,
              ...this.predefinedState,
            });
          } else {
            if (!savedState) {
              savedState = JSON.parse(
                localStorage.getItem(`grid-state-${this.type}`)
              );
            }
            if (savedState) {
              // if (this.type === this.toolbarType.allProcess) {
              const { sortdirection, ...others } = savedState;
              savedState = others;
              // }
              // console.log(currentState, savedState);
              this.grid.loadstate({
                ...currentState,
                ...savedState,
              });
              setTimeout(() => {
                this.grid.loadstate({
                  ...currentState,
                  ...savedState,
                });
              }, 500);
            }
          }
        },
      }
    );
    this.grid.setOptions({
      source: this.source,
    });
  }

  setGroup(inpGrp) {
    this.grid.addgroup(inpGrp);
  }

  getRowDatabyId(rowid) {
    return this.grid.getrowdatabyid(rowid);
  }

  getRowData() {
    return this.grid.getrows();
  }
}

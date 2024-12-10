import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  GridColumnModel,
  GridToolbarType,
  LoggedUserModel,
  OperatorTypes,
  Roles,
  ToolbarButtonModel,
  UserGroupsEnum,
} from 'src/app/core/_models';
import {
  ExcelExportColumnsModel,
  ExcelExportRequestModel,
  ExcelSaveRequestModel,
  FilterConditionsModel,
} from 'src/app/core/_models/shared/excel-export.model';
import * as _fromCoreSvc from 'src/app/core/_services';
import { ConfirmExportModalComponent } from '../../_modals/confirm-export-modal/confirm-export-modal.component';

@Component({
  selector: 'app-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss'],
})
export class GridToolbarComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('grid') gridInstance;
  darkTheme: boolean = true;
  @Input() selectFirstRow: boolean;
  @Input() type: string;
  @Input() data: any[] = [];
  @Input() groups: string[] = [];
  @Input() selectionMode?: string = 'radio';
  @Input() showRowNum?: boolean = true;
  @Input() gridHeightFull: boolean = true;
  @Input() pageable: boolean = false;
  @Input() automaticPageSize: boolean = false;
  @Input() showRowDetails: boolean = false;
  @Input() nestedSourceData? = [];
  @Input() width;
  @Input() showfixedBtns? = true;
  @Input() editable? = false;
  @Input() localization = {};
  @Input() ddList;
  @Input() height;
  // @Input() virtualmode? = false  ;
  @Input() statePredefined = false;
  @Input() predefinedState;
  @Input() refDataInstancesColumn;
  @Input() preCalculatedColumns = [];
  @Input() filterable = true;
  @Input() sortable = true;
  @Input() groupable = true;
  @Input() columnsreorder = true;
  @Output() filterChange: EventEmitter<any> = new EventEmitter();
  @Output() filterDataLength: EventEmitter<any> = new EventEmitter();
  @Output() emitAction: EventEmitter<any> = new EventEmitter();
  @Output() doubleClick: EventEmitter<any> = new EventEmitter();
  @Output() nestedParentObj = new EventEmitter();
  @Output() celldblClick = new EventEmitter();
  @Output() singleClick = new EventEmitter();
  @Output() emitColumns: EventEmitter<any> = new EventEmitter();
  @Output() cellValueChange = new EventEmitter();
  @Output() onColumnVisibilityChange = new EventEmitter();
  timeout: any;
  rowIndex: number[] = [];
  toolbarType = GridToolbarType;
  buttons: ToolbarButtonModel[] = [];
  columns: GridColumnModel[] = [];
  source: any = {};
  sourceMapReady = true;
  sourceConfig: any = {};
  selectedRow: any = null;
  selectedRows: any[] = [];
  selectedColumns: GridColumnModel[] = [];
  subscriptions: Subscription[] = [];
  user: LoggedUserModel;
  showExportXlsxButton;
  showSaveReportButton = false;
  sourceLabel = '';
  editedReportDetails = {
    editedReportName: '',
    ifEdited: false,
    editedReportNameError: '',
  };
  cellClickIdentifire: Boolean = false;

  constructor(
    private sharedSvc: _fromCoreSvc.SharedService,
    private gridColumnSvc: _fromCoreSvc.GridColumnsService,
    private gridSourceSvc: _fromCoreSvc.GridSourceService,
    private sourceLabelSvc: _fromCoreSvc.SourceLabelService,
    private modalSvc: NgbModal,
    private excelSvc: _fromCoreSvc.ExcelExportService,
    private repSvc: _fromCoreSvc.ReportsService,
    private actRoute: ActivatedRoute,
    private toastrSvc: ToastrService,
    private router: Router,
    private gridCellRendererSvc: _fromCoreSvc.gridCellRenderer
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getSource();
    this.getConfig();
    this.getColumns();
    this.getSourceLabel();
    // console.log("object", this.source)
    localStorage.setItem('gridType', this.type);

    if (
      this.type === GridToolbarType.systemreports ||
      this.type === GridToolbarType.reports
    ) {
      this.showExportXlsxButton = false;
    }

    if (
      this.type === GridToolbarType.alltasks ||
      this.type === GridToolbarType.workbasket ||
      this.type === GridToolbarType.worklist ||
      this.type === GridToolbarType.allProcess
    ) {
      this.showSaveReportButton = false;
    }

    // console.log("x",this.showExportXlsxButton, this.type)
    if (this.type === GridToolbarType.allProcess) {
      this.showExportXlsxButton = true;
    }

    console.log(
      'showExportXlsxButton',
      this.ifContractProcess,
      this.showExportXlsxButton,
      !this.statePredefined,
      !this.showSaveReportButton
    );
  }
  ifContractProcess =
    JSON.parse(this.sharedSvc.selectedProcess)?.key ===
    'Process_initiation_impl';

  ngOnChanges(e): void {
    if (
      this.data &&
      this.data.length > 0 &&
      this.selectionMode == 'radio' &&
      this.selectedRow
    ) {
      this.data.find((i) => i.id == this.selectedRow.id)
        ? (this.selectedRow = null)
        : null;
    } else if (
      this.data &&
      this.data.length > 0 &&
      this.selectionMode == 'checkbox'
    ) {
      let temp = [];
      let deleteIds = [];

      this.selectedRows.forEach((i) => {
        if (this.data.find((j) => j.uid == i.uid)) {
          temp.push(i);
        } else {
          deleteIds.push(i.uid);
        }
      });

      this.selectedRows = temp;

      if (deleteIds.length > 0) {
        this.deleteRow(deleteIds);
        this.changeButtonStats(1);
      }
    } else if (
      this.data &&
      this.data.length == 0 &&
      this.selectedRows.length > 0 &&
      this.selectionMode == 'checkbox'
    ) {
      let ids = this.selectedRows.map((i) => i.uid);
      this.selectedRows = [];
      this.deleteRow(ids);
      this.changeButtonStats(1);
    }
    this.setGridData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((i) => i.unsubscribe());
  }

  getConfig(): void {
    this.subscriptions.push(
      this.sharedSvc.getToolbarButtons(this.type).subscribe((a) => {
        //temp logic will be deleted later
        if (this.type === 'process_definition') {
          let tmpObj = {
            label: 'Copy',
            action: 'copyprocdef',
            singleSelect: null,
            forRoles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'],
            forScreens: null,
            cssClass: 'primarybtnstyle',
            disabled: true,
          };
          a.push(tmpObj);
        }

        if (this.type === 'process_variable') {
          let addProcessNamesBtn = {
            label: 'Add Process Names',
            action: 'selectprocessname',
            singleSelect: null,
            forRoles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'],
            forScreens: null,
            cssClass: 'primarybtnstyle',
            disabled: true,
          };

          let copyBtn = {
            label: 'Copy',
            action: 'copyprocvar',
            singleSelect: null,
            forRoles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'],
            forScreens: null,
            cssClass: 'primarybtnstyle',
            disabled: true,
          };

          a.push(addProcessNamesBtn, copyBtn);
        }
        // ===============================
        this.buttons = a;
        console.log('BUTTONS ', this.buttons, this.type);
        this.changeButtonStats();
      })
    );
  }

  getSourceLabel(): void {
    this.sourceLabelSvc.getSourceLabels(this.type).subscribe((res) => {
      this.sourceLabel = res;
    });
  }

  filterLength(data) {
    this.filterDataLength.emit(data);
  }

  filteredData(ev) {
    this.data = ev;
  }

  getSource() {
    this.sourceConfig = this.gridSourceSvc.sourceConfig[this.type];
    // console.log("srxscnfig",this.sourceConfig)
  }

  getColumns(): void {
    console.log('TYPE ', this.type, this.toolbarType.reports);
    this.columns = [];
    switch (this.type) {
      case this.toolbarType.worklist:
      case this.toolbarType.allProcess:
      case this.toolbarType.workbasket:
      case this.toolbarType.contractlist:
        this.getTaskGridColumns();
        break;
      case this.toolbarType.comments:
        this.getTaskGridColumns();
        break;
      case this.toolbarType.user:
        this.getUserGridColumns();
        break;
      case this.toolbarType.group:
        this.getGroupGridColumns();
        break;
      case this.toolbarType.role:
        this.getRolesGridColumns();
        break;
      case this.toolbarType.company:
        this.getCompanyGridColumns();
        break;
      case this.toolbarType.country:
        this.showRowNum = false;
        this.getCompanyGridColumns();
        break;
      case this.toolbarType.processvariable:
        this.getProcessVariableColumn();
        break;
      case this.toolbarType.process_form:
        this.getProcessFormColumn(this.toolbarType.process_form);
        break;
      case this.toolbarType.anchor_entity:
        this.getProcessFormColumn(this.toolbarType.anchor_entity);
        break;

      case this.toolbarType.processdefinition:
        this.getProcessDefinitionColumns(this.toolbarType.processdefinition);
        break;
      case this.toolbarType.keywords:
        this.getProcessDefinitionColumns(this.toolbarType.keywords);
        break;
      case this.toolbarType.aiattributes:
        this.getProcessDefinitionColumns(this.toolbarType.processdefinition);
        break;
      case this.toolbarType.systemreports:
        this.getReportsColumn();
        break;
      case this.toolbarType.reports:
        this.getReportsColumn();
        break;
      case this.toolbarType.contentmanagement:
        this.getContentTemplateColumn();
        break;
      default:
        break;
    }

    if (this.showRowNum) {
      this.addRowNum();
    }
  }

  setSelectedColumnsfromState() {
    localStorage.setItem(
      `grid-columns-${this.type}`,
      JSON.stringify(this.columns)
    );
    this.selectedColumns = this.columns.map((c) => {
      c.checked = !c.hidden;
      return c;
    });
  }

  getProcessFormColumn(type) {
    this.subscriptions.push(
      this.gridColumnSvc.getProcessFormColumns(type).subscribe((a) => {
        this.columns = [...this.columns, ...a];
      })
    );
  }

  getProcessDefinitionColumns(type) {
    // this.sourceConfig = this.gridSourceSvc.sourceConfig[this.type];
    // console.log("CONSOLE log>>>", this.sourceConfig)
    this.subscriptions.push(
      this.gridColumnSvc.getProcessDefinitionColumns(type).subscribe((a) => {
        this.columns = [...a];
        this.getDynamicSource(a);
        // console.log('PROCESS DEF COLUMNS ----', a);
        this.setSelectedColumnsfromState();
      })
    );
  }
  getKeywordsColumns(type) {
    // this.sourceConfig = this.gridSourceSvc.sourceConfig[this.type];
    // console.log("CONSOLE log>>>", this.sourceConfig)
    this.subscriptions.push(
      this.gridColumnSvc.getKeywordsColumns(type).subscribe((a) => {
        this.columns = [...a];
        this.getDynamicSource(a);
        // console.log('PROCESS DEF COLUMNS ----', a);
        this.setSelectedColumnsfromState();
      })
    );
  }
  getReportsColumn() {
    this.subscriptions.push(
      this.gridColumnSvc.getReportsColumns().subscribe((a) => {
        this.columns = [...this.columns, ...a];
        this.setSelectedColumnsfromState();
      })
    );
    this.sourceConfig = this.gridSourceSvc.sourceConfig[this.type];
    this.sourceMapReady = true;
    this.updateBoundData();
    this.setGridData();
  }

  getContentTemplateColumn() {
    this.subscriptions.push(
      this.gridColumnSvc.getTemplatesGridColumns().subscribe((a) => {
        this.columns = [...this.columns, ...a];
        this.setSelectedColumnsfromState();
      })
    );
  }

  getProcessVariableColumn() {
    this.subscriptions.push(
      this.gridColumnSvc.getProcessVariableColumns().subscribe((a) => {
        this.columns = [...this.columns, ...a];
        this.setSelectedColumnsfromState();
      })
    );
  }
  getDynamicSource(gridVariables): void {
    this.sourceConfig = this.gridSourceSvc.sourceConfig[this.type];
    this.sharedSvc.getFeedbackVars().subscribe((allVars) => {
      let sourceMap = [];
      allVars.data.forEach((vari) => {
        let gridVariable = gridVariables.find(
          (gridVariable) => gridVariable.key === vari.name
        );
        if (gridVariable) {
          if (gridVariable.key !== 'contractInitiationTime') {
            sourceMap.push({
              name: gridVariable.key,
              map: `processvariables>${gridVariable.key}`,
              type:
                typeof vari.datatype === 'string'
                  ? vari.datatype === 'Number'
                    ? 'string'
                    : vari.datatype.toLowerCase()
                  : 'string',
            });
          }
        }
      });

      if (
        this.sourceConfig?.sortcolumn &&
        gridVariables.some(
          (gridVar) => gridVar.key === this.sourceConfig.sortcolumn
        )
      ) {
        this.sourceConfig = {
          ...this.sourceConfig,
          dataFields: [...sourceMap, ...this.sourceConfig.dataFields],
        };
      } else {
        this.sourceConfig = {
          dataFields: [...sourceMap, ...this.sourceConfig.dataFields],
        };
      }

      this.sourceMapReady = true;

      this.updateBoundData();
      this.setGridData();

      if (!this.statePredefined) {
        localStorage.removeItem(`grid-source-${this.type}`);
        localStorage.setItem(
          `grid-source-${this.type}`,
          JSON.stringify(this.sourceConfig.dataFields)
        );
      }
    });
  }

  getTaskGridColumns(): void {
    this.sourceMapReady = false;
    // console.log('TYPE 000', this.type);
    this.subscriptions.push(
      this.gridColumnSvc.getTasklistGridColumns(this.type).subscribe((a) => {
        this.getDynamicSource(a);

        this.columns = [
          ...this.columns,
          ...a.map((element) => {
            let colConfig: any = {
              text: element.header ? element.header : '',
              datafield: element.key ? element.key : '',
              minwidth: element.filtertype === 'date' ? '310px' : '40px',
              width: element.width ? element.width : '',
              hidden: element.hidden ? element.hidden : false,
              cellsformat: element.key?.includes('elapsed')
                ? 'd2'
                : element.cellsformat
                ? element.cellsformat
                : '',
            };
            if (element.filtertype !== 'nofilter') {
              colConfig.filtertype = element.filtertype;
            }
            return colConfig;
          }),
        ];

        this.columns = this.columns.map((i) => {
          if (
            i.datafield.toLocaleLowerCase().includes('image') ||
            i.datafield == 'psDerivedScore'
          ) {
            return {
              ...i,
              cellsrenderer: this.gridCellRendererSvc.imagerenderer,
              cellsalign: 'center',
              align: 'center',
            };
          }
          if (i.datafield === 'psCandidateInterestedString') {
            return {
              ...i,
              cellsrenderer: this.gridCellRendererSvc.interestedIconRenderer,
              cellsalign: 'center',
              align: 'center',
            };
          }
          if (i.datafield === 'hasDocument') {
            return {
              ...i,
              cellsrenderer: this.gridCellRendererSvc.attachmentIconRenderer,
              cellsalign: 'center',
              align: 'center',
              draggable: false,
              resizable: false,
              pinned: true,
            };
          }
          if (i.datafield === 'psMessageStatus') {
            return {
              ...i,
              cellsrenderer: this.gridCellRendererSvc.msgStatusRenderer,
              cellsalign: 'center',
              align: 'center',
            };
          }
          if (i.datafield === 'psUnreadMessageCount') {
            return {
              ...i,
              cellsrenderer:
                this.gridCellRendererSvc.unreadWhatsappMsgCellRenderer,
              cellsalign: 'center',
              align: 'center',
            };
          }
          if (i.datafield === 'psCandidateResponseReceived') {
            return {
              ...i,
              cellsrenderer:
                this.gridCellRendererSvc.candidate1stResponseCellRenderer,
              cellsalign: 'center',
              align: 'center',
            };
          }
          if (i.datafield === 'psStoppedByCandidate') {
            return {
              ...i,
              cellsrenderer:
                this.gridCellRendererSvc.stoppedByCandidateCellRenderer,
              cellsalign: 'center',
              align: 'center',
            };
          }
          if (i.datafield === 'psCallBack') {
            return {
              ...i,
              cellsrenderer: this.gridCellRendererSvc.callbackIconCellRenderer,
              cellsalign: 'center',
              align: 'center',
            };
          }
          if (i.datafield === 'psManualMode') {
            return {
              ...i,
              cellsrenderer: this.gridCellRendererSvc.manualModeCellRenderer,
              cellsalign: 'center',
              align: 'center',
            };
          } else {
            return i;
          }
        });

        if (
          this.type === this.toolbarType.contractlist ||
          this.type === this.toolbarType.allProcess ||
          this.type === this.toolbarType.alltasks
        ) {
          this.columns.map((c) => {
            if (c.text !== '#') {
              c.cellclassname =
                this.type === this.toolbarType.allProcess
                  ? this.allTasksColumnClass
                  : this.contractSearchColumnClass;
            }
            return c;
          });
        }

        this.statePredefined
          ? this.emitColumns.emit(this.columns)
          : this.setSelectedColumnsfromState();
      })
    );
  }

  getUserGridColumns(): void {
    this.subscriptions.push(
      this.gridColumnSvc.getUserGridColumns().subscribe((a) => {
        this.columns = [...this.columns, ...a];
        this.columns.map((c) => {
          if (c.datafield == 'groupnames' || c.datafield === 'roles') {
            c.cellsrenderer = this.arraySplitterCellsRenderer;
          }
          // else if (c.datafield === 'active') {
          //   c.cellsrenderer = this.activeCellsRenderer;
          // }
          else {
            c.cellsrenderer = this.usercellclassrenderer;
          }
          return c;
        });
        localStorage.removeItem(`grid-source-${this.type}`);
        localStorage.setItem(
          `grid-source-${this.type}`,
          JSON.stringify(this.sourceConfig.dataFields)
        );
        this.setSelectedColumnsfromState();
      })
    );
  }

  usercellclassrenderer = (
    row,
    column,
    value,
    defaultHtml,
    columnSettings,
    rowData
  ) => {
    let classname =
      rowData.activeString === 'Yes' ? 'inprocessClass' : 'terminatedClass';
    return `<div class="jqx-grid-cell-left-align ${classname}" style="margin-left: 5px; margin-top:10px">${value}</div>`;
  };

  // activeCellsRenderer = (
  //   row,
  //   columnfield,
  //   value,
  //   defaulthtml,
  //   columnproperties,
  //   rowdata
  // ) => {
  //   let formatVal = value ? 'Yes' : ' No';
  //   let classname = value ? 'inprocessClass' : 'terminatedClass';
  //   return `<div class="jqx-grid-cell-left-align ${classname}" style="margin-left: 5px; margin-top:10px">${formatVal}</div>`;
  // };

  arraySplitterCellsRenderer = (
    row,
    columnfield,
    value,
    defaulthtml,
    columnproperties,
    rowData
  ) => {
    let formattedValue;
    if (Array.isArray(value)) {
      formattedValue = value.join(', ');
    } else {
      formattedValue = value;
    }

    let classname =
      this.type === this.toolbarType.user
        ? rowData.activeString === 'Yes'
          ? 'inprocessClass'
          : 'terminatedClass'
        : '';
    return `<div class="jqx-grid-cell-left-align  ${classname}" style="margin-left: 5px; margin-top:10px">${formattedValue}</div>`;
  };

  contractscellclassname = (
    row,
    column,
    value,
    defaultHtml,
    columnSettings,
    rowData
  ) => {
    // return 'completedClass';

    switch (defaultHtml.sortorder) {
      case 1:
        return column === 'elapsedhour' || column === 'elapseddays'
          ? 'inprocessClassNumber'
          : 'inprocessClass';

      case 2:
        return column === 'elapsedhour' || column === 'elapseddays'
          ? `completedClassNumber`
          : `completedClass`;
      case 3:
        return column === 'elapsedhour' || column === 'elapseddays'
          ? `terminatedClassNumber`
          : 'terminatedClass';
    }
  };

  contractSearchColumnClass = (
    row,
    column,
    value,
    defaultHtml,
    columnSettings,
    rowData
  ) => {
    let boldClass = '';
    let stopedByCandidateClass = '';
    let ifNotInWa = '';

    if (defaultHtml?.psUnreadMessageCount > 0) {
      boldClass = 'bold';
    }
    if (defaultHtml?.psStoppedByCandidate) {
      stopedByCandidateClass = 'stopedByCandidate';
    }
    if (defaultHtml?.ifMobileNumberInWa === false) {
      ifNotInWa = 'ifNotInWa';
    }

    switch (defaultHtml.overallstats) {
      case 'In-Process':
        return column === 'elapsedhour' ||
          column === 'elapseddays' ||
          column === 'psUnreadMessageCount'
          ? `inprocessClassNumber ${boldClass} ${stopedByCandidateClass} ${ifNotInWa}`
          : `inprocessClass ${boldClass} ${stopedByCandidateClass} ${ifNotInWa}`;
      case 'Completed':
        return column === 'elapsedhour' ||
          column === 'elapseddays' ||
          column === 'psUnreadMessageCount'
          ? `completedClassNumber ${boldClass} ${stopedByCandidateClass} ${ifNotInWa}`
          : `completedClass ${boldClass} ${stopedByCandidateClass} ${ifNotInWa}`;
      case 'Terminated':
        return column === 'elapsedhour' ||
          column === 'elapseddays' ||
          column === 'psUnreadMessageCount'
          ? `terminatedClassNumber ${boldClass} ${stopedByCandidateClass} ${ifNotInWa}`
          : `terminatedClass ${boldClass} ${stopedByCandidateClass} ${ifNotInWa}`;
    }
  };

  allTasksColumnClass = (
    row,
    column,
    value,
    defaultHtml,
    columnSettings,
    rowData
  ) => {
    switch (defaultHtml.overallstats) {
      case 'In-Process':
        return defaultHtml.endtime
          ? column === 'elapsedhour' || column === 'elapseddays'
            ? 'completedClassNumber'
            : 'completedClass'
          : column === 'elapsedhour' || column === 'elapseddays'
          ? 'inprocessClassNumber'
          : 'inprocessClass';
      case 'Completed':
        return defaultHtml.endtime
          ? column === 'elapsedhour' || column === 'elapseddays'
            ? 'completedClassNumber'
            : 'completedClass'
          : column === 'elapsedhour' || column === 'elapseddays'
          ? 'inprocessClassNumber'
          : 'inprocessClass';
      case 'Terminated':
        return column === 'elapsedhour' || column === 'elapseddays'
          ? `terminatedClassNumber`
          : 'terminatedClass';
    }
  };

  getGroupGridColumns(): void {
    this.subscriptions.push(
      this.gridColumnSvc.getGroupGridColumns().subscribe((a) => {
        this.columns = [...this.columns, ...a];
      })
    );
  }
  getRolesGridColumns(): void {
    this.subscriptions.push(
      this.gridColumnSvc.getRolesGridColumns().subscribe((a) => {
        this.columns = [...this.columns, ...a];
      })
    );
  }
  getCompanyGridColumns(): void {
    this.subscriptions.push(
      this.gridColumnSvc.getCompanyGridColumns(this.type).subscribe((a) => {
        this.columns = [...this.columns, ...a];
        if (this.type === this.toolbarType.country) {
          this.refDataInstancesColumn.forEach((r) => {
            this.columns.push({ text: r.name, datafield: r.name });
            this.sourceConfig.dataFields.push({ name: r.name, type: 'string' });
          });
          this.columns.map((c) => {
            // if(c.datafield == 'synonyms') {
            //   c.cellsrenderer = this.arraySplitterCellsRenderer;
            // }
            if (
              this.refDataInstancesColumn.map((r) => r.name).includes(c.text)
            ) {
              {
                (c.columntype = 'template'),
                  (c.createeditor = (
                    row,
                    cellvalue,
                    editor,
                    cellText,
                    width,
                    height
                  ) => {
                    // construct the editor.
                    editor.jqxDropDownList({
                      checkboxes: false,
                      source: this.ddList,
                      displayMember: 'name',
                      valueMember: 'name',
                      width: width,
                      height: height,
                      selectionRenderer: () => {
                        return "<span style='top:4px; position: relative;'>Please Choose:</span>";
                      },
                    });
                  }),
                  (c.initeditor = (
                    row,
                    cellvalue,
                    editor,
                    celltext,
                    pressedkey
                  ) => {
                    // set the editor's current value. The callback is called each time the editor is displayed.
                    var items = editor.jqxDropDownList('getItems');
                    // editor.jqxDropDownList('uncheckAll');
                    var values = cellvalue.split(/,\s*/);
                    // let values = cellvalue ;
                    // for (let  j of values) {
                    //     for (let i of items) {
                    //         if (i.label === j) {
                    //             editor.jqxDropDownList('selectedCell', i.index);
                    //         }
                    //     }
                    // }
                  }),
                  (c.geteditorvalue = (row, cellvalue, editor) => {
                    // return the editor's value
                    let val = editor.val() === '' ? cellvalue : editor.val();
                    return val;
                  });
              }
            } else {
              c.editable = false;
            }
            return c;
          });
        }
        localStorage.removeItem(`grid-source-${this.type}`);
        localStorage.setItem(
          `grid-source-${this.type}`,
          JSON.stringify(this.sourceConfig.dataFields)
        );
        this.setSelectedColumnsfromState();
      })
    );
  }

  addRowNum(): void {
    this.columns.unshift({
      text: '#',
      sortable: false,
      filterable: false,
      editable: false,
      groupable: false,
      draggable: false,
      resizable: false,
      pinned: true,
      datafield: 'num',
      columntype: 'number',
      width: 50,
      cellsrenderer: (row: number, column: any, value: number): string => {
        return (
          `<div style="margin: 8px 4px; color: ${
            this.darkTheme ? 'black' : ''
          }" >` +
          (value + 1) +
          '</div>'
        );
      },
    });
  }

  changeButtonStats(opt?: number): void {
    // console.log('CHANGE BUTTON STATUS----', opt, this.selectedRows,this.buttons);
    if (this.buttons && this.buttons.length > 0) {
      this.buttons.forEach((i) => {
        if (i.disabled === undefined || i.disabled == null || opt === 1) {
          if (
            !this.selectedRow &&
            (!this.selectedRows ||
              (this.selectedRows.length === 0 && i.action !== 'export'))
          ) {
            i.disabled = true;
          } else if (
            (this.selectedRow ||
              (this.selectedRows && this.selectedRows.length > 0)) &&
            i.action === 'clearassignment'
          ) {
            if (this.selectedRow.activeString === 'No') i.disabled = false;
            else i.disabled = true;
          } else if (
            this.selectedRow ||
            (this.selectedRows &&
              this.selectedRows.length > 0 &&
              i.action !== 'export')
          ) {
            if (
              i.singleSelect &&
              this.selectedRows &&
              this.selectedRows.length > 1 &&
              i.action !== 'terminate' &&
              i.action !== 'update' &&
              i.action !== 'startPreScreening' &&
              i.action !== 'bulk'
            ) {
              i.disabled = true;
            } else if (this.selectedRows && i.action === 'terminate') {
              i.disabled = false;
              this.selectedRows.forEach((k) => {
                if (
                  k.overallstats === 'Completed' ||
                  k.overallstats === 'Terminated' ||
                  (!this.user.roles.includes(Roles.SUPER_ADMIN) &&
                    !this.user.roles.includes(Roles.LEGAL_ADMIN)) ||
                  k.initiatedby === this.user.userid
                ) {
                  i.disabled =
                    k.initiatedby === this.user.userid ||
                    (k.groupid === UserGroupsEnum.SALES &&
                      k.assignee === this.user.userid)
                      ? false
                      : true;
                }
              });

              // const m = this.selectedRows.map(a => a.overallStats);
              // if (m.includes('Completed') || m.includes('Terminated')) {
              //   i.disabled =  true;
              // }
            }
            // commented the below conditon to enable the return to queue button
            // else if (
            //   this.selectedRows &&
            //   (i.action === 'claim' || i.action === 'unclaim')
            // ) {
            //   i.disabled = this.selectedRows.find(
            //     //change from == to !== to remove disable from return to queue in sales
            //     (a) => a.groupid !== UserGroupsEnum.SALES
            //   )
            //     ? true
            //     : false;
            // }
            //logic for editvar and delvar
            else if (
              this.selectedRows.length > 1 &&
              (i.action === 'editvar' ||
                i.action === 'delvar' ||
                i.action === 'copyprocvar')
            ) {
              i.disabled = true;
            }
            // ====
            else {
              i.disabled = false;
            }
          }
        }
        if (
          this.selectedRows &&
          i.action === 'compare' &&
          this.selectedRows.length > 1
        ) {
          i.disabled = false;
        }
        if (
          this.selectedRows &&
          i.action === 'compare' &&
          this.selectedRows.length <= 1
        ) {
          i.disabled = true;
        }
        //logic for addvar and sync metadata to always stay enabled
        if (i.action === 'addvar' || i.action === 'syncmeta') {
          i.disabled = false;
        }
        // =====
        //added condition for export button in toolbar buttons
      });
    }
  }

  toolbarEmit(e): void {
    if (e === 'export') {
      this.exportXls();
    }
    if (this.selectedRow && this.selectionMode == 'radio') {
      this.emitAction.emit({
        action: e,
        id: this.selectedRow.id,
        row: this.selectedRow,
      });
    } else if (!this.selectedRow && this.selectionMode == 'radio') {
      this.emitAction.emit({ action: e });
    } else if (this.selectionMode == 'checkbox') {
      this.emitAction.emit({ action: e, rows: this.selectedRows });
    } else if (this.selectionMode === 'singlecell' && this.selectedRow) {
      this.emitAction.emit({ action: e, rows: this.selectedRow });
    }
  }

  setGridData(): void {
    if (this.automaticPageSize && this.pageable) {
      let tableData = this.data.map((obj) => {
        let initiationfields = { ...obj.initiationfields };
        return {
          created: obj.initiationdate
            ? obj.initiationdate
            : obj.contractInitiationTime,
          ...initiationfields,
          ...obj,
          businessKey: obj.contractid,
        };
      });
      this.source = new jqx.dataAdapter({
        localdata: tableData,
        pagesize:
          this.data.length > 50
            ? 50
            : this.data.length < 10
            ? 10
            : this.data.length,
        ...this.sourceConfig,
      });
    } else {
      let tableData = this.data.map((obj) => {
        let initiationfields = { ...obj.initiationfields };
        return {
          created: obj.initiationdate
            ? obj.initiationdate
            : obj.contractInitiationTime,
          ...initiationfields,
          ...obj,
          businessKey: obj.contractid,
        };
      });
      this.source = new jqx.dataAdapter({
        localdata: tableData,
        ...this.sourceConfig,
      });
      // console.log('tableData====2', tableData);
    }
  }

  onFilterChange(filters) {
    this.filterChange.emit(filters);
  }

  onGridRowSelect(e: any): void {
    if (this.selectionMode == 'radio') {
      this.selectedRow = e.args.row;
      this.emitAction.emit({
        action: 'rowSelected',
        row: this.selectedRow,
        id: this.selectedRow.id,
      });
    } else if (this.selectionMode == 'checkbox') {
      if (this.cellClickIdentifire) {
        if (e.args.row) {
          this.cellClickIdentifire = false;
          this.selectedRows = [];
          this.selectedRows.push(e.args.row);
        }
      } else {
        if (e.args.row) {
          this.selectedRows.push(e.args.row);
        } else if (e.args.rowindex && e.args.rowindex.length > 0) {
          this.selectedRows = this.data;
        } else if (e.args.rowindex && e.args.rowindex.length == 0) {
          this.selectedRows = [];
        }
      }
      console.log('AAAAAAAAAAAAAAAAAAAAAAAAA', this.selectedRows);

      this.emitAction.emit({ action: 'rowSelected', rows: this.selectedRows });
    }
    // console.log('GET DATA ');
    this.changeButtonStats(1);
  }

  onGridRowUnselect(e: any): void {
    if (this.selectionMode == 'checkbox') {
      if (!this.cellClickIdentifire) {
        this.selectedRows = this.selectedRows.filter(
          (i) => i.uid !== e.args.row.uid
        );
        this.emitAction.emit({
          action: 'rowSelected',
          rows: this.selectedRows,
        });
      }
      this.changeButtonStats(1);
    }
  }

  ready = () => {
    // if (this.type === this.toolbarType.contractlist) {
    //   return function () {
    //     this.sortby('overallStats', 'desc');
    //     this.sortby('initiationdate', 'desc');
    //   }
    // }
    if (this.type === this.toolbarType.country) {
      return function () {
        this.sortby('countryname', 'asc');
      };
    }
    if (this.type === this.toolbarType.alltasks) {
      return function () {
        // this.sortby('contractstatus', 'asc');
        // this.sortby('contractinitiationtime', 'desc');
        // this.sortby('taskstatus', 'asc');
        // this.sortby('starttime', 'desc');
        // this.sortby('partnername', 'asc');
        // this.sortby('contracttype', 'asc');
        // this.sortby('product', 'asc');
        // this.sortby('cename', 'asc');
      };
    }
  };

  resetGrid(): void {
    localStorage.removeItem(`grid-columns-${this.type}`);
    localStorage.removeItem(`grid-state-${this.type}`);
    localStorage.removeItem(`grid-refresh-${this.type}`);
    window.location.reload();
  }

  clearFilters(): void {
    let state = JSON.parse(localStorage.getItem(`grid-state-${this.type}`));
    if (state) {
      state.filters = { filterscount: 0 };
      localStorage.setItem(`grid-state-${this.type}`, JSON.stringify(state));
    }
    if (this.type === GridToolbarType.allProcess) {
      localStorage.removeItem('all_tasks_searchparams');
    }

    window.location.reload();
  }

  onGridDoubleClick(e): void {
    let selectedRow = e.args.row.bounddata;
    this.doubleClick.emit(selectedRow);
  }

  clearSelection(): void {
    this.gridInstance.deSelectRow();
  }

  deleteRow(ids: string[]): void {
    this.gridInstance.deleteRow(ids);
  }

  updateRow(idx, resp): void {
    this.gridInstance.updateRow(idx, resp);
  }

  getRowData() {
    return this.gridInstance.getRowData();
  }

  exportXls(userfileName?: string, { updateExistingReport = false } = {}) {
    // prop 'searchContract' for all tasks

    if (!updateExistingReport) this.gridInstance.saveGridState();

    let dt = new Date();
    this.columns = this.columns.filter((col) => !!col);
    let finalColumns = this.statePredefined
      ? this.preCalculatedColumns
      : this.columns;

    let cols: ExcelExportColumnsModel[] = finalColumns
      .filter((s) => !s.hidden)
      .map((c) => {
        let obj = { datafield: c.datafield, label: c.text };
        return obj;
      });

    cols = cols.filter((c) => c.datafield !== 'num');
    if (this.type === this.toolbarType.company) {
      let obj = finalColumns
        .filter((a) => a.datafield === 'isactive')
        .map((c) => {
          return { datafield: c.datafield, label: c.text };
        });
      cols.push(obj[0]);
    }
    let gridState = !updateExistingReport
      ? JSON.parse(localStorage.getItem(`grid-state-${this.type}`))
      : this.gridInstance.getState();

    let filtercondtions = [] as FilterConditionsModel[];

    let gridsource = JSON.parse(
      localStorage.getItem(`grid-source-${this.type}`)
    );
    let fields = [
      { key: 'filterdatafield', label: 'operand' },
      { key: 'filtercondition', label: 'operator' },
      { key: 'filtervalue', label: 'value' },
      { key: 'datatype', label: 'datatype' },
    ];

    for (let i = 0; i < gridState.filters.filterscount; i++) {
      //  let obj = {operand: gridState.filters['filterdatafield' + i], operator: gridState.filters['filtercondition' + i], value: gridState.filters['filtervalue' + i],
      //    datatype: ''}
      let obj = {} as FilterConditionsModel;
      fields.forEach((f) => {
        obj[f.label] = gridState.filters[f.key + i];
      });
      // temp code to be ommited nad grid columns data type to be set
      obj.datatype = gridsource?.find(
        (a) => a.name === gridState.filters['filterdatafield' + i]
      )?.type
        ? gridsource?.find(
            (a) => a.name === gridState.filters['filterdatafield' + i]
          )?.type
        : 'string';
      obj.value =
        obj.datatype === 'boolean'
          ? obj.value === 'true'
            ? true
            : false
          : obj.value;
      if (obj.datatype === 'date') {
        obj.istimeincluded = finalColumns
          .find((c) => c.datafield === obj.operand)
          .cellsformat.includes('HH:mm:ss')
          ? true
          : false;
      }
      obj.value !== 'All' ? filtercondtions.push(obj) : null;
      if (this.type === this.toolbarType.company && obj.operand === 'status') {
        let inobj: FilterConditionsModel = {
          operand: 'isactive',
          datatype: 'boolean',
          operator: OperatorTypes.EQUALS.toUpperCase(),
          value:
            obj.value.toLowerCase().startsWith('ac') ||
            obj.value.toLowerCase().startsWith('act') ||
            obj.value.toLowerCase().startsWith('acti')
              ? true
              : false,
        };
        filtercondtions.push(inobj);
      }
    }

    if (this.type === this.toolbarType.company) {
      cols = cols.filter((a) => a.datafield !== 'status');
      filtercondtions = filtercondtions.filter((a) => a.operand !== 'status');
    }

    filtercondtions = filtercondtions.map((cond) =>
      cond.operator === 'NULL' ? { ...cond, operator: 'EQUAL' } : cond
    );

    let payload: ExcelExportRequestModel = {
      columns: cols,
      conditions: filtercondtions,
      source: this.sourceLabelSvc.getSourceType(this.type),
      sourceLabel: this.sourceLabel,
      processName: JSON.parse(this.sharedSvc.selectedProcess).name,
    };
    if (this.type === GridToolbarType.allProcess) {
      payload.searchContract = localStorage.getItem('searchContract');
    }

    const exportAndDownload = () => {
      this.excelSvc.export(payload).subscribe((resp) => {
        // let blob = new Blob([a], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        // let objectUrl = URL.createObjectURL(blob);
        // window.open(objectUrl)

        var pom = document.createElement('a');
        // var csvContent= resp; //here we load our csv data
        // var blob = new Blob([csvContent],{type: 'text/xls;charset=utf-8;'});
        var url = URL.createObjectURL(resp.body);
        pom.href = url;
        // let filename = `${this.type}.xlsx`;
        let currentTime = moment().format('DD-MMM-YYYY HH:mm:ss');
        let filename = userfileName
          ? `${this.sourceLabel}_${userfileName}_${currentTime}.xlsx`
          : `${this.sourceLabel}_${currentTime}.xlsx`;

        pom.setAttribute('download', filename);
        pom.click();

        if (updateExistingReport) {
          let reportNameToEdit =
            this.actRoute.snapshot.paramMap.get('reportName');
          if (userfileName === reportNameToEdit) {
            location.reload();
          } else {
            this.router
              .navigate([`landing/reports/edit/${userfileName}`])
              .then(() => {
                location.reload();
              });
          }
        }
      });
    };

    if (userfileName !== undefined) {
      let saveData: ExcelSaveRequestModel = {
        columns: cols,
        conditions: filtercondtions,
        source: this.sourceLabelSvc.getSourceType(this.type),
        sourceLabel: this.sourceLabel,
        reportName: userfileName,
      };

      if (this.type === GridToolbarType.allProcess) {
        saveData.searchContract = localStorage.getItem('searchContract');
      }

      if (!updateExistingReport) {
        this.repSvc.saveReport(saveData).subscribe((resp) => {
          if (resp?.status) {
            this.toastrSvc.success(
              "Report saved successfully. Please check the 'REPORTS' section"
            );
            exportAndDownload();
          } else {
            this.toastrSvc.error('Report could not be saved');
          }
        });
      } else {
        let reportNameToEdit =
          this.actRoute.snapshot.paramMap.get('reportName');
        this.repSvc
          .updateReport(saveData, reportNameToEdit)
          .subscribe((resp) => {
            if (resp?.status) {
              this.toastrSvc.success('Report saved successfully');
              exportAndDownload();
            } else {
              this.toastrSvc.error('Report could not be saved');
            }
          });
      }
    } else {
      exportAndDownload();
    }
  }
  handleExport(): void {
    if (
      this.type === GridToolbarType.alltasks ||
      this.type === GridToolbarType.workbasket ||
      this.type === GridToolbarType.worklist ||
      this.type === GridToolbarType.contractlist
    ) {
      this.openConfirmExportModal();
    } else {
      this.exportXls();
    }
  }
  openConfirmExportModal(): void {
    const modalRef = this.modalSvc.open(ConfirmExportModalComponent, {
      keyboard: false,
      backdrop: 'static',
      size: 'sm',
    });

    modalRef.result.then(
      (result) => {
        if (typeof result === 'string') {
          this.exportXls(result.trim());
        }
      },
      (reason) => {
        if (reason === 'ExportOnly') this.exportXls();
      }
    );
  }

  saveGridDefinition() {
    let reportName = this.editedReportDetails.ifEdited
      ? this.editedReportDetails.editedReportName
      : this.actRoute.snapshot.paramMap.get('reportName');
    if (reportName.trim() === '') {
      return (this.editedReportDetails.editedReportNameError =
        'Please type a name for this file');
    }

    let regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (regex.test(reportName.trim())) {
      return (this.editedReportDetails.editedReportNameError =
        'Spacial characters are not allowed');
    }

    this.exportXls(reportName, { updateExistingReport: true });
  }

  onlyDownload(conditions = []) {
    let reportName = this.actRoute.snapshot.paramMap.get('reportName');
    this.repSvc
      .getReport({
        reportName: reportName,
        processName: JSON.parse(this.sharedSvc.selectedProcess).name,
        conditions: history.state.conditions ?? [],
      })
      .subscribe((resp) => {
        var pom = document.createElement('a');
        var url = URL.createObjectURL(resp.body);
        pom.href = url;
        let currentTime = moment().format('DD-MMM-YYYY HH:mm:ss');

        let filename = `${this.sourceLabel}_${reportName}_${currentTime}.xlsx`;
        pom.setAttribute('download', filename);
        pom.click();
      });
  }
  chooseColumns(opened: boolean): void {
    if (opened) {
      let state = localStorage.getItem(`grid-columns-${this.type}`);

      if (state) {
        this.selectedColumns = JSON.parse(state);
        this.selectedColumns.forEach(
          (c) =>
            (c.checked = !this.columns.find((a) => a.datafield === c.datafield)
              .hidden)
        );
      } else {
        this.selectedColumns = JSON.parse(JSON.stringify(this.columns));
        this.selectedColumns.map((i) => (i.checked = true));
        localStorage.setItem(
          `grid-columns-${this.type}`,
          JSON.stringify(this.selectedColumns)
        );
      }
    }
  }

  preCalculatedColumnClicked(column): void {
    column.hidden = !column.hidden;
    this.onColumnVisibilityChange.emit(column);
    if (!column.hidden) {
      this.gridInstance.showColumn(column.datafield);
    } else {
      this.gridInstance.hideColumn(column.datafield);
    }
  }

  columnClicked(column): void {
    column.checked = !column.checked;
    if (column.checked) {
      this.selectedColumns.find(
        (i) => i.datafield == column.datafield
      ).checked = true;
      localStorage.setItem(
        `grid-columns-${this.type}`,
        JSON.stringify(this.selectedColumns)
      );
      this.gridInstance.showColumn(column.datafield);
    } else {
      this.selectedColumns.find(
        (i) => i.datafield == column.datafield
      ).checked = false;
      localStorage.setItem(
        `grid-columns-${this.type}`,
        JSON.stringify(this.selectedColumns)
      );
      this.gridInstance.hideColumn(column.datafield);
    }
  }

  emitRowForNesting(event) {
    this.nestedParentObj.emit(event);
  }

  populateNestingRow(
    index: number,
    parentElement: any,
    gridElement: any,
    record: any
  ) {
    this.gridInstance.fillRowDetails(index, parentElement, gridElement, record);
  }

  beginUpdate() {
    // this.gridInstance.beginUpdate() ;
  }

  endUpdate() {
    this.gridInstance.endUpdate();
  }

  updateBoundData(savedState?) {
    // this.gridInstance.source = new jqx.dataAdapter({
    //   localdata: this.data,
    //   ...this.sourceConfig
    // });

    if (this.gridInstance) {
      // console.log('*******************************************');
      // console.log('DATA---', this.data);
      this.gridInstance.updateData = this.data;
      this.gridInstance.config = this.sourceConfig;
      this.gridInstance.updateBoundData(savedState);
      // console.log('UPDATE---', this.gridInstance.updateData);
      // console.log('*******************************************');
    }
  }

  setGroup(inpgrp) {
    this.gridInstance.setGroup(inpgrp);
  }

  emitCellSingleClickEvent(event) {
    this.cellClickIdentifire = true;
    this.singleClick.emit(event);
    // this.timeout = setTimeout(() => {
    //   if (this.selectFirstRow) {
    //     this.rowIndex.push(event.args.rowindex);
    //     this.rowIndex = [...this.rowIndex]; // for ngonchanges to work in grid.comp.ts
    //     console.log(this.rowIndex, 'rowIndex');
    //   }
    // }, 270);
  }

  emitCellDblClickEvent(event) {
    // clearTimeout(this.timeout);
    this.celldblClick.emit(event);
  }

  emitCellValueChange(ev) {
    this.cellValueChange.emit(ev);
  }

  getRowDatabyId(rowid) {
    this.selectedRow = this.gridInstance.getRowDatabyId(rowid);

    this.changeButtonStats(1);
    return this.gridInstance.getRowDatabyId(rowid);
  }
}

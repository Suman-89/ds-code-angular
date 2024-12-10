import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CompanyManagementService,
  ExcelExportService,
  RefDataService,
  SharedService,
} from 'src/app/core/_services';
import { TaskActionService } from '../../../process/layout/_services/task-action.service';
import { GridToolbarType, InstanceModel } from 'src/app/core/_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCountryDataComponent } from '../../_modals';
import { ToastrService } from 'ngx-toastr';
import { CountryProductCEMapModel } from '../../_models';
@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
})
export class CompanyDashboardComponent implements OnInit {
  @ViewChild('companyGrid') companyGridInst;
  compGridColumns = [];
  gridData;
  allCompaniesData = [];
  selectedComp;
  mngmttype;
  searchMsg = '';
  type = GridToolbarType;
  ceList;
  ceMapWithCountryList;
  selectionMode = 'checkbox';
  editable = false;
  products: InstanceModel[];
  bulkUpdateMap;
  height;
  selectedProcess;

  constructor(
    private router: Router,
    private actroute: ActivatedRoute,
    private compSvc: CompanyManagementService,
    private sharedSvc: SharedService,
    private modalSvc: NgbModal,
    private refSvc: RefDataService,
    private toastrSvc: ToastrService,
    private excelService: ExcelExportService,
    private taskActionSvc: TaskActionService
  ) {}

  ngOnInit(): void {
    this.getGridColumns();
    this.getGridData();
    let processname = JSON.parse(localStorage.getItem('selected-process'));
    this.selectedProcess = processname.label;
  }

  addOrEditCompany(opt) {
    const parentpath = 'landing/company/';
    let path;
    //  opt === 1 ? path = 'add-company' : path = 'edit-company/' + this.selectedComp.id;
    switch (opt) {
      case 1:
        this.router.url.includes('contract')
          ? (path = 'contracting-entities/add-contract-entities')
          : (path = 'companies/add-company');
        break;
      case 2:
        this.router.url.includes('contract')
          ? (path =
              'contracting-entities/edit-contract-entities/' +
              this.selectedComp.id)
          : (path = 'companies/edit-company/' + this.selectedComp.id);
        break;
    }
    this.router.navigate([parentpath + path]);
  }

  getGridColumns() {
    if (this.router.url.includes('contract')) {
      this.mngmttype = 'Contract Entities';
      this.compSvc.getContractGridColumns().subscribe((res) => {
        this.compGridColumns = res;
      });
    } else {
      this.mngmttype = this.router.url.includes('country-management')
        ? this.type.country
        : this.type.company;
    }
  }
  getGridData() {
    switch (this.mngmttype) {
      case 'Contract Entities':
        this.getContractingEntities();
        break;
      case this.type.company:
        this.getCompanyData();
        break;
      case this.type.country:
        this.getCEmappedToCountries();
        break;
    }
  }

  getCEmappedToCountries() {
    this.compSvc.getAllContractingEnities().subscribe((r) => {
      if (r.status) {
        this.ceMapWithCountryList = r.data;
        this.getAllProducts();
      }
    });
  }

  getAllProducts() {
    this.refSvc.getInstances('PR', true).subscribe((p) => {
      if (p.data) {
        this.products = p.data;
        this.getCountries();
      }
    });
  }

  getCountries() {
    this.sharedSvc.getCountryOnInit().subscribe((c) => {
      if (c.status) {
        this.selectionMode = 'singlecell';
        this.editable = true;
        this.height = '80%';
        c.data.map((a) => {
          // if (this.ceMapWithCountryList.find(ce => ce.code === a.countrycode)) {
          //    a['contractingentity'] = this.ceMapWithCountryList.find(ce => ce.code === a.countrycode).name
          //   } else {
          //    a['contractingentity'] = null;
          //   }
          //  a['contractingentity'] = this.ceMapWithCountryList.map(ce => ce.name).join(',') ;
          //  a['ceiot'] = this.ceMapWithCountryList.map(ce => ce.name).join(',')  ;
          //  a['cesms'] = this.ceMapWithCountryList.map(ce => ce.name).join(',')  ;
          //  a['cevoice'] = '' ;
          //  a['ceother'] = '' ;
          //  a['cemobile'] = '' ;
          this.products.map((p) => {
            let c = this.ceMapWithCountryList.find(
              (ce) => ce.countrycode === a.countrycode
            );
            if (c && a.countrycode === c.countrycode) {
              a[p.name] = c.mappings.find((m) => m.productname === p.name)
                ? c.mappings.find((m) => m.productname === p.name).cename
                : '';
            } else {
              a[p.name] = '';
            }
          });
          return a;
        });
        this.gridData = c.data;
        this.getContractingEntities(1);
      }
    });
  }

  getContractingEntities(opt?) {
    this.compSvc.getContractingEntities().subscribe((resp) => {
      opt
        ? (this.ceList = resp.data.sort((a, b) => (a.id > b.id ? 1 : -1)))
        : (this.gridData = resp.data.sort((a, b) => (a.id > b.id ? 1 : -1)));
    });
  }

  getCompanyData() {
    this.compSvc.getAllCompanies().subscribe((resp) => {
      this.height = null;
      this.gridData = resp.data.sort((a, b) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
      // console.log("Ammi Mukul",this.gridData.find((a)=>{ return a.name === '388697452002'}));

      this.gridData.forEach((a) => {
        a.isactive ? (a.status = 'Active') : (a.status = 'Inactive');
      });
      this.allCompaniesData = resp.data.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      this.gridData = this.gridData.map((i) => {
        return {
          ...i,
          id: i.id.toString(),
          accountManagers: i.accountManagers?.map((i) => i.fullName),
        };
      });
    });
  }

  doubleClick(ev): void {
    this.selectedComp = ev;
    if (ev.countryname) {
      this.editCountryData();
    } else {
      this.addOrEditCompany(2);
    }
  }

  onGridRowSelect(ev) {
    this.selectedComp = ev.rows[0];
    switch (ev.action) {
      case 'edit':
        this.addOrEditCompany(2);
        break;
      case 'addcompany':
        this.addOrEditCompany(1);
        break;
      case 'editcountry':
        this.editCountryData();
        break;
      case 'bulkupdate':
        this.applyCEProductForAllCountries();
        break;
      case 'syncdms':
        this.syncWithDms();
        break;
      case 'exportCompany':
        this.exportAsXLSX(ev.columns);
        break;
      // case 'deletecompany':
      //   this.deleteCompany(this.selectedComp.id) ;
      //   break;
      case 'bulk':
        this.taskActionSvc.sendBulkMessage(ev.rows, 1);
      // break;
    }
  }
  doubleClickContEntity(data) {
    this.selectedComp = data;
    this.addOrEditCompany(2);
  }
  selectContEntity(data) {
    this.selectedComp = data;
  }

  filterCompanies(data) {
    data.length > 0
      ? (this.searchMsg = 'Showing Results for "' + data + '"')
      : (this.searchMsg = '');
    this.gridData = this.allCompaniesData.filter(
      (a) =>
        a.name.toLowerCase().includes(data.toLowerCase()) ||
        a.friendlyname.toLowerCase().includes(data.toLowerCase())
    );
  }

  deleteCompany(id) {
    this.compSvc.deleteCompany(id).subscribe((a) => {
      if (a.status) {
        this.getGridData();
      }
    });
  }

  syncWithDms() {
    this.compSvc.syncDms().subscribe((a) => {
      if (a.status) {
        this.toastrSvc.success('Synced With DMS');
      }
    });
  }

  onCellDblClick(ev) {
    this.selectedComp = ev.args.row;
    // let data;
    // if(ev.args.datafield === 'ceiot' || ev.args.datafield == 'cesms' || ev.args.datafield == 'cemobile' ||  ev.args.datafield == 'cevoice' ||  ev.args.datafield == 'ceother') {
    //   data = {product: ev.args.datafield.substr(2,ev.args.datafield.length).toUpperCase(), countryname: ev.args.row.bounddata.countryname } ;
    // }
    // this.editCountryData(data) ;
  }

  cellValueChangeEvent(ev) {
    let rowData = this.companyGridInst.getRowDatabyId(ev.args.rowindex);
    if (ev.args.newvalue.length > 0) {
      this.bulkUpdateMap = ev;
      this.setCEProductCountryMap(rowData, ev);
    }
  }

  setCEProductCountryMap(rowData, ev, count?) {
    let data: CountryProductCEMapModel = {
      countryname: rowData.countryname,
      countrycode: rowData.countrycode,
      code: rowData.code,
      mappings: { productname: ev.args.datafield, cename: ev.args.newvalue },
    };
    this.compSvc.mapCountryProductCE(data).subscribe((m) => {
      if (m.status) {
        !count ? this.toastrSvc.success('Mapped to country') : null;
        if (count === this.gridData.length) {
          window.location.reload();
        }
      }
    });
  }

  applyCEProductForAllCountries() {
    if (this.bulkUpdateMap) {
      let i = 0;
      this.gridData.map((e) => {
        i = i + 1;
        this.setCEProductCountryMap(e, this.bulkUpdateMap, i);
      });
    } else {
      this.toastrSvc.warning(
        'Please select a contracting entity and then try bulk update'
      );
    }
  }

  editCountryData() {
    const countryObj = {
      countryname: this.selectedComp.countryname,
      id: this.selectedComp.id,
      code: this.selectedComp.code,
      countrycode: this.selectedComp.countrycode,
      isd: this.selectedComp.isd,
      synonyms: this.selectedComp.synonyms,
      contractingentity: this.selectedComp.contractingentity,
      region: this.selectedComp.region,
    };
    const modalRef = this.modalSvc.open(EditCountryDataComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.country = countryObj;
    // modalRef.componentInstance.product = countryObj.product ;
    modalRef.componentInstance.ceList = this.ceList;
    modalRef.componentInstance.countryDetailsEmitter.subscribe((c) => {
      if (c) {
        modalRef.close();
        this.toastrSvc.success('Country Details Saved');
        this.gridData
          .filter((a) => a.id === c.id)
          .map((m) => {
            (m.isd = this.selectedComp.isd = c.isd),
              (m.synonyms = this.selectedComp.synonyms = c.synonyms);
            m.contractingentity = this.selectedComp.contractingentity =
              c.contractingentity;
            m.region = this.selectedComp.region = c.region;
            return m;
          });
        this.gridData = this.gridData.sort((a, b) =>
          a.countryname > b.countryname ? 1 : -1
        );
        this.companyGridInst.data = this.gridData;
        // this.companyGridInst.updateRow(id, this.selectedComp) ;
        this.companyGridInst.updateBoundData();
      }
    });
  }

  exportAsXLSX(columns): void {
    const lCol = localStorage.getItem(`grid-columns-${this.type.company}`);
    let state =
      columns?.length == 0
        ? lCol
          ? JSON.parse(lCol).filter((a) => !a.checked)
          : null
        : columns;

    let data = this.allCompaniesData.map((a) => {
      if (state) {
        state.forEach((s) => {
          delete a[s.datafield];
        });
      }
      return a;
    });
    let date = new Date().toDateString();
    this.excelService.exportAsExcelFile(`companydata${date}`, data);
  }
}

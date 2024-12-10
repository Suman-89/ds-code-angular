import { CompanyManagementService, RefDataService, SharedService } from 'src/app/core/_services';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompanyGroupModel } from 'src/app/feature/company/_models';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() type: string ;
  @Input() searchUrl: string ;
  @Input() createAllowed?: boolean = false;
  @Output() resultEmitter: EventEmitter<string> = new EventEmitter<string>() ;

  list: CompanyGroupModel[] = [];
  selectedResult;

  searchArray = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(term => {
        if (term.length > 1 && this.list.length > 0) {
          let temp = this.list.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
          return temp.length > 0 ? temp : (this.createAllowed ? [{ id: `create:${term}`, name: `Create ${term}` }] : []);
        } else if (term.length > 1 && this.list.length == 0 && this.createAllowed) {
          return [{ id: `create`, name: `Create ${term}`, param: term}];
        }
        return [];
      })
    ) ;
  }

  searchFormatter = x => x.name ;
  outputFormatter = x => x.id;

  constructor(private companySvc: CompanyManagementService, private refSvc: RefDataService, private sharedSvc: SharedService) { }

  ngOnInit(): void {
    this.getListData() ;
  }

  getListData() {
    switch (this.type) {
      case 'group':
        this.getGroups();
        break ;
    }
  }


  getGroups() {
    this.companySvc.getCompanyGroups().subscribe(resp => {
     if (resp.status) {
      this.list = resp.data ;
     }
    }) ;
  }

  getParentCompany() {
    this.companySvc.getAllCompanies().subscribe( resp => {
      this.list = resp.data ;
    }) ;
  }

  getfkaList() {
    this.companySvc.getParentCompanies().subscribe( resp => {
      this.list = resp.data ;
    }) ;
  }

  searchCompany(term: string): void {
    this.companySvc.searchCompanies(term).subscribe(a => {
      this.list = a.data;
    })
  }

  // getProductList(): void {
  //   this.refSvc.getAllRefdataCategories().subscribe(resp => {
  //     this.list = resp.data;
  //   })
  // }

  emitResult(data) {
    if (data.length > 3) {
      this.resultEmitter.emit(data) ;
    }
  }
}

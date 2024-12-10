import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { TypeAheadModel } from 'src/app/core/_models';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import {
  CompanyManagementService,
  RefDataService,
  WhatsappService,
} from 'src/app/core/_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss'],
})
export class TypeAheadComponent implements OnInit, OnChanges {
  @Input() type: string;
  @Input() value?: any = '';
  @Input() createAllowed?: boolean = false;
  @Input() secondLevelId?: any = null;
  @Input() required?: boolean = false;
  @Input() search?: string = 'local';
  @Input() fromVoice;
  @Output() searchCleared: EventEmitter<boolean> = new EventEmitter();
  @Output() resultEmitter: EventEmitter<TypeAheadModel> =
    new EventEmitter<TypeAheadModel>();

  focus$ = new Subject<string>();

  typeAheadVal: TypeAheadModel = {} as TypeAheadModel;
  list: TypeAheadModel[] = [];
  url: string = '';

  searchFormatter = (x) => x.name;
  localArrayFn = this.localArray();
  loading: boolean = false;
  constructor(
    private companySvc: CompanyManagementService,
    private refDataSvc: RefDataService,
    private whatsappSvc: WhatsappService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.url = this.router.url;
    const substring = 'initiate';
    const isInitiatePage = this.url.indexOf(substring);
    if (isInitiatePage !== -1) {
      // selecting digital sherpa by default for ds content creation
      let process = JSON.parse(localStorage.getItem('selected-process'));
      // console.log("process", process)
      if (process.key === 'Initiation_dsContentCreationProcess') {
        this.companySvc.searchCompanies('digitalsherpa').subscribe((res) => {
          // console.log("res.data", res.data)
          if (res.data.length > 1) {
            for (let i of res.data) {
              if (i.name === 'DigitalSherpa') {
                console.log('iiii', i);
                res.data[0] = i;
                break;
              }
            }
          }
          this.typeAheadVal = res.data[0];
          this.resultEmitter.emit(res.data[0]);
        });
      } else if (process.key === 'Initiation_surbhiTravelProcess') {
        this.companySvc.searchCompanies('emami').subscribe((res) => {
          this.typeAheadVal = res.data[0];
          this.resultEmitter.emit(res.data[0]);
        });
      }
    }
    this.getListData();

    // console.log("from Voice DEAL *******************",this.fromVoice)
  }

  ngOnChanges(): void {
    if (this.value && this.value.length > 0) {
      this.typeAheadVal = { ...this.typeAheadVal, name: this.value };
    } else {
      this.typeAheadVal = {} as TypeAheadModel;
    }
  }

  searchArray = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.loading = true;
        if (term.length > 1) {
          return this.searchListData(term.trimLeft()).pipe(
            map((a) => {
              if (
                this.createAllowed &&
                (a.length === 0 ||
                  (a.length > 0 &&
                    a[0].name.toLowerCase() !== term.toLowerCase()))
              ) {
                a.push({
                  id: `create:${term}`,
                  name: `Create ${term}`,
                  param: term,
                });
              }
              console.log('i m running');
              console.log('a', a);
              this.loading = false;
              return a;
            })
          );
        } else {
          this.searchCleared.emit(true);
          this.loading = false;
          return of([] as TypeAheadModel[]);
        }
      })
    );

  searchListData(term?: string) {
    switch (this.type) {
      case 'company':
        return this.searchCompany(term);
      case 'groups':
        return this.searchGroup(term);
    }
  }

  searchCompany = (term?: string): Observable<TypeAheadModel[]> => {
    return this.companySvc
      .searchCompanies(encodeURIComponent(term))
      .pipe(map((a) => a.data));
  };

  searchGroup = (term: string): Observable<TypeAheadModel[]> => {
    return this.companySvc
      .getCompanyGroups()
      .pipe(map((a) => a.data.filter((d) => d.name.includes(term))));
  };

  localSearch = (term?: string): Observable<TypeAheadModel[]> => {
    return of(
      this.list
        .filter((v) => v.name.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 10)
    );
  };

  getRefDataInst(type: string, isCat: boolean = true): void {
    this.refDataSvc.getInstances(type, isCat).subscribe((a) => {
      this.list = a.data;
    });
  }

  getContractingEnt(): void {
    this.companySvc.getContractingEntities().subscribe((a) => {
      this.list = a.data;
    });
  }

  getCarrierType(): void {
    this.companySvc.getCompanyTypes().subscribe((a) => {
      this.list = a.data;
    });
  }

  getRecruiters(type: string): void {
    let process = JSON.parse(localStorage.getItem('selected-process'))?.name;
    this.whatsappSvc.getRecruiters().subscribe((a) => {
      let data = a.data.filter((x) => x.processName === process);
      console.log(data);
      this.list = data;
    });
  }

  getListData(): void {
    switch (this.type) {
      case 'products':
        this.getRefDataInst('PR');
        break;
      case 'recruiters':
        this.getRecruiters('recruiters');
        break;
      case 'contractType':
        this.getRefDataInst('CONT_TYPE');
        break;
      case 'contractTermType':
        this.getRefDataInst('CT');
        break;
      case 'otherProducts':
        this.getRefDataInst('OPT');
        break;
      case 'currAmend':
        this.getRefDataInst('CURR_AMEND');
        break;
      case 'currency':
        this.getRefDataInst('CUR');
        break;
      case 'contractingEntity':
        this.getContractingEnt();
        break;
      case 'carrierType':
        this.getCarrierType();
        break;
      case 'casePriority':
        this.getRefDataInst('CASE_PRI');
        break;
      case 'secondLevel':
        this.getRefDataInst(this.secondLevelId, false);
        break;
      case 'partnerType':
        this.getRefDataInst('partnerType');
        break;
      case 'vendorDisputeType':
        this.getRefDataInst('vendorDisputeType');
        break;
      case 'customerDisputeType':
        this.getRefDataInst('customerDisputeType');
        break;
    }
  }

  localArray() {
    return () => this.focus$.pipe(map(() => this.list));
  }

  emitResult(data): void {
    if (data.item) {
      this.resultEmitter.emit(data.item);
    }
    if (data.item && data.item.name.toLowerCase().includes('create')) {
      return (data.item.name = data.item.param);
    }
  }
}

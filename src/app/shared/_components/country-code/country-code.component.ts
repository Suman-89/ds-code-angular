import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { UserService } from 'src/app/core/_services';

@Component({
  selector: 'app-country-code',
  templateUrl: './country-code.component.html',
  styleUrls: ['./country-code.component.scss'],
})
export class CountryCodeComponent implements OnInit {
  constructor(private userSvc: UserService) {}
  ngOnInit(): void {
    this.getAllCountryCodes();
    combineLatest(this.countryObs, this.rawNumberObs).subscribe(([a, b]) => {
      let fullNumber = `${a}${b}`;
      if (b) {
        this.fullNumberEmitter.emit(fullNumber);
      }
    });
    // console.log(this.savedNumber)
  }
  //
  dropDown:boolean=false;
  searchText;

  toggleDropDown(){
    this.dropDown=!this.dropDown;
    if(this.dropDown){
      console.log("toggle in")
    }else{
      console.log("toggle out")
    }
  }
  
  allCountries;
  countryData;
  filteredCountries;
  selectedCountry: string = '+91';
  rawNumber: number;
  countryObs: BehaviorSubject<string> = new BehaviorSubject(
    this.selectedCountry
  );
  rawNumberObs: BehaviorSubject<string> = new BehaviorSubject('');

  @Input() savedNumber: string;

  @Output() fullNumberEmitter: EventEmitter<string> =
    new EventEmitter<string>();

  getAllCountryCodes(): void {
    this.userSvc.getAllCountryCodes().subscribe((res) => {
      this.allCountries = res;
      // console.log(this.allCountries)
      this.countryData=res;
    });
  }
   
  selectCountryCode(val){
    console.log(val)
   this.selectedCountry=val.value
   this.selectCountry()

  }

  searchCountries() {   
    console.log(this.searchText)
    this.filteredCountries = this.countryData.filter((country) =>
      country.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      country.dial_code.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.allCountries=this.filteredCountries
  }
  selectCountry(): void {
    this.countryObs.next(this.selectedCountry);
  }

  getNumber(): void {
    this.rawNumberObs.next(this.rawNumber.toString());
  }

  editMode(val: boolean): void {
    if (!val) {
      this.userSvc.isEditMode.next(false);
      this.fullNumberEmitter.emit(this.savedNumber);
    } else {
      this.userSvc.isEditMode.next(true);
    }
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormDataConstants } from 'src/app/core/_models';
import { CompanyManagementService, RefDataService } from 'src/app/core/_services';
import { CountryDataModel } from '../../_models';

@Component({
  selector: 'app-edit-country-data',
  templateUrl: './edit-country-data.component.html',
  styleUrls: ['./edit-country-data.component.scss']
})
export class EditCountryDataComponent implements OnInit {
@Input() country: CountryDataModel;
@Input() product;
@Input() ceList;
@Output() countryDetailsEmitter = new EventEmitter<CountryDataModel>() ;
inputSynonym='' ;
pattern = new FormDataConstants() ;
regions; 
  constructor(private actModal: NgbActiveModal, private refSvc: RefDataService, private compSvc: CompanyManagementService) { }

  ngOnInit(): void {
    this.getRegionRefData() ;
  }

  close() {
    this.actModal.close() ;
  }

  getRegionRefData() {
    this.refSvc.getInstances('REG', true).subscribe( r => {
      if(r.status) {
        this.regions = r.data ;
      }
    })
  }
  addSynonym() {
    if (!this.country.synonyms) {
      this.country.synonyms = [] ;
    }
    this.inputSynonym.length > 0 ?  this.country.synonyms.push(this.inputSynonym) : null ;
    this.inputSynonym = '' 
  }

  deleteSyn(syn) {
    this.country.synonyms = this.country.synonyms.filter(s => s !== syn) ;
  }

  saveCEChange(opt) {
    let ce ;
    switch(opt) {
      case 1:
        ce = this.country.contractingentity ;
        break;
      case 2:
        ce = this.country.ceiot 
        break;  
      case 3:
          ce = this.country.cesms 
          break; 
      case 4:
            ce = this.country.cemobile 
            break; 
      case 5:
            ce = this.country.cevoice 
            break;
      case 6:
        ce = this.country.ceother 
        break;            


    }
    this.compSvc.putCountryDetailsofCE(this.country.countrycode, ce).subscribe(r => {
     if(r.status) {

     }
    }) ;
  }
  save() {
     this.addSynonym() ;
     const countryObj = {
      countryname: this.country.countryname,
      id: this.country.id,
      code: this.country.code,
      countrycode: this.country.countrycode,
      isd: this.country.isd,
      synonyms: this.country.synonyms,
      region: this.country.region
     }
     this.compSvc.editCountryDetails(countryObj).subscribe( r => {
      if (r.status) {
        this.countryDetailsEmitter.emit(this.country) ;
        }
      });

 }

  preventChar(event, field?) {
    if (!event.code.includes('Digit') && !event.code.includes('Numpad')) {
        if (event.key !== '+' && event.code !== 'Backspace')  {
          this.country[field] = '' 
        }
    }
  }
  
  preventNumber(event, field?) {
    if (event.code.includes('Digit')) {
       this.country[field] = ''
    }
  }

}

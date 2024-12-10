import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/core/_services';

@Injectable({
  providedIn: 'root'
})
export class BltService {
    constructor(private apiSvc: ApiService) { }
    devUrl = "https://development.digisherpa.ai/"
   

    savePricingConfig(payload){
        let path = this.devUrl+"pricing/config";
        return this.apiSvc.post(path, payload)
    }

    getPricingConfig(){
        let path = this.devUrl+"pricing/config";
        return this.apiSvc.get(path)
    }

    getPricingList(){
        let path = this.devUrl+"pricing/details/list";
        return this.apiSvc.get(path)
    }

 
}





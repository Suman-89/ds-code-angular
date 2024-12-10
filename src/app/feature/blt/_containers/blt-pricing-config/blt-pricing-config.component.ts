import { Component, OnInit , AfterViewInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { fromEvent  } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RefDataService } from 'src/app/core/_services';
import { BltService } from '../../_services/blt.service';
import { ElevatorPricingBase, ElevatorPricingPremiumsModel, LocationDependentPriceModel, PricingConfigModel } from '../../_models';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-blt-pricing-config',
  templateUrl: './blt-pricing-config.component.html',
  styleUrls: ['./blt-pricing-config.component.scss'],
})
export class BltPricingConfigComponent implements OnInit {
  constructor(
    private refDataSvc: RefDataService,
    private BltSvc : BltService,
    private toastrSvc : ToastrService

  ) {}

  pricingMiscellaneousObj ={
    gstPercentage:0,
    commissionPercentage:0,
    annualWarrantyPercentage:0,
    profitMarginPercentage:0,

  }

  existingElevatorData =[];

  //ELEVATOR , INSTALLATION , FREIGHT , UNLOADING , ADDITIONAL
  // elevatorPricingData: elevatorPricingData[] = [
  elevatorPricingHeaders = [
    'Capacity',
    'MR / MS Gearbase',
    'MR / MS Gearless',
    'MRL - MS Base',
    'Per Stop Increase',
    'High Rise Stops',
    'High Rise Premium per Stop',
    'SS Premium',
    'SS High Rise Floor Premium',
    'SSL Door Price Per Floor',
    'MRLHigh Rise Premium',
  ];
  elevatorPricingData = [
    
    // },
    // ... Add more objects
  ];

  installationPricingHeaders = [
   'MR - Geared Base',
   'MR - Gearless Premium',
   'MRL Premium',

  ];
  installationPricingData=[
    {
      mrgBasePrice:'' || 0,
      mrglPremium:'' || 0,
      mrlPremium:'' || 0,
    }

  ]
  installationCapacityHeaders = [
    'Capacity',
    'Install Capacity Premium'
  ];

  installationCapacityData = [
  ];

  installLocationHeaders = [
    'Location',
    'Install Location Premium'
  ];
  installLocationData = [
  ]
  freightPricingHeaders = [
    'Base Price',
    'High Rise Stop',
    'High Rise Premium Per Stop',
    'MRL Premium' 
   ];

   freightPricingData=[
    {
      basePrice:'' || 0,
      highRiseStop:'' || 0,
      highRisePremiumPerStop:'' || 0,
      mrlPremium: '' || 0
        },
  ]
   freightCapacityHeaders = [
     'Capacity',
     'Freight Capacity Premium'
   ]

   freightCapacityData = [
  ];

   freightLocationHeaders = [
    'Location',
    'Frieght Location Premium'
  ];

  freightLocationData = [
  ]
   unloadingChargesHeaders = [
    'Base Price',
    'High Rise Stop',
    'High Rise Premium Per Stop',
 
   ];
   unloadingChargesData=[
    {
      basePrice: '' || 0,
      highRiseStops: '' || 0,
      highRisePremiumPerStop: '' || 0,
     
        }

  ]
   unloadingCapacityHeaders = [
     'Capacity',
     'Unloading Capacity Premium'
   ]
   unloadingCapacityData = [
  ];

  unloadingLocationHeaders = [
    'Location',
    'Unloading Location Premium'
  ];

  unloadingLocationData = [
  
  ]
   additionalFeaturePricingHeaders=[
     'Additional Feature',
     'Base Cost',
     'Premium Per Stop'
   ]

   additionalFeaturePricingData=[
   ]
   user = JSON.parse(localStorage.getItem('user'));
  isAdmin = false; // Replace with your user role logic

  editable = true;
  capacityList=[];
  locationList=[];
  additionalFeatureList=[];
   
 
  ngOnInit(): void {

    if (this.user.roles.includes('SUPER_ADMIN') || this.user.roles.includes("SYSTEM_ADMIN")) {
       this.isAdmin=true
    }
    else{
      window.history.back();
    }
    this.getCapacityRefData();
    this.getLocationRefData();
    this.getAdditionalFeatureRefData();
 
  }

  ngAfterViewInit() {
    this.BltSvc.getPricingConfig().subscribe((res)=>{
      console.log("res", res.data)
      console.log("caplist", this.capacityList)

      if(res.data.elevatorPricingPremiums.length>0){
        this.existingElevatorData = res.data.elevatorPricingPremiums;
      }
      if(res.data.installPrices.length > 0){
      this.installationPricingData = res.data.installPrices;      
      }
      if(res.data.freightPrices.length > 0){
        this.freightPricingData = res.data.freightPrices;
      }
      if(res.data.unloadingPrices.length > 0){
        this.unloadingChargesData = res.data.unloadingPrices;
      }
      if(res.data.additionalFeaturePrices.length > 0){
        this.additionalFeaturePricingData = res.data.additionalFeaturePrices
      }
      if(res.data.pricingMiscellaneous.length > 0){
        this.pricingMiscellaneousObj = res.data.pricingMiscellaneous[0];
      }

   
      if(res.data.elevatorPricingPremiums.length > 0){
        this.elevatorPricingData=[];
        this.installationCapacityData=[];
        this.freightCapacityData =[];
        this.unloadingCapacityData =[];
        res.data.elevatorPricingPremiums.forEach((el) => {
        
          let obj={};
          const foundCapacity = this.capacityList.find((cl) => Number(cl.name) === el.capacity);
          if(foundCapacity && res.data.elevatorPricingPremiums.length>0){
  
          obj["capacity"] = el.capacity;
          obj["perStopIncrease"]=el.premiumPerStop;
          obj["highRiseStop"]=el.highRiseStop;
          obj["highRisePremiumPerStop"]=el.highRisePremiumPerStop;
          obj["ssPremium"]=el.ssPremium;
          obj["ssHighRiseFloorPremium"]=el.ssHighRisePremiumPerStop;
          obj["sslDoorPricePerFloor"]=el.ssLandingDoorPrice;
          obj["mrlHighRisePremium"]=el.mrlHighRisePremium;
          obj["createdBy"] = el.createdBy;
          obj["createdTimeStamp"] = el.createdTimeStamp;
          // console.log("elevatorprikcnigbases", el.elevatorPricingBases)
          if(el.elevatorPricingBases.length > 0){
            obj["mrMsGearbase"]=el.elevatorPricingBases[0].basePrice;
            obj["mrMsGearless"]=el.elevatorPricingBases[1].basePrice;
            obj["mrlmsbase"]=el.elevatorPricingBases[2].basePrice;
          }


             
         
          // this.updateBasePrice(el.elevatorPricingBases , obj)
          // el.elevatorPricingBases.forEach((bp) => {
          //   if(bp.machineTractionType === "mrMsGearbase"){
          //     obj["mrMsGearbase"]=bp.basePrice;
          //   }
          //   if(bp.machineTractionType === "mrMsGearless"){
          //     obj["mrMsGearless"]=bp.basePrice;
          //   }
          //   if(bp.machineTractionType === "mrlmsbase"){
          //     obj["mrlmsbase"] = bp.basePrice;
          //   }
          // })
  
          this.elevatorPricingData.push(obj);
  
  
           let ic={};
           ic["capacity"]=el.capacity;
           ic["installCapacityPremium"]=el.installCapacityPremium
           this.installationCapacityData.push(ic);
  
           let fc={};
           fc["capacity"]=el.capacity;
           fc["freightCapacityPremium"]=el.freightCapacityPremium
           this.freightCapacityData.push(fc);
  
           let uc={};
           uc["capacity"]=el.capacity;
           uc["unloadingCapacityPremium"]=el.unloadingCapacityPremium
           this.unloadingCapacityData.push(uc);
  
        
  
        }})

        for(let i =0 ; i < this.capacityList.length ; i++){
          let capacityExistinElevatorPricing = this.existingCheck(Number(this.capacityList[i].name) , this.elevatorPricingData , "capacity");
        //  console.log("capppp", capacityExistinElevatorPricing)
          if(!capacityExistinElevatorPricing){
           this.elevatorPricingData.push({
             capacity: this.capacityList[i].name,
             mrMsGearbase: '' || 0,
             mrMsGearless: '' || 0,
             mrlmsbase: '' || 0,
             perStopIncrease: '' || 0,
             highRiseStop: '' || 0,
             highRisePremiumPerStop: '' || 0,
             ssPremium: '' || 0,
             ssHighRiseFloorPremium: '' || 0,
             sslDoorPricePerFloor: '' || 0,
             mrlHighRisePremium: '' || 0,
             createdBy:"",
             createdTimeStamp:""           
           })
          }
          let capacityExistinInstallationPricing = this.existingCheck(Number(this.capacityList[i].name) , this.installationCapacityData , "capacity");
          if(!capacityExistinInstallationPricing){
           this.installationCapacityData.push({
             capacity: this.capacityList[i].name,
             installCapacityPremium: '' || 0
           })
          }
          let capacityExistinFreightPricing = this.existingCheck(Number(this.capacityList[i].name) , this.freightCapacityData ,"capacity");
          if(!capacityExistinFreightPricing){
           this.freightCapacityData.push({
             capacity: this.capacityList[i].name,
             freightCapacityPremium: '' || 0
           })
          }
          let capacityExistinUnloadingCharges = this.existingCheck(Number(this.capacityList[i].name) , this.unloadingCapacityData , "capacity");
          if(!capacityExistinUnloadingCharges){
           this.unloadingCapacityData.push({
             capacity: this.capacityList[i].name,
             unloadingCapacityPremium: '' || 0
           })
          }
      }
  
      for(let i =0 ; i < this.locationList.length ; i++){
        let capacityExistinInstallationPricing = this.existingCheck(this.locationList[i].name , this.installLocationData , "location");
        if(!capacityExistinInstallationPricing){
         this.installLocationData.push({
           location: this.locationList[i].name,
           installLocationPremium: '' || 0
         })
        }
        let capacityExistinFreightPricing = this.existingCheck(this.locationList[i].name , this.freightLocationData , "location");
        if(!capacityExistinFreightPricing){
         this.freightLocationData.push({
           location: this.locationList[i].name,
           freightLocationPremium: '' || 0
         })
        }
        let capacityExistinUnloadingCharges = this.existingCheck(this.locationList[i].name , this.unloadingLocationData ,"location");
        if(!capacityExistinUnloadingCharges){
         this.unloadingLocationData.push({
           location: this.locationList[i].name,
           unloadingLocationPremium: '' || 0
         })
        }
    }
  
    for(let i =0 ; i < this.additionalFeatureList.length ; i++){
      let additionalFeatureExist = this.existingCheck(this.additionalFeatureList[i].name , this.additionalFeaturePricingData , "additionalFeatureType");
      if(!additionalFeatureExist){
       this.additionalFeaturePricingData.push({
         additionalFeatureType : this.additionalFeatureList[i].name ,
         additionalFeatureBasePrice: '' || 0,
         additionalFeaturePremiumPerStop: '' || 0
       })
      }
    
  }
      }
     

      
     
   

      if(res.data.locationDependentPrices.length > 0){
        this.installLocationData=[];
        this.freightLocationData=[];
        this.unloadingLocationData=[];
        res.data.locationDependentPrices.forEach((el) => {
          let  il={};
          il["location"]=el.location;
          il["installLocationPremium"] = el.installLocationPremium;

          this.installLocationData.push(il)

          let  fl={};
          fl["location"]=el.location;
          fl["freightLocationPremium"] = el.freightLocationPremium;
          this.freightLocationData.push(fl)

          let  ul={};
          ul["location"]=el.location;
          ul["unloadingLocationPremium"] = el.unloadingLocationPremium;
          this.unloadingLocationData.push(ul)
      
          
      })
      }
   
    

    
    })
    


  
  }
   
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  updateBasePrice(baseprice , obj){
    baseprice.forEach((bp) => {
      if(bp.machineTractionType === "mrMsGearbase"){
        obj["mrMsGearbase"]=bp.basePrice;
      }
      if(bp.machineTractionType === "mrMsGearless"){
        obj["mrMsGearless"]=bp.basePrice;
      }
      if(bp.machineTractionType === "mrlmsbase"){
        obj["mrlmsbase"] = bp.basePrice;
      }
    })
  }

   arrComp(newArr, oldArr) {
    // Check if arrays have the same length (early exit if not)
    if (newArr.length === oldArr.length) {  
  
    // Loop through each object in the arrays
    for (let i = 0; i < newArr.length; i++) {
      const updatedCreatedBy = this.compareAndUpdateCreatedBy(newArr[i], oldArr[i]);
      newArr[i] = updatedCreatedBy;
    }

  }
  
    return newArr;
  }

 compareAndUpdateCreatedBy(newObj, oldObj) {
    // Clone data to avoid modifying original objects
    const newObjCopy = JSON.parse(JSON.stringify(newObj));
    const oldObjCopy = JSON.parse(JSON.stringify(oldObj));
  
    // Exclude 'createdBy' and 'createdTimeStamp' from comparison
    delete newObjCopy.createdBy;
    delete newObjCopy.createdTimeStamp;
    delete oldObjCopy.createdBy;
    delete oldObjCopy.createdTimeStamp;
  
    // Compare using strict equality to ensure deep comparison
    if (JSON.stringify(newObjCopy) !== JSON.stringify(oldObjCopy)) {
      newObj.createdBy = this.user.fullname + "updated";
      newObj.createdTimeStamp = new Date().toISOString();
    }
  
    return newObj;
  }
  

  getCapacityRefData() {
    this.refDataSvc.getInstances('ECAP', true).subscribe((resp) => {
      this.capacityList = resp.data;
      this.capacityList=this.capacityList.sort((a,b)=> a.name-b.name)

      for(let i =0 ; i < this.capacityList.length ; i++){
        let capacityExistinElevatorPricing = this.existingCheck(Number(this.capacityList[i].name) , this.elevatorPricingData , "capacity");
        if(!capacityExistinElevatorPricing){
         this.elevatorPricingData.push({
           capacity: this.capacityList[i].name,
           mrMsGearbase: '' || 0,
           mrMsGearless: '' || 0,
           mrlmsbase: '' || 0,
           perStopIncrease: '' || 0,
           highRiseStop: '' || 0,
           highRisePremiumPerStop: '' || 0,
           ssPremium: '' || 0,
           ssHighRiseFloorPremium: '' || 0,
           sslDoorPricePerFloor: '' || 0,
           mrlHighRisePremium: '' || 0,
         })
        }
        let capacityExistinInstallationPricing = this.existingCheck(Number(this.capacityList[i].name) , this.installationCapacityData , "capacity");
        if(!capacityExistinInstallationPricing){
         this.installationCapacityData.push({
           capacity: this.capacityList[i].name,
           installCapacityPremium: '' || 0
         })
        }
        let capacityExistinFreightPricing = this.existingCheck(Number(this.capacityList[i].name) , this.freightCapacityData ,"capacity");
        if(!capacityExistinFreightPricing){
         this.freightCapacityData.push({
           capacity: this.capacityList[i].name,
           freightCapacityPremium: '' || 0
         })
        }
        let capacityExistinUnloadingCharges = this.existingCheck(Number(this.capacityList[i].name) , this.unloadingCapacityData , "capacity");
        if(!capacityExistinUnloadingCharges){
         this.unloadingCapacityData.push({
           capacity: this.capacityList[i].name,
           unloadingCapacityPremium: '' || 0
         })
        }
    }
  
      
    });
  }

  existingCheck(capName , existingArr , key){
      for(let i of existingArr){
        if(capName ===  i[key]){
          return true
        } 
      }
      return false
  }

  getLocationRefData() {
    this.refDataSvc.getInstances('ELOC', true).subscribe((resp) => {
      this.locationList = resp.data;
      // this.locationList=this.locationList.sort((a,b)=> a.name-b.name)
      
      for(let i =0 ; i < this.locationList.length ; i++){
        let capacityExistinInstallationPricing = this.existingCheck(this.locationList[i].name , this.installLocationData , "location");
        if(!capacityExistinInstallationPricing){
         this.installLocationData.push({
           location: this.locationList[i].name,
           installLocationPremium: '' || 0
         })
        }
        let capacityExistinFreightPricing = this.existingCheck(this.locationList[i].name , this.freightLocationData , "location");
        if(!capacityExistinFreightPricing){
         this.freightLocationData.push({
           location: this.locationList[i].name,
           freightLocationPremium: '' || 0
         })
        }
        let capacityExistinUnloadingCharges = this.existingCheck(this.locationList[i].name , this.unloadingLocationData ,"location");
        if(!capacityExistinUnloadingCharges){
         this.unloadingLocationData.push({
           location: this.locationList[i].name,
           unloadingLocationPremium: '' || 0
         })
        }
    }

    
      
    });
  }

  getAdditionalFeatureRefData() {
    this.refDataSvc.getInstances('EAF', true).subscribe((resp) => {
      this.additionalFeatureList = resp.data;

      for(let i =0 ; i < this.additionalFeatureList.length ; i++){
        let additionalFeatureExist = this.existingCheck(this.additionalFeatureList[i].name , this.additionalFeaturePricingData , "additionalFeatureType");
        if(!additionalFeatureExist){
         this.additionalFeaturePricingData.push({
           additionalFeatureType : this.additionalFeatureList[i].name ,
           additionalFeatureBasePrice: '' || 0,
           additionalFeaturePremiumPerStop: '' || 0
         })
        }
      
    }
 
      
    });
  }

  handleCellInput(event , i , key) {
   
    const input$ = fromEvent(event.target, 'keyup').pipe(
    
      debounceTime(3000),

    );
    
    input$.subscribe(value => {
      this.elevatorPricingData[i][key] = value['target']['value'];
      // console.log("elevatorPricingData", this.elevatorPricingData);
      // this.cdRef.detectChanges(); // Trigger change detection (Solution 1)
    });
    
    // console.log("elevatorPricingData" ,this.elevatorPricingData)

  }
  

  save(){

    let elevatorPricingPremiums=[];

    this.elevatorPricingData.forEach((el)=>{
      let obj: ElevatorPricingPremiumsModel = {
        capacity: 0,
        premiumPerStop: 0,
        highRiseStop: 0,
        highRisePremiumPerStop: 0,
        ssPremium: 0,
        ssHighRisePremiumPerStop: 0,
        ssLandingDoorPrice: 0,
        mrlHighRisePremium: 0,
        installCapacityPremium: 0,
        freightCapacityPremium: 0,
        unloadingCapacityPremium: 0
      };
        obj.capacity=el.capacity;
        obj.premiumPerStop = el.perStopIncrease;
        obj.highRiseStop=el.highRiseStop;
        obj.highRisePremiumPerStop=el.highRisePremiumPerStop;
        obj.ssPremium = el.ssPremium;
        obj.ssHighRisePremiumPerStop = el.ssHighRiseFloorPremium;
        obj.ssLandingDoorPrice=el.sslDoorPricePerFloor;
        obj.mrlHighRisePremium = el.mrlHighRisePremium;

        this.installationCapacityData.forEach((ic)=>{
          if(ic.capacity===el.capacity){
            obj.installCapacityPremium=ic.installCapacityPremium;
          }
        })

        this.freightCapacityData.forEach((fc) => {
          if(fc.capacity === el.capacity){
            obj.freightCapacityPremium = fc.freightCapacityPremium;
          }
        })

        this.unloadingCapacityData.forEach((uc) => {
          if(uc.capacity === el.capacity){
            obj.unloadingCapacityPremium = uc.unloadingCapacityPremium
          }
        })
       console.log("el.creedby", el.createdBy , el.createdTimeStamp)
        let user =JSON.parse(localStorage.getItem("user")).fullname
        if(el.createdBy === undefined || el.createdBy === ""){
          obj.createdBy = user;
        }else{
          obj.createdBy= el.createdBy
        }
        if(el.createdTimeStamp === undefined || el.createdTimeStamp === ""){
          obj.createdTimeStamp= new Date().toISOString();
        }else{
          obj.createdTimeStamp = el.createdTimeStamp
        }
        obj.elevatorPricingBases=[];
        let machineTractionType=[
         
      {
          capacity:el.capacity,
          machineTractionUnit:"MRG",
          basePrice:el.mrMsGearbase
        },
      {
          capacity:el.capacity,
          machineTractionUnit:"MRGL",
          basePrice:el.mrMsGearless
        },
     {
          capacity:el.capacity,
          machineTractionUnit:"MRL",
          basePrice:el.mrlmsbase
        }
      ]
        for(let i of machineTractionType){
       
           obj.elevatorPricingBases.push(i)

           
        }

        elevatorPricingPremiums.push(obj)
        
    })

    
    // elevatorPricingPremiums.forEach((el) => {
    //   const existingCapacityObj = this.existingElevatorData.find(
    //     (existingEl) => existingEl.capacity === el.capacity
    //   );
    
    //   // If the capacity object is not found, push the new element into the array
    //   if (!existingCapacityObj) {
    //     this.existingElevatorData.push(el);
    //   }
    // });
    
    // this.arrComp(elevatorPricingPremiums , this.existingElevatorData)

    console.log("elevatorpricingPremiums", elevatorPricingPremiums)
    
    let locationDependentPrices= [];    
    
     this.locationList.forEach((el)=> {
      let locationObj:LocationDependentPriceModel={
        location: '',
        installLocationPremium: 0,
        freightLocationPremium: 0,
        unloadingLocationPremium: 0
      }
      locationObj.location = el.name;
      this.installLocationData.forEach((il)=>{
        if(il.location === el.name){
          locationObj.installLocationPremium=il.installLocationPremium;
        }
      })
      this.freightLocationData.forEach((fl)=>{
        if(fl.location === el.name){
          locationObj.freightLocationPremium=fl.freightLocationPremium;
        }
      })
      this.unloadingLocationData.forEach((ul)=>{
        if(ul.location === el.name){
          locationObj.unloadingLocationPremium=ul.unloadingLocationPremium;
        }
      })

      locationDependentPrices.push(locationObj)
        
     })

     let pricingMiscellaneous=[];
     pricingMiscellaneous.push(this.pricingMiscellaneousObj);

     let freightPrices = this.freightPricingData

     let installPrices=this.installationPricingData;

     let unloadingPrices = this.unloadingChargesData;

     let additionalFeaturePrices = this.additionalFeaturePricingData;
     
     let payload:PricingConfigModel={
      elevatorPricingPremiums,
      locationDependentPrices,
      pricingMiscellaneous,
      freightPrices,
      installPrices,
      unloadingPrices,
      additionalFeaturePrices
     }

     console.log("payload" , payload)

     this.BltSvc.savePricingConfig(payload).subscribe((res) => {
        //  console.log("res",res)
         this.toastrSvc.success('Pricing Configured');
     })


    // console.log("elevatorPricingPremium" , elevatorPricingPremiums)
    // console.log("locationdepedetPrices", locationDependentPrices)
    // console.log("pricingmiscaleonus", pricingMiscellaneous)
    // console.log("freighprices", freightPrices)
    // console.log("installprices", installPrices)
    // console.log("unloadingcharges", unloadingPrices)
    // console.log("aditonalfeature", additionalFeaturePrices)

  }

  // removeConfig(index: number) {
  //   if (index >= 0 && index < this.elevatorPricingData.length) {
  //     this.elevatorPricingData.splice(index, 1);
  //   } else {
  //     console.error('Invalid index:', index);
  //   }
  // }
  

  // addRow() {
  //   this.elevatorPricingData.push({
  //     capacity: ''|| 0,
  //     mrMsGearbase: ''||0,
  //     mrMsGearless: ''|| 0,
  //     mrlmsbase:1000,
  //     perStopIncrease: '' || 0,
  //     highRiseStop: '' || 0,
  //     highRisePremiumPerStop: '' || 0,
  //     ssPremium: '' || 0,
  //     ssHighRiseFloorPremium: '' || 0,
  //     ssPerFloorPremium: '' || 0,
  //     mrlHighRisePremium: '' || 0,
  //   });
  //   this.save()
  // }


  // getSelectedRows() {
  //   return this.elevatorPricingData.filter((row) => (row as any).deleteCheckbox.checked);
  // }

  // removeRow(index: number) {
  //   this.elevatorPricingData.splice(index, 1);
  // }


}

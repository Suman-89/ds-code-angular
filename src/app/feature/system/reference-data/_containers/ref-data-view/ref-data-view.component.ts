import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Subscription } from 'rxjs';
import * as _fromServices from '../../_services';
import * as _fromCoreModels from 'src/app/core/_models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ref-data-view',
  templateUrl: './ref-data-view.component.html',
  styleUrls: ['./ref-data-view.component.scss'],
})
export class RefDataViewComponent implements OnInit, OnDestroy {
  @ViewChild('grid', { static: false }) grid: jqxGridComponent;
  subscriptions: Subscription[] = [];
  routeId: string;
  routecode: string;
  // instanceArr: _fromCoreModels.InstanceModel[];
  instanceArr : any;
  isCat: boolean;
  // instanceChild: _fromCoreModels.InstanceModel[];
  instanceChild : any;
  selectedInstance: _fromCoreModels.InstanceModel;
  entity: _fromCoreModels.ReferenceDataModel;
  firstLevelChild = '';
  // firstLevelChild = {name:'', code:''} ;
  secondLevelChild = '';
  // secondLevelChild = {name:'', code:''} ;
  thirdLevelChild = '';
  // secondLevelChild = {name:'', code:''} ;



  constructor(
    private refDataSvc: _fromServices.RefDataService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.routeId = this.route.snapshot.paramMap.get('refid');
    this.routecode = this.route.snapshot.paramMap.get('refdatacode');
    // this.entity.id = this.routeId ;
    this.getInstances(this.routecode, true);
    this.getCategoryByCode(this.routecode);
    console.log("instanceArr", this.instanceArr)
    console.log("instachild", this.instanceChild)
    // this.getGridDetails();
  }

  ngOnDestroy(): void {}

  fromInstancePanel(event, opt?) {
    switch (event.type) {
      case 'edit':
        this.editInstance(event.data, event.params, opt);
        break;
      case 'view':
        opt = false;
        console.log("event", event.data)
        // this.getInstances(event.data, opt, 'fromPanel');
        this.getChildInstances(event.data, opt, 'fromPanel');
        break;
      case 'delete':
        this.openSweetalert(event, opt);
        break;
    }
  }

  getInstances(inpObj, type, fromPanel?) {
    console.log("inputObj , type , frompanel" , inpObj , type , fromPanel)
    let id;
    fromPanel ? (id = inpObj.id) : (id = inpObj);
    this.refDataSvc.getInstances(id, type).subscribe((res) => {
      if (!fromPanel) {
        this.instanceArr = res.data;
      this.instanceArr=this.instanceArr.filter((el)=>el.levels===1)
        console.log("arrr", this.instanceArr)
        // this.entity.name = res.data[0].catname;
      }
      if (fromPanel) {
        this.instanceChild = res.data;
        this.selectedInstance = inpObj;
    console.log("instachild , insstances", this.instanceChild)
    console.log("entity" , this.entity)
      }
    });
  }

  getChildInstances(inpObj, type, fromPanel?) {
    if(inpObj.levels === this.entity.levels){
      return
    }
    console.log("inputObj , type , frompanel" , inpObj , type , fromPanel)
    // let id;
    let parentId ; 
    inpObj.id ? parentId = inpObj.id : parentId = '';
    // fromPanel ? (id = inpObj.id) : (id = inpObj);
    this.refDataSvc.getChildInstances(this.routeId, parentId).subscribe((res) => {
      if (!fromPanel) {
        this.instanceArr = res.data;
      this.instanceArr=this.instanceArr.filter((el)=>el.levels===1)
        console.log("arrr", this.instanceArr)
        // this.entity.name = res.data[0].catname;
      }
      if (fromPanel) {
        this.instanceChild = res.data;
        this.selectedInstance = inpObj;
    console.log("instachild , insstances", this.instanceChild)
    console.log("entity" , this.entity)
      }
    });
  }

  getCategoryByCode(code) {
    this.refDataSvc.getCategoryByCode(code).subscribe((resp) => {
      this.entity = resp.data;
      console.log("entity", this.entity)
    });
  }

  postInstances(id, inname, opt) {
   
    console.log("id , inname , opt" , id , inname , opt)
    opt === 1 ? (this.isCat = true) : (this.isCat = false);
    let payload = {};
    let levels;
    let instanceParentName;
    opt===1 ? levels=1 : levels = this.selectedInstance.levels + 1
    this.selectedInstance ? instanceParentName = this.selectedInstance.name : instanceParentName=null;
    // let catId=this.entity.id
    payload = { name :inname , categoryParentId : this.entity.id , catcode:this.entity.code , levels , instanceParentName};

    // if(this.isCat){
    //  payload = { name :inname , categoryParentId : this.entity.id}
    // }else {
    //   payload = { name :inname , categoryParentId : this.entity.id}
    // }

    let parentId = id
    if(opt===1){
      parentId = '';
    }
    let catId=this.entity.id

    console.log("Payload", payload)
    // let payload = {name : inname}
    this.refDataSvc
      .addInstance(catId, payload , parentId)
      .subscribe((resp) => {
        if (resp.status) {
          if (opt === 1) {
            this.instanceArr.push(resp.data);
            this.firstLevelChild = ''; 
          }
          if (opt === 2) {
            console.log("resp.data"  , resp.data)
            this.instanceChild.push(resp.data);
            console.log("second levell" , this.secondLevelChild)
            this.secondLevelChild = '';
          }
          if (opt === 3) {
            this.instanceChild.push(resp.data);
            this.thirdLevelChild = '';
          }
          this.toastrSvc.success('Instance added');
        }
        console.log("arr", this.instanceArr)
        console.log("child", this.instanceChild)
      });
      
  }

  removeInstance(event, opt) {
    this.isCat = false;
    this.refDataSvc.removeRefData(event.id, this.isCat).subscribe((resp) => {
      if (opt === 1) {
        this.instanceArr = this.instanceArr.filter((a) => a.id !== event.id);
      }
      if (opt === 2) {
        this.instanceChild = this.instanceChild.filter(
          (a) => a.id !== event.id
        );
      }
      Swal.fire('Instance Deleted!', 'success');
    });
  }

  editInstance(event, params, opt?) {
    // opt === 1 ? this.isCat = true : this.isCat = false;
    this.refDataSvc
      .editRefData(event.id, { name: params })
      .subscribe((resp) => {
        if (resp.data) {
          if (opt === 1) {
            this.instanceArr.find((a) => a.id === event.id).name = params;
          }
          if (opt === 2) {
            this.instanceChild.find((a) => a.id === event.id).name = params;
          }
          this.toastrSvc.success('Instance Edited');
        }
      });
  }

  openSweetalert(event, opt) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Instance!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.removeInstance(event.data, opt);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled');
      }
    });
  }

  back() {
    const path = '../../../';
    this.router.navigate([path], { relativeTo: this.route });
  }
}

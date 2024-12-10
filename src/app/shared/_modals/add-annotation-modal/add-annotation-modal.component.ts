import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { KeyModel } from 'src/app/core/_models';

@Component({
  selector: 'app-add-annotation-modal',
  templateUrl: './add-annotation-modal.component.html',
  styleUrls: ['./add-annotation-modal.component.scss']
})
export class AddAnnotationModalComponent implements OnInit {
// @Input() type : string ;
@Input() selectedText ;
@Input() annotkeys: any[] ;
@Output() addedAnnotEmit = new EventEmitter() ;
quads: KeyModel[] ;
annotForm: KeyModel = {key: '', value: '', type: ''} ;
types = ['Key', 'Value'] ;
dispValueField = false ;
keyForm= {key:'', label:''} ;
dispNewKeyForm = false ;
  constructor(private activeModal: NgbActiveModal, private toastrSvc: ToastrService) { }

  ngOnInit(): void {
   this.initFn() ;
  }



  initFn() {
    // this.type === 'value' ? this.annotForm.value = this.selectedText.text: null ;
    const obj = Object.keys(this.selectedText.quads[0]) ;
    this.quads = [] ;
    obj.map(o => {
      let data = {key: o, value: this.selectedText.quads[0][o]} ;
      this.quads.push(data) ;
      return o ;
    })  ;
    let stList = JSON.parse(localStorage.getItem('annotList')) ;
    if(stList) {
     this.annotkeys = stList ;
    } else {
     localStorage.setItem('annotList', JSON.stringify(this.annotkeys)) ;
    }
   }


   save() {
     this.addedAnnotEmit.emit(this.annotForm) ;
   }

   closeModal() {
     this.activeModal.close() ;
    }

    toggleValueField(val) {
     return this.dispValueField = val === 'Value' ?  true : false ;  
    }

    addNewKey() {
      this.annotkeys.push(this.keyForm) ;
      this.keyForm = {key:'', label:''} ;
      this.toastrSvc.success('Key Added') ;
      this.toggleNewKeyForm() ;
      localStorage.removeItem('annotList') ;
      localStorage.setItem('annotList', JSON.stringify(this.annotkeys)) ;

    }

    toggleNewKeyForm() {
      this.dispNewKeyForm = !this.dispNewKeyForm ;
    }
}
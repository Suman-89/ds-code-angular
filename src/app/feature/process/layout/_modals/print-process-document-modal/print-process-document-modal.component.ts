import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { timeStamp } from 'console';
import { type } from 'os';
import { TaskDocumentModel } from '../../_models';
import { TaskActionService } from '../../_services';

@Component({
  selector: 'app-print-process-document-modal',
  templateUrl: './print-process-document-modal.component.html',
  styleUrls: ['./print-process-document-modal.component.scss']
})
export class PrintProcessDocumentModalComponent implements OnInit {
  @Input() docs ;
  @Input() partnerLegalName ;
  @Input() product ;
  @Input() contractType ;
  @Output() printEmitter = new EventEmitter() ;
  allSelected: boolean ;
  supportingDocs = [
    {id:'info', name:'Info', selected:true, type: 2},
    {id:'audit', name:'Audit Trail', selected:true, type:1},
    {id:'comment', name:'Comments', selected:true, type: 3},
  ]

  constructor(private actModal: NgbActiveModal, private taskActionSvc:TaskActionService) { }

  ngOnInit(): void {
    this.docs.map(a => {
      a.selected=true;
      return a;
    }) ;
    this.allSelected = true ;
  }

  close() {
    this.actModal.close() ;
  }
  getDocTypefromFolder(doc: TaskDocumentModel): string {
    return this.taskActionSvc.getDocTypefromFolder(doc.foldername, doc);

  }
  toggleDocSelection(ev, index) {
   this.docs[index].selected = ev.checked ;
  //  this.allSelected = this.checkAllProcessDocSelection() ;
  this.allSelected =  this.docs.find(a => !a.selected) ? false : true ; 
  }

  toggleSupportingDocSelection(ev, i) {
   this.supportingDocs[i].selected = ev.checked ;
  }

  transformTOCommaSeparated(obj: any[], property: string) {
    let str = ''; 
    obj.forEach(m => {
       str = str + ',' + m[property];  
     }) ;
    str = str.substr(1);  
    return str ;
  }

  printDocs() {
    // report/id/combined?types=1,2&b=false
     const obj = this.docs.filter(a => a.selected) ;
     const suppDocObj = this.supportingDocs.filter(s => s.selected) ; 
     const emitObj = {processDocs: this.transformTOCommaSeparated(obj, 'contentid') ,
                      supportingDocs:  suppDocObj.map(a => a.type) } ;
     this.printEmitter.emit(emitObj) ;
  }

  checkAllProcessDocSelection() {
    return this.docs.find(a => !a.selected) ? true : false ;
  }

  toggleAllSelection(e) {
   this.docs.map( d => {
     d.selected = e.checked;
     return d ;
   }) ;
   this.allSelected = e.checked
  }

  checkForNoSelect() {
    return this.docs.filter(a => a.selected).length > 0 ? false : true  ; 
  }
}

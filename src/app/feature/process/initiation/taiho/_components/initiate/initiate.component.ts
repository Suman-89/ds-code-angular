import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-initiate-taiho',
  templateUrl: './initiate.component.html',
  styleUrls: ['./initiate.component.scss', '../../../../form.module.scss']
})
export class InitiateTaihoComponent implements OnInit, OnDestroy {
 @Input() inputData ;
  @Output() docDataEmitter = new EventEmitter();
  acceptList: string = 'application/pdf';

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }
  handleFileInput(ev) {
    let files = ev.target.files as File[];
    if(files.length > 0 && files[0].type === this.acceptList){
      this.inputData.selectedDocument = files[0];
      this.save() ;

    }
  }
 
  save() {
    let formdata = new FormData();
    if (this.inputData.selectedDocument instanceof File){
      formdata.append('pdf', this.inputData.selectedDocument);
    }
    this.docDataEmitter.emit(formdata) ; 
  }

}

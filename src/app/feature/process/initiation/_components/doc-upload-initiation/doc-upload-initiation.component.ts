import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-doc-upload-initiation',
  templateUrl: './doc-upload-initiation.component.html',
  styleUrls: ['./doc-upload-initiation.component.scss']
})
export class DocUploadInitiationComponent implements OnInit, OnDestroy {

  @Input() inputData? = {selectedDocument: {} as File} ;
  @Output() docDataEmitter = new EventEmitter();
  acceptList: string = '*';

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  handleFileInput(ev) {
    let files = ev.target.files as File[];
    if(files.length > 0){
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

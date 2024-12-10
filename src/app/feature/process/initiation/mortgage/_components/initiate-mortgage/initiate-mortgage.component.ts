import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-initiate-mortgage',
  templateUrl: './initiate-mortgage.component.html',
  styleUrls: ['./initiate-mortgage.component.scss']
})
export class InitiateMortgageComponent implements OnInit {

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

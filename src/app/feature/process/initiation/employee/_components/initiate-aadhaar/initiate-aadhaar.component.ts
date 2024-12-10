import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-initiate-aadhaar',
  templateUrl: './initiate-aadhaar.component.html',
  styleUrls: ['./initiate-aadhaar.component.scss'],
})
export class InitiateAadhaarComponent implements OnInit, OnDestroy {
  constructor(private readonly sanitizer: DomSanitizer) {}

  @Input() inputData;

  @Output() docDataEmitter = new EventEmitter();
  @Output() imgEmitter = new EventEmitter<any>();
  acceptList: string[] = ['image/jpeg', 'image/png'];

  ngOnInit(): void {}

  ngOnDestroy(): void {}
  handleFileInput(ev) {
    let files = ev.target.files as File[];
    if (
      (files.length > 0 && files[0].type === this.acceptList[0]) ||
      (files.length > 0 && files[0].type === this.acceptList[1])
    ) {
      this.inputData.selectedDocument = files[0];
      this.save();
      this.imgEmitter.emit(
        this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[0]))
      );
    }
  }

  save() {
    let formdata = new FormData();
    if (this.inputData.selectedDocument instanceof File) {
      formdata.append('file', this.inputData.selectedDocument);
    }
    this.docDataEmitter.emit(formdata);
  }
}

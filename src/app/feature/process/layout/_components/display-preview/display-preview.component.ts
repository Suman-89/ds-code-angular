import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-display-preview',
  templateUrl: './display-preview.component.html',
  styleUrls: ['./display-preview.component.scss'],
})
export class DisplayPreviewComponent implements OnInit {
  @Input() url;
  @Output() isDownloadable: EventEmitter<boolean> = new EventEmitter<boolean>();
  isImgFile: boolean = false;
  isImgUrl;
  isPdfFile: boolean = false;
  isPdfUrl:SafeResourceUrl;
  isDiffFile : boolean = false;
  isDiffUrl;
  contentType;
  @ViewChild('pdfViewer') pdfViewer: PdfViewerComponent;

  constructor(
    private sanitizer:DomSanitizer
  ) {}

  ngOnInit(): void {
    if(this.url.includes("jpg")){
      this.isImgFile=true;
      this.isImgUrl=this.url
    }else{
      this.getContentType(this.url)
      .then((res) => {
        this.contentType = res.type;
        if (this.contentType.includes('image')) {
          this.isImgFile = true;
          this.isImgUrl=this.url
          this.isDownloadable.emit(true)
        } else if (this.contentType.includes('pdf')) {
          this.isPdfFile = true;
          this.isPdfUrl= this.sanitizer.bypassSecurityTrustResourceUrl(res.blobUrl);
          this.isDownloadable.emit(true)
          // this.url=this.url+"#page=1";
        }else{
     this.isDiffFile=true;
     this.isDiffUrl=this.url;
     this.isDownloadable.emit(false)
        }
        console.log('cntenttype', this.contentType);
      }) 
      .catch((err) => {
        console.log('err', err);
      });
    }
 
  }

  download(){
    if (this.url) {
      const anchor = document.createElement('a');
      anchor.href = this.url;
      // anchor.target = '_blank'; // Open the link in a new tab/window.
      anchor.download = 'downloaded-file.pdf'; // Set the default download filename.
      anchor.click();
    }
  }


  async getContentType(url) {
    try {
      let res = await fetch(url);
      const type = res.headers.get('content-type');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      return {
        type,blobUrl
      }
    } catch (err) {
      console.log('err');
    }
  }
  
}

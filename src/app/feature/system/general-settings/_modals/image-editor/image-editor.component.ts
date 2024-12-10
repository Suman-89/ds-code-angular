import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { GridToolbarType } from 'src/app/core/_models';
import * as _fromCoreSvc from 'src/app/core/_services';
import { GridColumnsService, ReportsService } from 'src/app/core/_services';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng2PicaService } from 'ng2-pica';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
})
export class ImageEditorComponent implements OnInit {
  constructor(
    public modal: NgbActiveModal,
    private readonly sanitizer: DomSanitizer,
    private ng2PicaService: Ng2PicaService
  ) {}

  @Input() imageSrc: File;
  imageUrl;
  minWidth = 10;
  maxWidth = 0;
  minHeight = 10;
  maxHeight = 0;
  width;
  height = 0;

  resizedImage;

  ngOnInit(): void {
    if (this.imageSrc) {
      this.processImage();
    }
  }

  async processImage() {
    let orginalDimentions: any = await this.getImageSize(this.imageSrc);
    this.width = orginalDimentions.width;
    this.maxWidth = orginalDimentions.width;
    this.height = orginalDimentions.height;
    this.maxHeight = orginalDimentions.height;
  }

  uploadImage() {
    //     this.ng2PicaService.resize([someFile], newWidth, newHeight).subscribe((result)=>{
    //       //all good, result is a file
    //       console.info(result);
    // }, error =>{
    //       //something went wrong
    //       console.error(error);
    // });
    this.ng2PicaService
      .resize([this.imageSrc], this.width, this.height)
      .subscribe(
        (result) => {
          console.log(result);
          this.modal.close(result);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getImageSize(url: File | string) {
    let imageUrl = typeof url === 'string' ? url : URL.createObjectURL(url);
    // this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    const img = document.createElement('img');
    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        // Natural size is the actual image size regardless of rendering.
        // The 'normal' `width`/`height` are for the **rendered** size.
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // Resolve promise with the width and height
        resolve({ width, height });
      };

      // Reject promise on error
      img.onerror = reject;
    });

    // Setting the source makes it start downloading and eventually call `onload`
    img.src = imageUrl;

    return promise;
  }
}

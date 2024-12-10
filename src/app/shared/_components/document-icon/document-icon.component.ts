import { Component, OnInit, Input } from '@angular/core';
import * as docIcons from 'src/assets/data/doc-icon.json';

@Component({
  selector: 'app-document-icon',
  templateUrl: './document-icon.component.html',
  styleUrls: ['./document-icon.component.scss'],
})
export class DocumentIconComponent implements OnInit {
  private _mimetype: string;
  imageValue: string;
  iconValue=''

  @Input() set MIMEType(value: string) {
    
    if (value) {
      this._mimetype = value;
      this.imageValue = this.getImageByMimeType(this._mimetype);
      
    }
  }
  get MIMEType(): string {
    return this._mimetype;
  }

  constructor() {}

  ngOnInit(): void {
    this.iconValue = docIcons['msg-icon']
    console.log("ICON ",this.iconValue,"DIRECT",docIcons['msg-icon'])
  }

  getImageByMimeType(mimetype) {
    let path = './assets/images/';
    if (mimetype.includes('video')) {
      return path + 'video.png';
    }
    if (mimetype.includes('audio')) {
      return path + 'audio.png';
    }
    let i = docIcons.default[mimetype];

    return i ? `${path}${i}` : `${path}document.png`;
  }
}

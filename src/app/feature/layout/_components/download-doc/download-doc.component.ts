import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/core/_services';

@Component({
  selector: 'app-download-doc',
  templateUrl: './download-doc.component.html',
  styleUrls: ['./download-doc.component.scss']
})
export class DownloadDocComponent implements OnInit {

  constructor(private route: ActivatedRoute, private sharedSvc: SharedService) { }

  ngOnInit(): void {
    this.downloadDoc();
  }

  downloadDoc(): void {
    let contentId = this.route.snapshot.paramMap.get('contentId');
    this.sharedSvc.downloadDoc(contentId).subscribe(res => {
      if (res) {
        // let blob = new Blob([a], { type: data.headers['content-type'].split(';')[0] });

        let url = window.URL.createObjectURL(res.body);
        // create hidden dom element (so it works in all browsers)
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);

        // create file, attach to hidden element and open hidden element
        a.href = url;
        let contentDis = res.headers.get('Content-Disposition');
        a.download = contentDis.split('=')[1];
        a.click();
        return url;
      }
    })
  }

}

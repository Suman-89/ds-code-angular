import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullCommentBoxModalComponent } from '../../../../../shared/_modals';
import {
  CommentBoxConstants,
  LoggedUserModel,
  TagType,
} from 'src/app/core/_models';
import {
  TaskActionService,
  TaskInfoService,
  TaskSignalService,
} from '../../_services';
import { TaskDocumentModel } from '../../_models';
import { ApiService } from 'src/app/core/_services';

@Component({
  selector: 'app-display-comment',
  templateUrl: './display-comment.component.html',
  styleUrls: ['./display-comment.component.scss'],
})
export class DisplayCommentComponent implements AfterViewInit {
  @Input() darkTheme;
  private _data;
  pdfjsLib: any;
  // @Input() data: any;
  isUrl: boolean = false;
  urlLink;

  @Input('data')
  set data(data: any) {
    if (data) {
      var bold = /\*(.*?)\*/gm;
      var underscore = /\_(.*?)\_/gm;
      let newLine = /\n/gm;
      let hyperLink =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

      if (data.sentText) {
        data.sentText = data.sentText.replace(bold, '<strong>$1</strong>');
        data.sentText = data.sentText.replace(underscore, '<em>$1</em>');
        if (data.messageSource === 'whatsapp') {
          data.sentText = data.sentText.replace(newLine, '<br/>');
        }
        let links = data.sentText.match(hyperLink);
        // if(links!==null){
        //   let url = links[0]
        //   console.log("url", url)
        //   if(url.includes("dp.reca.ai")){
        //     console.log("urrrrrl", url)
        //     data.sentText = data.sentText.replace(
        //       hyperLink,
        //       `<div id="pdf-container">_</div>`
        //       // `<a class='transLinks' target='_blank' style='color:#2B65EC;font-style: italic;' >${data.sentText.match(
        //       //   hyperLink
        //       // )}</a>`
        //     );
        //     this.fetchAndDisplayPreview(url)
        //   }
        //   else{
        //           data.sentText = data.sentText.replace(
        //   hyperLink,
        //   `<a class='transLinks' target='_blank' style='color:#2B65EC;font-style: italic;' >${data.sentText.match(
        //     hyperLink
        //   )}</a>`
        // );

        //   }

        // }
        data.sentText = data.sentText.replace(
          hyperLink,
          `<a class='transLinks' target='_blank' style='color:#2B65EC;font-style: italic;' >${data.sentText.match(
            hyperLink
          )}</a>`
        );
      }
      this._data = {
        ...data,
        santizedMessage: this.sanitizer.bypassSecurityTrustHtml(
          '<div>' + data.message + '</div>'
        ),
        sentText: this.sanitizer.bypassSecurityTrustHtml(data.sentText),
      };
    }
  }

  get data() {
    return this._data;
  }

  @Input() allowReply;
  @Input() type? = 'Comment';
  @Input() userList;
  @Input() groupList;
  @Input() docList;
  @Input() businessKey: string;
  @Input() psCandidateEmail: string;
  isDownloadableDoc: boolean;

  isTruncateNeeded;
  disabled;
  user: LoggedUserModel;
  ongoingTasks;
  isShowReplies: boolean = false;
  allReplies;
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private taskInfoSvc: TaskInfoService,
    private taskActionSvc: TaskActionService,
    private taskSignalSvc: TaskSignalService,
    private apiSvc: ApiService
  ) {}

  // ngOnInit(): void {
  //   this.user = JSON.parse(localStorage.getItem('user'));
  //   this.getOngoingTasks();

  //   if (this.data) {
  //     var bold = /\*(.*?)\*/gm;
  //     var underscore = /\_(.*?)\_/gm;
  //     let newLine = /\n/gm;
  //     let hyperLink =
  //       /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

  //     if (this.data.sentText) {
  //       this.data.sentText = this.data.sentText.replace(
  //         bold,
  //         '<strong>$1</strong>'
  //       );
  //       this.data.sentText = this.data.sentText.replace(
  //         underscore,
  //         '<em>$1</em>'
  //       );
  //       if (this.data.messageSource === 'whatsapp') {
  //         this.data.sentText = this.data.sentText.replace(newLine, '<br/>');
  //       }
  //       let links = this.data.sentText.match(hyperLink);
  //       if (links !== null) {
  //         let url = links[0];
  //         // console.log('urllll', url);
  //         this.isUrl = true;
  //         this.urlLink = url;

  //         // this.getContentType(url)
  //       }
  //       // if(links!==null){
  //       //   let url = links[0]
  //       //   console.log("url", url)
  //       //   if(url.includes("dp.reca.ai")){
  //       //     console.log("urrrrrl", url)
  //       //     this.data.sentText = this.data.sentText.replace(
  //       //       hyperLink,
  //       //       `<div id="pdf-container">_</div>`
  //       //       // `<a class='transLinks' target='_blank' style='color:#2B65EC;font-style: italic;' >${this.data.sentText.match(
  //       //       //   hyperLink
  //       //       // )}</a>`
  //       //     );
  //       //     this.fetchAndDisplayPreview(url)
  //       //   }
  //       //   else{
  //       //           this.data.sentText = this.data.sentText.replace(
  //       //   hyperLink,
  //       //   `<a class='transLinks' target='_blank' style='color:#2B65EC;font-style: italic;' >${this.data.sentText.match(
  //       //     hyperLink
  //       //   )}</a>`
  //       // );

  //       //   }

  //       // }
  //       // this.data.sentText = this.data.sentText.replace(
  //       //   hyperLink,
  //       //   `<img src=${this.data.sentText.match(
  //       //     hyperLink
  //       //   )}/>`
  //       // );
  //     }
  //     this.data = {
  //       ...this.data,
  //       santizedMessage: this.sanitizer.bypassSecurityTrustHtml(
  //         '<div>' + this.data.message + '</div>'
  //       ),
  //       sentText: this.sanitizer.bypassSecurityTrustHtml(this.data.sentText),
  //     };
  //   }
  // }

  onIsVarChanged(event) {
    this.isDownloadableDoc = event;
  }

  ngAfterViewInit(): void {
    const transLinks = document.querySelectorAll('.transLinks');
    transLinks.forEach((el: Element) => {
      el.setAttribute('href', el.textContent);
    });
  }

  //  async getContentType(url){
  //      try{
  //      let res=await fetch(url)
  //      console.log("res", res)

  //      const contentType = res.headers.get("content-type");

  //            console.log("contentType  :  "+contentType);
  //      }catch(err){
  //       console.log("err", err)
  //      }
  //   }

  //   async fetchAndDisplayPreview(url) {
  //     try {
  //       // URL to the resource you want to fetch

  //       // Fetch the resource
  //       const response = await fetch(url);

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       // Determine the content type of the response
  //       const contentType = response.headers.get("content-type");

  //       console.log("contentType  :  "+contentType);

  //       // Check the content type to decide how to display the content
  //       if (contentType.startsWith("image")) {
  //         // If it's an image, create an <img> element and display the image
  //         const blob = await response.blob();
  //         const blobUrl = URL.createObjectURL(blob);

  //         const previewImage = document.createElement("img");
  //         previewImage.src = blobUrl;

  //         // Append the image to a container (e.g., a div with the id "preview-container")
  //         const previewContainer = document.getElementById("pdf-container");
  //         previewContainer.appendChild(previewImage);
  //       } else if (contentType === "application/pdf") {
  //         // If it's a PDF, you can use a PDF viewer library like pdf.js
  //         const blob = await response.blob();
  //         const blobUrl = URL.createObjectURL(blob);

  //         console.log("blobUrl :  "+blobUrl)

  //         // Initialize pdf.js and display the PDF in an <iframe>
  //         this.pdfjsLib.getDocument(blobUrl).promise.then((pdfDoc) => {
  //           // Load and display the first page of the PDF
  //           console.log("pdfDoc.getPage :  "+pdfDoc.getPage)
  //           return pdfDoc.getPage(1);
  //         }).then((page) => {
  //           console.log("page", page)
  //           const pdfContainer = document.getElementById("pdf-container");
  //           const scale = 0.48;
  //           const viewport = page.getViewport({ scale });
  //           const canvas = document.createElement("canvas");
  //           const context = canvas.getContext("2d");
  // //           const offsetY = (canvas.height - viewport.height) / 2;

  // // // Apply the vertical offset to center the content from the top
  // // context.translate(0, offsetY);

  // // Apply the horizontal offset to center the content
  //           canvas.style.height = "100px";
  //           canvas.style.width ="100%";
  //           // canvas.style.display="flex";
  //           // canvas.style.justifyContent="center"
  //           // canvas.style.alignItems="center"

  //           pdfContainer.appendChild(canvas);
  //           pdfContainer.style.cursor="pointer";
  //           pdfContainer.addEventListener("click", ()=>{
  //             window.location.href=url
  //           })
  //           const renderContext = {
  //             canvasContext: context,
  //             viewport: viewport,
  //           };
  //           return page.render(renderContext);
  //         }).catch((error) => {
  //           console.error("Error rendering PDF:", error);
  //         });
  //       } else {
  //         console.warn(`Unsupported content type: ${contentType}`);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching and displaying preview:", error);
  //     }
  //   }

  downloadLink() {
    if (this.urlLink) {
      const anchor = document.createElement('a');
      anchor.href = this.urlLink;
      // anchor.target = '_blank'; // Open the link in a new tab/window.
      anchor.download = 'downloaded-file.pdf'; // Set the default download filename.
      anchor.click();
    }
  }

  getOngoingTasks() {
    this.taskSignalSvc.ongoingTasks.subscribe((a) => {
      if (a) {
        this.ongoingTasks = a;
      }
    });
  }

  toggleFullText() {
    this.disabled = !this.disabled;
  }

  handler(hasTruncated) {
    this.isTruncateNeeded = hasTruncated;
  }

  returnIsTruncated() {
    let doc = document.getElementById(`${this.data.id}`);
    if (doc.innerText.length > 100) {
      return true;
    } else {
      return false;
    }
  }

  public insertUserTagHtml(user) {
    return `<span
      class="mention user-mention" style="color: #ff9900" id="${user.userid}" data-tagtype="${TagType.USER}"
      contenteditable="false"
      >${user.fullname}</span>`;
  }

  public insertGroupTagHtml(group) {
    return `<span
      class="mention group-mention" style="color: #2aa89b"  id="${group.id}" data-tagtype="${TagType.GROUP}"
      contenteditable="false"
      >${group.name}</span>`;
  }

  replyComment() {
    const modalRef = this.modalService.open(FullCommentBoxModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.mentionConfig =
      this.taskActionSvc.getMultiMentionConfig(this.docList);
    console.log(
      'this.userList',
      this.userList,
      'GROUPS',
      this.groupList,
      'CONFIG',
      modalRef.componentInstance.mentionConfig
    );
    if (modalRef.componentInstance.mentionConfig.mentions?.length == 1) {
      modalRef.componentInstance.mentionConfig.mentions.push({
        items: this.userList,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
      modalRef.componentInstance.mentionConfig.mentions.push({
        items: this.groupList,
        triggerChar: '#',
        insertHtml: true,
        labelKey: 'name',
        mentionSelect: this.insertGroupTagHtml,
      });
      // console.log("this.userList", this.userList, "GROUPS", this.groupList, "CONFIG", modalRef.componentInstance.mentionConfig)
    }
    modalRef.componentInstance.commentBoxOptions = {
      allowFullScreen: false,
      height: 300,
      plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
      toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
    };
    modalRef.componentInstance.commenttype = 'Reply';
    modalRef.componentInstance.onSubmitted.subscribe((e) => {
      this.onReplySubmit(e);
    });
  }

  emailReply() {
    const modalRef = this.modalService.open(FullCommentBoxModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.mentionConfig =
      this.taskActionSvc.getMultiMentionConfig(this.docList);
    if (modalRef.componentInstance.mentionConfig.mentions?.length == 1) {
      modalRef.componentInstance.mentionConfig.mentions.push({
        items: this.userList,
        triggerChar: '@',
        insertHtml: true,
        labelKey: 'fullname',
        mentionSelect: this.insertUserTagHtml,
      });
      modalRef.componentInstance.mentionConfig.mentions.push({
        items: this.groupList,
        triggerChar: '#',
        insertHtml: true,
        labelKey: 'name',
        mentionSelect: this.insertGroupTagHtml,
      });
      // console.log("this.userList", this.userList, "GROUPS", this.groupList, "CONFIG", modalRef.componentInstance.mentionConfig)
    }
    modalRef.componentInstance.commentBoxOptions = {
      allowFullScreen: false,
      height: 300,
      plugins: CommentBoxConstants.TINYMCE_FULL_PLUGINS,
      toolbar: CommentBoxConstants.TINYMCE_FULL_TOOLBAR,
    };
    modalRef.componentInstance.commenttype = 'Reply';
    modalRef.componentInstance.onSubmitted.subscribe((e) => {
      this.onEmailReplySubmit(e);
    });
  }

  toggleReply() {
    if (this.data.showReply) {
      this.data.showReply = false;
    } else {
      if (!this.data.replies) {
        this.taskInfoSvc.getAllReplies(this.data.id).subscribe((resp) => {
          if (resp.status) {
            this.data.replies = resp.data;
            this.data.showReply = true;
          }
        });
      } else {
        this.data.showReply = true;
      }
    }
  }

  download(doc: TaskDocumentModel): void {
    this.taskInfoSvc.openDocument(doc.contentid);
  }

  onReplySubmit(e) {
    if (e) {
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(e, 'text/html');
      if (htmlDoc?.children[0]['innerText'].trim()) {
        let reqdata = {
          message: e,
          users: [],
          groups: [],
          documents: [],
          levelInfo: '',
        };
        let mentions = htmlDoc.getElementsByClassName('mention');

        for (var i = 0; i < mentions.length; i++) {
          console.log(mentions[i].id); //second console output
          if (mentions[i]['dataset'].tagtype == TagType.USER) {
            reqdata.users.push(mentions[i].id);
          } else if (mentions[i]['dataset'].tagtype == TagType.GROUP) {
            reqdata.groups.push(mentions[i].id);
          } else if (mentions[i]['dataset'].tagtype == TagType.DOCUMENT) {
            let version = mentions[i]['dataset'].version;
            reqdata.documents.push({
              name: mentions[i].id,
              version,
            });
          }
        }
        reqdata.levelInfo = this.taskActionSvc.setLevelInfo(
          this.ongoingTasks,
          this.user
        );

        this.taskInfoSvc
          .replyComment(reqdata, this.data.id)
          .subscribe((resp) => {
            if (resp.status) {
              localStorage.removeItem(`comment-${this.user.userid}`);
              if (this.data.replies) {
                this.data.replies = [resp.data, ...this.data.replies];
              }
              this.data.replycount += 1;
            }
          });
      }
    }
  }
  onEmailReplySubmit(e) {
    // if (e) {
    //   this.taskActionSvc.onTranscriptSubmitted(
    //     e,
    //     data?.subject,
    //     `${this.user.fullname}`
    //   );
    // }
    if (e) {
      let formData = new FormData();
      const timestamp = new Date().toISOString();
      formData.append('businessKey', this.businessKey);
      formData.append('messageSource', 'email');
      let reqParams = {
        subject: this.data?.subject,
        sentText: e,
        timestamp: timestamp,
        options: [],
        // uniqueUserIdentifier: uniqueUserIdentifier,
        userFullName: `${this.user.fullname}`,
        isBot: true,
        emailReceivers: [
          { defaultValue: this.psCandidateEmail, defaultType: 'email' },
        ],
      };
      formData.append('dtoStr', JSON.stringify(reqParams));
      formData.append('isOutGoing', 'true');
      formData.append('parentMessageId', `${this.data?.id}`);
      formData.append('isReply', 'true');
      this.taskInfoSvc.postReply(formData).subscribe((res) => {
        console.log(res);
      });
    }
  }
  showReplies() {
    if (!this.isShowReplies) {
      this.taskInfoSvc.showAllReplies(this.data.id).subscribe((res) => {
        this.allReplies = res.data;
      });
    }
    this.isShowReplies = !this.isShowReplies;
  }
}

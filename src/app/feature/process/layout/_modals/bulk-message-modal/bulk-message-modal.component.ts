import {
  Component,
  ElementRef,
  OnInit,
  Input,
  AfterViewInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SharedService, WhatsappService } from 'src/app/core/_services';
import {
  CommentBoxConstants,
  CommentBoxOptions,
  LoggedUserModel,
  TagType,
} from 'src/app/core/_models';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EmailAttachmentComponent } from '../email-attachment/email-attachment.component';
import { TaskActionService } from 'src/app/feature/process/layout/_services';

declare var tinymce: any;

@Component({
  selector: 'app-bulk-message-modal',
  templateUrl: './bulk-message-modal.component.html',
  styleUrls: ['./bulk-message-modal.component.scss'],
})
export class BulkMessageModalComponent implements OnInit {
  @Input() rows;
  @Input() opt;
  inputMsg: string = '';
  candidateData: any[];
  displayCandidate: any[];
  isTerminated: any = false;
  expand: boolean = false;
  processName;
  user;
  constructor(
    private activeModal: NgbActiveModal,
    private sharedSvc: SharedService,
    private toastrSvc: ToastrService,
    private elementRef: ElementRef,
    private modalService: NgbModal,
    public taskActionSvc: TaskActionService,
    private WhatsappService: WhatsappService
  ) {}

  ngOnInit(): void {
    console.log('rows', this.rows);
    this.processName = JSON.parse(
      localStorage.getItem('selected-process')
    ).name;
    this.user = JSON.parse(localStorage.getItem('user')).fullname;
    let isProcVar = this.rows[0];
    // console.log("procvar",isProcVar.processvariables)
    // Example usage:
    if (isProcVar.hasOwnProperty('processvariables')) {
      const mergedArray = this.mergeArraysOfObjects(this.rows);
      this.rows = mergedArray;
    }
    // console.log("rows", this.rows)

    this.isTerminated = this.checkIsterminated(this.rows);

    console.log('termianted', this.isTerminated);
    this.displayCandidate = this.rows;
    this.displayCandidate = this.displayCandidate.slice(0, 4);

    // tinymce.init({
    //   target: this.elementRef.nativeElement.querySelector('#editor'),
    //   // plugins: ['bold italic underline strikethrough | alignleft aligncenter alignright alignjustify forecolor backcolor removeformat bullist numlist'],
    //   toolbar: 'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify forecolor backcolor removeformat bullist numlist',
    //   menubar: false,
    //   height: '300px',
    //   setup: (editor) => {
    //     editor.on('init', () => {
    //      this.inputMsg=editor.setContent(this.inputMsg); // Set the initial content
    //     });
    //     editor.on('input', () => {
    //       this.inputMsg = editor.getContent(); // Update inputMsg when content changes
    //     })
    //   },
    // });
  }

  textOnChange(e) {
    this.inputMsg = e.target.value;
  }

  mergeArraysOfObjects(arrayOfArrays) {
    const mergedArray = [];

    for (const array of arrayOfArrays) {
      let isTerminated = array.terminated;
      array.processvariables['overallstats'] = isTerminated;
      mergedArray.push(array.processvariables);
    }

    return mergedArray;
  }

  checkIsterminated(data) {
    let flag = false;
    data.forEach((el) => {
      if (el.overallstats === 'Terminated' || el.overallstats === true) {
        flag = true;
        return flag;
      }
    });
    return flag;
  }

  showMore() {
    let div = document.getElementById('showMore');
    let msgDiv = document.getElementById('typeMessage');
    let selectedNumber = document.getElementById('selectedNumbers');
    if (div.innerText === 'Expand') {
      this.expand = true;
      selectedNumber.style.height = '100%';
      selectedNumber.style.overflow = 'auto';
      msgDiv.style.display = 'none';
      this.displayCandidate = this.rows;
      div.innerText = 'Collapse';
    } else {
      selectedNumber.style.height = 'auto';
      selectedNumber.style.overflow = '';
      this.expand = false;
      msgDiv.style.display = 'block';
      this.displayCandidate = this.displayCandidate.slice(0, 4);
      div.innerText = 'Expand';
    }
  }

  removeCandidate(id) {
    if (this.rows.length > 1) {
      if (this.processName === 'Initiation Process Pre-Screening') {
        this.rows = this.rows.filter((el) => {
          return el.psId !== id;
        });
      } else if (this.processName === 'Initiation Lead Management') {
        this.rows = this.rows.filter((el) => {
          return el.contractid !== id;
        });
      }

      this.displayCandidate = this.rows;
      let div = document.getElementById('showMore');
      if (div.innerText === 'Expand') {
        this.displayCandidate = this.rows.slice(0, 4);
      } else {
        this.displayCandidate = this.rows;
      }
    }
    this.isTerminated = this.checkIsterminated(this.rows);
    // console.log("termianted",this.isTerminated)
  }

  close() {
    // tinymce.get('editor').remove();
    this.taskActionSvc.emailSelectedFiles = [];
    this.activeModal.close();
  }

  sendBulkMessageReca() {
    if (this.processName === 'Initiation Process Pre-Screening') {
      console.log('AAAAAAAAAAAAAAAAA', this.taskActionSvc.emailSelectedFiles);
      this.candidateData = this.rows.map((el) => {
        let obj = {
          mobileNum: el.psCandidateMobile,
          sentFrom: el.initiator,
          businessKey: el.psId,
        };
        return obj;
      });
      let data = {};
      data['message'] = this.inputMsg;
      data['data'] = this.candidateData;
      this.WhatsappService.bulkSendMessageReca(data).subscribe((res) => {
        if (res.status) {
          this.toastrSvc.success('Message Sent Successfully');
          this.activeModal.close();
        } else {
          this.toastrSvc.error('Something Went Wrong');
        }
      });
    } else if (this.processName === 'Initiation Lead Management') {
      let formData = new FormData();
      let phoneNumberArray = [];
      if (this.taskActionSvc.emailSelectedFiles.length > 0) {
        this.taskActionSvc.emailSelectedFiles.forEach((file) => {
          formData.append('files', file);
        });
      }
      phoneNumberArray = this.rows.map((el) => {
        let obj = {
          phoneNumber: el.clientContactMobileNumber,
        };
        return obj;
      });
      formData.append('message', this.inputMsg);
      formData.append('sentFrom', this.user);
      formData.append('usecase', this.processName);
      formData.append('sendToAll', 'false');
      formData.append('sendingTo', JSON.stringify(phoneNumberArray));

      this.WhatsappService.bulkSendMessageAys(formData).subscribe((res) => {
        if (res.status) {
          this.toastrSvc.success('Message Sent Successfully');
          this.activeModal.close();
        } else {
          this.toastrSvc.error('Something Went Wrong');
        }
      });
    } else {
      let formData = new FormData();
      let phoneNumberArray = [];
      if (this.taskActionSvc.emailSelectedFiles.length > 0) {
        this.taskActionSvc.emailSelectedFiles.forEach((file) => {
          formData.append('files', file);
        });
      }
      phoneNumberArray = this.rows.map((el) => {
        let obj = {
          phoneNumber: el.phoneNumber,
        };

        return obj;
      });
      formData.append('message', this.inputMsg);
      formData.append('sentFrom', this.user);
      formData.append('usecase', this.processName);
      formData.append('sendToAll', 'false');
      formData.append('sendingTo', JSON.stringify(phoneNumberArray));

      this.WhatsappService.bulkSendMessageAys(formData).subscribe((res) => {
        if (res.status) {
          this.toastrSvc.success('Message Sent Successfully');
          this.activeModal.close();
        } else {
          this.toastrSvc.error('Something Went Wrong');
        }
      });
    }
  }

  openEmailAttachment() {
    const ngbModalOpt: NgbModalOptions = {
      keyboard: false,
      backdrop: 'static',
      size: 'lg',
    };
    const refMod = this.modalService.open(
      EmailAttachmentComponent,
      ngbModalOpt
    );
    refMod.componentInstance.taskDetails = null;
    refMod.componentInstance.opt = 1;
    refMod.componentInstance.emitUser.subscribe((r: any[]) => {
      refMod.close();
    });
  }
}

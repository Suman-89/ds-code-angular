import { Component, OnInit, Input, ViewChild, EventEmitter, OnChanges, Output } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { LoggedUserModel } from 'src/app/core/_models';
import { TaskCommentModel } from 'src/app/feature/process/layout/_models';


@Component({
  selector: 'app-taguser',
  templateUrl: './taguser.component.html',
  styleUrls: ['./taguser.component.scss']
})
export class TaguserComponent implements OnInit, OnChanges {

  @ViewChild('p') public popover: NgbPopover;
  @Input() modelProp: TaskCommentModel = {} as TaskCommentModel;
  @Input() allUsers: LoggedUserModel[] = [];
  @Output() send = new EventEmitter();

  users_tmp: LoggedUserModel[] = null;
  prevText : string;
  innerCont: string;
  commentBox: HTMLElement;
  appendText: string;
  bindHTML: string;

  constructor() { }

  onSearch(e: KeyboardEvent) {

    let target = e.target as HTMLElement;
    let currentTarget = e.currentTarget as HTMLElement;

    if (e.keyCode == 13) {
      e.stopPropagation();
      this.send.emit(true);
    } else {

      this.modelProp.message = target.innerHTML;
      let el: string = currentTarget.innerHTML;

      if (el.includes('@')) {
        this.popover.close();
        let txt: string = el.substr(el.lastIndexOf('@')+1);
        this.appendText = txt.substr(txt.indexOf('<'));
        txt = txt.substr(0, txt.indexOf('<'));
        this.prevText = el.substr(0, el.lastIndexOf('@'));
        if (txt.length>1) {
          this.users_tmp = this.allUsers.filter( a => a.fname?.toLowerCase().startsWith(txt.toLowerCase()) || a.lname?.toLowerCase().startsWith(txt.toLowerCase()));
          this.popover.open();
        } else {
          this.users_tmp = JSON.parse(JSON.stringify(this.allUsers));
          this.popover.open();
        }
      } else {
        this.users_tmp = null;
        this.popover.close();
      }
    }
  }

  selectUser(user: LoggedUserModel) {
    this.bindHTML = `${this.prevText}<span class="taggedUser">${user.fname} ${user.lname}</span> ${this.appendText} `;
    this.modelProp.message = this.bindHTML;
    this.modelProp.users = this.modelProp.users? this.modelProp.users : [];
    this.modelProp.users.push(user.userid);
    this.popover.close();
  }

  storeEvent(e: FocusEvent) {
    if (!this.innerCont) {
      this.commentBox = e.target as HTMLElement;
      this.innerCont = this.commentBox.innerHTML;
    }
  }

  getColor() {
    return 'red';
  }

  stripHtml(html){
    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if ((!this.modelProp.message || this.modelProp.message.length == 0)) {
      this.bindHTML = '';
      if (this.commentBox) {
        this.commentBox.innerHTML = this.innerCont
      }
    }
  }
  

}

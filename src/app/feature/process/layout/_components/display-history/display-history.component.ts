import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { TaskInfoService } from '../../_services';

@Component({
  selector: 'app-display-history',
  templateUrl: './display-history.component.html',
  styleUrls: ['./display-history.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(5%)', opacity: 0 }),
        animate('250ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DisplayHistoryComponent implements OnInit, OnChanges {
  @Input() businessKey: string;
  @Input() darkTheme: boolean;
  isShowHistory: boolean = false;
  allPastBusinessKeys: any[];
  openCommentArr: boolean[];

  constructor(private taskInfoSvc: TaskInfoService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.showAllTranscriptionsHistory();
  }

  showAllTranscriptionsHistory(): void {
    this.taskInfoSvc
      .getAllTranscriptionsHistory(this.businessKey)
      .subscribe((res) => {
        if (res.data) {
          this.isShowHistory = true;
          this.allPastBusinessKeys = Object.entries(res.data);
          this.openCommentArr = this.allPastBusinessKeys.map(
            (e) => e === false
          );
        }
      });
  }

  openComment(i: number, el: HTMLElement) {
    this.openCommentArr[i] = !this.openCommentArr[i];
    el.scrollIntoView();
  }
}

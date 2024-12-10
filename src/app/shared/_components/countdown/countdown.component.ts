import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit {
  @Input() seconds: any;
  constructor() {}
  showTime: string;
  ngOnInit() {
    this.convertTime();
    //setInterval(this.convertTime, 10000,this.seconds);
  }
  convertTime() {
    var interval = setInterval(() => {
      var seconds = this.seconds;
      let dayTime = 60 * 60 * 24;
      var day = Math.floor(seconds / dayTime);
      let rmainingTime = seconds - dayTime * day;
      let hoursTime = 60 * 60;
      var hour = Math.floor(rmainingTime / hoursTime);
      rmainingTime = rmainingTime - hoursTime * hour;
      let minTime = 60;
      var minute = Math.floor(rmainingTime / minTime);
      rmainingTime = rmainingTime - minTime * minute;
      var second = Math.floor(rmainingTime);
      this.seconds--;
      // console.log(
      //   'Day - ' +
      //     day +
      //     ', Hours - ' +
      //     hour +
      //     ', Minutes - ' +
      //     minute +
      //     ', Seconds - ' +
      //     second
      // );
      if (day >= 0 && hour >= 0 && minute >= 0 && second >= 0) {
        this.showTime =
          day +
          ' Days ' +
          hour +
          ' Hours ' +
          minute +
          ' Minutes ' +
          second +
          ' Seconds ' +
          'Remaining';
      }
    }, 1000);
  }
}

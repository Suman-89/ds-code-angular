import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-process-prescreening',
  templateUrl: './start-process-prescreening.component.html',
  styleUrls: ['./start-process-prescreening.component.scss'],
})
export class StartProcessPrescreeningComponent implements OnInit {
  excelData;

  constructor() {}

  ngOnInit(): void {}
  excelDataCollector(ev) {
    this.excelData = ev;
  }
}

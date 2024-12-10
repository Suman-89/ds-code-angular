import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/_services';

@Component({
  selector: 'app-select-process-modal',
  templateUrl: './select-process-modal.component.html',
  styleUrls: ['./select-process-modal.component.scss'],
})
export class SelectProcessModalComponent implements OnInit {
  @Output() selectedProcEmitter = new EventEmitter();
  @Input() process;
  
  constructor(public activeModal: NgbActiveModal,public sharedSvc: SharedService,) {}

  ngOnInit(): void {
    this.process = this.process.filter((i) => i.isVisible).sort((a, b) => a.label > b.label ? 1 : -1);
    // console.log('PROCESSES >>>>>>>>>', this.process);
  }

  selectedProcessEvent(proc) {
    this.selectedProcEmitter.emit(
      this.process.find((a) => a.label === proc.label)
    );
  }
}

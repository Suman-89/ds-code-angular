import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  AuditTrailMappedModel,
  AuditTrailModel,
  AuditTrailViewModel,
  ContractDetailsModel,
} from '../../_models';
import { TaskService, TaskSignalService } from '../../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit, OnDestroy {
  @Input() darkTheme: boolean;
  auditTrail: ContractDetailsModel[] = [];
  auditTrailView: AuditTrailViewModel[] = [];
  trailView = [];
  contractId: string;
  subscription: Subscription[] = [];

  constructor(
    private taskSvc: TaskService,
    private taskSignalSvc: TaskSignalService
  ) {}

  ngOnInit(): void {
    this.subscribeToTaskDetails();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  subscribeToTaskDetails(): void {
    this.subscription.push(
      this.taskSignalSvc.businessKey.subscribe((a) => {
        if (a) {
          this.contractId = a;
          this.getAuditTrail();
        }
      })
    );
  }

  getAuditTrail(): void {
    this.taskSvc.getAuditTrail(this.contractId).subscribe((a) => {
      this.auditTrail = a.data;
      this.auditTrailView = [];
      this.mapToViewModel();
    });
  }

  ifProcessStartOrCompleteStep(step) {
    return (
      step.taskname === 'Process Started' ||
      step.taskname === 'Process Completed'
    );
  }

  mapToViewModel(): void {
    // this.auditTrail.forEach(a => {
    //   let ob ;
    //   let trail = [] ;
    //   a.contractTaskDtos.length == 1 ? a.contractTaskDtos.push(a.contractTaskDtos[0]) : null ;
    //   for (let i = 0; i <a.contractTaskDtos.length - 1; i++) {

    //     ob = {
    //       fromTask: a.contractTaskDtos[i],
    //       toTask: a.contractTaskDtos[i + 1]
    //     }
    //     trail.push(ob) ;
    //     }

    //     this.trailView.push({key: a.key, trailview: trail});
    //   })

    // let o = Object.keys(this.auditTrail) ;
    // o.forEach(a => {
    //   let trail = []
    //   let data = this.auditTrail[a]
    //   let ob: AuditTrailViewModel ;
    //   data.length == 1 ? data.push(data[0]) : null ;
    //   // if(data.length>1) {
    //     for (let i = 0; i <data.length - 1; i++) {

    //       ob = {
    //         fromTask: data[i],
    //         toTask: data[i + 1]
    //       }
    //       trail.push(ob) ;
    //   //   }
    //   // } else if (data.length ===1) {
    //   //    ob = {
    //   //      fromTask: data[0],
    //   //      toTask: data[0]
    //   //    }
    //   //    ob.toTask.endtime ? ob.toTask.starttime = ob.toTask.endtime : null ;
    //     //  trail.push(ob) ;
    //   }

    //   this.trailView.push({key: a, trailview: trail});
    // })
    this.auditTrail = this.auditTrail.sort((a, b) =>
      new Date(a.starttime) > new Date(b.starttime) ? 1 : -1
    );

    for (let i = 0; i < this.auditTrail.length - 1; i++) {
      let obj: AuditTrailViewModel = {
        fromTask: this.auditTrail[i],
        toTask: this.auditTrail[i + 1],
      };
      this.auditTrailView.push(obj);
    }
  }
}

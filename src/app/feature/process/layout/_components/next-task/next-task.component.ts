import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  TaskService,
  TaskActionService,
  TaskSignalService,
} from '../../_services';
import { ActivatedRoute } from '@angular/router';
import { LoggedUserModel } from 'src/app/core/_models';
import { ToastrService } from 'ngx-toastr';
import { TaskInfoModel } from '../../_models';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-next-task',
  templateUrl: './next-task.component.html',
  styleUrls: ['./next-task.component.scss'],
})
export class NextTaskComponent implements OnInit, OnDestroy {
  businessKey: string;
  processId: string;
  routeCheck: string;
  loggedUser: LoggedUserModel;
  timeoutInst;
  taskInfo;
  processVariablesGrid;
  constructor(
    private taskSvc: TaskService,
    private route: ActivatedRoute,
    private toastrSvc: ToastrService,
    private taskActionSvc: TaskActionService,
    private ngxService: NgxUiLoaderService,
    private taskSignalSvc: TaskSignalService
  ) {}

  ngOnInit(): void {
    this.businessKey = this.route.snapshot.paramMap.get('businessKey');
    this.processId = this.route.snapshot.paramMap.get('procId');
    this.routeCheck = this.route.snapshot.paramMap.get('routeCheck');
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    this.getContractInfo().subscribe((contractInfo) => {
      this.processVariablesGrid = contractInfo.data?.processvariables;
      this.getNextTask(40);
    });
    this.ngxService.startBackground();
    this.taskSignalSvc.taskInfo.subscribe((a) => {
      if (a) {
        this.taskInfo = a;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngxService.stopBackground();
    clearTimeout(this.timeoutInst);
  }

  getContractInfo() {
    return this.taskSvc.getContractById(this.businessKey);
  }

  getNextTask(retryCount: number = 0): void {
    this.taskSvc.getNextTask(null, this.businessKey).subscribe(
      (a) => {
        if (a.status) {
          if (
            a.data.tasks.length > 0 &&
            this.routeCheck == 'task' &&
            !a.data.contractcomplete
          ) {
            let myTaskCount: TaskInfoModel[] = [];
            let otherTaskCount: TaskInfoModel = null;

            a.data.tasks.forEach((i) => {
              if (
                this.loggedUser.userid === i.assignee &&
                i.processInstanceId === this.processId
              ) {
                myTaskCount.unshift(i);
              } else if (
                this.loggedUser.userid === i.assignee &&
                i.processInstanceId !== this.processId
              ) {
                myTaskCount.push(i);
              } else if (
                this.loggedUser.userid !== i.assignee &&
                !otherTaskCount
              ) {
                otherTaskCount = i;
              }
            });

            if (myTaskCount && myTaskCount.length > 0) {
              this.taskActionSvc.viewTask(myTaskCount[0].id);

              if (otherTaskCount && otherTaskCount.assigneeName) {
                this.toastrSvc.success(
                  `Task "${otherTaskCount.name}" is now with ${otherTaskCount.assigneeName}`
                );
              } else if (otherTaskCount && otherTaskCount.groupname) {
                this.toastrSvc.success(
                  `Task "${otherTaskCount.name}" is now in ${otherTaskCount.groupname} Queue`
                );
              }
              this.taskActionSvc.resetStatus(
                otherTaskCount,
                this.processVariablesGrid
              );

              return '';
            }
            if (otherTaskCount && otherTaskCount.assigneeName) {
              this.toastrSvc.success(
                `Task "${otherTaskCount.name}" is now with ${otherTaskCount.assigneeName}`
              );
              this.taskActionSvc.resetStatus(
                otherTaskCount,
                this.processVariablesGrid
              );
            } else if (otherTaskCount && otherTaskCount.groupname) {
              this.toastrSvc.success(
                `Task "${otherTaskCount.name}" is now in ${otherTaskCount.groupname} Queue`
              );
              this.taskActionSvc.resetStatus(
                otherTaskCount,
                this.processVariablesGrid
              );
            }
          } else if (
            a.data.tasks.length > 0 &&
            this.routeCheck == 'notify' &&
            !a.data.contractcomplete
          ) {
            this.taskActionSvc.viewTask(a.data[0].id);
            return '';
          } else if (retryCount > 0 && !a.data.contractcomplete) {
            this.timeoutInst = setTimeout(() => {
              this.getNextTask(retryCount - 1);
            }, 2000);
            return '';
          } else if (retryCount == 0 && !a.data.contractcomplete) {
            this.toastrSvc.info(
              'Please wait while we get the next thing in the contract'
            );
          } else if (a.data.contractcomplete) {
            this.taskSvc.getContractById(this.businessKey).subscribe((a) => {
              if (a.status) {
                this.taskActionSvc.resetStatus(null, this.processVariablesGrid);
                if (a.data.contracttype !== 'OFAC') {
                  this.toastrSvc.success(`Process Completed`);
                  // this.toastrSvc.success(`${a.data.contracttype} Process Completed for ${a.data.product}`);
                } else {
                  this.toastrSvc.success(`OFAC Process Completed`);
                }
              }
            });
          }
        }

        this.taskActionSvc.viewMyQueue();
        return '';
      },
      (err) => {
        this.taskActionSvc.viewMyQueue();
      }
    );
  }
}

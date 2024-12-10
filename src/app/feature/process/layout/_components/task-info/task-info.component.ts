import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TaskSignalService, TaskActionService } from '../../_services';
import { Subscription } from 'rxjs';
import { ProcessVariableModel, UIElementTypes } from 'src/app/core/_models';
import { TaskInfoModel } from '../../_models';
import { SharedService, UserService } from 'src/app/core/_services';
import * as moment from 'moment';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss'],
})
export class TaskInfoComponent implements OnInit, OnDestroy {
  @Input() tasks: TaskInfoModel[] = [];
  @Input() darkTheme: boolean;

  fullTextArea = [];
  taskInfo: TaskInfoModel;
  taskVariables: ProcessVariableModel[] = [];
  subscription: Subscription[] = [];
  groups;
  profileImage;
  candidateName;
  candidateScore = 0;
  shortName;
  scoreColor = '';
  psNoOfQuesAns = 0;
  psNoOfQues = 0;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));

  constructor(
    private taskSignalSvc: TaskSignalService,
    private taskActionSvc: TaskActionService,
    private userSvc: UserService,
    private sharedSvc: SharedService
  ) {}

  ngOnInit(): void {
    this.initFn();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((i) => i.unsubscribe());
  }

  initFn() {
    this.subscription.push(
      this.userSvc.getUserGroups().subscribe((r) => {
        if (r.status) {
          this.groups = r.data;
          this.getTaskInfo();
          this.getTaskVariables();
        }
      })
    );
  }

  getTaskInfo(): void {
    this.subscription.push(
      this.taskSignalSvc.taskInfo.subscribe((a) => {
        if (a) {
          this.taskInfo = a;
        }
      })
    );
  }

  getScore(score) {
    if (!isNaN(score)) {
      this.candidateScore = score;
    }
    if (this.candidateScore <= 30) {
      this.scoreColor = 'red';
    } else if (this.candidateScore > 30) {
      this.scoreColor = '#FFBF00';
    }
    if (this.candidateScore >= 70) {
      this.scoreColor = 'green';
    }
    if (this.candidateScore >= 90) {
      this.scoreColor = 'blue';
    }
    console.log('CANDIDATE SCORE', this.candidateScore, score, this.scoreColor);
  }

  filterArrayInOrder(array2, array1, key) {
    const setArray2 = new Set(array2.map((obj) => obj[key]));
    return array1.filter((obj1) => setArray2.has(obj1.name));
  }

  getTaskVariables(): void {
    this.subscription.push(
      this.taskSignalSvc.taskVariables.subscribe((a) => {
        if (a) {
          //commented the assigning of task variable for refresh issue
          // this.taskVariables = a;
          this.sharedSvc
            .getProcDefbyName(this.selectedProcess.name)
            .subscribe((x) => {
              let processDef = x.data;
              let info = processDef.gridsettings?.find(
                (i) => i.type == 'INFO'
              )?.columns;
          info=info.filter(i=>!i.hidden);

              let reArrangedInfo = [];
              if (info.length > 0) {
                info.forEach((el) => {
                  // Assuming 'info' is an array of objects with a 'name' property
                  const foundElement = a.find((i) => i.name === el.key);

                  if (foundElement) {
                    reArrangedInfo.push(foundElement);
                  }
                });

                this.taskVariables = reArrangedInfo;
              }

              this.taskVariables.forEach((x) => {
                if (x.name === 'lastMessageTimestamp') {
                  x.datatype = 'DateTime';
                }
                if (x.name === 'psWaEnabledUpto') {
                  x.datatype = 'DateTime';
                }
              });
              console.log(this.taskVariables);
              this.fullTextArea = this.taskVariables;
              this.fullTextArea = this.fullTextArea.map((e) => (e = false));
              console.log(this.fullTextArea);
              this.profileImage = this.taskVariables.find(
                (i) => i.name == 'psCandidateProfileImage'
              )?.value;
              this.candidateName = this.taskVariables.find(
                (i) => i.name == 'psCandidateName'
              )?.value;
              this.candidateScore = this.taskVariables.find(
                (i) => i.name == 'psDerivedScore'
              )?.value;
              if (this.candidateName) this.getScore(this.candidateScore);
              const words = this.candidateName?.toUpperCase()?.split(' ');

              if (!this.profileImage) {
                if (words?.length > 1) {
                  this.shortName = words?.[0]?.[0] + words?.[1]?.[0];
                } else {
                  this.shortName = words?.[0]?.[0];
                }
              }
              // console.log("TASK VARIABLE ",this.taskVariables)
              // console.log("psCandidateProfileImage", this.profileImage, this.taskVariables)
              this.taskVariables = this.taskVariables.filter(
                (i) =>
                  i.name != 'psCandidateProfileImage' &&
                  i.name != 'psCandidateName'
              );
              this.psNoOfQuesAns = this.taskVariables.find(
                (i) => i.name == 'psNoOfQuesAns'
              )?.value;
              this.psNoOfQues = this.taskVariables.find(
                (i) => i.name == 'psNoOfQues'
              )?.value;
              this.taskVariables
                .filter((a) => a.name === 'pmGroup')
                .map((m) => {
                  m.value = this.groups.find((r) => r.id === m.value).name;
                  return m;
                });
              this.taskVariables
                .filter((a) => a.uielementtype == UIElementTypes.DATEFIELD)
                .map((a) => {
                  console.log('aaa', a);
                  let d = moment(a.value).utcOffset('+05:30');
                  a.value =
                    a.datatype === 'Date'
                      ? d.format('DD-MMM-YYYY')
                      : d.format();
                  console.log('date', a.value);
                  if (a.value === 'Invalid date') {
                    a.value = '';
                  }
                });
              if (info.length === 0) {
                this.sortTaskDetails();
              }
            });
        }
      })
    );
  }

  sortTaskDetails(): void {
    let sortObj = {
      businessKey: -10,
      initiator: 9,
      ibasisContractingEntity: 8,
      contractInitiationTime: 7,
      partnerAddress: 6,
      ofacStatus: 10,
    };

    this.taskVariables.sort(
      (a: ProcessVariableModel, b: ProcessVariableModel) => {
        if (!sortObj[a.name] && !sortObj[b.name]) {
          return a.displaylabel.toLowerCase() > b.displaylabel.toLowerCase()
            ? 1
            : -1;
        } else {
          sortObj[a.name] = sortObj[a.name] ? sortObj[a.name] : 0;
          sortObj[b.name] = sortObj[b.name] ? sortObj[b.name] : 0;

          return sortObj[b.name] - sortObj[a.name];
        }
      }
    );
  }

  viewTask(task: TaskInfoModel) {
    this.taskActionSvc.viewTask(task.id);
  }

  textAreaOpener(i) {
    this.fullTextArea[i] = true;
  }
  textAreaCollapser(i) {
    this.fullTextArea[i] = false;
  }
}

import { Component, OnInit, OnDestroy, Input ,SimpleChanges,OnChanges} from '@angular/core';
import { TaskSignalService, TaskActionService } from '../../_services';
import { Subscription } from 'rxjs';
import { ProcessVariableModel, UIElementTypes } from 'src/app/core/_models';
import { TaskInfoModel } from '../../_models';
import { SharedService, UserService } from 'src/app/core/_services';
import * as moment from 'moment';


@Component({
  selector: 'app-compare-info',
  templateUrl: './compare-info.component.html',
  styleUrls: ['./compare-info.component.scss']
})
export class CompareInfoComponent implements OnInit, OnDestroy,OnChanges {
  @Input() tasks: any;
  @Input() index = 0;
  @Input () checkedCol:any
  taskInfo: TaskInfoModel;
  taskVariables: ProcessVariableModel[] = [];
  subscription: Subscription[] = [];
  groups;
  profileImage;
  candidateName;
  candidateScore = 0;
  scoreColor = '';
  shortName;
  tableData = [];
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  compulsoryVar = [];

  constructor(private taskSignalSvc: TaskSignalService, 
    private taskActionSvc: TaskActionService, private userSvc:UserService,private sharedSvc:SharedService) { }

  ngOnInit(): void {
    this.initFn() ;
    console.log("tasks", this.tasks)
  }

  ngOnDestroy(): void {
    // this.subscription.forEach(i => i.unsubscribe());
  }

  getCompareColumns() {
    // let processDef = this.sharedSvc.allProcessData.find(i => i.processkey == this.selectedProcess.key)?.processDef;
    // let columns = processDef.gridsettings?.find(i=>i.type=="COMPARE")?.columns
    
    // let data=[];
    //  columns.forEach((ele)=>{
       
    //   this.checkedCol.forEach((el)=>{

    //     if(ele.header===el.text){
    //        data.push(ele)
    //     }
    //   })

    //  })
    //  console.log("matchedCol", data)
    // const visibleCols = data?.filter(i => !i.disabled);
    // const visibleCols = this.checkedCol?.filter(i => !i.disabled);
    const visibleCols = this.checkedCol
    console.log("visisisisisisissi", visibleCols)
    this.compulsoryVar = visibleCols.map((col,i) => {
      if (col.key == 'psCandidateProfileImage') {
        return ({id:0, label:'' , name:  col.key})
      } else if (col.key ==  'psCandidateName') {
        return ({id:1, label:'' , name:  col.key})
      }else if (col.key == 'psDerivedScore') {
        return ({id:2, label:'' , name:  col.key})
      }else if (col.key=='psNoOfQuesAns') {
        return ({id:3, label:'' , name:  col.key})
      }else {
        return({id:4,label:col.header , name:  col.key})
      }
    })
    this.compulsoryVar.sort((a, b) => a.id - b.id);
    console.log("MATCHING PROCESS  >>>",visibleCols,this.compulsoryVar)

  }

  initFn() { }



  ngOnChanges(changes: SimpleChanges) {
    console.log("ONCHANGE", changes.checkedCol.currentValue)
    // console.log("this.tasks",this.tasks,this.checkedCol)
    // console.log("complusory", this.compulsoryVar)
    // console.log("tabledata", this.tableData)
      
    
    if (changes.checkedCol.currentValue) {
      this.getCompareColumns();
      // this.tasks =  changes.tasks.currentValue.map((item, index) => {
       
      let comparedData = this.tasks.map((item, index) => {
      // this.tasks =  this.tasks.map((item, index) => {
         let row = this.compulsoryVar.map(i => {
           if (i.name == 'psCandidateProfileImage') {
            let firstName = item.psCandidateFirstName;
            let lastName = item.psCandidateLastName;
             const shortName = (firstName ? firstName[0] : '') + (lastName ? lastName[0] : '')
             let otherData = {
               shortname: shortName,
               image: item[i.name],
               name :item.psCandidateName
            }
             
            if (!item[i.name] || (item[i.name].length<= 2)) {
              return ({type:'short-name',value:shortName,metaData:otherData})
            } else {
              return ({type:'image',value:item[i.name],metaData:otherData})
            }
           }
           if (i.name == 'psCandidateName') {
             return ({type:'name',value:item[i.name] ? item[i.name] : '--'})
           }
           if (i.name == 'psNoOfQuesAns') {
             return ({type:'questions',value:`${item[i.name] ? item[i.name] : 0}/${item.psNoOfQues?item.psNoOfQues:0}`})
           }
           if (i.name == 'psDerivedScore') {
             let scoreColor = this.getScore(item[i.name])
             return ({type:'score',value:item[i.name] ? item[i.name] : '0',color : scoreColor})
           }
    
           if(i.name == "contractInitiationTime"){ 
            let date=this.convertDateFormat(item.initiationdate)
            return ({type:'string', value:date})
           }
           if(i.name == "completiondatetime"){
            // console.log("item1", item.completiondatetime)
            let date=this.convertDateFormat(item.completiondatetime)
            return ({type:'string', value:date})
           }
      
           if(i.name == "elapseddays" || i.name == "elapsedhour"){
            return ({type:'string',value: i.name == "elapseddays" ? item.elapseddays.toFixed(2) : item.elapsedhour.toFixed(2) })
           }
           if(i.name == "hasDocument"){
            return ({type:'string', value:true ? "Available" : "Not Available" })
           }
           return ({type:'string',value:item[i.name] ? item[i.name] : '--'})
         })
      return row;
      })
      this.tableData = []
      this.compulsoryVar.forEach((item, id) => {
        // rev it was this.tasks  that was pushed now replace to comparedata
      this.tableData.push(this.getItemsAt(comparedData, id, item))
    })
    console.log("tableData",this.tableData)
    console.log("INFINITE-------------------", this.tasks, this.compulsoryVar);
    }
      
    
  }
  

   convertDateFormat(isoDateString) {
    const date = new Date(isoDateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}



  getItemsAt(data, i,item) {
    let values = []
    data.forEach(e => {
      values.push(e[i])
    })
    if (values.length > 0) {
      return [{type:'label',value: item.label},...values]
    } 
  }

  getScore(score) {
    let scoreColor = '';
    if (score <= 30 || (!score)) {
      scoreColor = 'red';
    } else if(score > 30){
      scoreColor = '#FFBF00';
    } if(score >= 70){
      scoreColor = 'green';
    } if(score >= 90){
      scoreColor = 'blue';
    }
    console.log("CANDIDATE SCORE",  score, scoreColor)
    return scoreColor
  }

  getTaskInfo(): void {
    this.subscription.push(this.taskSignalSvc.taskInfo.subscribe( a => {
      if (a) {
        this.taskInfo = a;
      }
    }));
  }

  getTaskVariables(): void {
    this.subscription.push(this.taskSignalSvc.taskVariables.subscribe(a => {
      if (a) {
        this.taskVariables = a;
        this.profileImage = this.taskVariables.find(i => i.name == 'psCandidateProfileImage')?.value;
        this.candidateName = this.taskVariables.find(i => i.name == 'psCandidateName')?.value;
        const words = this.candidateName?.toUpperCase()?.split(" ");
        if (!this.profileImage) { this.shortName = words?.[0]?.[0] + words?.[1]?.[0] };
        // console.log("TASK VARIABLE ",this.taskVariables)
        // console.log("psCandidateProfileImage", this.profileImage, this.taskVariables)
        this.taskVariables = this.taskVariables.filter(i=>i.name != 'psCandidateProfileImage' && i.name != 'psCandidateName')
        this.taskVariables.filter(a => a.name === 'pmGroup').map(m => {
          m.value = this.groups.find(r => r.id === m.value).name ;
          return m ;
        }) 
        this.taskVariables.filter(a => a.uielementtype == UIElementTypes.DATEFIELD).map( a => {
          let d = moment(a.value).utcOffset('+05:30');
          a.value = a.datatype === 'Date' ? d.format('DD-MMM-YYYY') : d.format() ; 
        })
        this.sortTaskDetails();
      }
    }));
  }

  sortTaskDetails(): void {
    let sortObj = {
      businessKey: -10,
      initiator: 9,
      ibasisContractingEntity: 8,
      contractInitiationTime: 7,
      partnerAddress: 6,
      ofacStatus: 10
    }

    this.tasks.sort((a: ProcessVariableModel, b: ProcessVariableModel) => {

      if (!sortObj[a.name] && !sortObj[b.name]) {
        return a.displaylabel.toLowerCase() > b.displaylabel.toLowerCase() ? 1 : -1;
      } else {
        sortObj[a.name] = sortObj[a.name] ? sortObj[a.name] : 0;
        sortObj[b.name] = sortObj[b.name] ? sortObj[b.name] : 0;

        return sortObj[b.name] - sortObj[a.name];
      }
    });
  }

  viewTask(task: TaskInfoModel) {
    this.taskActionSvc.viewTask(task.id);
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GridToolbarType } from 'src/app/core/_models';
import { ReportsService } from 'src/app/core/_services';
import Swal from 'sweetalert2';
import {Chart} from 'node_modules/chart.js'
import { AnalyticsService } from '../../_services';
import { SearchParamModel } from 'src/app/feature/process/layout/_models';

@Component({
  selector: 'app-analytics_app',
  templateUrl: './analytics_app.component.html',
  styleUrls: ['./analytics_app.component.scss'],
})
export class AnalyticsAppComponent implements OnInit {
  @ViewChild('gridinstance') gridInstance;
  selectedProcess = JSON.parse(localStorage.getItem('selected-process'));
  myChart
  constructor(
    private repSvc: ReportsService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private modalSvc: NgbModal,
    private toastrSvc: ToastrService,
    private analyticsSvc:AnalyticsService
  ) { }
  
  searchParams: SearchParamModel = {
    group: null,
    user: null,
    inprocess: true,
    contractstatus: 1,
  };

  ngOnInit(): void {
    this.renderChart('canvas1','pie','right')
    this.renderChart('canvas2', 'pie','right')
    this.renderChart('canvas3','bar','bottom')
    console.log("procFormUrl", this.analyticsSvc.bpmnUrl)
    this.getAllTasks(this.searchParams);
    
  }
  getAllTasks(ev) {
    this.analyticsSvc.searchContract(ev).subscribe((r) => {
      console.log("RRRR",r)
      // if (r.status) {
      //   //  let obj ;
      //   localStorage.setItem('searchContract', JSON.stringify(ev));
      //   this.searchData = r.data.filter((d) =>
      //     d.contractid.startsWith(prefix.businessKeyPrefix)
      //   );

      //   this.searchData.sort(
      //     (a, b) =>
      //       new Date(b.contractinitiationtime).getTime() -
      //       new Date(a.contractinitiationtime).getTime()
      //   );

      //   this.searchData.map((o) => {
      //     // o.elapsedtime = this.secondsToHms(o.elapsedtime) ;
      //     o.elapsedhour = this.secondsToHour(o.elapsedtime);
      //     o.elapseddays = this.secondsToDays(o.elapsedtime);
      //     o.taskstatus = o.endtime ? 'Completed' : 'In Progress';
      //     switch (o.contractstatus) {
      //       case 1:
      //         o.overallStats = 'In-Process';
      //         break;
      //       case 2:
      //         o.overallStats = 'Completed';
      //         break;
      //       case 3:
      //         o.overallStats = 'Terminated';
      //         break;
      //     }
      //     if (!o.assignee) {
      //       o.assignee = o.groupname + ' Queue';
      //     }
      //     if (o.product === 'IOT' && o.contracttype === 'Service Contract') {
      //       o.contractTypeSecondLevel = o.iotContractType;
      //     }
      //     return o;
      //   });
      //   if (this.isContractProcess) {
      //         this.groupsArr = ['groupname'];
      //       } 
      //   this.gridToolbarInst.data = this.searchData;
      //   this.gridToolbarInst.updateBoundData();
      // }
    });
  }
  
  renderChart(id,type,legendPosition) {
   this.myChart = new Chart(id, {
    type: type,
    
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 15, 4, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.4)',
                'rgba(54, 162, 235, 0.4)',
                'rgba(255, 206, 86, 0.4)',
                'rgba(75, 192, 192, 0.4)',
                'rgba(153, 102, 255, 0.4)',
                'rgba(255, 159, 64, 0.4)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
          borderWidth: 1.2,
          hoverBorderWidth: 3,
          hoverBackgroundColor:[
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(25, 152, 24, 0.7)'
            ],
        }]
     },
     
    options: {
        layout: {
          padding: {
            // left: 50,
            top:20,
          }
      },
      scales: {
          y: {
              beginAtZero: true
          }
      },
      legend:{ position:legendPosition },

      tooltips: {
        // borderColor: 'rgb(255, 0, 0)',
        // backgroundColor: 'rgb(255, 0, 0)'
     },
        
      
  },
});
  console.log("MY CHAT ",this.myChart)
}

}



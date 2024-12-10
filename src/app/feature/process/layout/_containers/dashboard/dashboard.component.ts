import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { TaskService } from '../../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private taskSvc: TaskService) {}
  public chart: any;
  contracts;

  ngOnInit(): void {
    this.countContract();
  }

  createChart(a, b, c) {
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ['In-Prosess', 'Completed', 'Terminated'],
        datasets: [
          {
            backgroundColor: ['green', 'blue', 'red'],
            data: [b, c, a],
            barThickness: 120,
            borderRadius: 300,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'All Case Status',
        },
      },
    });
  }

  countContract() {
    this.taskSvc.getContractList().subscribe((x) => {
      if (x.status) {
        this.contracts = x.data;
        let a = 0,
          b = 0,
          c = 0;
        this.contracts.forEach((i) => {
          if (i.terminated) {
            a++;
          } else if (i.inprogress) {
            b++;
          } else {
            c++;
          }
        });

        this.createChart(a, b, c);
      }
    });
  }
}

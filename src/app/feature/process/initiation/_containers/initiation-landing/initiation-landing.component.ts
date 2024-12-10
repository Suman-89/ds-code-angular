import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService, UserService } from 'src/app/core/_services';

@Component({
  selector: 'app-initiation-landing',
  templateUrl: './initiation-landing.component.html',
  styleUrls: ['./initiation-landing.component.scss']
})
export class InitiationLandingComponent implements OnInit {
 param ;
  constructor(
    private route: ActivatedRoute,
    private sharedSvc: SharedService,
    private userSvc: UserService,
  ) { }

  ngOnInit(): void {
    this.param = this.route.snapshot.paramMap.get('process');
    this.getUsers();
    this.getAllGroup();

  }

   getUsers(): void {
    this.userSvc.getAllUsers(true).subscribe((a) => {
      this.sharedSvc.allUsers = a.data;
    });
  }

  getAllGroup() {
    this.userSvc.getUserGroups().subscribe((a) => {
      this.sharedSvc.allGroups = a.data?.filter(
        (group) => group.id != 'camunda-admin' && group.id != 'guest'
      );
    });
  }

}

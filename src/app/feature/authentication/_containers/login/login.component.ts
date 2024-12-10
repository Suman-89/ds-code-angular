import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModel } from 'src/app/core/_models';
import { GatekeeperService, SharedService } from 'src/app/core/_services';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectProcessModalComponent } from 'src/app/shared/_modals';
import { SelectProcessService } from 'src/app/core/_services/select-process.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  //loginDivOpen = false;
  loginModel: LoginModel = {} as LoginModel;
  contractId: string;
  subscription: Subscription[] = [];
  workflowType;
  workflowMaps;
  constructor(
    private router: Router,
    private loginSvc: GatekeeperService,
    private toasterSvc: ToastrService,
    private actRoute: ActivatedRoute,
    public sharedSvc: SharedService,
    private modalsvs: NgbModal,
    private selProcSvc: SelectProcessService
  ) {}

  openLogin(): void {
    //this.loginDivOpen = true;
  }

  login(): void {
    let loginCredentials = {
      ...this.loginModel,
      password: btoa(this.loginModel.password),
    };
    this.loginSvc.login(loginCredentials).subscribe(
      (a) => {
        if (a.status) {
          localStorage.setItem('token', a.data.token);
          localStorage.setItem('refreshToken', a.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(a.data.user));
          this.loginSvc.loggedUser = a.data.user;
          this.loginSvc.token = a.data.token;
          this.loginSvc.refreshToken = a.data.refreshToken;
          this.sharedSvc.getGroups();
          this.getWorkflowMaps();
        }
      },
      (err) => {
        if (err.status === 401 || err.status === 403) {
          this.toasterSvc.error('Wrong username or password!');
        }
      }
    );
  }

  routeToApp() {
    let token = localStorage.getItem('token');
    if (token) {
      this.loginSvc.loggedUser = JSON.parse(localStorage.getItem('user'));
      this.contractId
        ? this.router.navigate([
            'landing',
            'process',
            'view-contract',
            this.contractId,
          ])
        : this.router.navigate(['landing']);
    }
  }

  cancel(): void {
    //this.loginDivOpen = false;
    this.loginModel = { userid: '', password: '' };
  }

  ngOnInit() {
    this.subscription.push(
      this.actRoute.queryParams.subscribe((a) => {
        if (a['contractid']) {
          this.contractId = a['contractid'];
        }

        this.routeToApp();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.map((i) => i.unsubscribe());
  }
  

  getWorkflowMaps() {
    var workflowMaps=[];
    var workflowType=[];
     this.sharedSvc.getWorkflowTypeMaps().subscribe((r) => {
      if (r) {
        workflowMaps = r;
        workflowMaps.forEach((a) => {
          if (a.processDef.isVisible && this.selProcSvc.checkGroup(a.processDef.participatingGroups,this.loginSvc.loggedUser.groupnames)) {
            workflowType.push({
            key: a.processkey,
            name: a.processname,
            label: a.processlabel,
            sidenavsuffix: a.processkey,
            iconName: a.iconColor,
            cardColor:a.cardColor,
            businessKeyPrefix: a.prefix,
            isVisible: a.processDef.isVisible,
            participatingGroups: a.processDef.participatingGroups,
            tabSettings: a.processDef.tabSettings,
        });
          }  
        });
        console.log("$$$$$$$$$",workflowMaps,  workflowType,this.loginSvc.loggedUser)
        if (workflowType.length == 1) {
          localStorage.removeItem('selected-process');
          localStorage.setItem('selected-process', JSON.stringify(workflowType[0]));
          this.routeToApp()
        } else {
          this.selProcSvc.getWorkflowMaps(workflowMaps);
        }
      }
    });
    
  }
}

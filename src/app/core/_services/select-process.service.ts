import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectProcessModalComponent } from 'src/app/shared/_modals';
import { Roles } from '../_models';
import { GatekeeperService } from './gatekeeper.service';
import { SharedService } from './shared.service';

@Injectable()
export class SelectProcessService {
  workflowMaps;
  workflowType;
  contractId;
  constructor(
    private sharedSvc: SharedService,
    private modalsvs: NgbModal,
    private loginSvc: GatekeeperService,
    private router: Router
  ) {}

  getWorkflowMaps(allProcess?) {
    if (allProcess?.length) {
      this.workflowMaps = allProcess;
      this.getWorkflowTypes();
    } else {
      this.sharedSvc.getWorkflowTypeMaps().subscribe((r) => {
      if (r) {
        this.workflowMaps = r;
        this.getWorkflowTypes();
      }
    });
    }
    
  }

  checkGroup(participatingGroups, userGroups) {
    let state = false;
    let currentUserGroups = userGroups;
    if (currentUserGroups.length > 1) {
     currentUserGroups = currentUserGroups.filter(i => i != 'guest');
    }
    participatingGroups?.forEach((i) => {
      if (currentUserGroups.includes(i.id)) {
        state = true
        return
    }
    })
    return state
  }

  getWorkflowTypes() {
    this.workflowType = [];
    let user = JSON.parse(localStorage.getItem('user'));
    this.workflowMaps.forEach((a) => {
      if (a.processDef.isVisible && this.checkGroup(a.processDef.participatingGroups, this.loginSvc.loggedUser.groupnames)) {
        this.workflowType.push({
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
    this.openSelecProcModal(this.workflowType);
  }

  openSelecProcModal(proc) {
    const refMod = this.modalsvs.open(SelectProcessModalComponent, {
      size: 'xl',
      keyboard: false,
      backdrop: 'static',
    });
    refMod.componentInstance.process = proc;
    refMod.componentInstance.selectedProcEmitter.subscribe(
      (r) => {
        if (r) {
          this.sharedSvc.selectedProcess = r;
          localStorage.removeItem('selected-process');
          localStorage.setItem('selected-process', JSON.stringify(r));
          refMod.close();
          this.routeToApp();
        }
      },
      (err) => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    );
  }

  routeToApp() {
    let token = localStorage.getItem('token');
    if (token) {
      this.loginSvc.loggedUser = JSON.parse(localStorage.getItem('user'));
      // this.contractId
      //   ? this.router.navigate([
      //       'landing',
      //       'process',
      //       'view-contract',
      //       this.contractId,
      //     ])
      //   :

      this.router.navigate(['landing', 'process']).then(() => {
        window.location.reload();
      });
    }
  }
}

import { Component, OnInit, SimpleChanges, ViewChild , ElementRef } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { GatekeeperService, SharedService } from 'src/app/core/_services';
import { SelectProcessService } from 'src/app/core/_services/select-process.service';
import { primaryColor, primaryColor1 } from 'src/assets/config/theme.json';
import {
  LoggedUserModel,
  NavDataModel,
  NavItemModel,
  Roles,
} from '../../../../core/_models';
import { MenuService } from '../../_services';
import { RoutingService } from '../../_services/routing.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @ViewChild('sidenavbar') sidenavbar;

  stewardOptions;
  // = new _fromConstants.SidenavData().sideNav ;
  navItems: NavItemModel[];
  // = this.stewardOptions;
  selectedMenu: any = null;
  hoveredMenu: NavItemModel = null;
  openSideNav = true;
  openSummery = false;
  loggedUser: any = null;
  showTour: any = false;
  workflowMaps;
  workflowType;
  showChat: boolean = false;
  isTroubleTicketProcess: boolean = false;
  processName: string = JSON.parse(localStorage.getItem('selected-process'))
  ?.name;
  @ViewChild('chatbotFrame') chatbotFrame: ElementRef;
  navData: NavDataModel;
  // ={
  //   logoPath:null,
  //   collapsedLogoPath:null,
  //   // selectedOption: this.navItems[0].itemChildren[0],
  //   navOptions:this.navItems
  // };

  navStyle: any = {
    collapseIconPath: './assets/images/left.png',
    collapseIconPlacement: 'bottom',
    backgroundColor: '#fff',
    floatbackgroundColor: '#fff',
    boxshadow: 'rgba(196, 190, 196, 0.53) 0px 0px 22px -5px',
    borderColor: primaryColor1,
    textColor: primaryColor,
    iconColor: primaryColor,
    iconHeight: 20,
    // selectedIconColor:'#ffaa00',
    // selectedTextColor:'#aaaaaa',
    selectedBackground: primaryColor1,
    selectedBackground_secondary: primaryColor1,
    // selectedBorderColor:'#2aa89b',
    borderAnimation: true,
    collapsible: true,
  };
  loading: boolean;
  user: LoggedUserModel;

  constructor(
    private router: Router,
    private routSvc: RoutingService,
    private menuSvc: MenuService,
    private gatekeeperSvc: GatekeeperService,
    public sharedSvc: SharedService,
    private selProcSvc: SelectProcessService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.routSvc.checkForValidRoute(this.navData, event);
      }
    });
  }


  toggleChat() {
    this.showChat = !this.showChat;
  }

  reloadChatbot() {
 
    
    // Removing a specific item from session storage
    // sessionStorage.removeItem('powerva.demoClient.dltoken');
    // sessionStorage.clear();
   let ss= window.sessionStorage.getItem("powerva.demoClient.dltoken");
   console.log("Ss",ss)
    const iframe: HTMLIFrameElement = this.chatbotFrame.nativeElement;
    // iframe.src = iframe.src;
    iframe.src = iframe.src + '?rand=' + Math.random();
    // iframe.src ="https://web.powerva.microsoft.com/environments/Default-6ae3e83b-2c41-4697-b2b8-0fec53a953ea/bots/cr754_digitalSherpaEmployeeBuddy/webchat?__version__=2" 

  }


  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    // console.log(changes)
  }

  onNavClick(e) {
    // if (e && isStopPropagration) {
    //   e.stopPropagation();
    // }
    /* let path: string = e.itemId;
    this.selectedMenu = e;
    const item = this.getSelectedLeafItem(e);
    if (item) {
      path !== 'notifications' ? path = path + '/' + item.itemId : path = path ;
      // if (path === 'reference-data' || path === 'company') {
      //   path = path ;
      // } else {
      //   path = path + '/' + item.itemId ;
      // }
      // this.router.navigate([path], {relativeTo: this.route});
    } 

    switch (item.itemId) {

    }*/
  }

  getSelectedLeafItem(selectedOption) {
    let selectedItem;
    if (selectedOption.itemChild)
      selectedItem = this.getSelectedLeafItem(selectedOption.itemChild);
    else selectedItem = selectedOption;
    return selectedItem;
  }

  toggleNavBar(e) {
    this.openSideNav = e;
  }

  onSignOut(e) {}

  onNavHovered(hoveredOption) {
    this.openSummery = false;
    if (
      hoveredOption[Object.keys(hoveredOption)[0]] &&
      hoveredOption[Object.keys(hoveredOption)[0]] != this.selectedMenu.itemId
    ) {
      this.hoveredMenu = this.getSelectedLeafItem(
        this.setMenu(Object.keys(hoveredOption)[0])
      );
      this.openSummery = true;
    } else {
      if (Object.keys(hoveredOption)[0] == this.hoveredMenu.itemId) {
        setTimeout(() => {
          this.hoveredMenu = undefined;
        }, 1000);
      } else this.hoveredMenu = undefined;
    }
  }
  setMenu(m) {
    switch (m) {
      case 'dashboard':
        return this.constructSelection(0, [this.navItems[0]]);
        break;
    }
  }

  constructSelection(i, items) {
    let selectedMenu = {
      itemId: items[i].itemId,
      itemName: items[i].itemName,
      itemIconPath: items[i].itemIconPath,
      itemIconClass: items[i].itemIconClass,
    };
    if (items[i + 1])
      selectedMenu['itemChild'] = this.constructSelection(i + 1, items);

    return selectedMenu;
  }

  ngOnInit(): void {
        // console.log(changes)
     if(this.processName==="Initiation E-mail Process"){
      this.isTroubleTicketProcess=true;
     }
    this.getWorkflowMaps();
    this.checkRoleAndGroup();
  }

  getWorkflowMaps() {
    this.sharedSvc.getWorkflowTypeMaps().subscribe((r) => {
      // console.log("GET WORKFLOW ...",r)
      if (r) {
        this.workflowMaps = r;
        this.getWorkflowTypes();
        this.getSideNavData();
      }
    });
  }

  getWorkflowTypes() {
    this.workflowType = [];
    this.workflowMaps.forEach((a) => {
      if (
        a.processDef.isVisible &&
        this.selProcSvc.checkGroup(
          a.processDef.participatingGroups,
          this.gatekeeperSvc.loggedUser.groupnames
        )
      ) {
        this.workflowType.push({
          key: a.processkey,
          name: a.processname,
          label: a.processlabel,
          sidenavsuffix: a.processkey,
          iconName: a.iconColor,
          cardColor: a.cardColor,
          businessKeyPrefix: a.prefix,
          isVisible: a.processDef.isVisible,
          participatingGroups: a.processDef.participatingGroups,
          tabSettings: a.processDef.tabSettings,
        });
      }
    });
  }

  checkRoleAndGroup(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      if (!this.gatekeeperSvc.loggedUser) {
        this.gatekeeperSvc.loggedUser = this.user;
      }
      this.toggle(true); // to load the active class in the beginning else no theme was set
    }
    // this.user.roles.forEach(i => {
    //   if (i === Roles.SUPER_ADMIN || i === Roles.SYSTEM_ADMIN) {
    //     if (!this.user.groupnames.includes(UserGroupsEnum.CAMUNDA_ADMIN)) {
    //       this.toasterSvc.warning(`You have ${i} role but the proper group has not been assigned`);
    //     }
    //   } else if (!this.user.groupnames.map(i => i.toLowerCase()).includes(i.split('_')[0].toLowerCase())) {
    //     this.toasterSvc.warning(`You have ${i} role but the proper group has not been assigned`);
    //   }
    // })
  }

  getSideNavData() {
    const roles = [
      Roles.LEGAL_ADMIN,
      Roles.SUPER_ADMIN,
      Roles.SALES_USER,
      Roles.LEGAL_USER,
      Roles.SYSTEM_ADMIN,
      Roles.BILLING_USER,
      Roles.BILLING_ADMIN,
      Roles.COMMERCIAL_OPS_ADMIN,
      Roles.COMMERCIAL_OPS_USER,
      Roles.CREDIT_ADMIN,
      Roles.CREDIT_USER,
      Roles.FPA_USER,
      Roles.FPA_ADMIN,
      Roles.INTERCONNECT_DESIGN_USER,
      Roles.INTERCONNECT_DESIGN_ADMIN,
      Roles.DEPLOYMENT_ADMIN,
      Roles.DEPLOYMENT_USER,
      Roles.PRODUCT_MANAGEMENT_USER,
      Roles.PRODUCT_MANAGEMENT_ADMIN,
      Roles.PMIOT_USER,
      Roles.PMIOT_ADMIN,
      Roles.PMSMS_USER,
      Roles.PMSMS_ADMIN,
      Roles.PMMOBILE_USER,
      Roles.PMMOBILE_ADMIN,
      Roles.EMTIOT_USER,
      Roles.EMTIOT_ADMIN,
      Roles.EMTMOBILE_USER,
      Roles.EMTMOBILE_ADMIN,
      Roles.EMTCFO_USER,
      Roles.EMTCFO_ADMIN,
      Roles.GUEST_USER,
      Roles.PMGRMOBILE_ADMIN,
      Roles.PMGRMOBILE_USER,
      Roles.EMTSALES_ADMIN,
      Roles.EMTSALES_USER,
    ];
    this.menuSvc.getSidenavData().subscribe((resp) => {
      this.stewardOptions = resp;
      console.log(
        'LANDING ',
        this.workflowType?.length,
        this.workflowType,
        resp
      );
      this.stewardOptions.push({
        itemId: 'dms-link',
        itemName: 'DMS - Historical Contracts',
        itemIconPath: 'fa fa-book',
        forRoles: roles,
        isExternalLink: true,
        switchFlow: false,
        link: this.sharedSvc.dmsLink,
      });
      this.workflowType?.length > 1 &&
        this.stewardOptions?.push({
          itemId: 'change-process',
          itemName: 'Switch Workflow',
          itemIconPath: 'fa fa-exchange',
          forRoles: roles,
          isExternalLink: true,
          switchFlow: true,
        });
      this.navItems = this.stewardOptions;
      this.navData = {
        logoPath: null,
        collapsedLogoPath: null,
        // selectedOption: this.navItems[0].itemChildren[0],
        navOptions: this.navItems,
      };
      // this.stewardOptions = resp ;
    });
  }

  toggle(opt) {
    // const active = this.themeService.getActiveTheme();
    // active.name === 'light' ? this.themeService.setTheme('dark') : this.themeService.setTheme('light');
    //   // document.getElementById('headerCont').setAttribute('style', active.properties) ;
    //   // document.getElementById('bodyCont').setAttribute('style', active.properties) ;
    //   const style = document.createElement("style");
    //   style.innerHTML = active.classProperty ;
    //   // document.head.setAttribute("style", active.classProperty)
    //   document.head.appendChild(style);
    //   this.sidenavbar.navbarStyle.iconColor = active.color ;
    //   this.sidenavbar.navbarStyle.terxtColor = active.color ;
  }
}

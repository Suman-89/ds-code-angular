import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  NavDataModel,
  NavItemModel,
  NavStyleModel,
  SelectedNavItemModel,
} from '../../../../core/_models';

import { SelectProcessService } from 'src/app/core/_services/select-process.service';
import { Event, NavigationEnd, Router } from '@angular/router';
import { RoutingService } from '../../_services/routing.service';
import { SharedService } from './../../../../core/_services/shared.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavbarComponent implements OnInit {
  description: any = '';
  @ViewChild('sideNav') directive = null;

  @Input() darkTheme: boolean = true;
  @Input() navData: NavDataModel;
  @Input() navStyle?: NavStyleModel;
  @Input() loggedUser?: string;
  @Input() selectedMenu?: SelectedNavItemModel;
  @Output() selection = new EventEmitter();
  @Output() toggleExpansion = new EventEmitter();
  @Output() signOut = new EventEmitter();
  @Output() hoverOption = new EventEmitter();

  // navbarConfig:NavConfigModel;
  navbarStyle: NavStyleModel;
  // selectedMenu: SelectedNavItemModel;
  selectedParentMenu: NavItemModel;
  openSideNav: boolean = false;
  hoverItem: NavItemModel;
  summeryHoverItem: NavItemModel;
  collapsedHoverItem: NavItemModel;
  navWidth = {
    collapseWidth: 60,
    expandWidth: 210,
  };
  selectionColor: string = '#0642ea';
  activeIds: {} = {};

  level: number = 0;
  constructor(
    private router: Router,
    private routeSvc: RoutingService,
    private selectProcSvc: SelectProcessService,
    public sharedSvc: SharedService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.routeSvc.checkForValidRoute(this.navData, event);
      }
    });
  }

  ngOnInit() {
    console.log('navdata', this.navData);

    if (this.navData.navOptions) {
      if (!this.selectedMenu) {
        this.selectedMenu = this.setSelectedMenu(this.navData.navOptions);
      }
      this.activeIds[this.selectedMenu.itemId] = true;
    }
    this.navbarStyle = this.navStyle ? this.navStyle : new NavStyleModel();
  }

  gotoUser() {
    this.router.navigate(['dataprofiling/user']);
  }

  setSelectedMenu(navOptions) {
    let selectedOption = {
      itemId: navOptions[0].itemId,
      itemName: navOptions[0].itemName,
      itemIconPath: navOptions[0].itemIconPath,
      itemIconClass: navOptions[0].itemIconClass,
      routePath: navOptions[0].routePath,
    };
    if (navOptions[0].itemChildren)
      selectedOption['itemChild'] = this.setSelectedMenu(
        navOptions[0].itemChildren
      );

    return selectedOption;
  }

  setWidth() {
    let width = !this.openSideNav ? '100%' : 'auto';
    return width;
  }

  setHeight() {
    let height = this.navbarStyle.iconHeight
      ? this.navbarStyle.iconHeight + 30 + 'px'
      : '50px';
    return height;
  }

  getItemContainerStyle(item) {
    return {
      // 'border-bottom':(this.navbarStyle.borderColor) ? 'solid 1px '+this.navbarStyle.borderColor : null,
      height: this.setHeight(),
      /* 'background-color': this.setBackgroundColor(item) */
    };
  }

  getChildItemContainerStyle(childItem) {
    return {
      'border-bottom': this.navbarStyle.borderColor
        ? 'solid 1px ' + this.navbarStyle.borderColor
        : null,
      'background-color': this.setBackgroundColor(childItem),
    };
  }

  setIconStyle(item?) {
    let height = this.navbarStyle.iconHeight
      ? this.navbarStyle.iconHeight - 2 + 'px'
      : '20px';
    if (item) {
      if (item.itemIconPath) {
        return { height: height, color: this.setColor(item, 'icon') };
      }
      if (item.itemIconClass) {
        return { 'font-size': height, color: this.setColor(item, 'icon') };
      }
    } else {
      if (this.navbarStyle.collapseIconPath) {
        return {
          height: height,
          color: this.navbarStyle.iconColor
            ? this.navbarStyle.iconColor
            : 'white',
        };
      }
      if (this.navbarStyle.collapseIconClass) {
        return {
          'font-size': height,
          color: this.navbarStyle.iconColor
            ? this.navbarStyle.iconColor
            : 'white',
        };
      }
    }
  }

  setBackgroundColor(item) {
    let background;
    if (
      (this.selectedMenu && this.selectedMenu.itemId == item.itemId) ||
      (this.selectedParentMenu &&
        this.selectedParentMenu.itemId == item.itemId) ||
      (this.hoverItem && this.hoverItem.itemId == item.itemId)
    ) {
      background = this.navbarStyle.selectedBackground
        ? this.navbarStyle.selectedBackground
        : null;
    } else {
      background = 'transparent';
    }
    return background;
  }

  setColor(item, prop?) {
    if (
      (this.selectedMenu && this.selectedMenu.itemId == item.itemId) ||
      (this.selectedParentMenu &&
        this.selectedParentMenu.itemId == item.itemId) ||
      (this.hoverItem && this.hoverItem.itemId == item.itemId)
    ) {
      if (prop && prop == 'icon')
        return this.navbarStyle.selectedIconColor
          ? this.navbarStyle.selectedIconColor
          : this.selectionColor;
      else if (prop && prop == 'text')
        return this.navbarStyle.selectedTextColor
          ? this.navbarStyle.selectedTextColor
          : this.navbarStyle.textColor
          ? this.navbarStyle.textColor
          : 'black';
    } else if (prop && prop == 'icon')
      return this.navbarStyle.iconColor ? this.navbarStyle.iconColor : 'white';
    else if (prop && prop == 'text')
      return this.navbarStyle.textColor ? this.navbarStyle.textColor : 'white';
  }

  changeProcess() {
    this.selectProcSvc.getWorkflowMaps();
  }

  constructSelection(i, items) {
    let selectedMenu = {
      itemId: items[i].itemId,
      itemName: items[i].itemName,
      itemIconPath: items[i].itemIconPath,
      itemIconClass: items[i].itemIconClass,
      routePath: items[i].routePath,
    };
    if (items[i + 1])
      selectedMenu['itemChild'] = this.constructSelection(i + 1, items);

    return selectedMenu;
  }

  onNavClick(itemArray, item?) {
    // console.log('item', item);
    // console.log('itemArray', itemArray);

    if (itemArray[0]?.isExternalLink || item.isExternalLink) {
      if (item && item.link) {
        window.open(item.link, '_blank');
        return;
      }
      this.changeProcess();
    } else {
      this.selectedMenu = null;
      this.selectedParentMenu = null;
      if (item) {
        itemArray.unshift(item);
      }
    }
    if (itemArray.length > 0) {
      this.selectedMenu = {
        itemId: itemArray[0].itemId,
        itemName: itemArray[0].itemName,
        itemIconPath: itemArray[0].itemIconPath,
        itemIconClass: itemArray[0].itemIconClass,
        routePath: itemArray[0].routePath,
      };
    }
    if (itemArray[1])
      this.selectedMenu['itemChild'] = this.constructSelection(1, itemArray);

    this.selection.emit(this.selectedMenu);
    this.hoverItem = undefined;
    this.collapsedHoverItem = undefined;
  }

  toggleNavBar() {
    this.sharedSvc.responsiveLogoChange = !this.sharedSvc.responsiveLogoChange;
    this.openSideNav = !this.openSideNav;
    this.toggleExpansion.emit(this.openSideNav);
  }

  itemHovered(item) {
    this.hoverItem = item;
    this.collapsedHoverItem = item;
    let currentHover = this.hoverItem;

    setTimeout(() => {
      if (
        !item.itemChildren &&
        this.hoverItem &&
        currentHover.itemId == this.hoverItem.itemId
      ) {
        this.summeryHoverItem = currentHover;
        let hoverOption = {};
        hoverOption[currentHover.itemId] = true;
      }
    }, 4000);
  }

  itemHoverOut(item) {
    if (this.hoverItem && this.hoverItem.itemId == item.itemId) {
      this.hoverItem = undefined;
      if (
        this.summeryHoverItem &&
        this.summeryHoverItem.itemId == item.itemId
      ) {
        this.summeryHoverItem = undefined;
        let hoverOption = {};
        hoverOption[item.itemId] = false;
      }
    }
  }

  childHoverOut() {
    this.collapsedHoverItem = undefined;
  }
  onSummeryHover(hoverOption) {}

  show(item) {
    if (
      (this.hoverItem && this.hoverItem.itemId == item.itemId) ||
      (this.collapsedHoverItem && this.collapsedHoverItem.itemId == item.itemId)
    )
      return { display: 'block' };
    else return { display: 'none' };
  }

  setContainerBackground(item) {
    if (!this.darkTheme) {
      return {
        backgroundColor: this.navbarStyle.floatbackgroundColor
          ? this.navbarStyle.floatbackgroundColor
          : 'black',
        'border-color': this.navbarStyle.floatbackgroundColor
          ? this.navbarStyle.floatbackgroundColor
          : 'white',
      };
    }
  }

  getStyleDropdown(item) {
    if (this.activeIds[item.itemId]) {
      return {
        color: this.navbarStyle.borderColor
          ? 'solid 1px ' + this.navbarStyle.borderColor
          : null,
      };
    } else
      return {
        color: this.navbarStyle.borderColor
          ? 'solid 1px ' + this.navbarStyle.borderColor
          : null,
        transform: 'rotate(-90deg)',
      };
  }

  getHoverBorderStyle(item) {
    if (
      (this.selectedMenu && this.selectedMenu.itemId == item.itemId) ||
      (this.hoverItem && this.hoverItem.itemId == item.itemId)
    ) {
      return {
        width: '100%',
        backgroundColor: this.navbarStyle.selectedBorderColor
          ? this.navbarStyle.selectedBorderColor
          : null,
      };
    } else
      return {
        width: '0px',
      };
  }

  defaultActiveId() {
    if (this.selectedMenu) {
      return this.selectedMenu.itemId;
    }
  }
  setActiveIds(e) {
    Object.keys(this.activeIds).forEach((k) => (this.activeIds[k] = false));
    this.activeIds[e.panelId] = e.nextState;
  }
  onSignOut() {
    this.signOut.emit(true);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    if (!this.directive.nativeElement.contains(event.target)) {
      this.hoverItem = undefined;
      this.collapsedHoverItem = undefined;
    }
  }
}

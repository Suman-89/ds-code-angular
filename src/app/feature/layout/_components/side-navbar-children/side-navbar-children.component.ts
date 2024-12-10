import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/core/_services';
import {
  NavDataModel,
  NavItemModel,
  NavStyleModel,
  SelectedNavItemModel,
} from '../../../../core/_models';
import { RoutingService } from '../../_services/routing.service';

@Component({
  selector: 'app-side-navbar-children',
  templateUrl: './side-navbar-children.component.html',
  styleUrls: ['./side-navbar-children.component.scss'],
})
export class SideNavbarChildrenComponent implements OnInit {
  @Input() childData: NavItemModel[];
  @Input() currentItemData: NavDataModel;
  @Input() navbarStyle?: NavStyleModel;
  @Input() level: number;
  @Input() darkTheme: boolean;
  @Input('selectedMenu')
  set selectedMenu(selection: any) {
    if (selection) {
      this._selectedMenu = selection;
      this.levelSelectedItem = this.getLevelSelection(this._selectedMenu, 0);
    }
  }
  // get selectedMenu(): any { return this._selectedMenu; };
  @Input() openSideNav: boolean;
  @Output() navSelection = new EventEmitter();
  @Output() summeryhoverOption = new EventEmitter();

  _selectedMenu: SelectedNavItemModel;
  levelSelectedItem: SelectedNavItemModel;
  hoveredItem: SelectedNavItemModel;
  summeryHoverItem;
  activeIds: {} = {};
  user;
  constructor(
    private routeSvc: RoutingService,
    public sharedSvc: SharedService
  ) {}

  ngOnInit() {
    // console.log('CHILD DATA NAV', this.childData);
    let user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  getLevelSelection(selectedMenu, currentLevel) {
    let selection = selectedMenu;
    if (currentLevel < this.level && selectedMenu['itemChild']) {
      selection = this.getLevelSelection(
        selectedMenu['itemChild'],
        currentLevel + 1
      );
    }
    return selection;
  }

  getChildItemContainerStyle(childItem) {
    return {
      /* 'border-bottom': (this.navbarStyle.borderColor && this.level>0) ? 'solid 1px ' + this.navbarStyle.borderColor : null,
      'background-color': this.setBackgroundColor(childItem), */
      height: this.setHeight(),
      'padding-left': this.getPadding(),
    };
  }

  setBackgroundColor(item) {
    let background;
    if (
      (this.levelSelectedItem &&
        this.levelSelectedItem.itemId == item.itemId) ||
      (this.hoveredItem && this.hoveredItem.itemId == item.itemId)
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
      (this.levelSelectedItem &&
        this.levelSelectedItem.itemId == item.itemId) ||
      (this.hoveredItem && this.hoveredItem.itemId == item.itemId)
    ) {
      if (prop && prop == 'icon')
        return this.navbarStyle.selectedIconColor
          ? this.navbarStyle.selectedIconColor
          : '#0642ea';
      else if (prop && prop == 'text')
        return this.navbarStyle.selectedTextColor
          ? this.navbarStyle.selectedTextColor
          : this.navbarStyle.textColor
          ? this.navbarStyle.textColor
          : 'white';
    } else if (prop && prop == 'icon')
      return this.navbarStyle.iconColor ? this.navbarStyle.iconColor : 'white';
    else if (prop && prop == 'text')
      return this.navbarStyle.textColor ? this.navbarStyle.textColor : 'white';
  }

  getHoverBorderStyle(item) {
    if (
      (this.levelSelectedItem &&
        this.levelSelectedItem.itemId == item.itemId) ||
      (this.hoveredItem && this.hoveredItem.itemId == item.itemId)
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

  setHeight(icon?) {
    let height = this.navbarStyle.iconHeight
      ? this.navbarStyle.iconHeight + 20 - 7 * this.level + 'px'
      : '35px';
    if (this.level == 0) {
      height = this.navbarStyle.iconHeight
        ? this.navbarStyle.iconHeight + 30 + 'px'
        : '50px';
    }
    if (icon) {
      height = this.navbarStyle.iconHeight
        ? this.navbarStyle.iconHeight - 4 * this.level + 'px'
        : '40px';
    }
    return height;
  }

  getPadding() {
    if (this.openSideNav) {
      return 15 * this.level + 'px';
    } else {
      if (this.level == 1) return 0;
      else return 15 * (this.level - 1) + 'px';
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

  defaultActiveId() {
    if (this.levelSelectedItem) {
      // this.activeIds[this.levelSelectedItem.itemId] = true;
      return this.levelSelectedItem.itemId;
    }
  }
  setActiveIds(e) {
    if (this.level == 0) {
      Object.keys(this.activeIds).forEach((k) => (this.activeIds[k] = false));
    }
    this.activeIds[e.panelId] = e.nextState;
    this.navToDefaultRoute(this.childData.find((c) => c.itemId === e.panelId));
  }

  // hoverItem(childItem?) {
  //   this.hoveredItem = childItem ? childItem : undefined;
  // }
  itemHovered(childItem) {
    this.hoveredItem = childItem;
    let currentHover = this.hoveredItem;

    setTimeout(() => {
      if (
        !childItem.itemChildren &&
        this.hoveredItem &&
        currentHover.itemId == this.hoveredItem.itemId
      ) {
        this.summeryHoverItem = currentHover;
        let hoverOption = {};
        hoverOption[currentHover.itemId] = true;
        this.summeryhoverOption.emit(hoverOption);
      }
    }, 4000);
  }

  itemHoverOut(childItem) {
    if (this.hoveredItem && this.hoveredItem.itemId == childItem.itemId) {
      this.hoveredItem = undefined;
      if (
        this.summeryHoverItem &&
        this.summeryHoverItem.itemId == childItem.itemId
      ) {
        this.summeryHoverItem = undefined;
        let hoverOption = {};
        hoverOption[childItem.itemId] = false;
        this.summeryhoverOption.emit(hoverOption);
      }
    }
  }

  onSummeryHover(hoverOption) {
    this.summeryhoverOption.emit(hoverOption);
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }
  onNavClick(selectedArrayItems, parentItem?) {
    // console.log("*****", selectedArrayItems && selectedArrayItems[0].link, 'dms-link')
    selectedArrayItems &&
      selectedArrayItems[0].link &&
      this.goToLink(selectedArrayItems[0].link);

    if (parentItem && !(selectedArrayItems && selectedArrayItems[0].link)) {
      selectedArrayItems.unshift(parentItem);
      this.navSelection.emit(selectedArrayItems);
    } else {
      !(selectedArrayItems && selectedArrayItems[0].link) &&
        this.navSelection.emit(selectedArrayItems);
    }
  }
  isIndicator(childItem) {
    return (
      !childItem.itemChildren &&
      this.levelSelectedItem.itemId == childItem.itemId
    );
  }

  navToDefaultRoute(item) {
    item.itemChildren
      ? this.routeSvc.routeToDefaultChild(item.itemChildren[0], item)
      : this.transformSelectedMenuBeforeRouting(item);
  }

  transformSelectedMenuBeforeRouting(item) {
    this._selectedMenu.itemChildren = this._selectedMenu.itemChild;
    this.routeSvc.routeToDefaultChild(item, this._selectedMenu);
  }
}

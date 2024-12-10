import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _fromComponents from './_components';
import * as _fromContainers from './_containers';
import { LayoutRoutingModule } from './layout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  ThemeModule,
  lightTheme,
  darkTheme,
  ThemeService,
} from 'src/app/theme';
import { MenuService } from './_services';
import { SelectProcessService } from 'src/app/core/_services/select-process.service';

@NgModule({
  declarations: [
    _fromContainers.LandingComponent,
    _fromComponents.HeaderComponent,
    _fromComponents.FooterComponent,
    _fromComponents.SideNavbarComponent,
    _fromComponents.SideNavbarChildrenComponent,
    _fromComponents.DownloadDocComponent,
    _fromComponents.NotificationsComponent,
  ],
  exports: [
    _fromContainers.LandingComponent,
    _fromComponents.HeaderComponent,
    _fromComponents.FooterComponent,
    _fromComponents.SideNavbarChildrenComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NgbModule,
    SharedModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light',
    }),
  ],
  providers: [ThemeService, MenuService, SelectProcessService],
})
export class LayoutModule {}

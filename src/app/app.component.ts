import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GatekeeperService, SharedService } from 'src/app/core/_services';
import { LoggedUserModel } from './core/_models';
import jwt_decode from 'jwt-decode';
import { ProcessFormsService } from './feature/system/process-forms/_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  setup = false;
  title = 'ibasis-ui';
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  user: LoggedUserModel;
  userManagementApiUrl: string = environment.userManagementApiUrl;
  processName: string = JSON.parse(localStorage.getItem('selected-process'))
    ?.name;

  constructor(
    private sharedSvc: SharedService,
    private gatekeeperSvc: GatekeeperService,
    private procFromSvc: ProcessFormsService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('onceGridsUpdated') !== 'done') {
      Object.keys(localStorage)
        .filter((key) => key.includes('grid'))
        .forEach((savedGrid) => {
          localStorage.removeItem(savedGrid);
        });
      localStorage.setItem('onceGridsUpdated', 'done');
    }
    if (window.location !== window.parent.location) {
      window.addEventListener('message', (event) => {
        if (event.data.token) {
          const {
            sub,
            jti: userid,
            groups,
            authorities,
          }: any = jwt_decode(event.data?.token);
          localStorage.setItem('token', event.data?.token);
          localStorage.setItem('refreshToken', event.data?.token);
          let user = {
            userid,
            fullname: sub,
            accountid: userid,
            groupnames: groups,
            roles: authorities.map((authority) => authority.authority),
          };
          localStorage.setItem('user', JSON.stringify(user));
          let userl = localStorage.getItem('user');
          if (userl) {
            this.gatekeeperSvc.loggedUser = JSON.parse(userl);
          }
          this.gatekeeperSvc.loggedInUserEmitter.emit(user);
          this.gatekeeperSvc
            .exchangeToken({ token: event.data?.token })
            .subscribe((newTokens) => {
              localStorage.setItem('token', newTokens.data.token);
              localStorage.setItem('refreshToken', newTokens.data.refreshToken);
              this.gatekeeperSvc.token = newTokens.data.token;
              this.gatekeeperSvc.refreshToken = newTokens.data.refreshToken;
            });
          this.initFunction();
        }
      });
    } else this.initFunction();
  }

  initFunction() {
    let user = localStorage.getItem('user');
    this.setDefaultTheme();
    if (user) {
      this.user = JSON.parse(user);
      if (!this.gatekeeperSvc.loggedUser) {
        this.gatekeeperSvc.loggedUser = this.user;
        this.gatekeeperSvc.loggedInUserEmitter.emit(this.user);
      }
    }
    this.setTheme();
  }

  setTheme() {
    //first calling process definition api to see if any themes are present or not. If it's there then we simply apply those themes and if not they are present we use the general settings themes.

    this.procFromSvc.getProcDefbyName(this.processName).subscribe((res) => {
      // console.log("ofacCheck", res.data)
      localStorage.setItem('procDefOfacCheck', res.data.ofacCheck);
      localStorage.setItem('processtype', res.data.processtype);
      localStorage.setItem(
        'docTypeSettings',
        JSON.stringify(res.data.docTypeSettings)
      );
      localStorage.setItem('tabSettings', JSON.stringify(res.data.tabSettings));
      localStorage.setItem(
        'participatingGroups',
        JSON.stringify(res.data.participatingGroups)
      );

      if (res.data.themes) {
        let theme = Array.isArray(res.data.themes) ? res.data.themes[0] : null;
        // console.log('AAAAAAAA', res.themes);
        localStorage.setItem('theme', JSON.stringify(res.data.themes[0]));
        if (theme) {
          document.getElementById('custom-style').innerHTML = `* {
            --primaryColor: ${theme.primaryColor};
            --primaryColorRGB: ${this.sharedSvc.hexToRgb(theme.primaryColor)};
            --primaryColor1:  ${theme.primaryColor1};
            --secondaryColor:  ${theme.secondaryColor};
            --secondaryColorRGB:  ${this.sharedSvc.hexToRgb(
              theme.secondaryColor
            )};
            --tertiarycolor: ${theme.tertiarycolor};
            --quaternaryColor: ${theme.quaternaryColor};
            --dangerColor: ${theme.dangerColor};
            --sideNavColor: ${theme.sideNavColor};
            --tabColor: ${theme.tabColor};
            --textColor: ${theme.textColor}
          }`;
          document.title = theme.documentTitle;
          this.sharedSvc.logoUrl = theme.logoUrl;
          this.sharedSvc.dynamicThemeUrls.next({
            logoUrl: theme.logoUrl,
            loginLogoUrl: theme.loginLogoUrl,
            faviconUrl: theme.faviconUrl,
            workflowOverlayTitle: theme.workflowOverlayTitle,
          });
          this.favIcon.href = theme.faviconUrl;
        } else this.setDefaultTheme();
      } else {
        this.sharedSvc.getThemes().subscribe((res) => {
          let theme = Array.isArray(res.themes) ? res.themes[0] : null;
          localStorage.setItem('theme', JSON.stringify(res.themes[0]));
          if (theme) {
            document.getElementById('custom-style').innerHTML = `* {
                  --primaryColor: ${theme.primaryColor};
                  --primaryColorRGB: ${this.sharedSvc.hexToRgb(
                    theme.primaryColor
                  )};
                  --primaryColor1:  ${theme.primaryColor1};
                  --secondaryColor:  ${theme.secondaryColor};
                  --secondaryColorRGB:  ${this.sharedSvc.hexToRgb(
                    theme.secondaryColor
                  )};
                  --tertiarycolor: ${theme.tertiarycolor};
                  --quaternaryColor: ${theme.quaternaryColor};
                  --dangerColor: ${theme.dangerColor};
                  --sideNavColor: ${theme.sideNavColor};
                  --tabColor: ${theme.tabColor},
                  --textColor: ${theme.textColor}
                }`;
            document.title = theme.documentTitle;
            this.sharedSvc.logoUrl = theme.logoUrl;
            this.sharedSvc.dynamicThemeUrls.next({
              logoUrl: theme.logoUrl,
              loginLogoUrl: theme.loginLogoUrl,
              faviconUrl: theme.faviconUrl,
              workflowOverlayTitle: theme.workflowOverlayTitle,
            });
            this.favIcon.href = theme.faviconUrl;
          } else this.setDefaultTheme();
        });
      }
    });
  }

  setDefaultTheme() {
    let localStoreTheme = JSON.parse(localStorage.getItem('theme'));
    if (localStoreTheme) {
      document.getElementById('custom-style').innerHTML = `* {
        --primaryColor: ${localStoreTheme.primaryColor};
        --primaryColorRGB: ${this.sharedSvc.hexToRgb(
          localStoreTheme.primaryColor
        )};
        --primaryColor1:  ${localStoreTheme.primaryColor1};
        --secondaryColor:  ${localStoreTheme.secondaryColor};
        --secondaryColorRGB:  ${this.sharedSvc.hexToRgb(
          localStoreTheme.secondaryColor
        )};
        --tertiarycolor: ${localStoreTheme.tertiarycolor};
        --quaternaryColor: ${localStoreTheme.quaternaryColor};
        --dangerColor: ${localStoreTheme.dangerColor};
        --sideNavColor: ${localStoreTheme.sideNavColor}
        --tabColor: ${localStoreTheme.tabColor};
        --textColor: ${localStoreTheme.textColor};
      }`;
      document.title = localStoreTheme.documentTitle;
      this.sharedSvc.logoUrl = localStoreTheme.logoUrl;
      this.sharedSvc.dynamicThemeUrls.next({
        logoUrl: localStoreTheme.logoUrl,
        loginLogoUrl: localStoreTheme.loginLogoUrl,
        faviconUrl: localStoreTheme.faviconUrl,
        workflowOverlayTitle: localStoreTheme.workflowOverlayTitle,
      });
      this.favIcon.href = localStoreTheme.faviconUrl;
    } else {
      document.getElementById('custom-style').innerHTML = `* {
      --primaryColor: #041c44;
      --primaryColorRGB: ${this.sharedSvc.hexToRgb('#041c44')};
      --primaryColor1:  #ceebe8;
      --secondaryColor:  #ff9900;
      --tertiarycolor: #b6C8e2;
      --quaternaryColor: #000;
      --dangerColor: #c32121;
      --sideNavColor: #041c44;
      --tabColor: #041c44;
      --textColor: #c32121;
    }`;
      document.title = '';
      this.sharedSvc.logoUrl = '';
      this.sharedSvc.dynamicThemeUrls.next({
        logoUrl: '',
        loginLogoUrl: '',
        faviconUrl: '',
        workflowOverlayTitle: 'Choose Workflow',
      });
      this.favIcon.href = '';
    }
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TreeModule } from 'angular-tree-component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './feature/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';

import { ToastrModule } from 'ngx-toastr';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import * as _customValidation from './validators/custom-validation';
import * as _customValidationMessages from './validators/custom-validation-message';
import { AuthInterceptor } from './core/_interceptors/auth.interceptor';
import {
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
  NgxUiLoaderHttpConfig,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
} from 'ngx-ui-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { primaryColor } from '../assets/config/theme.json';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MentionModule } from '@tectes/angular-mentions';
import { VmtCommentsComponent } from './external/vmt-comments/vmt-comments.component';
import { VmtDisplayCommentComponent } from './external/vmt-display-comment/vmt-display-comment.component';
import { VmtDocumentsComponent } from './external/vmt-documents/vmt-documents.component';
import { ProcessLayoutModule } from './feature/process/layout/process-layout.module';
import { VmtTabsViewComponent } from './external/vmt-tabs-view/vmt-tabs-view.component';
import { BltModule } from './feature/blt/blt.module';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: primaryColor,
  pbColor: primaryColor,
  overlayColor: 'rgba(40,40,40,0.5)',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 60,
  fgsType: SPINNER.rectangleBounce,
  bgsPosition: POSITION.centerCenter,
  bgsSize: 60,
  bgsType: SPINNER.rectangleBounce,
  bgsColor: primaryColor,
};

const ngxUiHttpLoader: NgxUiLoaderHttpConfig = {
  excludeRegexp: ['(tasks)', '(companies/all)'],
  showForeground: true,
};

@NgModule({
  declarations: [
    AppComponent,
    VmtCommentsComponent,
    VmtDisplayCommentComponent,
    VmtDocumentsComponent,
    VmtTabsViewComponent,
  ],
  imports: [
    BltModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    LayoutModule,
    HttpClientModule,
    NgbModule,
    jqxGridModule,
    PdfViewerModule,
    TreeModule.forRoot(),
    FormsModule,
    SharedModule,
    ProcessLayoutModule,
    ReactiveFormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule.forRoot(ngxUiHttpLoader),
    FormlyModule.forRoot({
      validationMessages: [
        {
          name: 'required',
          message: _customValidationMessages.requiredMessage,
        },
        {
          name: 'emailValid',
          message: _customValidationMessages.emailValidMessage,
        },
        {
          name: 'passwordMatch',
          message: _customValidationMessages.passwordMatchMessage,
        },
      ],
      validators: [
        { name: 'emailValid', validation: _customValidation.emailValid },
        { name: 'passwordMatch', validation: _customValidation.passwordMatch },
      ],
    }),
    FormlyBootstrapModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    MentionModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

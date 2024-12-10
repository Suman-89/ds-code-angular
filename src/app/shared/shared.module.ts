import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _fromComponents from './_components';
import * as _fromFormlyComponents from './_formly_components';
import * as _fromDirectives from './_directives';
import * as _fromModals from './_modals';
import * as _fromPipes from './_pipes';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormlyModule } from '@ngx-formly/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MentionModule } from '@tectes/angular-mentions';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import {
  LineTruncationLibModule,
  LineTruncationDirective,
} from 'ngx-line-truncation';
import { ReportFiltersComponent } from './_components/report-filters/report-filters.component';
import { OtpVerifyComponent } from './_components/otp-verify/otp-verify.component';
import { DocumentListComponent } from './_components/document-list/document-list.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { CountryCodeComponent } from './_components/country-code/country-code.component';
import { CountdownComponent } from './_components/countdown/countdown.component';
import { CountryDropdownComponent } from './_components/country-dropdown/country-dropdown.component';

@NgModule({
  declarations: [
    _fromComponents.LoaderComponent,
    _fromComponents.GridComponent,
    _fromComponents.SidePanelComponent,
    _fromComponents.CardComponent,
    _fromComponents.AddEditCompanyComponent,
    _fromComponents.ToolbarComponent,
    _fromComponents.GridToolbarComponent,
    _fromComponents.AddressFormComponent,
    _fromComponents.SearchComponent,
    _fromComponents.TypeAheadComponent,
    _fromComponents.AddedAddressComponent,
    _fromComponents.RefdataFormComponent,
    _fromComponents.TaguserComponent,
    _fromComponents.FriendlyAddressComponent,
    _fromComponents.DocumentIconComponent,
    _fromComponents.CommentBoxComponent,
    _fromComponents.EmailBoxComponent,
    _fromComponents.NonLocalCommentBoxComponent,
    _fromComponents.RulesetInputTypeComponent,
    _fromComponents.PdfViewerComponent,
    _fromComponents.DropdownSearchComponent,
    _fromComponents.CustomIconPickerComponent,
    _fromComponents.RefDataSelectorComponent,
    _fromComponents.DatePickerComponent,
    _fromComponents.ReportFiltersComponent,
    _fromComponents.GridSettingHeadersComponent,
    _fromComponents.GridColSettingComponent,
    _fromFormlyComponents.ToggleSwitchTypeComponent,
    _fromFormlyComponents.DateTypeComponent,
    _fromFormlyComponents.FormlyHorizontalWrapper,
    _fromFormlyComponents.FormlyVerticalWrapper,
    _fromFormlyComponents.MetadataPanelWrapperComponent,

    _fromModals.ConfirmExportModalComponent,
    _fromModals.CreateCompanyModalComponent,
    _fromModals.FullCommentBoxModalComponent,
    _fromModals.FullNonLocalCommentBoxModalComponent,
    _fromModals.AddAnnotationModalComponent,
    _fromModals.SelectProcessModalComponent,
    _fromModals.ReportInputsModalComponent,

    _fromDirectives.FileUploaderDirective,
    _fromDirectives.HasPermissionDirective,
    _fromDirectives.TaguserDirective,
    _fromPipes.SanitizeHtmlPipe,
    _fromPipes.RoleNamePipe,
    _fromPipes.DisplayRolesPipe,
    ReportFiltersComponent,
    OtpVerifyComponent,
    DocumentListComponent,
    CountryCodeComponent,
    CountdownComponent,
    CountryDropdownComponent
  ],
  exports: [
    _fromComponents.LoaderComponent,
    _fromComponents.GridComponent,
    _fromComponents.SidePanelComponent,
    _fromComponents.CardComponent,
    _fromComponents.AddEditCompanyComponent,
    _fromComponents.ToolbarComponent,
    _fromComponents.GridToolbarComponent,
    _fromComponents.AddressFormComponent,
    _fromComponents.SearchComponent,
    _fromComponents.TypeAheadComponent,
    _fromComponents.AddedAddressComponent,
    _fromComponents.RefdataFormComponent,
    _fromComponents.TaguserComponent,
    _fromComponents.FriendlyAddressComponent,
    _fromComponents.DropdownSearchComponent,
    _fromComponents.CustomIconPickerComponent,
    _fromComponents.RefDataSelectorComponent,
    _fromComponents.DocumentIconComponent,
    _fromComponents.CommentBoxComponent,
    _fromComponents.EmailBoxComponent,
    _fromComponents.NonLocalCommentBoxComponent,
    _fromComponents.RulesetInputTypeComponent,
    _fromComponents.PdfViewerComponent,
    _fromComponents.DatePickerComponent,
    _fromComponents.ReportFiltersComponent,
    _fromComponents.GridSettingHeadersComponent,
    _fromComponents.GridColSettingComponent,
    _fromFormlyComponents.ToggleSwitchTypeComponent,
    _fromFormlyComponents.DateTypeComponent,
    _fromFormlyComponents.FormlyHorizontalWrapper,
    _fromFormlyComponents.FormlyVerticalWrapper,
    _fromFormlyComponents.MetadataPanelWrapperComponent,

    _fromDirectives.FileUploaderDirective,
    _fromDirectives.HasPermissionDirective,
    _fromDirectives.TaguserDirective,
    LineTruncationDirective,

    _fromPipes.SanitizeHtmlPipe,
    _fromPipes.RoleNamePipe,
    _fromPipes.DisplayRolesPipe,
    OtpVerifyComponent,
    DocumentListComponent,
    CountryCodeComponent,
    CountdownComponent,
  ],
  providers: [],
  entryComponents: [
    _fromModals.CreateCompanyModalComponent,
    _fromModals.FullCommentBoxModalComponent,
    _fromModals.FullNonLocalCommentBoxModalComponent,
    _fromModals.AddAnnotationModalComponent,
    _fromModals.SelectProcessModalComponent,
  ],
  imports: [
    CommonModule,
    jqxGridModule,
    jqxWindowModule,
    jqxDropDownListModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    NgxDaterangepickerMd.forRoot(),
    NgOtpInputModule,
    NgxIntlTelInputModule,

    FormlyModule.forChild({
      wrappers: [
        {
          name: 'form-field-horizontal',
          component: _fromFormlyComponents.FormlyHorizontalWrapper,
        },
        {
          name: 'form-field-vertical',
          component: _fromFormlyComponents.FormlyVerticalWrapper,
        },
        {
          name: 'metadata-collapse',
          component: _fromFormlyComponents.MetadataPanelWrapperComponent,
        },
      ],
      types: [
        {
          name: 'toggle-switch',
          component: _fromFormlyComponents.ToggleSwitchTypeComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'custom-date',
          component: _fromFormlyComponents.DateTypeComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
    MentionModule,
    PdfViewerModule,
    LineTruncationLibModule,
  ],
})
export class SharedModule {}

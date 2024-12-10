import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import * as _fromContainers from './_containers';
import * as _fromServices from './_services';
import * as _fromModals from './_modals';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GroupModalComponent } from './_modals/group-modal/group-modal.component';
import { RolesModalComponent } from './_modals/roles-modal/roles-modal.component';
import { CreateUserModalComponent } from './_modals/create-user-modal/create-user-modal.component';

@NgModule({
  declarations: [
    _fromContainers.UserManagementComponent,
    _fromContainers.ListComponent,
    _fromModals.ViewEditUserModalComponent,
    _fromModals.FailedCamundaUserDisplayComponent,
    GroupModalComponent,
    RolesModalComponent,
    CreateUserModalComponent,
  ],
  providers: [
    _fromServices.GroupService,
    _fromServices.RolesService,
    _fromServices.GroupRoleService,
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
    jqxGridModule,
    FormlyModule,
    FormsModule,
    NgbModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class UserManagementModule {}

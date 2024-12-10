import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as _fromContainers from './_containers';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [_fromContainers.LoginComponent],
  exports: [_fromContainers.LoginComponent],
  imports: [CommonModule, FormsModule, AuthRoutingModule, SharedModule],
})
export class AuthenticationModule {}

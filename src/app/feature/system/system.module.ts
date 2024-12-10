import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  imports: [CommonModule, SystemRoutingModule, TreeModule],
})
export class SystemModule {}

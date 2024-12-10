import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartProcessLmsComponent } from './start-process-lms/start-process-lms.component';
import { ProcessDefInitiationExcelRoutingModule } from './process-def-initiation-excel-routing.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [StartProcessLmsComponent],
  imports: [CommonModule, ProcessDefInitiationExcelRoutingModule, SharedModule],
})
export class ProcessDefInitiationExcelModule {}

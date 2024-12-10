import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartProcessLmsComponent } from '../Initiation-excel/start-process-lms/start-process-lms.component';

const routes: Routes = [{ path: 'lms', component: StartProcessLmsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessDefInitiationExcelRoutingModule {}

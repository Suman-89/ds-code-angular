import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessLayoutModule } from './layout/process-layout.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => ProcessLayoutModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessRoutingModule {}

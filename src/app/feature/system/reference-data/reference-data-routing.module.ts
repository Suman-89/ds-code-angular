import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as _fromContainers from './_containers';

const routes: Routes = [
  {path : '' , component : _fromContainers.ReferenceDataLandingComponent,
        children: [
          // {path: '', redirectTo: 'dashboard' , pathMatch: 'full'},
          {path: '', component: _fromContainers.DashboardComponent},
          {path: ':refdataname/:refdatacode/:refid', component: _fromContainers.RefDataViewComponent}
        ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferenceDataRoutingModule { }

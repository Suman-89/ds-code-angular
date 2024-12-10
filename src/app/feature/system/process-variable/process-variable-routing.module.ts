import { AddVariableComponent } from './_modal/add-variable/add-variable.component';
import { ViewVariableComponent } from './_components/view-variable/view-variable.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', component: ViewVariableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessVariableRoutingModule { }

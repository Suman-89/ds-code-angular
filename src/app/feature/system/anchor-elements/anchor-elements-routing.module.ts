import { AddAnchorElementsComponent, } from './_components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAnchorElementsComponent } from './_containers';


const routes: Routes = [
  {path: '', component: ViewAnchorElementsComponent },
  {path: 'add-anchor', component: AddAnchorElementsComponent},
  {path: 'edit-anchor/:key', component: AddAnchorElementsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessFormsRoutingModule { }

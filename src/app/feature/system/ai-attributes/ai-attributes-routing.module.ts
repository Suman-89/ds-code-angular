import { AddProcessFormsComponent, } from './_components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditAiAttributesComponent,  ViewAiAttributesComponent } from './_containers';


const routes: Routes = [
  {path: '', component: ViewAiAttributesComponent },
  {path: 'add-forms', component: AddProcessFormsComponent},
  {path: 'edit-form/:key', component: AddProcessFormsComponent},
  {path: 'copy-form/:key', component: AddProcessFormsComponent},
  {path: 'change-attributes/view/:id', component: AddEditAiAttributesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessFormsRoutingModule { }

import { AddProcessFormsComponent } from './_components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AddEditProcdefFormComponent,
  ViewProcessFormsComponent,
} from './_containers';

const routes: Routes = [
  { path: '', component: ViewProcessFormsComponent },
  { path: 'definition-forms', component: ViewProcessFormsComponent },
  { path: 'add-forms', component: AddProcessFormsComponent },
  { path: 'edit-form/:key', component: AddProcessFormsComponent },
  { path: 'copy-form/:key', component: AddProcessFormsComponent },
  { path: 'definition-forms/add', component: AddEditProcdefFormComponent },
  { path: 'definition-forms/edit/:id', component: AddEditProcdefFormComponent },
  { path: 'definition-forms/copy/:id', component: AddEditProcdefFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessFormsRoutingModule {}

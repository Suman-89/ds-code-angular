import { AddProcessFormsComponent, } from './_components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditGeneralSettingsComponent,  ViewProcessFormsComponent } from './_containers';


const routes: Routes = [
  {path: '', component: AddEditGeneralSettingsComponent },
  {path: 'definition-forms', component: ViewProcessFormsComponent },
  {path: 'add-forms', component: AddProcessFormsComponent},
  {path: 'edit-form/:key', component: AddProcessFormsComponent},
  {path: 'copy-form/:key', component: AddProcessFormsComponent},
  {path: 'general-settings/add', component: AddEditGeneralSettingsComponent},
  {path: 'general-settings/:id', component: AddEditGeneralSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessFormsRoutingModule { }

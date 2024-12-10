import * as _fromComponents from './_components/';
import * as _fromContainers from './_containers/';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', component: _fromComponents.ContentLayoutComponent, children: [
    {path: '', component: _fromContainers.TemplateListComponent},
    {path: 'add', component: _fromContainers.AddEditContentTemplateComponent},
    {path: 'edit/:tid', component: _fromContainers.AddEditContentTemplateComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentManagementRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as _fromContainers from './_containers';

const routes: Routes = [
  {
    path: '',
    component: _fromContainers.CompanyLandingComponent,
    children: [
      { path: '', redirectTo: 'companies', pathMatch: 'full' },
      {
        path: 'companies',
        component: _fromContainers.CompanyDashboardComponent,
      },
      {
        path: 'contracting-entities',
        component: _fromContainers.CompanyDashboardComponent,
      },
      {
        path: 'country-management',
        component: _fromContainers.CompanyDashboardComponent,
      },
      {
        path: 'companies/add-company',
        component: _fromContainers.CompanyActionComponent,
      },
      {
        path: 'companies/edit-company/:id',
        component: _fromContainers.CompanyActionComponent,
      },
      {
        path: 'contracting-entities/add-contract-entities',
        component: _fromContainers.ContractingEntitiesComponent,
      },
      {
        path: 'contracting-entities/edit-contract-entities/:id',
        component: _fromContainers.ContractingEntitiesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}

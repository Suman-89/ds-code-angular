import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as _fromContainers from './_containers';
import * as _fromComponents from './_components';
import * as _fromCoreGuards from '../../../core/_guards';
import { BltPricingConfigComponent } from '../../blt/_containers/blt-pricing-config/blt-pricing-config.component';
import { BltPriceListComponent } from '../../blt/_containers/blt-price-list/blt-price-list.component';
import { ProcessDefInitiationModule } from '../initiation/process-def-initiation.module';
import { ProcessDefInitiationExcelModule } from '../Initiation-excel/process-def-initiation-excel.module';

const routes: Routes = [
  {
    path: '',
    component: _fromContainers.ProcessLandingComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        component: _fromContainers.DashboardComponent,
        canActivate: [_fromCoreGuards.RoleGuard],
      },
      {
        path : 'blt-price-list',
        component : BltPriceListComponent
      },
      {
        path : 'blt-price-config',
        component : BltPricingConfigComponent
      },
      { path: 'my-queue', component: _fromContainers.TasklistComponent },
      { path: 'group', component: _fromContainers.TasklistComponent },
      { path: 'contracts', component: _fromContainers.TasklistComponent },
      {
        path: 'all-tasks',
        component: _fromContainers.ContractSearchResultComponent,
      },

      { path: 'my-comments', component: _fromContainers.TasklistComponent },
      {
        path: 'view-task/:taskId',
        component: _fromContainers.ViewTaskComponent,
      },
      {
        path: 'compare-task',
        component: _fromContainers.CompareTaskComponent,
      },
      {
        path: 'view-contract/:contractId',
        component: _fromContainers.ViewContractComponent,
      },
      {
        path: 'next/:businessKey/:routeCheck',
        component: _fromComponents.NextTaskComponent,
      },
      {
        path: 'next/:procId/:businessKey/:routeCheck',
        component: _fromComponents.NextTaskComponent,
      },
      {
        path: 'next/:procId/:businessKey/:routeCheck/:formKeyForLegalCheck/:taskIdForLegalCheck',
        component: _fromComponents.NextTaskComponent,
      },
      { path: 'initiate', loadChildren: () => ProcessDefInitiationModule },
      {
        path: 'initiate-excel',
        loadChildren: () => ProcessDefInitiationExcelModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessLayoutRoutingModule {}

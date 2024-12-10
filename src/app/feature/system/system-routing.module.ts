import { ContentManagementModule } from './content-management/content-management.module';
import { ProcessFormsModule } from './process-forms/process-forms.module';
import { ProcessVariableModule } from './process-variable/process-variable.module';
import { ReferenceDataModule } from './reference-data/reference-data.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralSettingsModule } from './general-settings/general-settings.module';
import { AiAttributesModule } from './ai-attributes/ai-attributes.module';
import { AnchorElementsModule } from './anchor-elements/anchor-elements.module';

const routes: Routes = [
  { path: '', redirectTo: 'process-variable', pathMatch: 'full' },
  { path: 'process-variable', loadChildren: () => ProcessVariableModule },
  { path: 'process-forms', loadChildren: () => ProcessFormsModule },
  { path: 'process-def-forms', loadChildren: () => ProcessFormsModule },
  { path: 'reference-data', loadChildren: () => ReferenceDataModule },
  { path: 'content-management', loadChildren: () => ContentManagementModule },
  { path: 'general-settings', loadChildren: () => GeneralSettingsModule },
  { path: 'ai-attributes', loadChildren: () => AiAttributesModule },
  { path: 'anchor-elements', loadChildren: () =>  AnchorElementsModule},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}

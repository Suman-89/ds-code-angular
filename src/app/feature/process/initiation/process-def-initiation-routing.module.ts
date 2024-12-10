import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import * as _fromComponents from './_components';
import * as _fromContainers from './_containers';

import * as _fromTaihoContainers from '../initiation/taiho/_containers' ;
import * as _fromTaihoComponents from '../initiation/taiho/_components' ;
import * as _fromIbasisComponents from '../initiation/ibasis/_containers';
import * as _fromEmployeeComponents from '../initiation/employee/_containers'


const routes: Routes = [
    // { path: 'leave', component: _fromContainers.StartProcessComponent },
    { path: ':process', component: _fromContainers.InitiationLandingComponent }
    // { path: 'taiho', component: _fromTaihoContainers.StartTaihoProcessComponent},
    // { path: '', component: _fromIbasisComponents.StartProcessIbasisComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessDefInitiationRoutingModule {}
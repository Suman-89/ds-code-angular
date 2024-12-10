import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as _fromContainers from './_containers';

const routes: Routes = [
    {
        path: '', component: _fromContainers.UserManagementComponent, children: [
            {path: '', redirectTo: 'users', pathMatch: 'full'}, // users = type
            { path: ':type', component: _fromContainers.ListComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from './feature/layout/layout.module';
import { AuthenticationModule } from './feature/authentication/authentication.module';
import { VmtCommentsComponent } from './external/vmt-comments/vmt-comments.component';
import { VmtDocumentsComponent } from './external/vmt-documents/vmt-documents.component';

const routes: Routes = [
  { path: ':businessKey/comments', component: VmtCommentsComponent },
  { path: ':businessKey/documents', component: VmtDocumentsComponent },
  { path: '', loadChildren: () => AuthenticationModule },
  { path: 'landing', loadChildren: () => LayoutModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

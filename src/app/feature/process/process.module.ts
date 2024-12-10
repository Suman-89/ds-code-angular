import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProcessRoutingModule } from './process-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [CommonModule, SharedModule, ProcessRoutingModule, PdfViewerModule],
})
export class ProcessModule {}

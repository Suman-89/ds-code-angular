import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDateParserFormatter, NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import * as _fromServices from './_services';
import * as _fromGuards from './_guards';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModule
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: _fromServices.NgbDateCustomParserFormatter },
    { provide: NgbDateAdapter, useClass: _fromServices.NgbUTCStringAdapter },
    _fromGuards.RoleGuard

  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() core: CoreModule ){
    if (core) {
        throw new Error('You should import core module only in the root module') ;
    }
  }

}

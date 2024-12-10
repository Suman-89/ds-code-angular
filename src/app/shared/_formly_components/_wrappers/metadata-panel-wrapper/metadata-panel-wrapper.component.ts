import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-metadata-accordion',
  template: `
    <div class="card mt-2">
      <div [hidden]="to.label == 'default'" class="collapse-header card-header">{{ to.label }}</div>
      <div class="card-body">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `,
  styleUrls:['./metadata-panel-wrapper.component.scss']
})
export class MetadataPanelWrapperComponent extends FieldWrapper {
}
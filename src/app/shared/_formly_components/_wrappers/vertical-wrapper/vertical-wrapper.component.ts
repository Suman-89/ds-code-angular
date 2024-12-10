import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
    selector: 'formly-vertical-wrapper',
    styles: [
        `
      .infoIcon{
        width: 14px;
        cursor: pointer;
        margin-left: 5px;
      }
      `
    ],
    template: `
    <div class="form-group row" style="margin: 0px 0px 10px 0px">
      <label [attr.for]="id" class="col-sm-12 verticalLabel">
        {{ to.label }}
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
        <img *ngIf="to.tooltip" container="body" src="./assets/images/info-secondary.png" class="infoIcon" placement="top" [ngbTooltip]="to.tooltip">
      </label>
      <div class="col-sm-12 inputField">
        <ng-template #fieldComponent></ng-template>
      </div>

      <!-- <div *ngIf="showError" class="col-sm-3 invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div> -->
    </div>
  `,
})
export class FormlyVerticalWrapper extends FieldWrapper {
}

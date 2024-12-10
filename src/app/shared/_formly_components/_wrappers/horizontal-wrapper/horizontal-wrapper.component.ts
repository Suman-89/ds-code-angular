import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-horizontal-wrapper',
  styles: [
    `
      .infoIcon {
        width: 14px;
        height: 16px;
        cursor: pointer;
        margin-left: 6px;
        vertical-align: top;
        margin-top: 5px;
      }

      .inputAndinfoIcon {
        display: flex;
        flex-direction: row;
      }
    `,
  ],
  template: `
    <div class="form-group row" style="margin: 0px 0px 10px 0px">
      <div
        class="col-sm-5 inputAndinfoIcon inputField"
        style="padding-right: 10px !important "
      >
        <label
          [attr.for]="id"
          container="body"
          placement="top"
          [ngbTooltip]="to.label"
          class="horizontalLabel"
        >
          {{ to.label }}
          <ng-container *ngIf="to.required && to.hideRequiredMarker !== true"
            >*</ng-container
          >
        </label>
        <img
          *ngIf="to.tooltip"
          container="body"
          src="./assets/images/info-secondary.png"
          class="infoIcon"
          placement="top"
          [ngbTooltip]="to.tooltip"
        />
      </div>
      <div class="col-sm-7 inputField" style="padding-left: 10px !important">
        <ng-template #fieldComponent></ng-template>
      </div>

      <!-- <div *ngIf="showError" class="col-sm-3 invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div> -->
    </div>
  `,
})
export class FormlyHorizontalWrapper extends FieldWrapper {}

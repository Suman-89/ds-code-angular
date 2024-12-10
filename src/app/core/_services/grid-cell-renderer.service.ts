import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ResponseModel } from 'src/app/core/_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class gridCellRenderer {
  constructor(private apiSvc: ApiService) {}

  interestedIconRenderer = (
    row: number,
    datafield: string,
    value: any
  ): string => {
    if (value === 'Interested') {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><i class="fa fa-thumbs-up fa-lg" aria-hidden="true" style="color: #debb0b;"></i></div>`;
    }
    if (value === 'Not Interested') {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><i class="fa fa-thumbs-down fa-lg" aria-hidden="true" style="color: #debb0b;"></i></div>`;
    }
  };

  attachmentIconRenderer = (
    row: number,
    datafield: string,
    value: any
  ): string => {
    if (value) {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><i class="fa fa-paperclip fa-lg" aria-hidden="true"></i></div>`;
    } else {
      return ``;
    }
  };

  msgStatusRenderer = (row: number, datafield: string, value: any): string => {
    if (value === 'Read' || value === 'Last Message Read') {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><img style="width: 15px; height: 15px;" src="./assets/icons/read.svg" alt="read"/></div>`;
    }
    if (value === 'Delivered' || value === 'Last Message Delivered') {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><img style="width: 15px; height: 15px;" src="./assets/icons/received.svg" alt="delivered"/></div>`;
    }
    if (value === 'Last Message Sent' || value === 'Sent') {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><img style="width: 14px; height: 14px;" src="./assets/icons/send.svg" alt="send"/></div>`;
    }
    if (value === 'Failed' || value === 'Last Message Failed') {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="color: #ff3300;"></i></div>`;
    }
  };

  unreadWhatsappMsgCellRenderer = (
    row: number,
    datafield: string,
    value: any
  ) => {
    if (value !== '0' && value) {
      return `<div class="emojiClass" style="width: 100%; height: 100%;"><div style="position: relative; z-index: 0; padding: 0 7px;">
      <i class="fa fa-whatsapp fa-2x" aria-hidden="true" style="color: #2adb59;"></i><div style="font-size: 8px; background-color: #ff3300; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; justify-content: center; align-items: center;position: absolute; z-index: 1; top: 0; right: 0;">${value}</div>
      </div></div>`;
    }

    if (value === '0') {
      return ``;
    }
  };

  candidate1stResponseCellRenderer = (
    row: number,
    datafield: string,
    value: any
  ) => {
    if (value === true) {
      return `<div class="emojiClass" style="width: 100%; height: 100%;">
      <i class="fa fa-check-circle fa-lg" aria-hidden="true" style="color: #2adb59;"></i></div>`;
    }
    if (value === false) {
      return `<div class="emojiClass" style="width: 100%; height: 100%;">
      <i class="fa fa-times-circle fa-lg" aria-hidden="true" style="color: #ff3300;"></i></div>`;
    }
  };

  stoppedByCandidateCellRenderer = (
    row: number,
    datafield: string,
    value: any
  ) => {
    if (value === true) {
      return `<div class="emojiClass" style="width: 100%; height: 100%;">
      <i class="fa fa-ban fa-lg" aria-hidden="true" style="color: #ff3300;"></i></div>`;
    } else {
      return ``;
    }
  };

  callbackIconCellRenderer = (row: number, datafield: string, value: any) => {
    if (value === true) {
      return `<div class="emojiClass" style="width: 100%; height: 100%;">
      <i class="fa fa-phone fa-lg" aria-hidden="true" style="color: #041C44;"></i></div>`;
    } else {
      return ``;
    }
  };

  manualModeCellRenderer = (row: number, datafield: string, value: any) => {
    if (value === true) {
      return `<div class="emojiClass" style="width: 100%; height: 100%;">
      <img src="./assets/icons/Human.webp" style="width: 25px; height: 25px;" alt="Human" />
      </div>`;
    } else {
      return `<div class="emojiClass" style="width: 100%; height: 100%;">
      <img src="./assets/icons/Bot.svg" style="width: 25px; height: 25px;" alt="Bot" />
      </div>`;
    }
  };

  imagerenderer = (row: number, datafield: string, value: any): string => {
    // console.log('IMAGE ', value);
    let score = value;
    let scoreColor = 'red';
    let borderStyle = `border:1.4px solid var(--secondaryColor);border-radius:20px`;
    const commonStyle =
      'display:flex;justify-content:center;align-items:center;text-align:center;transform:translateY(3px);font-weight:400';
    if (value.length <= 2 && isNaN(value)) {
      return `<div style="${commonStyle};font-size:16px;">
          <strong class="text-primary" style="${commonStyle};transform:translateY(0px);height:30px;width:30px;${borderStyle}" >${value}</strong>
        </div>`;
    } else if (!isNaN(value)) {
      score = !value || value <= 0 ? 0 : Math.floor(value);
      if (score <= 30) {
        scoreColor = 'red';
      } else if (score > 30) {
        scoreColor = '#FFBF00';
      }
      if (score >= 70) {
        scoreColor = 'green';
      }
      if (score >= 90 && score <= 100) {
        scoreColor = 'blue';
      }
      if (score > 100) {
        score = 100;
        scoreColor = 'blue';
      }
      return `<div style="${commonStyle};font-size:12px;">
          <strong class="text-primary" style="${commonStyle};transform:translateY(0px);height:32px;width:32px;border-radius:50px;border:1.4px solid ${scoreColor}" >${score}%</strong>
        </div>`;
    } else {
      return `<div style="${commonStyle}">
          <img style="${borderStyle}" height="30" width="30" src="${value}" />
        </div>`;
    }
  };
}

import { UserGroupsEnum } from 'src/app/core/_models';

export class GlobalUpdateConstant {
  variableNames = ['gsdRequiredAction', 'specialNotes', 'status'];

  productManagementGrps = [
    UserGroupsEnum.PM_IOT,
    UserGroupsEnum.PM_MGR,
    UserGroupsEnum.PM_MOBILE,
    UserGroupsEnum.PM_SMS,
    UserGroupsEnum.PM_VOICE,
    UserGroupsEnum.PRODUCTION_MANAGEMENT,
  ];
}

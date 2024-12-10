export interface ProcDefModel {
  processname: string;
  description: string;
  processlabel: string;
  variables: string[];
  key: {
    variablename: string;
    prefix: string;
  };
  gridsettings: [
    {
      type: string;
      columns: GridSetterColumnModel[];
    }
  ];
  authorization: {
    groups: [
      {
        key: string;
        initiation: boolean;
        showgroupq: boolean;
      }
    ];
  };
}

export interface GridSetterColumnModel {
  header: string;
  key: string;
  width: string;
  filtertype: string;
  cellsformat: string;
  disabled: boolean;
  hidden: boolean;
  common: boolean;
  mobile: string;
  tablet: string;
}

export enum GridTypeSetterEnum {
  BASIC = 'BASIC',
  MYQ = 'MYQ',
  GROUPQ = 'GROUPQ',
  ALLPROCESS = 'ALLPROCESS',
  ALLTASKS = 'ALLTASKS',
  COMPARE = 'COMPARE',
  INFO='INFO'
}

export enum GridSettingTypeEnum {
  GENERAL_SETTINGS = 'GENERAL_SETTINGS',
  PROC_DEF_DEFAULT = 'PROC_DEF_DEFAULT',
  PROC_DEF_SPECIFIC = 'PROC_DEF_SPECIFIC',
}

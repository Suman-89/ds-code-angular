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
}

export enum GridTypeSetterEnum {
  BASIC = 'BASIC',
  MYQ = 'MYQ',
  GROUPQ = 'GROUPQ',
  ALLPROCESS = 'ALLPROCESS',
  ALLTASKS = 'ALLTASKS',
}

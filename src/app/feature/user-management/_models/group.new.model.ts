import { RolesModel } from '.';

export interface GroupNewModel {
  id: number;
  name: string;
  description: string;
  groupid: string;
  rolevm?: RolesModel[];
}

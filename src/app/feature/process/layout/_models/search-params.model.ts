import { Interface } from "readline";

export interface SearchParamModel {
  group: string;
  user: string;
  inprocess: boolean;
  contractstatus?: number;
}
import { ReferenceDataModel } from 'src/app/core/_models';

export interface AddVarDropdownModel {
  sources?: string[];
  uiElementTypes?: string[] ;
  category?: string[] ;
  dataTypes: string[] ;
  refData: ReferenceDataModel[] ;
}

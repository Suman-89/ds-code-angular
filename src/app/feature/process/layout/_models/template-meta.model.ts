import { ProcessVariableModel, TypeAheadModel } from 'src/app/core/_models';

export interface TemplateMetaRequestModel {
    contracttype: TempModel[],
    products: TempModel[],
    metadata?: Map<string, any>
}

interface TempModel {
    name: string
} 

export interface TemplateMetaResponseModel {
    shortname: string,
    bookmarks: ProcessVariableModel[],
    metadata: ProcessVariableModel[]
}
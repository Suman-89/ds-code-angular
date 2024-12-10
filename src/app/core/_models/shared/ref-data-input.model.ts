export interface RefOptions {
    isFirstLevelTypeahead?: boolean,
    isFirstLevelRequired?: boolean,
    isFirstLevelMultiSelect: boolean,
    showSecondLevel?: boolean,
    isSecondLevelMultiSelect?: boolean,
    isSecondLevelTypeahead?: boolean,
    isSecondLevelRequired?: boolean,
}

export interface RefdataFormModel {
    firstLevelInstance: any[],
    secondLevelInstance?: any[]
}

export interface Refdata {
    code: string,
    name: string,
    extra?: string
}
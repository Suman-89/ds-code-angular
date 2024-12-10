export interface SideNavElementModel {
    id: string,
    name: string,
    path?: string,
    children?: SideNavElementModel[],
    hasChildren?: boolean,
    collapsed?: boolean,
    disabled?: boolean,
    selected?: boolean
}
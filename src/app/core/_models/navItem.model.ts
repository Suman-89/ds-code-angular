export class NavItemModel {
    itemId: string;
    itemName: string;
    itemIconPath?: string;
    itemIconClass?:string;
    itemChildren?: NavItemModel[];
    routePath?:string;
    visibleFor?:string[];
    isExactRouteMatch?:boolean;
}
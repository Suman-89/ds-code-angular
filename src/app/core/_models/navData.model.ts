import { NavItemModel } from './navItem.model';

export class NavDataModel {
    logoPath?:string;
    collapsedLogoPath?:string;
    selectedOption?:NavItemModel;
    navOptions?: NavItemModel[];
}
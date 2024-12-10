export class NavStyleModel{
    backgroundColor?:string;
    floatbackgroundColor?:string;
    iconColor?:string;
    borderColor?:string;
    textColor?:string;
    iconHeight?:number;
    boxshadow: string;

    selectedBackground?: string;
    selectedTextColor?: string;
    selectedIconColor:string;
    selectedBorderColor:string;

    borderAnimation?: boolean;
    
    collapseIconPath?: string;
    collapseIconClass?: string;
    collapseIconPlacement?: string;

    collapsible: boolean;
}
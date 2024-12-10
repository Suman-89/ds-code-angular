export class SidenavModel {
  itemId: string ;
  itemName: string;
  itemIconPath: string;
  itemChildren?: SidenavModel[] ;
  routePath?: string;
}

// "itemId": "itemName": "itemIconPath": "itemChildren":

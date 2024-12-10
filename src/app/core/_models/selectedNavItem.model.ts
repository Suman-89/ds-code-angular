export class SelectedNavItemModel {
  itemId: string;
  itemName: string;
  itemIconPath?: string;
  itemIconClass?: string;
  itemChild?: SelectedNavItemModel;
  routePath: string;
  visibleFor?: string[];
  itemChildren?: any;
}

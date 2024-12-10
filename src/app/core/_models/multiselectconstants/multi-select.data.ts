export class NgbMultiSelectConstats{
  dropdownSingleSelectSettings = {
  singleSelection: true,
  closeDropDownOnSelection: true,
  limitSelection: 1,
  itemsShowLimit: 2,
  allowSearchFilter: true
  };
  dropdownMultiSelectSettings = {
    singleSelection: false,
    closeDropDownOnSelection: false,
    itemsShowLimit: 2,
    allowSearchFilter: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    };
  options = {
  isFirstLevelTypeahead : false,
  isFirstLevelRequired : true,
  isFirstLevelMultiSelect: true,
  showSecondLevel : false,
  isSecondLevelMultiSelect : false,
  isSecondLevelTypeahead : false,
  isSecondLevelRequired : false
  };
}

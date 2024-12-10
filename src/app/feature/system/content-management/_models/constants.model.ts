import { OperatorTypes } from "src/app/core/_models";

export class Constants {
    static operatorList = {
        'String': [OperatorTypes.CONTAINS, OperatorTypes.DOES_NOT_CONTAIN, OperatorTypes.EQUALS] ,
        'Dropdown': [OperatorTypes.EQUALS, OperatorTypes.DOES_NOT_EQUALS] ,
        'Date': [OperatorTypes.BETWEEN, OperatorTypes.GREATER_THAN, OperatorTypes.LESS_THAN],
        'Number': [OperatorTypes.EQUALS, OperatorTypes.DOES_NOT_EQUALS, OperatorTypes.GREATER_THAN, OperatorTypes.LESS_THAN],
        // for billin interval and payment interval number operator rule is used ,
        'Default': [OperatorTypes.EQUALS, OperatorTypes.DOES_NOT_EQUALS]
      }
}


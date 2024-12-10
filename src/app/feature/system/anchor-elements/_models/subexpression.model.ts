import { ExpModel } from './exp.model'
export class SubexpressionModel{
    variableName:string;
    expressionArray:ExpModel[];
    expressionString:string;
    isPredicate?: boolean;
}
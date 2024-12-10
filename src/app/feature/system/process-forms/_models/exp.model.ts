import { OperationsModel } from './operations.model'
export class ExpModel{
    id:number;
    operations?:OperationsModel[];
    children?:ExpModel[];
}


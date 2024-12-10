import { InitiationTaskModel } from "./initiation-task.model";

export interface InitiationModel extends InitiationTaskModel {
    invoiceNumber: string; 
    invoiceDate: string;
    invoiceAmount?: number;
    poNumber?: string;
    poDate: string;
    poTotalAmount?: number ;
    poAmountConsumedTillDate: number;
    totalPoAmountLeft: number;
    poBusinessOwner: string;
    poBusinessGroup: string;
    medicalAffairsUser: string;
 
    

 }
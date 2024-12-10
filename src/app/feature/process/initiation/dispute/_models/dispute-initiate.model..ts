import { InitiationTaskModel } from "../../_models";

export interface DisputeInitiateModel extends InitiationTaskModel{
    partnerType
    customerDisputeType
    vendorDisputeType
    customerSapNumber
    vendorSapNumber
    disputedInvoiceNumber
    disputedInvoiceDate
    invoiceAmount
    disputedAmount
    trafficPeriodFrom
    trafficPeriodTo
}
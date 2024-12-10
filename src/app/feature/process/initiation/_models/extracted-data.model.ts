export interface ExtractedDataModel {
  purchase_order: any;
  invoice_id: string;
  total_amount?: string;
  total_po_value?: string;
  invoice_date?: string;
  aadhaarId?: string;
  name?: string;
  vendor_name?: string;
  companyId?: any;
  po_date?: string;
  amt_consumed_till_date?: string;
  amount_left?: string;
  business_owner?: string;
  business_group?: string;
  medicalAffairsUser?: string;
  companyCode?: string;
}

// invoice_date: "15-0CT-20 "
// invoice_id: "4278829 "
// purchase_order: "BPO# 2019773 "
// total_amount: "66.39 "

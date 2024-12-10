import { Injectable } from '@angular/core';
import { GridToolbarType } from '../_models';

@Injectable({
  providedIn: 'root',
})
export class GridSourceService {
  gridToolbarType = GridToolbarType;

  sourceConfig = {};

  constructor() {
    this.setSourceConfig();
  }

  setSourceConfig(): void {
    this.sourceConfig[this.gridToolbarType.worklist] = {
      sortcolumn: 'created',
      sortdirection: 'desc',
      dataFields: [
        {
          name: 'contractInitiationTime',
          map: 'contractInitiationTime',
          type: 'date',
        },

        { name: 'created', type: 'date' },
        { name: 'initiator', type: 'string' },
        {
          name: 'initiatorname',
          map: 'initiatedbyfullname',
          type: 'string',
        },
        { name: 'name', type: 'string' },
        { name: 'id', type: 'string' },
        { name: 'processInstanceId', type: 'string' },
        { name: 'country', type: 'string' },
        { name: 'assignee', type: 'string' },
        { name: 'assigneeName', type: 'string' },
        { name: 'groupid', type: 'string' },
        { name: 'groupname', type: 'string', map: 'groupname' },
        { name: 'taskname', map: 'name' },
        { name: 'elapsedhour', type: 'number' },
        { name: 'elapseddays', type: 'number' },
        // {
        //   name: 'issueType',
        //   map: 'initiationfields>issueType',
        //   type: 'string',
        // },
        // {
        //   name: 'ticketId',
        //   map: 'initiationfields>ticketId',
        //   type: 'string',
        // },
        // {
        //   name: 'bookingdate',
        //   map: 'initiationfields>ticketCreationDate',
        //   type: 'string',
        // },
        // {
        //   name: 'dealType',
        //   map: 'initiationfields>dealType',
        //   type: 'string',
        // },
        // {
        //   name: 'contentCreationUser',
        //   map: 'initiationfields>contentCreationUser',
        //   type: 'string',
        // },
        // {
        //   name: 'contentCreationUserName',
        //   map: 'initiationfields>contentCreationUserName',
        //   type: 'string',
        // },
        // {
        //   name: 'courseDomain',
        //   map: 'initiationfields>courseDomain',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusAssignments',
        //   map: 'initiationfields>contentStatusAssignments',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusEndOfSessionQuiz',
        //   map: 'initiationfields>contentStatusEndOfSessionQuiz',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusPostRead',
        //   map: 'initiationfields>contentStatusPostRead',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusPreRead',
        //   map: 'initiationfields>contentStatusPreRead',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusSelfPacedContent',
        //   map: 'initiationfields>contentStatusSelfPacedContent',
        //   type: 'string',
        // },

        // {
        //   name: 'contentStatusSessionContent',
        //   map: 'initiationfields>contentStatusSessionContent',
        //   type: 'string',
        // },

        // {
        //   name: 'course',
        //   map: 'initiationfields>course',
        //   type: 'string',
        // },
        // {
        //   name: 'module',
        //   map: 'initiationfields>module',
        //   type: 'string',
        // },
        // {
        //   name: 'dealCompany',
        //   map: 'initiationfields>dealCompany',
        //   type: 'string',
        // },
        // {
        //   name: 'dealId',
        //   map: 'initiationfields>dealId',
        //   type: 'string',
        // },
        // {
        //   name: 'amendmentId',
        //   map: 'initiationfields>amendmentId',
        //   type: 'string',
        // },
        // {
        //   name: 'dealDescription',
        //   map: 'initiationfields>dealDescription',
        //   type: 'string',
        // },
        // {
        //   name: 'contractType',
        //   map: 'initiationfields>contractType',
        //   type: 'string',
        // },
        // {
        //   name: 'contractTypeSecondLevel',
        //   map: 'initiationfields>contractTypeSecondLevel',
        //   type: 'string',
        // },
        // { name: 'product', map: 'initiationfields>product', type: 'string' },
        // {
        //   name: 'hrTicketType',
        //   map: 'initiationfields>hrTicketType',
        //   type: 'string',
        // },
        // {
        //   name: 'productSecondLevel',
        //   map: 'initiationfields>productSecondLevel',
        //   type: 'string',
        // },

        // {
        //   name: 'contentCreationUser',
        //   map: 'initiationfields>contentCreationUser',
        //   type: 'string',
        // },
        // {
        //   name: 'contentCreationUserName',
        //   map: 'initiationfields>contentCreationUserName',
        //   type: 'string',
        // },
        // {
        //   name: 'courseDomain',
        //   map: 'initiationfields>courseDomain',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusAssignments',
        //   map: 'initiationfields>contentStatusAssignments',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusEndOfSessionQuiz',
        //   map: 'initiationfields>contentStatusEndOfSessionQuiz',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusPostRead',
        //   map: 'initiationfields>contentStatusPostRead',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusPreRead',
        //   map: 'initiationfields>contentStatusPreRead',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusSelfPacedContent',
        //   map: 'initiationfields>contentStatusSelfPacedContent',
        //   type: 'string',
        // },

        // {
        //   name: 'contentStatusSessionContent',
        //   map: 'initiationfields>contentStatusSessionContent',
        //   type: 'string',
        // },
        // {
        //   name: 'course',
        //   map: 'initiationfields>course',
        //   type: 'string',
        // },
        // {
        //   name: 'module',
        //   map: 'initiationfields>module',
        //   type: 'string',
        // },
        // {
        //   name: 'partnerLegalName',
        //   map: 'initiationfields>partnerLegalName',
        //   type: 'string',
        // },
        // {
        //   name: 'businessKey',
        //   map: 'initiationfields>businessKey',
        //   type: 'string',
        // },
        // { name: 'country', map: 'initiationfields>country', type: 'string' },
        // { name: 'totalContractValue', type: 'string' },
        // {
        //   name: 'casePriority',
        //   map: 'initiationfields>casePriority',
        //   type: 'string',
        // },
        // {
        //   name: 'ibasisContractingEntity',
        //   map: 'initiationfields>ibasisContractingEntity',
        // },
        // { name: 'companyCode', map: 'initiationfields>companyCode' },
        // {
        //   name: 'companyName',
        //   map: 'initiationfields>companyName',
        //   type: 'string',
        // },
        // {
        //   name: 'ticketType',
        //   map: 'initiationfields>ticketType',
        //   type: 'string',
        // },
        // {
        //   name: 'customerDisputeType',
        //   map: 'initiationfields>customerDisputeType',
        // },
        // {
        //   name: 'customerSapNumber',
        //   map: 'initiationfields>customerSapNumber',
        // },
        // { name: 'disputedAmount', map: 'initiationfields>disputedAmount' },
        // {
        //   name: 'disputedInvoiceDate',
        //   map: 'initiationfields>disputedInvoiceDate',
        // },
        // {
        //   name: 'disputedInvoiceNumber',
        //   map: 'initiationfields>disputedInvoiceNumber',
        // },

        // { name: 'partnerType', map: 'initiationfields>partnerType' },
        // {
        //   name: 'trafficPeriodFrom',
        //   map: 'initiationfields>trafficPeriodFrom',
        // },
        // { name: 'trafficPeriodTo', map: 'initiationfields>trafficPeriodTo' },
        // {
        //   name: 'vendorDisputeType',
        //   map: 'initiationfields>vendorDisputeType',
        // },
        // { name: 'vendorSapNumber', map: 'initiationfields>vendorSapNumber' },
        // { name: 'ibasisContractingEntityLegalName', type: 'string' },
        // {
        //   name: 'hrTicketIssueFaced',
        //   map: 'initiationfields>hrTicketIssueFaced',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketNumber',
        //   map: 'initiationfields>hrTicketNumber',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketQuery',
        //   map: 'initiationfields>hrTicketQuery',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketSource',
        //   map: 'initiationfields>hrTicketSource',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketType',
        //   map: 'initiationfields>hrTicketType',
        //   type: 'string',
        // },
        // {
        //   name: 'medicalAffairsUser',
        //   map: 'initiationfields>medicalAffairsUser',
        //   type: 'string',
        // },
        // {
        //   name: 'poTotalAmount',
        //   map: 'initiationfields>poTotalAmount',
        //   type: 'string',
        // },
        // { name: 'invoiceAmount', map: 'initiationfields>invoiceAmount' },
        // { name: 'invoiceNumber', map: 'initiationfields>invoiceNumber' },
        // {
        //   name: 'invoiceDate',
        //   map: 'initiationfields>invoiceDate',
        //   type: 'string',
        // },
        // {
        //   name: 'poAmountConsumedTillDate',
        //   map: 'initiationfields>poAmountConsumedTillDate',
        //   type: 'string',
        // },
        // {
        //   name: 'poNumber',
        //   map: 'initiationfields>poNumber',
        //   type: 'string',
        // },
        // {
        //   name: 'totalContractValue',
        //   map: 'initiationfields>totalContractValue',
        //   type: 'string',
        // },
        // {
        //   name: 'totalPoAmountLeft',
        //   map: 'initiationfields>totalPoAmountLeft',
        //   type: 'string',
        // },
        // // mortgage start -----
        // {
        //   name: 'area',
        //   map: 'initiationfields>area',
        //   type: 'string',
        // },
        // {
        //   name: 'city',
        //   map: 'initiationfields>city',
        //   type: 'string',
        // },
        // {
        //   name: 'county',
        //   map: 'initiationfields>county',
        //   type: 'string',
        // },
        // {
        //   name: 'borrower',
        //   map: 'initiationfields>borrower',
        //   type: 'string',
        // },
        // {
        //   name: 'propertyAddress',
        //   map: 'initiationfields>propertyAddress',
        //   type: 'string',
        // },
        // {
        //   name: 'neighbourhoodName',
        //   map: 'initiationfields>neighbourhoodName',
        //   type: 'string',
        // },
        // {
        //   name: 'yearBuilt',
        //   map: 'initiationfields>yearBuilt',
        //   type: 'string',
        // },
        // {
        //   name: 'mortgageId',
        //   map: 'initiationfields>mortgageId',
        //   type: 'string',
        // },
        // {
        //   name: 'state',
        //   map: 'initiationfields>state',
        //   type: 'string',
        // },
        // mortgage end

        // email process start
        // {
        //   name: 'emailBody',
        //   map: 'initiationfields>emailBody',
        //   type: 'string',
        // },
        // {
        //   name: 'emailDate',
        //   map: 'initiationfields>emailDate',
        //   type: 'date',
        // },
        // {
        //   name: 'emailRecipient',
        //   map: 'initiationfields>emailRecipient',
        //   type: 'string',
        // },
        // {
        //   name: 'emailSender',
        //   map: 'initiationfields>emailSender',
        //   type: 'string',
        // },
        // {
        //   name: 'emailSubject',
        //   map: 'initiationfields>emailSubject',
        //   type: 'string',
        // },
        // {
        //   name: 'emailTicketId',
        //   map: 'initiationfields>emailTicketId',
        //   type: 'string',
        // },
        // email process end
      ],
    };
    this.sourceConfig[this.gridToolbarType.workbasket] = {
      sortcolumn: 'created',
      sortdirection: 'desc',
      dataFields: [
        {
          name: 'taskname',
          map: 'name',
          type: 'string',
        },
        {
          name: 'name',
          map: 'name',
          type: 'string',
        },
        {
          name: 'contractInitiationTime',
          map: 'contractInitiationTime',
          type: 'date',
        },
        { name: 'created', type: 'date' },
        { name: 'initiator', type: 'string' },
        {
          name: 'initiatorname',
          map: 'initiatedbyfullname',
          type: 'string',
        },
        { name: 'elapsedhour', type: 'number' },
        { name: 'elapseddays', type: 'number' },
        { name: 'groupname', type: 'string', map: 'groupname' },
        { name: 'id', type: 'string' },
        { name: 'processInstanceId', type: 'string' },
        // {
        //   name: 'issueType',
        //   map: 'initiationfields>issueType',
        //   type: 'string',
        // },
        // {
        //   name: 'ticketId',
        //   map: 'initiationfields>ticketId',
        //   type: 'string',
        // },
        // {
        //   name: 'bookingdate',
        //   map: 'initiationfields>ticketCreationDate',
        //   type: 'string',
        // },
        // {
        //   name: 'contentCreationUser',
        //   map: 'initiationfields>contentCreationUser',
        //   type: 'string',
        // },
        // {
        //   name: 'contentCreationUserName',
        //   map: 'initiationfields>contentCreationUserName',
        //   type: 'string',
        // },
        // {
        //   name: 'courseDomain',
        //   map: 'initiationfields>courseDomain',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusAssignments',
        //   map: 'initiationfields>contentStatusAssignments',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusEndOfSessionQuiz',
        //   map: 'initiationfields>contentStatusEndOfSessionQuiz',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusPostRead',
        //   map: 'initiationfields>contentStatusPostRead',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusPreRead',
        //   map: 'initiationfields>contentStatusPreRead',
        //   type: 'string',
        // },
        // {
        //   name: 'contentStatusSelfPacedContent',
        //   map: 'initiationfields>contentStatusSelfPacedContent',
        //   type: 'string',
        // },

        // {
        //   name: 'contentStatusSessionContent',
        //   map: 'initiationfields>contentStatusSessionContent',
        //   type: 'string',
        // },
        // {
        //   name: 'course',
        //   map: 'initiationfields>course',
        //   type: 'string',
        // },
        // {
        //   name: 'module',
        //   map: 'initiationfields>module',
        //   type: 'string',
        // },
        // {
        //   name: 'dealType',
        //   map: 'initiationfields>dealType',
        //   type: 'string',
        // },
        // {
        //   name: 'dealCompany',
        //   map: 'initiationfields>dealCompany',
        //   type: 'string',
        // },
        // {
        //   name: 'dealId',
        //   map: 'initiationfields>dealId',
        //   type: 'string',
        // },
        // {
        //   name: 'amendmentId',
        //   map: 'initiationfields>amendmentId',
        //   type: 'string',
        // },
        // {
        //   name: 'dealDescription',
        //   map: 'initiationfields>dealDescription',
        //   type: 'string',
        // },
        // {
        //   name: 'contractType',
        //   map: 'initiationfields>contractType',
        //   type: 'string',
        // },
        // {
        //   name: 'contractTypeSecondLevel',
        //   map: 'initiationfields>contractTypeSecondLevel',
        //   type: 'string',
        // },
        // { name: 'product', map: 'initiationfields>product', type: 'string' },
        // {
        //   name: 'hrTicketType',
        //   map: 'initiationfields>hrTicketType',
        //   type: 'string',
        // },
        // {
        //   name: 'productSecondLevel',
        //   map: 'initiationfields>productSecondLevel',
        //   type: 'string',
        // },
        // {
        //   name: 'partnerLegalName',
        //   map: 'initiationfields>partnerLegalName',
        //   type: 'string',
        // },
        // { name: 'name', type: 'string' },
        // {
        //   name: 'businessKey',
        //   map: 'initiationfields>businessKey',
        //   type: 'string',
        // },
        // { name: 'processInstanceId', type: 'string' },
        // { name: 'country', map: 'initiationfields>country', type: 'string' },
        // { name: 'totalContractValue', type: 'string' },
        // {
        //   name: 'casePriority',
        //   map: 'initiationfields>casePriority',
        //   type: 'string',
        // },
        // {
        //   name: 'ibasisContractingEntity',
        //   map: 'initiationfields>ibasisContractingEntity',
        // },
        // { name: 'companyCode', map: 'initiationfields>companyCode' },
        // {
        //   name: 'companyName',
        //   map: 'initiationfields>companyName',
        //   type: 'string',
        // },
        // {
        //   name: 'ticketType',
        //   map: 'initiationfields>ticketType',
        //   type: 'string',
        // },
        // {
        //   name: 'customerDisputeType',
        //   map: 'initiationfields>customerDisputeType',
        // },
        // {
        //   name: 'customerSapNumber',
        //   map: 'initiationfields>customerSapNumber',
        // },
        // { name: 'disputedAmount', map: 'initiationfields>disputedAmount' },
        // {
        //   name: 'disputedInvoiceDate',
        //   map: 'initiationfields>disputedInvoiceDate',
        // },
        // {
        //   name: 'disputedInvoiceNumber',
        //   map: 'initiationfields>disputedInvoiceNumber',
        // },
        // { name: 'invoiceAmount', map: 'initiationfields>invoiceAmount' },
        // { name: 'invoiceNumber', map: 'initiationfields>invoiceNumber' },

        // { name: 'partnerType', map: 'initiationfields>partnerType' },
        // { name: 'taskname', map: 'name' },
        // {
        //   name: 'trafficPeriodFrom',
        //   map: 'initiationfields>trafficPeriodFrom',
        // },
        // { name: 'trafficPeriodTo', map: 'initiationfields>trafficPeriodTo' },
        // {
        //   name: 'vendorDisputeType',
        //   map: 'initiationfields>vendorDisputeType',
        // },
        // { name: 'vendorSapNumber', map: 'initiationfields>vendorSapNumber' },
        // { name: 'country', map: 'initiationfields>country', type: 'string' },
        // { name: 'ibasisContractingEntityLegalName', type: 'string' },
        // {
        //   name: 'hrTicketIssueFaced',
        //   map: 'initiationfields>hrTicketIssueFaced',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketNumber',
        //   map: 'initiationfields>hrTicketNumber',
        //   type: 'string',
        // },
        // {
        //   name: 'medicalAffairsUser',
        //   map: 'initiationfields>medicalAffairsUser',
        //   type: 'string',
        // },
        // {
        //   name: 'poTotalAmount',
        //   map: 'initiationfields>poTotalAmount',
        //   type: 'string',
        // },
        // {
        //   name: 'invoiceDate',
        //   map: 'initiationfields>invoiceDate',
        //   type: 'string',
        // },
        // {
        //   name: 'poAmountConsumedTillDate',
        //   map: 'initiationfields>poAmountConsumedTillDate',
        //   type: 'string',
        // },
        // {
        //   name: 'poNumber',
        //   map: 'initiationfields>poNumber',
        //   type: 'string',
        // },
        // {
        //   name: 'totalContractValue',
        //   map: 'initiationfields>totalContractValue',
        //   type: 'string',
        // },
        // {
        //   name: 'totalPoAmountLeft',
        //   map: 'initiationfields>totalPoAmountLeft',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketQuery',
        //   map: 'initiationfields>hrTicketQuery',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketSource',
        //   map: 'initiationfields>hrTicketSource',
        //   type: 'string',
        // },
        // {
        //   name: 'hrTicketType',
        //   map: 'initiationfields>hrTicketType',
        //   type: 'string',
        // },
        //   // mortgage start -----
        //   {
        //     name: 'area',
        //     map: 'initiationfields>area',
        //     type: 'string',
        //   },
        //   {
        //     name: 'city',
        //     map: 'initiationfields>city',
        //     type: 'string',
        //   },
        //   {
        //     name: 'county',
        //     map: 'initiationfields>county',
        //     type: 'string',
        //   },
        //   {
        //     name: 'borrower',
        //     map: 'initiationfields>borrower',
        //     type: 'string',
        //   },
        //   {
        //     name: 'propertyAddress',
        //     map: 'initiationfields>propertyAddress',
        //     type: 'string',
        //   },
        //   {
        //     name: 'neighbourhoodName',
        //     map: 'initiationfields>neighbourhoodName',
        //     type: 'string',
        //   },
        //   {
        //     name: 'yearBuilt',
        //     map: 'initiationfields>yearBuilt',
        //     type: 'string',
        //   },
        //   {
        //     name: 'mortgageId',
        //     map: 'initiationfields>mortgageId',
        //     type: 'string',
        //   },
        //   {
        //     name: 'state',
        //     map: 'initiationfields>state',
        //     type: 'string',
        //   },
        //   // mortgage end

        //   // email process start
        //   {
        //     name: 'emailBody',
        //     map: 'initiationfields>emailBody',
        //     type: 'string',
        //   },
        //   {
        //     name: 'emailDate',
        //     map: 'initiationfields>emailDate',
        //     type: 'date',
        //   },
        //   {
        //     name: 'emailRecipient',
        //     map: 'initiationfields>emailRecipient',
        //     type: 'string',
        //   },
        //   {
        //     name: 'emailSender',
        //     map: 'initiationfields>emailSender',
        //     type: 'string',
        //   },
        //   {
        //     name: 'emailSubject',
        //     map: 'initiationfields>emailSubject',
        //     type: 'string',
        //   },
        //   {
        //     name: 'emailTicketId',
        //     map: 'initiationfields>emailTicketId',
        //     type: 'string',
        //   },
        //   // email process end
      ],
    };
    (this.sourceConfig[this.gridToolbarType.contractlist] = {
      dataFields: [
        { name: 'initiationdate', type: 'date' },
        { name: 'completiondatetime', type: 'date' },
        { name: 'rootprocessid', type: 'string' },

        {
          name: 'contractInitiationTime',
          map: 'initiationdate',
          type: 'date',
        },
        { name: 'elapsedhour', type: 'number' },
        { name: 'elapseddays', type: 'number' },
        { name: 'initiatorname', map: 'initiatedbyfullname', type: 'string' },
        { name: 'initiator', map: 'initiatedbyfullname', type: 'string' },
        { name: 'initiatedby', type: 'string' },
        { name: 'contractid', type: 'string' },
        { name: 'overallstats', map: 'overallStats', type: 'string' },
        { name: 'created', type: 'date' },
        { name: 'country', type: 'string' },
        {
          name: 'taskname',
          map: 'taskname',
          type: 'string',
        },
        // {
        //   name: 'name',
        //   map: 'taskname',
        //   type: 'string',
        // },
        {
          name: 'hasDocument',
          map: 'hasDocument',
          type: 'boolean',
        },
      ],
    }),
      // this.sourceConfig[this.gridToolbarType.contractlist] = {
      //   // sortcolumn:'sortorder',
      //   // sortdirection:'asc',
      //   dataFields: [
      //     {
      //       name: 'issueType',
      //       map: 'initiationfields>issueType',
      //       type: 'string',
      //     },
      //     {
      //       name: 'ticketId',
      //       map: 'initiationfields>ticketId',
      //       type: 'string',
      //     },
      //     {
      //       name: 'bookingdate',
      //       map: 'initiationfields>ticketCreationDate',
      //       type: 'string',
      //     },
      //     { name: 'id', type: 'string' },
      //     { name: 'initiationdate', type: 'date' },
      //     { name: 'completiondatetime', type: 'date' },
      //     { name: 'elapsedhour', type: 'number' },
      //     { name: 'elapseddays', type: 'number' },
      //     { name: 'initiatedbyfullname', type: 'string' },
      //     { name: 'initiatedby', type: 'string' },
      //     { name: 'contracttype', type: 'string' },
      //     { name: 'contractTypeSecondLevel', type: 'string' },
      //     { name: 'product', type: 'string' },
      //     {
      //       name: 'dealType',
      //       map: 'initiationfields>dealType',
      //       type: 'string',
      //     },
      //     {
      //       name: 'dealId',
      //       map: 'initiationfields>dealId',
      //       type: 'string',
      //     },
      //     {
      //       name: 'amendmentId',
      //       map: 'initiationfields>amendmentId',
      //       type: 'string',
      //     },
      //     {
      //       name: 'dealDescription',
      //       map: 'initiationfields>dealDescription',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contentCreationUser',
      //       map: 'initiationfields>contentCreationUser',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contentCreationUserName',
      //       map: 'initiationfields>contentCreationUserName',
      //       type: 'string',
      //     },
      //     {
      //       name: 'courseDomain',
      //       map: 'initiationfields>courseDomain',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contentStatusAssignments',
      //       map: 'processvariables>contentStatusAssignments',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contentStatusEndOfSessionQuiz',
      //       map: 'processvariables>contentStatusEndOfSessionQuiz',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contentStatusPostRead',
      //       map: 'processvariables>contentStatusPostRead',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contentStatusPreRead',
      //       map: 'processvariables>contentStatusPreRead',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contentStatusSelfPacedContent',
      //       map: 'processvariables>contentStatusSelfPacedContent',
      //       type: 'string',
      //     },

      //     {
      //       name: 'contentStatusSessionContent',
      //       map: 'processvariables>contentStatusSessionContent',
      //       type: 'string',
      //     },
      //     {
      //       name: 'course',
      //       map: 'initiationfields>course',
      //       type: 'string',
      //     },
      //     {
      //       name: 'module',
      //       map: 'initiationfields>module',
      //       type: 'string',
      //     },
      //     {
      //       name: 'dealCompany',
      //       map: 'initiationfields>dealCompany',
      //       type: 'string',
      //     },

      //     {
      //       name: 'hrTicketType',
      //       map: 'initiationfields>hrTicketType',
      //       type: 'string',
      //     },
      //     {
      //       name: 'medicalAffairsUser',
      //       map: 'initiationfields>medicalAffairsUser',
      //       type: 'string',
      //     },
      //     {
      //       name: 'poTotalAmount',
      //       map: 'initiationfields>poTotalAmount',
      //       type: 'string',
      //     },
      //     {
      //       name: 'invoiceDate',
      //       map: 'initiationfields>invoiceDate',
      //       type: 'string',
      //     },
      //     {
      //       name: 'poAmountConsumedTillDate',
      //       map: 'initiationfields>poAmountConsumedTillDate',
      //       type: 'string',
      //     },
      //     {
      //       name: 'poNumber',
      //       map: 'initiationfields>poNumber',
      //       type: 'string',
      //     },
      //     {
      //       name: 'totalContractValue',
      //       map: 'initiationfields>totalContractValue',
      //       type: 'string',
      //     },
      //     {
      //       name: 'totalPoAmountLeft',
      //       map: 'initiationfields>totalPoAmountLeft',
      //       type: 'string',
      //     },
      //     {
      //       name: 'productSecondLevel',
      //       map: 'initiationfields>productSecondLevel',
      //       type: 'string',
      //     },
      //     { name: 'productSecondLevel', type: 'string' },
      //     { name: 'partnerlegalname', type: 'string' },
      //     { name: 'cename', type: 'string' },
      //     { name: 'contractid', type: 'string' },
      //     { name: 'overallStats', type: 'string' },
      //     { name: 'country', type: 'string' },
      //     { name: 'totalContractValue', type: 'number' },
      //     { name: 'casePriority', type: 'string' },
      //     { name: 'rootprocessid', type: 'string' },
      //     { name: 'sortorder', type: 'number' },
      //     {
      //       name: 'companyName',
      //       map: 'initiationfields>companyName',
      //       type: 'string',
      //     },
      //     {
      //       name: 'ticketType',
      //       map: 'initiationfields>ticketType',
      //       type: 'string',
      //     },
      //     { name: 'currency', type: 'string' },
      //     { name: 'initiator', type: 'string' },
      //     {
      //       name: 'initiatorname',
      //       map: 'initiatedbyfullname',
      //       type: 'string',
      //     },
      //     { name: 'country', type: 'string' },
      //     { name: 'created', type: 'date' },
      //     { name: 'ibasisContractingEntityLegalName', type: 'string' },
      //     {
      //       name: 'businessKey',
      //       map: 'initiationfields>businessKey',
      //       type: 'string',
      //     },
      //     {
      //       name: 'taskname',
      //       map: 'taskname',
      //       type: 'string',
      //     },
      //     {
      //       name: 'contractType',
      //       map: 'initiationfields>contractType',
      //       type: 'string',
      //     },
      //     { name: 'companyCode', map: 'initiationfields>companyCode' },
      //     {
      //       name: 'contractInitiationTime',
      //       map: 'initiationfields>contractInitiationTime',
      //       type: 'date',
      //     },
      //     {
      //       name: 'customerDisputeType',
      //       map: 'initiationfields>customerDisputeType',
      //     },
      //     {
      //       name: 'customerSapNumber',
      //       map: 'initiationfields>customerSapNumber',
      //     },
      //     { name: 'disputedAmount', map: 'initiationfields>disputedAmount' },
      //     {
      //       name: 'disputedInvoiceDate',
      //       map: 'initiationfields>disputedInvoiceDate',
      //     },
      //     {
      //       name: 'disputedInvoiceNumber',
      //       map: 'initiationfields>disputedInvoiceNumber',
      //     },
      //     { name: 'invoiceAmount', map: 'initiationfields>invoiceAmount' },
      //     { name: 'invoiceNumber', map: 'initiationfields>invoiceNumber' },
      //     { name: 'partnerType', map: 'initiationfields>partnerType' },
      //     { name: 'processname', map: 'initiationfields>processname' },
      //     {
      //       name: 'trafficPeriodFrom',
      //       map: 'initiationfields>trafficPeriodFrom',
      //     },
      //     { name: 'trafficPeriodTo', map: 'initiationfields>trafficPeriodTo' },
      //     {
      //       name: 'vendorDisputeType',
      //       map: 'initiationfields>vendorDisputeType',
      //     },
      //     { name: 'vendorSapNumber', map: 'initiationfields>vendorSapNumber' },
      //     {
      //       name: 'hrTicketIssueFaced',
      //       map: 'initiationfields>hrTicketIssueFaced',
      //       type: 'string',
      //     },
      //     {
      //       name: 'hrTicketNumber',
      //       map: 'initiationfields>hrTicketNumber',
      //       type: 'string',
      //     },
      //     {
      //       name: 'hrTicketQuery',
      //       map: 'initiationfields>hrTicketQuery',
      //       type: 'string',
      //     },
      //     {
      //       name: 'hrTicketSource',
      //       map: 'initiationfields>hrTicketSource',
      //       type: 'string',
      //     },
      //     {
      //       name: 'hrTicketType',
      //       map: 'initiationfields>hrTicketType',
      //       type: 'string',
      //     },
      //     // mortgage start -----
      //     {
      //       name: 'area',
      //       map: 'initiationfields>area',
      //       type: 'string',
      //     },
      //     {
      //       name: 'city',
      //       map: 'initiationfields>city',
      //       type: 'string',
      //     },
      //     {
      //       name: 'county',
      //       map: 'initiationfields>county',
      //       type: 'string',
      //     },
      //     {
      //       name: 'borrower',
      //       map: 'initiationfields>borrower',
      //       type: 'string',
      //     },
      //     {
      //       name: 'propertyAddress',
      //       map: 'initiationfields>propertyAddress',
      //       type: 'string',
      //     },
      //     {
      //       name: 'neighbourhoodName',
      //       map: 'initiationfields>neighbourhoodName',
      //       type: 'string',
      //     },
      //     {
      //       name: 'yearBuilt',
      //       map: 'initiationfields>yearBuilt',
      //       type: 'string',
      //     },
      //     {
      //       name: 'mortgageId',
      //       map: 'initiationfields>mortgageId',
      //       type: 'string',
      //     },
      //     {
      //       name: 'state',
      //       map: 'initiationfields>state',
      //       type: 'string',
      //     },
      //     // mortgage end

      //     // email process start
      //     {
      //       name: 'emailBody',
      //       map: 'initiationfields>emailBody',
      //       type: 'string',
      //     },
      //     {
      //       name: 'emailDate',
      //       map: 'initiationfields>emailDate',
      //       type: 'date',
      //     },
      //     {
      //       name: 'emailRecipient',
      //       map: 'initiationfields>emailRecipient',
      //       type: 'string',
      //     },
      //     {
      //       name: 'emailSender',
      //       map: 'initiationfields>emailSender',
      //       type: 'string',
      //     },
      //     {
      //       name: 'emailSubject',
      //       map: 'initiationfields>emailSubject',
      //       type: 'string',
      //     },
      //     {
      //       name: 'emailTicketId',
      //       map: 'initiationfields>emailTicketId',
      //       type: 'string',
      //     },
      //     // email process end
      //   ],
      // };

      (this.sourceConfig[this.gridToolbarType.allProcess] = {
        sortcolumn: 'caseStatus',
        sortdirection: 'asc',
        dataFields: [
          {
            name: 'taskname',
            map: 'taskname',
            type: 'string',
          },
          {
            name: 'name',
            map: 'taskname',
            type: 'string',
          },
          { name: 'taskstatus', type: 'string' },
          { name: 'caseStatus', map: 'contractstatus', type: 'string' },
          { name: 'id', type: 'string' },
          { name: 'initiationdate', type: 'date' },
          { name: 'completiondatetime', type: 'date' },
          { name: 'taskelapsedhours', map: 'elapsedhour', type: 'number' },
          { name: 'taskelapseddays', map: 'elapseddays', type: 'number' },
          { name: 'elapseddays', map: 'contractelapsedtime', type: 'number' },
          { name: 'contractelapsedtime', type: 'number' },
          { name: 'groupname', type: 'string' },
          { name: 'initiatedbyfullname', type: 'string' },
          { name: 'initiatedby', type: 'string' },
          { name: 'contracttype', type: 'string' },
          { name: 'contractTypeSecondLevel', type: 'string' },
          { name: 'product', type: 'string' },
          { name: 'productSecondLevel', type: 'string' },
          { name: 'partnerlegalname', type: 'string' },
          { name: 'cename', type: 'string' },
          { name: 'contractid', type: 'string' },
          { name: 'overallstats', map: 'overallStats', type: 'string' },
          { name: 'country', type: 'string' },
          { name: 'totalContractValue', type: 'number' },
          { name: 'casePriority', type: 'string' },
          { name: 'rootprocessid', type: 'string' },
          { name: 'sortorder', type: 'number' },
          { name: 'currency', type: 'string' },
          { name: 'initiator', map: 'initiatedbyfullname', type: 'string' },
          {
            name: 'initiatorname',
            map: 'initiatedbyfullname',
            type: 'string',
          },
          { name: 'created', type: 'date' },
          { name: 'ibasisContractingEntityLegalName', type: 'string' },
          {
            name: 'contractInitiationTime',
            map: 'contractinitiationtime',
            type: 'date',
          },
          {
            name: 'starttime',
            map: 'starttime',
            type: 'date',
          },
          {
            name: 'endtime',
            map: 'endtime',
            type: 'date',
          },
          // {
          //   name: 'hrTicketType',
          //   map: 'initiationfields>hrTicketType',
          //   type: 'string',
          // },
          // {
          //   name: 'contentCreationUser',
          //   map: 'initiationfields>contentCreationUser',
          //   type: 'string',
          // },
          // {
          //   name: 'contentCreationUserName',
          //   map: 'initiationfields>contentCreationUserName',
          //   type: 'string',
          // },
          // {
          //   name: 'courseDomain',
          //   map: 'initiationfields>courseDomain',
          //   type: 'string',
          // },
          // {
          //   name: 'contentStatusAssignments',
          //   map: 'initiationfields>contentStatusAssignments',
          //   type: 'string',
          // },
          // {
          //   name: 'contentStatusEndOfSessionQuiz',
          //   map: 'initiationfields>contentStatusEndOfSessionQuiz',
          //   type: 'string',
          // },
          // {
          //   name: 'contentStatusPostRead',
          //   map: 'initiationfields>contentStatusPostRead',
          //   type: 'string',
          // },
          // {
          //   name: 'contentStatusPreRead',
          //   map: 'initiationfields>contentStatusPreRead',
          //   type: 'string',
          // },
          // {
          //   name: 'contentStatusSelfPacedContent',
          //   map: 'initiationfields>contentStatusSelfPacedContent',
          //   type: 'string',
          // },

          // {
          //   name: 'contentStatusSessionContent',
          //   map: 'initiationfields>contentStatusSessionContent',
          //   type: 'string',
          // },
          { name: 'assignee', type: 'string', map: 'assignee' },
          // {
          //   name: 'course',
          //   map: 'initiationfields>course',
          //   type: 'string',
          // },
          // {
          //   name: 'module',
          //   map: 'initiationfields>module',
          //   type: 'string',
          // },
          // {
          //   name: 'dealType',
          //   map: 'initiationfields>dealType',
          //   type: 'string',
          // },
          // {
          //   name: 'dealCompany',
          //   map: 'initiationfields>dealCompany',
          //   type: 'string',
          // },
          // {
          //   name: 'dealId',
          //   map: 'initiationfields>dealId',
          //   type: 'string',
          // },
          // {
          //   name: 'amendmentId',
          //   map: 'initiationfields>amendmentId',
          //   type: 'string',
          // },
          // {
          //   name: 'dealDescription',
          //   map: 'initiationfields>dealDescription',
          //   type: 'string',
          // },
          // {
          //   name: 'companyName',
          //   map: 'initiationfields>companyName',
          //   type: 'string',
          // },
          // {
          //   name: 'ticketType',
          //   map: 'initiationfields>ticketType',
          //   type: 'string',
          // },
          // {
          //   name: 'productSecondLevel',
          //   map: 'initiationfields>productSecondLevel',
          //   type: 'string',
          // },
          // {
          //   name: 'issueType',
          //   map: 'initiationfields>issueType',
          //   type: 'string',
          // },
          // {
          //   name: 'ticketId',
          //   map: 'initiationfields>ticketId',
          //   type: 'string',
          // },
          // {
          //   name: 'bookingdate',
          //   map: 'initiationfields>ticketCreationDate',
          //   type: 'string',
          // },

          // {
          //   name: 'businessKey',
          //   map: 'initiationfields>businessKey',
          //   type: 'string',
          // },
          // {
          //   name: 'contractType',
          //   map: 'initiationfields>contractType',
          //   type: 'string',
          // },
          // { name: 'companyCode', map: 'initiationfields>companyCode' },
          // {
          //   name: 'customerDisputeType',
          //   map: 'initiationfields>customerDisputeType',
          // },
          // {
          //   name: 'customerSapNumber',
          //   map: 'initiationfields>customerSapNumber',
          // },
          // { name: 'disputedAmount', map: 'initiationfields>disputedAmount' },
          // {
          //   name: 'disputedInvoiceDate',
          //   map: 'initiationfields>disputedInvoiceDate',
          // },
          // {
          //   name: 'disputedInvoiceNumber',
          //   map: 'initiationfields>disputedInvoiceNumber',
          // },
          // { name: 'invoiceAmount', map: 'initiationfields>invoiceAmount' },
          // { name: 'invoiceNumber', map: 'initiationfields>invoiceNumber' },
          // { name: 'partnerType', map: 'initiationfields>partnerType' },
          // { name: 'processname', map: 'initiationfields>processname' },
          // {
          //   name: 'trafficPeriodFrom',
          //   map: 'initiationfields>trafficPeriodFrom',
          // },
          // { name: 'trafficPeriodTo', map: 'initiationfields>trafficPeriodTo' },
          // {
          //   name: 'vendorDisputeType',
          //   map: 'initiationfields>vendorDisputeType',
          // },
          // { name: 'vendorSapNumber', map: 'initiationfields>vendorSapNumber' },
          // {
          //   name: 'hrTicketIssueFaced',
          //   map: 'initiationfields>hrTicketIssueFaced',
          //   type: 'string',
          // },
          // {
          //   name: 'hrTicketNumber',
          //   map: 'initiationfields>hrTicketNumber',
          //   type: 'string',
          // },
          // {
          //   name: 'hrTicketQuery',
          //   map: 'initiationfields>hrTicketQuery',
          //   type: 'string',
          // },
          // {
          //   name: 'hrTicketSource',
          //   map: 'initiationfields>hrTicketSource',
          //   type: 'string',
          // },
          // {
          //   name: 'hrTicketType',
          //   map: 'initiationfields>hrTicketType',
          //   type: 'string',
          // },
          // {
          //   name: 'medicalAffairsUser',
          //   map: 'initiationfields>medicalAffairsUser',
          //   type: 'string',
          // },
          // {
          //   name: 'poTotalAmount',
          //   map: 'initiationfields>poTotalAmount',
          //   type: 'string',
          // },
          // {
          //   name: 'invoiceDate',
          //   map: 'initiationfields>invoiceDate',
          //   type: 'string',
          // },
          // {
          //   name: 'poAmountConsumedTillDate',
          //   map: 'initiationfields>poAmountConsumedTillDate',
          //   type: 'string',
          // },
          // {
          //   name: 'poNumber',
          //   map: 'initiationfields>poNumber',
          //   type: 'string',
          // },
          // {
          //   name: 'totalContractValue',
          //   map: 'initiationfields>totalContractValue',
          //   type: 'string',
          // },
          // {
          //   name: 'totalPoAmountLeft',
          //   map: 'initiationfields>totalPoAmountLeft',
          //   type: 'string',
          // },
          // // mortgage start -----
          // {
          //   name: 'area',
          //   map: 'initiationfields>area',
          //   type: 'string',
          // },
          // {
          //   name: 'city',
          //   map: 'initiationfields>city',
          //   type: 'string',
          // },
          // {
          //   name: 'county',
          //   map: 'initiationfields>county',
          //   type: 'string',
          // },
          // {
          //   name: 'borrower',
          //   map: 'initiationfields>borrower',
          //   type: 'string',
          // },
          // {
          //   name: 'propertyAddress',
          //   map: 'initiationfields>propertyAddress',
          //   type: 'string',
          // },
          // {
          //   name: 'neighbourhoodName',
          //   map: 'initiationfields>neighbourhoodName',
          //   type: 'string',
          // },
          // {
          //   name: 'yearBuilt',
          //   map: 'initiationfields>yearBuilt',
          //   type: 'string',
          // },
          // {
          //   name: 'mortgageId',
          //   map: 'initiationfields>mortgageId',
          //   type: 'string',
          // },
          // {
          //   name: 'state',
          //   map: 'initiationfields>state',
          //   type: 'string',
          // },
          // // mortgage end

          // // email process start
          // {
          //   name: 'emailBody',
          //   map: 'initiationfields>emailBody',
          //   type: 'string',
          // },
          // {
          //   name: 'emailDate',
          //   map: 'initiationfields>emailDate',
          //   type: 'date',
          // },
          // {
          //   name: 'emailRecipient',
          //   map: 'initiationfields>emailRecipient',
          //   type: 'string',
          // },
          // {
          //   name: 'emailSender',
          //   map: 'initiationfields>emailSender',
          //   type: 'string',
          // },
          // {
          //   name: 'emailSubject',
          //   map: 'initiationfields>emailSubject',
          //   type: 'string',
          // },
          // {
          //   name: 'emailTicketId',
          //   map: 'initiationfields>emailTicketId',
          //   type: 'string',
          // },
          // email process end
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.comments] = {
        dataFields: [
          { name: 'name', type: 'string', map: 'user>name' },
          { name: 'comment', type: 'string' },
          { name: 'createdDate', type: 'date' },
        ],
      });

    (this.sourceConfig[this.gridToolbarType.user] = {
      dataFields: [
        { name: 'userid', type: 'string' },
        { name: 'fname', type: 'string' },
        { name: 'lname', type: 'string' },
        { name: 'groupnames', type: 'string' },
        { name: 'roles', type: 'string' },
        { name: 'active', type: 'boolean' },
        { name: 'email', type: 'string' },
      ],
    }),
      (this.sourceConfig[this.gridToolbarType.group] = {
        dataFields: [
          { name: 'name', type: 'string' },
          { name: 'groupid', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'rolevm', type: 'string' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.company] = {
        dataFields: [
          { name: 'name', type: 'string' },
          { name: 'id', type: 'string' },
          { name: 'code', type: 'string' },
          { name: 'friendlyname', type: 'string' },
          { name: 'carriertype', type: 'string' },
          { name: 'aliases', type: 'string' },
          { name: 'groupname', type: 'string' },
          { name: 'parentname', type: 'string' },
          { name: 'countries', type: 'string' },
          { name: 'status', type: 'string' },
          { name: 'isactive', type: 'boolean' },
          { name: 'vendorsapid', type: 'string' },
          { name: 'customersapid', type: 'string' },
          { name: 'customersapid', type: 'string' },
          { name: 'otherEmails', type: 'array' },
          { name: 'accountManagers', type: 'array' },
          { name: 'partherLevel', type: 'string' },
          { name: 'aadhaarId', type: 'string', map: 'aadhaar>aadhaarId' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.prescreening] = {
        dataFields: [
          { name: 'Service Order Number', type: 'string' },
          { name: 'Job Position', type: 'string' },
          { name: 'Job Description', type: 'string' },
          { name: 'Hiring Company Name', type: 'string' },
          { name: 'Recruiting Company Name', type: 'string' },
          { name: 'Hiring Manager ID', type: 'string' },
          { name: 'Hiring Manager Name', type: 'string' },
          { name: 'Candidate Source', type: 'string' },
          { name: 'Candidate ID (ATS)', type: 'string' },
          { name: 'Candidate First Name', type: 'string' },
          { name: 'Candidate Last Name', type: 'string' },
          { name: 'Candidate Name', type: 'string' },
          { name: 'Candidate Mobile Number', type: 'string' },
          { name: 'Candidate Email', type: 'string' },
          { name: 'Rounds Of InterView', type: 'string' },
          { name: 'Reason', type: 'string' },
          { name: 'Cases', type: 'string' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.LMS] = {
        dataFields: [
          { name: 'Company Name', type: 'string' },
          { name: 'Client Contact Name', type: 'string' },
          { name: 'Client Contact Mobile Number', type: 'number' },
          { name: 'Client Contact Email', type: 'string' },
          { name: 'Client Contact Designation', type: 'string' },
          { name: 'Source of Lead', type: 'string' },
          { name: 'Lead Status', type: 'string' },
          { name: 'Region of Sales', type: 'string' },
          { name: 'Industry', type: 'string' },
          { name: 'Country', type: 'string' },
          { name: 'City', type: 'string' },
          { name: 'Client Contact Profile URL', type: 'string' },
          { name: 'Company Listing Status', type: 'string' },
          { name: 'Connected On LinkedIn', type: 'string' },
          { name: 'Opportunity ID', type: 'string' },
          { name: 'Next Review Date', type: 'string' },
          { name: 'Sales Person', type: 'string' },
          { name: 'Opportunity Description', type: 'string' },
          { name: 'Opportunity Value', type: 'string' },
          { name: 'Currency', type: 'string' },
          { name: 'Offering', type: 'Offering' },
          { name: 'Revenue Model', type: 'Revenue Model' },
          { name: 'Monthly License Fees', type: 'Monthly License Fees' },
          { name: 'Services Fees', type: 'string' },
          { name: 'Monthly Subscription Volume', type: 'string' },
          { name: 'Monthly Subscription Fee', type: 'string' },
          {
            name: 'Critical Success Factors',
            type: 'Critical Success Factors',
          },
          { name: 'Expected Closure Date', type: 'Expected Closure Date' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.country] = {
        dataFields: [
          { name: 'countryname', type: 'string' },
          { name: 'countrycode', type: 'string' },
          { name: 'code', type: 'string' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.process_form] = {
        dataFields: [
          { name: 'processNamess', type: 'array' },
          { name: 'name', type: 'string' },
          { name: 'key', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'groupname', type: 'string' },
          { name: 'defaulttab', type: 'string' },
          { name: 'commentsneeded', type: 'boolean' },
          { name: 'reviewable', type: 'boolean' },
          { name: 'isreviewtask', type: 'boolean' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.anchor_entity] = {
        dataFields: [
          { name: 'processNames', type: 'array' },
          { name: 'anchorConfigId', type: 'string' },
          { name: 'anchorConfigDisplayName', type: 'string' },
          { name: 'description', type: 'string' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.aiattributes] = {
        dataFields: [
          { name: 'processname', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'processlabel', type: 'string' },
          { name: 'isVisible', type: 'boolean', map: 'processDef>isVisible' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.processdefinition] = {
        dataFields: [
          { name: 'processname', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'processlabel', type: 'string' },
          { name: 'isVisible', type: 'boolean', map: 'processDef>isVisible' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.keywords] = {
        dataFields: [
          { name: 'keyword', type: 'string' },
          { name: 'descriptionVariable', type: 'string' },
          { name: 'ticketType', type: 'string' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.processvariable] = {
        dataFields: [
          { name: 'id', type: 'string' },
          { name: 'displaylabel', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'datatype', type: 'string' },
          { name: 'categoryname', type: 'string' },
          { name: 'refdatacode', type: 'string' },
          { name: 'uielementtype', type: 'string' },
          { name: 'system', type: 'boolean' },
          { name: 'linkedtometadata', type: 'boolean' },
          { name: 'emailtemplatevariable', type: 'boolean' },
          { name: 'processNames', type: 'array' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.systemreports] = {
        dataFields: [
          { name: 'reportName', type: 'string' },
          { name: 'sourceLabel', type: 'string' },
          { name: 'userName', type: 'string' },
          { name: 'source', type: 'string' },
          { name: 'hasDate', type: 'boolean' },
          { name: 'subproduct', type: 'string' },
          { name: 'createdAt', type: 'date' },
          { name: 'updatedAt', type: 'date' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.reports] = {
        dataFields: [
          { name: 'reportName', type: 'string' },
          { name: 'sourceLabel', type: 'string' },
          { name: 'userName', type: 'string' },
          { name: 'source', type: 'string' },
          { name: 'hasDate', type: 'boolean' },
          { name: 'subproduct', type: 'string' },
          { name: 'createdAt', type: 'date' },
          { name: 'updatedAt', type: 'date' },
        ],
      }),
      (this.sourceConfig[this.gridToolbarType.contentmanagement] = {
        dataFields: [
          { name: 'id', type: 'number' },
          { name: 'name', type: 'string' },
          { name: 'code', type: 'string' },
          { name: 'tname', type: 'string' },
          { name: 'processNames', type: 'array' },
        ],
      });

    // this.sourceConfig[this.gridToolbarType.country] = {
    //   updaterow: (rowid: any, rowdata: any, commit: any): void => {
    //     // synchronize with the server - send update command
    //     // call commit with parameter true if the synchronization with the server is successful
    //     // and with parameter false if the synchronization failder.
    //     commit(true);
    // },
    //   datatype: 'array' ,
    //   datafields:
    //        [
    //            {name : 'countryname' , type: 'string' } ,
    //            {name: 'contractingentity' , type: 'string'},
    //            {name: 'code' , type: 'string'},
    //            {name: 'countrycode' , type: 'string'},
    //            {name: 'synonyms' , type: 'string'},
    //            {name: 'isd' , type: 'string'},
    //            {name : 'ceiot',  type: 'string' },
    //            {name : 'cesms',  type: 'string'},
    //            {name : 'cemobile' ,  type: 'string'} ,
    //            {name : 'cevoice' ,  type: 'string'} ,
    //            {name : 'ceother' , type: 'string' },
    //            {name: 'region' ,  type: 'string' },
    //        ]
    // }
  }
}

// editable: true,
// selectionmode: 'singlecell',

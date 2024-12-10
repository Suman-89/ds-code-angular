import { UserGroupsEnum } from 'src/app/core/_models';

export class ReviewTaskConstant {
  userGroupEnum = UserGroupsEnum;
  reviewGroupMap = {
    [this.userGroupEnum.BILLING]: {
      name: 'Review With Billing',
      variable: 'reviewWithBilling',
    },
    [this.userGroupEnum.COMMERCIAL_OPS]: {
      name: 'Review with Commercial Ops',
      variable: 'reviewWithCommercialOps',
    },
    [this.userGroupEnum.CREDIT]: {
      name: 'Review with Credit',
      variable: 'reviewWithCredit',
    },
    [this.userGroupEnum.EMTCFO]: {
      name: 'Review With EMT CFO',
      variable: 'reviewWithEmtCfo',
    },
    [this.userGroupEnum.REC_MANAGER]: {
      name: 'Review With Recruter Manager',
      variable: 'psReviewWithRecruiterManager',
    },
    [this.userGroupEnum.REC_BUSINESS]: {
      name: 'Review With Recruting Business',
      variable: 'psReviewWithRecruitingBusiness',
    },
    [this.userGroupEnum.EMTIOT]: {
      name: 'Review With EMT IOT',
      variable: 'reviewWithEmtIot',
    },
    [this.userGroupEnum.EMTMOBILE]: {
      name: 'Review With EMT Mobile',
      variable: 'reviewWithEmtMobile',
    },
    [this.userGroupEnum.EMTSALES]: {
      name: 'Review With EMT Sales',
      variable: 'reviewWithEmtSales',
    },
    [this.userGroupEnum.FPA]: {
      name: 'Review With Fpa',
      variable: 'reviewWithFpa',
    },
    [this.userGroupEnum.INTERCONNECT_DESIGN]: {
      name: 'Review With Interconnect Design',
      variable: 'reviewWithId',
    },
    [this.userGroupEnum.LEGAL]: {
      name: 'Review with Legal',
      variable: 'reviewWithLegal',
    },
    [this.userGroupEnum.PM_IOT]: {
      name: 'Review with PM IOT',
      variable: 'reviewWithPmIot',
    },
    [this.userGroupEnum.PM_MOBILE]: {
      name: 'Review with PM Mobile',
      variable: 'reviewWithPmMobile',
    },
    [this.userGroupEnum.PM_SMS]: {
      name: 'Review with PM SMS',
      variable: 'reviewWithPmSms',
    },
    [this.userGroupEnum.PM_VOICE]: {
      name: 'Review with PM Voice',
      variable: 'reviewWithPmVoice',
    },
    [this.userGroupEnum.PRODUCTION_MANAGEMENT]: {
      name: 'Review with PM',
      variable: 'reviewWithPm',
    },
    [this.userGroupEnum.SALES]: {
      name: 'Review with AM',
      variable: 'reviewWithAm',
    },
    [this.userGroupEnum.EMT_BUSINESS]: {
      name: 'Review with EMT Business',
      variable: 'reviewWithEmtBusiness',
    },
    [this.userGroupEnum.EMPLOYEE]: {
      name: 'Review with Employee',
      variable: 'reviewWithEmployee',
    },
    [this.userGroupEnum.BUSINESS]: {
      name: 'Review With Business',
      variable: 'reviewWithBusiness',
    },
    [this.userGroupEnum.FINANCE]: {
      name: 'Review with Finance',
      variable: 'reviewWithFinance',
    },
    [this.userGroupEnum.EMT_HR]: {
      name: 'Review with EMT HR',
      variable: 'reviewWithEmtHr',
    },
    [this.userGroupEnum.FRAUD]: {
      name: 'Review With Fraud',
      variable: 'reviewWithFraud',
    },
    [this.userGroupEnum.FINANCECS]: {
      name: 'Review With Finance Career Settlements',
      variable: 'reviewWithFinanceCareerSettlements',
    },
    [this.userGroupEnum.FINANCEAP]: {
      name: 'Review With FinanceAccountsPayable',
      variable: 'reviewWithFinanceAccountsPayable',
    },
    [this.userGroupEnum.BILLINGIS]: {
      name: 'Review With BillingIs',
      variable: 'reviewWithBillingIs',
    },
    [this.userGroupEnum.DEALMANAGEMENT]: {
      name: 'Review With Deal Management',
      variable: 'reviewWithDealManagement',
    },
    [this.userGroupEnum.DEALRATES]: {
      name: 'Review With Deal Rates',
      variable: 'reviewWithDealRates',
    },
    [this.userGroupEnum.RATES]: {
      name: 'Review With Rates',
      variable: 'reviewWithRates',
    },
    [this.userGroupEnum.DISPUTES]: {
      name: 'Review With Disputes',
      variable: 'reviewWithDisputes',
    },
    [this.userGroupEnum.PM_MGR]: {
      name: 'Review With Product Manager Mobile',
      variable: 'reviewWithProductManagerMobile',
    },
    [this.userGroupEnum.DEPLOYMENT]: {
      name: 'Review With Deployment',
      variable: 'reviewWithDeployment',
    },
    [this.userGroupEnum.CLAIMAGENT]: {
      name: 'Review With Claim Agent',
      variable: 'rcmReviewWithClaimAgent',
    },
    [this.userGroupEnum.MEDICALCODING]: {
      name: 'Review With Medical Coding',
      variable: 'rcmReviewWithMedicalCoding',
    },
    [this.userGroupEnum.CLAIMANALYST]: {
      name: 'Review With Claim Analyst',
      variable: 'rcmReviewWithClaimAnalyst',
    },
    [this.userGroupEnum.DENIALANALYST]: {
      name: 'Review With Dental Analyst',
      variable: 'rcmReviewWithDenialAnalyst',
    },
    [this.userGroupEnum.ACCOUNTS]: {
      name: 'Review With Accounts',
      variable: 'rcmReviewWithAccounts',
    },
    [this.userGroupEnum.PATIENTBILLING]: {
      name: 'Review With Patient Billing',
      variable: 'rcmReviewWithPatientBilling',
    },
    [this.userGroupEnum.SERVICEMANAGER]: {
      name: 'Review With Service Manager',
      variable: 'reviewWithSm',
    },
    [this.userGroupEnum.OPERATIONS]: {
      name: 'Review With Operations',
      variable: 'reviewWithOperations',
    },
    [this.userGroupEnum.FUNCTIONMANAGER]: {
      name: 'Review With Patient Billing',
      variable: 'reviewWithFm',
    },
    [this.userGroupEnum.EMT]: {
      name: 'Review With EMT',
      variable: 'reviewWithEmt',
    },
    [this.userGroupEnum.CONTENT_CREATOR]: {
      name: 'Review With Content Creator',
      variable: 'reviewWithContentCreator',
    },
    [this.userGroupEnum.CONTENT_REQUESTER]: {
      name: 'Review With Content Requester',
      variable: 'reviewWithContentRequester',
    },
    [this.userGroupEnum.REVIEWER]: {
      name: 'Review With Reviewer',
      variable: 'reviewWithReviewer',
    },
    [this.userGroupEnum.EMAMI]: {
      name: 'Review With Emami',
      variable: 'reviewWithEmami',
    },
  };
}

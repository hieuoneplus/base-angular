export interface IParamQueryTransactionCitad {
    id: number;
    transactionId: string;
    t24ReferenceNumber: string;
    debitValueDate: string;
    senderName: string;
    receiverName: string;
    amountCreditrd: string;
    partnerStatus: string;
    metaDataErrMsg: string;
    type: string
}

export interface PaginationQueryTransactionCitadDto<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        unpaged: boolean;
        paged: boolean;
    };
    totalPages?: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export interface IResponseQueryTransactionCitad {
    id?: number,
    transactionId?: string,
    originalTransactionId?: string,
    transactionReference?: string,
    originalTransactionReference?: string,
    t24ReferenceNumber?: string,
    way4WalletReferenceNumber?: string,
    way4CardReferenceNumber?: string,
    kind?: string,
    t24TxnType?: string,
    paymentType?: string,
    transactionType?: string,
    paymentProcessor?: string,
    channel?: string,
    sourceChannel?: string,
    gateway?: string,
    debitTheirRef?: string,
    debitAccountNo?: string,
    debitAccountType?: string,
    debitAccountName?: string,
    debitAmount?: number,
    amountCredited?: number,
    debitCurrency?: string,
    debitValueDate?: string,
    creditTheirRef?: string,
    creditAccountNo?: string,
    creditAccountName?: string,
    creditAccountType?: string,
    creditAmount?: number,
    creditCurrency?: string,
    creditValueDate?: string,
    chargeAccountNo?: string,
    chargeAccountType?: string,
    chargeCurrency?: string,
    chargeType?: string,
    senderAccountNo?: string,
    senderAccountType?: string,
    senderName?: string,
    senderBankCode?: string,
    senderBranchCode?: string,
    senderAddress?: string,
    receiverAccountNo?: string,
    receiverAccountType?: string,
    receiverName?: string,
    receiverBankCode?: string,
    receiverBranchCode?: string,
    receiverAddress?: string,
    description?: string,
    extendedDescription?: string,
    paymentSystem?: string,
    status?: string,
    error?: {
        code?: string,
        message?: string,
        forwardError?: string,
        suppressedErrors?: ISuppressedErrors[]
    },
    metadata?: {
        $type?: string,
        transactionSource?: string,
        branchCode?: string,
        t24DebitAccountNo?: string,
        t24CreditAccountNo?: string,
        t24ChargeAccountNo?: string,
        t24ReceiverAccountNo?: string,
        way4ReceiverAccountNo?: string,
        originalT24ReferenceNumber?: string,
        inhouseReceiverBankCode?: string,
        inhouseChargeType?: string,
        profitCentreCust?: string,
        treasuryRate?: string,
        chequeNumber?: string,
        mbPayMethod?: string,
        orgData?: string,
        posMid?: string,
        goodId?: string,
        bpmCode?: string,
        uniqueTransId?: string,
        classifyCode?: string,
        mkfileCom?: string,
        walletNumber?: string,
        walletName?: string,
        walletStatus?: string,
        cardToken?: string,
        maskedCardNumber?: string,
        cardModule?: string,
        cardName?: string,
        cardId?: string,
        cardStatus?: string,
        makerId?: string,
        t24CitadSdAdd?: string,
        t24AddInfor?: string,
        dateTime?: string,
        overemMtcn?: string,
        txnPurpose?: string,
        subProduct?: string,
        category?: string,
        customerId?: string,
        charges?: string,
        revertT24?: string,
        isVisaCard?: string,
        addInfos?: IAddInfos[],
        checkCode?: string,
        cardErrorMessage?: string,
        paymentDetails?: string,
        detailsExtend?: string,
        cpPayment?: string,
        tcsResponseCode?: string,
        tcsResponseString?: string,
        refundedT24ReferenceNumber?: string,
        processInfos?: IProcessInfos[],
        citadTrxType?: string,
        citadReference?: string,
        citadCusType?: string,
        citadRvCode?: string,
        citadContentEx?: string,
        citadExESign?: string,
        citadCheckCode?: string,
        citadTrxDate?: string,
        citadSdTime?: string,
        citadRelationNo?: string,
        citadSdAccnt?: string,
        citadSdAddr?: string,
        citadMsgKey?: string,
        citadMsgType?: string,
        citadErrStatus?: string,
        citadResponseCode?: string,
        citadSerialNo?: string,
        citadInputType?: string,
        citadTadId?: string,
        citadESign?: string,
        citadBalanceTime?: string,
        citadAmount?: string,
        citadSdName?: string,
        citadRvName?: string,
        citadRvAddr?: string,
        citadContent?: string,
        citadOpert1?: string,
        citadOpert2?: string,
        citadTrxStatus?: string,
        citadTrxFileName?: string,
        citadTrxFileCore?: string,
        citadMac?: string,
        citadProcess?: string,
        citadSdIdentify?: string,
        citadRvIdentify?: string,
        citadAuthorized?: string,
        citadFeeCiId?: string,
        citadFeeFlag?: string,
        citadTaxCode?: string,
        citadSdCode?: string,
        citadMsgReason?: string,
        citadOrigId?: string,
        citadConfirmId?: string,
        citadApprId?: string,
        citadApprTime?: string,
        citadGtwFlag?: string
        citadApprInTime?: string,
        citadApprInId?: string,
        citadErrMsg?: string,
        citadSdIdNo?: string,
        citadSdIssueDate?: string,
        citadSdIssuer?: string,
        citadRvIdNo?: string,
        citadRvIssueDate?: string,
        citadRvIssuer?: string,
        citadOption1?: string,
        citadOption2?: string,
        citadOption3?: string,
        citadSpare?: string,
        citadExchangeRate?: string
    },
    partnerStatus?: string,
    partnerId?: string,
    partnerReference?: string,
    partnerMetadata?: string,
    createdBy?: string,
    createdAt?: string,
    updatedBy?: string,
    updatedAt?: string
}

export interface IAddInfos {
    type?: string,
    properties?: {
        map?: {
            "PAYMENT.DETAILS"?: IPaymentDetail[]
            "DETAILS.EXTEND"?: string,
            "CP.PAYMENT"?: ICpPayment[]
            "IN.BEN.ACCT.NO"?: string,
            "BC.BANK.SORT.CODE"?: string,
            "R.CI.CODE"?: string,
            "CREDIT.THEIR.REF"?: string,
            "DEBIT.THEIR.REF"?: string,
            "AT.UNIQUE.ID"?: string,
            "CHEQUE.NUMBER"?: string,
            "KB.MCHUONG"?: string,
            "PHONE.NUMBER"?: string,
            "CLEARING.ID"?: string,
            'MB.PRDT.ID'?: string,
            "OVEREM.MTCN"?: string
        },
        empty?: boolean
    }
}

export interface IPaymentDetail {
    "PAYMENT.DETAILS"?: string
}

export interface ICpPayment {
    "CP.PAYMENT"?: string
}

export interface ISuppressedErrors {
    code?: string,
    message?: string,
    forwardError?: {
        httpStatus?: number,
        errorCode?: string,
        serviceCode?: string,
        message?: string,
        path?: string,
        rawResponse?: string
    },
    suppressedErrors?: string
}

export interface IProcessInfos {
    creditAccountNo?: string,
    creditAccountType?: string,
    kind?: string,
    error?: {
        code?: string,
        message?: string,
        forwardError?: string,
        suppressedErrors?: ISuppressedErrors[]
    },
    transactionReference?: string,
    originalTransactionReference?: string,
    transactionId?: string,
    originalTransactionId?: string
}

export interface IGetWhitelistCategoriesParams {
    subProduct?: string;
    category?: string;
    code?: string;
    active?: boolean
    page: number;
    size: number;
    sort?: string;
    subProductRequired?: boolean;
}
export interface IWhitelistCategoryContent {
    stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
    id: string;
    category:string;
    code: string;
    subProduct:string;
    active: boolean;
    deleted:boolean;
    subProductRequired:boolean;
    reason: string,
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}
export interface IRequestPostWhitelistCategory {
    category:string;
    code: string;
    subProduct:string;
    active: boolean;
    deleted:boolean;
    subProductRequired:boolean;
    reason: string;
}
export interface IRequestPutWhitelistCategory {
    category:string;
    code?: string;
    subProduct?:string;
    active?: boolean;
    deleted?:boolean;
    subProductRequired?:boolean;
    reason: string;
}
export interface IPostWhitelistCategoryContent {
    id: string;
    category:string;
    code: string;
    subProduct:string;
    active: boolean;
    deleted:boolean;
    subProductRequired:boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface IConfig {
  id: number,
  configId: number,
  key: string,
  active: boolean,
  reason: string,
  action: string,
  createdBy: string,
  value: any,
  createdAt: string,
  updatedBy: string,
  updatedAt: string
}

export interface IAbbreviationConfig extends IConfig {
  value: {
    key: string;
    abbreviations: {
      $type: "abbreviation";
    } & {
      [key: string]: string[];
    };
  };
}

export interface IGetWhitelistCategoriesHistoriesParams {
    subProduct?: string;
    category?: string;
    code?: string;
    active?: boolean;
    page: number;
    size: number;
    sort?: string;
    subProductRequired?: boolean;
    updatedAtFrom?: string,
    updatedAtTo?: string,
    updatedBy?: string
    whitelistCategoryIds?: string[]
}
export interface IWhitelistCategoryHistoryContent {
    stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
    id: string;
    action: string,
    whitelistCategoryId: number,
    category:string;
    reason:string;
    code: string;
    subProduct:string;
    active: boolean;
    deleted:boolean;
    subProductRequired:boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}
export interface IGetStateTreasuriesParams {
    name?: string,
    creditAccountNo?: string,
    branchCode?: string,
    codes? :string,
    page: number;
    size: number;
    sort?: string;
}
export interface IStateTreasuryContent {
    stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
    id: string;
    code: string,
    name: string,
    creditAccountNo: string,
    branchCode: string,
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}
export interface IRequestPostStateTreasury {
    code: string,
    name: string,
    creditAccountNo: string,
    branchCode: string,
    reason: string;
}
export interface IRequestPutStateTreasury {
    name?: string,
    creditAccountNo?: string,
    branchCode?: string,
    reason?: string;
    code?: string,
}
export interface IGetStateTreasuriesHistoriesParams {
    page: number;
    size: number;
    sort?: string;
    name?: string,
    creditAccountNo?: string,
    branchCode?: string,
    codes? :string,
    updatedAtFrom?: string,
    updatedAtTo?: string,
    updatedBy?: string
    
}
export interface IStateTreasuriesHistoryContent {
    stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
    id: string;
    code: string,
    name: string,
    creditAccountNo: string,
    branchCode: string,
    reason:string;
    action:string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface IGetTransactionCreditHistoriesParams {
  page: number;
  size: number;
  sort?: string;
  key?: string,
  createdAtFrom?: string,
  createdAtTo?: string,
  createdBy?: string

}

export interface ITransactionCreditContent {
  stt: number;
  id: string;
  key: string,
  type: string,
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ITransactionCreditHistoryContent {
  stt: number;
  id: number;
  key: string,
  type: string,
  configId: string,
  reason:string;
  action:string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  value: string;
}

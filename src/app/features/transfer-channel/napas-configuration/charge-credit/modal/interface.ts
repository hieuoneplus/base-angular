export interface PaginationBaseDto<T> {
    content: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}

export interface PaginationChargrCreditDto<T> {
    chargeCredits: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}


export interface PaginationChargeCreditDto<T> {
    content: T[];
    totalPages: number,
    totalElements: number,
    pageable: {
        pageNumber: number,
        pageSize: number,
        sort: {
            empty: boolean,
            sorted: boolean,
            unsorted: boolean
        },
        offset: number,
        unpaged: boolean,
        paged: boolean
    },
    size: number,
    number: number,
    sort: {
        empty: boolean,
        sorted: boolean,
        unsorted: boolean
    },
    first: boolean,
    last: boolean,
    numberOfElements: number,
    empty: boolean
}

export interface IParamsSearch {
    disputeId?: string,
    id?: string,
    fromDate?: string,
    toDate?: string,
    transactionReferenceNumber?: string,
    direction?: string,
    type?: string,
    fromAmount?: string,
    toAmount?: string,
    status?: string,
    disputeType?: string,
    pageNumber?: number,
    pageSize?: number,
}

export interface IParamsSearchCreate {
    senderReference?: string,
    traceNumber?: string,
    disputeType?: string,
    disputeAssignee?: string,
    disputeAssigner?: string,
    fromDate?: string,
    toDate?: string,
    origTransactionReference?: string,
    disputeTypeCode?: string,
    disputeClaimCode?: string,
    disputeStatus?: string,
    disputeId?: string,
    user?: string,
    page?: number,
    pageNumber?: number,
    pageSize?: number,
    size?: number
}

export interface IParamsSearchTransactionOrigin {
    transactionReferenceNumber: string,
    systemTraceAuditNumber?: string,
    transactionDate?: string,
}

export interface IResponseChargeCredit {
    stt: number,
    id: string,
    disputeId: string,
    createdAt: string,
    amountValue: number,
    amountCurrencyCode: string,
    approvalStatus: string,
    creationDateTime: string,
    updatedAt: string,
    transactionType: string,
    type: string,
    napasRespond: string,
    origTransactionReference: string,
    reason: string,
    caseId: string,
    indicatorResponseCode: string,
    indicatorResponseDescription: string,
    updatedBy: string,
    createdBy: string
}

export interface IResponseTransactionDispute {
    stt: number,
    id: string,
    senderReference: string,
    creationDateTime: string,
    caseId: string,
    origProcessingCode: string,
    origSystemTrace: string,
    origLocalTime: string,
    origLocalDate: string,
    origSendingMember: string,
    origCardAcceptorTerminalId: string,
    origTransactionReference: string,
    origTransactionAmount: string,
    origTransactioncurrencyCode: string,
    origSettlementAmount: string,
    origSettlementCurrencyCode: string,
    origReceivingMember: string,
    origSenderAcc: string,
    origReceiverAcc: string,
    origCreatedAt: string,
    disputeId: string,
    disputeAssigner: string,
    disputeAssignee: string,
    disputeCreationDateTime: string,
    disputeTypeCode: string,
    disputeClaimCode: string,
    disputeSender: string,
    disputeAmount: number,
    disputeCurrencyCode: string,
    disputeSubject: string,
    disputeMessage: string,
    disputeStatus: string,
    approveDisputeStatus: string,
    fileName: string,
    fileId: string,
    mimeType: string,
    encodeType: string,
    charSet: string,
    fileBinary: string,
    state: 0,
    dueDate: string,
    reason: string,
    description: string,
    correctProcessingCode: string,
    correctTransactionAmount: string,
    correctTransactioncurrencyCode: string,
    correctSettlementAmount: string,
    correctSettlementcurrencyCode: string,
    correctSystemTrace: string,
    correctLocalTime: string,
    correctLocalDate: string,
    correctSendingMember: string,
    correctCardAcceptorTerminalId: string,
    correctTransactionReference: string,
    transactionType: string,
    createdAt: string,
    napasRespond: string,
    type: string,
    updatedAt: string,
    indicatorResponseCode: string,
    indicatorResponseDescription: string,
    senderName: string,
    receiverName: string,
}

export interface PaginationTransactionOriginalDto<T> {
    content: T[];
    totalPages: number,
    totalElements: number,
    pageable: {
        pageNumber: number,
        pageSize: number,
        sort: {
            empty: boolean,
            sorted: boolean,
            unsorted: boolean
        },
        offset: number,
        unpaged: boolean,
        paged: boolean
    },
    size: number,
    number: number,
    sort: {
        empty: boolean,
        sorted: boolean,
        unsorted: boolean
    },
    first: boolean,
    last: boolean,
    numberOfElements: number,
    empty: boolean
}

export interface IResponseTransactionOriginal {
    transactionId: string,
    transactionReferenceNumber: string,
    transactionStatus: string,
    w4Status: string,
    direction: string,
    timeLocalTransaction: string,
    dateLocalTransaction: string,
    paymentCode: string,
    systemTraceAuditNumber: string,
    ft: string,
    dateSettlement: string,
    way4WalletReferenceNumber: string,
    napasStatus: string,
    acceptingInstitutionIdentificationCode: string,
    fromAccountIdentification: string,
    settlementAmount: number,
    settlementCurrencyCode: number,
    additionalDataPrivate: string,
    contentTransfers: string,
    receivingInstitutionIdentificationCode: string,
    toAccountIdentification: string,
    informationCardOrAccountBeneciary: string,
    authorizationIdentificationResponse: string,
    userDefinedField: string,
    docId: string,
    senderName: string,
    receiverName: string,
}

export interface ICreateChargeCredit {
    disputeId:  string,
    chargeCreditData: {
        chargeCreditAmount: {
            value: number,
            currencyCode: string
        }
    }
}

export interface IUpdateChargeCredit {
    disputeId:  string,
    amount: number,
    currency: string,
    status: string,
}
export interface IApproveChargeCredit {
    action: string,
    id: string,
    reason: string,
}
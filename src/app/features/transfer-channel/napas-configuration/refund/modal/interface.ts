export interface PaginationBaseDto<T> {
    content: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}

export interface PaginationTransactionRefundDto<T> {
    pageSize: number,
    pageNumber: number,
    total: number,
    returnResponses: T[],
}

export interface PaginationTransactionRefundBatchDto<T> {
    pageSize: number,
    pageNumber: number,
    total: number,
    batchReturnResponses: T[],
}

export interface PaginationTransactionDisputeDto<T> {
    disputes: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}

export interface IParamsSearch {
    id?: string,
    origSystemTrace?: string,
    origTransactionReference?: string,
    origFT?: string,
    caseId?: string,
    creationDateTime?: string,
    toCreationDateTime?: string,
    batchId?: string,
    direction?: string,
    sendingMember?: string,
    receivingMember?: string,
    returnStatus?: string[],
    disputeId?: string,
    page?: number,
    size?: number,
}

export interface IParamsSearchBatch {
    createAt?: string,
    toCreateAt?: string,
    status?: string,
    fileName?: string,
    id?: string,
    page?: number,
    size?: number,
}
export interface IResponseTransactionRefund {
    stt: number,
    id: string,
    batchId: string,
    senderReference: string,
    caseId: string,
    processingCode: string,
    transactionAmount: number,
    currencyCode: string,
    transDateTime: string,
    localTime: string,
    localDate: string,
    referenceNumber: string,
    cardAcceptorTerminalId: string,
    senderAcc: string,
    receiverAcc: string,
    disputeId: string,
    contentTransfers: string,
    origTransactionReference: string,
    status: string,
    reason: string,
    direction: string,
    transactionAccountingType: boolean,
    origCreateDateTime: string,
    returnType: string,
    ft: string,
    systemTrace: string,
    sendingMember: string,
    receivingMember: string,
    settlementAmount: number,
    settlementCurrencyCode: string,
    settlementConversionRate: string,
    settlementDate: string,
    settlementStatus: string,
    responseCode: string,
    settlementCode: string,
    originalService: string,
    errorCode: string,
    errorDesc: string,
    createdAt: string,
    updatedAt: string,
    mti: string,
    creationDateTime: string,
    transactionReference: string,
    origCreatedAt: string,
    createdBy: string,
    updatedBy: string
}
export interface IResponseTransactionRefundBatch {
    stt: number,
    id: string,
    fileName: string,
    transactionCount: number,
    successTransactionCount: number,
    failTransactionCount: number,
    processingTransactionCount: number,
    createAt: string,
    approveAt: string,
    createBy: string,
    approveBy: string,
    status: string,
}

export interface IParamsSearchTransactionOrigin {
    transactionReferenceNumber: string,
    systemTraceAuditNumber?: string,
    transactionDate?: string,
    toTransactionDate?: string,
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
    createdAt: string,
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
export interface ICreateTransactionRefund {
    type: string,
    returnId?: string,
    returnDataProcessingCode: string,
    returnDataTransactionAmount: number,
    returnDataCurrencyCode: string,
    senderAcc: string,
    receiverAcc: string,
    disputeId: string,
    contentTransfers: string,
    originalDataOrigTransactionReference: string,
    transactionAccountingType: string,
    origCreateDateTime: string,
}

export interface IApproveTransactionRefund {
    action: string,
    batchId?: string;
    id?: string;
    reason: string,
}

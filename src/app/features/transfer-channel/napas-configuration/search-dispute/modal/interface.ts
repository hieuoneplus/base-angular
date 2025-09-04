export interface PaginationBaseDto<T> {
    disputes: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}

export interface PaginationTransactionRefundDto<T> {
    returnResponses: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}

export interface PaginationChargeCreditsDto<T> {
    chargeCredits: T[];
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

export interface IParamsSearch {
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
    toTransactionDate?: string,
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
    origTransactionAmount: number,
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
export interface IOriginalData {
    origProcessingCode: string,
    origSystemTrace: string,
    origLocalTime: string,
    origLocalDate: string,
    origSendingMember: string,
    origCardAcceptorTerminalId: string,
    origTransactionReference: string,
    origAdditionalInformation: {
        origTransactionAmount: {
            value: string,
            currencyCode: string
        },
        origSettlementAmount: {
            value: string,
            currencyCode: string
        },
        origReceivingMember: string,
        origSenderAcc: string,
        origReceiverAcc: string
    }
}

export interface IDisputeData {
    disputeId: string,
    disputeAssigner: string,
    disputeAssignee: string,
    disputeCreationDateTime: string,
    disputeTypeCode: string,
    disputeClaimCode: string,
    disputeSender: string,
    disputeAmount: {
        value: string,
        currencyCode: string
    },
    disputeSubject: string,
    disputeMessage: string,
    disputeStatus: string,
    fileAttachment: IFileAttachment[],
    approveDisputeStatus: string
}

export interface IFileAttachment {
    fileName: string | string,
    mimeType: string | string,
    fileBinary: string | string
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

export interface ICreateDispute {
    originalData: {
        origTransactionReference: string
        origCreatedAt: string
    },
    approvalDisputeStatus: string, //WAITING
    disputeData: {
        disputeId?: string,
        disputeTypeCode: string,
        disputeClaimCode: string
    },
    disputeAmount: {
        value?: number,
        currencyCode: string// VND
    },
    disputeSubject: string,
    disputeMessage: string,
    disputeStatus: string,
    fileAttachments: [
        {
            fileName: string,
            mimeType: string,
            encodeType: string,
            charSet: string,
            fileBinary: string
        }
    ]
}

export interface IApproveTransactionDispute {
    action: string,
    disputeId: string,
    reason: string,
}

export interface IApproveBatchDispute {
    action: string,
    disputeIds: string[],
    reason: string,
}

export interface IResponseTransactionRefund {
    id: string,
    batchId: string,
    caseId: string,
    processingCode: string,
    transactionAmount: number,
    currencyCode: string,
    senderAcc: string,
    receiverAcc: string,
    disputeId: string,
    contentTransfers: string,
    origTransactionReference: string,
    status: string,
    reason: string,
    direction: string,
    transactionAccountingType: string,
    origCreateDateTime: string,
    returnType: string,
    ft: string,
    systemTrace: string,
    sendingMember: string,
    receivingMember: string
}

export interface IResponseChargeCredits {
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
    indicatorResponseDescription: string
}

export interface ICreateDisputeResponse {
    originalRequest: {
        originalData: {
            origTransactionReference: string,
            origCreatedAt?: string
        }
    },
    disputeData: {
        disputeId: string,
        disputeSubject: string,
        disputeMessage: string,
        disputeAmount: {
            value: number,
            currencyCode: string
        },
        disputeStatus: string,
        fileAttachment: [
            {
                fileName: string,
                mimeType: string,
                encodeType: string,
                charSet: string,
                fileBinary: string
            }
        ]
    }
}

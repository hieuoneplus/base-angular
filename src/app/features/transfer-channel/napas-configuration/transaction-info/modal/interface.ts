export interface PaginationBaseDto<T> {
    content: T[];
    pageNumber?: number;
    pageSize?: number;
    total?: number;
}

export interface PaginationTransactionInfoDto<T> {
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
    fromAccountIdentification?: string,
    ft?: string,
    systemTraceAuditNumber?: string,
    toAccountIdentification?: string,
    transactionDate?: string,
    toTransactionDate?: string,
    transactionId?: string,
    transactionReferenceNumber?: string,
}
export interface IResponseTransactionInfo {
    stt: number,
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
    createdAt: string
}

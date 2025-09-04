export interface PaginationBaseDto<T> {
    flagReportResponses: T[];
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
    id?: string,
    reportName?: string,
    flag?: string,
    flagOrs?: string,
    versionReconcile?: string,
    createdAt?: string,
    // toCreatedAt?: string
}
export interface IResponseFlagReport {
    stt: number,
    id: string,
    reportName: string,
    receivingRole: string,
    settlementDate: string,
    settlementCode: string,
    services: string,
    flag: string,
    flagOrs: string,
    reportId: string,
    versionReconcile: string,
    totalPage: string,
    createDate: string
}

export interface IRequestFlagReport {
    reportName: string,
    receivingRole: string,
    settlementDate: string,
    settlementCode: string,
    services: string,
    flag: string,
    flagOrs: string,
    reportId: string,
    versionReconcile: string,
    totalPage: string,
    createDate: string,
}

export interface IRequestUpdateFlagReport {
    id: string,
    flagOrs: string,
    reportId: string,
    createDate: string,
}

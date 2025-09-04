export interface IResponseMbsSignal {
    id: number;
    key: string;
    value: {
        $type: string;
        partnerTransactionPatterns: string[]
    };
    active: boolean;
    reason: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface PaginationHistoryMbsSignalDto<T> {
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

export interface IResponseHistoryMbsSignal {
    id: number;
    configId: number;
    key: string;
    active: boolean;
    reason: string;
    action: string;
    createdBy: string;
    value: {
        $type: string;
        abbreviations: {
            "DOANH NGHIEP TN": string[];
            "Doanh nghiệp Trang": string[];
            "DNTN": []
        }
    };
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface IRequestUpdateMbsSignal {
    key: string,
    value: {
        $type: string,
        partnerTransactionPatterns: string[]
    },
    reason: string
}

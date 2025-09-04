export interface IResponseOnOffGateWay {
    id: number;
    key: string;
    value: {
        $type: string;
        values: boolean[]
    };
    active: boolean;
    reason: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface PaginationHistoryOnOffGateWayDto<T> {
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

export interface IResponseHistoryOnOffGateWay {
    id: number;
    configId: number;
    key: string;
    active: boolean;
    reason: string;
    action: string;
    createdBy: string;
    value: {
        $type: string;
        values: {
            
        }
    };
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

export interface IRequestUpdateOnOffGateWay {
    key: string,
    value: {
        $type: string,
        values: boolean[]
    },
    reason: string
}
export interface UpdateOnOffGatewayContent {
    stt: number;
    gateway:string;
    active: boolean;
  }
export interface IPageable<T> {
    content: T[],
    page: number,
    size: number,
    total: number,
  }
  
  export interface IHistorySortParams {
    sort?: string,
    updatedAtFrom: string,
    updatedAtTo: string,
    updatedBy: string
  }
  
  export interface IHistory {
    stt?: number,
    id?: number,
    action: string,
    transferChannel?: string,
    minAmount?: number,
    maxAmount?: number,
    fragmentMaxAmount?: number,
    fragmentAmount?: number,
    active: boolean,
    reason?: string,
    createdAt?: string,
    createdBy?: string,
    updatedAt?: string,
    updatedBy?: string,
  }
  
  export interface IDetailHistoryConfig {
    id?: number,
    action?: string,
    transferChannel?: string,
    minAmount?: number,
    maxAmount?: number,
    fragmentMaxAmount?: number,
    fragmentAmount?: number,
    active?: boolean,
    reason?: string,
    createdAt?: string,
    createdBy?: string,
    updatedBy?: string,
    updatedAt?: string
  }
  export interface ITransferChannelLimitContent {
    stt: number;
    id: number;
    transferChannel: string;
    minAmount?: number;
    maxAmount?: number;
    currency: string;
    fragmentAmount: number;
    fragmentMaxAmount: number;
    active: string;
    createdBy?: string,
    createdAt?: string,
    updatedBy?: string,
    updatedAt?: string
}

export interface ISearchParams {
    transferChannel ?: string;
    active?: boolean;
    page: number;
    size: number;
}

export interface IPostTransferChannelLimitBody {
    transferChannel: string;
    minAmount?: number;
    maxAmount?: number;
    currency: string;
    fragmentAmount?: number;
    fragmentMaxAmount?: number;
    active?: boolean;
    reason?: string;
}

export interface IPutTransferChannelLimitBody {
    minAmount?: number;
    maxAmount?: number;
    fragmentAmount?: number;
    fragmentMaxAmount?: number;
    active?: boolean;
    reason?: string;
}
  
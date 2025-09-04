export interface PaginationBaseDto<T> {
  configHistories: T[];
  pageNumber?: number;
  pageSize?: number;
  total?: number;
}

export interface IHistorySortParams {
  key: string,
  sort?: string,
  createdAtFrom: string,
  createdAtTo: string,
  createdBy: string
}

export interface IConfig {
  id: number,
  key: string,
  value: string,
  description: string,
  createTime: string,
  reason: string,
  actionType: string,
  createdBy: string,
}


export interface IResponseTransactionLag {
  key: string,
  value: string,
  description: string
}

export interface IRequestTransactionLag {
  reason: string,
  value: string,
  description?: string
}
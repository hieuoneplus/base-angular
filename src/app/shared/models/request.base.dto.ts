export interface HttpOptions {
    url?: string;
    path?: string;
    body?: any;
    headers?: any;
    params?: any;
    cacheMins?: number;
    isAuthentication?: boolean;
    uuid?: string;
    responseType?: string;
}

export interface HttpResponse<T> {
    clientMessageId: string;
    error?: string;
    path: string;
    status: number;
    timestamp: string;
    data?: T;
    originalService?: string;
    soaErrorCode?: string;
    soaErrorDesc?: string;
  }

export interface IPageable<T> {
  content: T,
  pageable: {
    pageNumber: number,
    pageSize: number,
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    }
    offset: number,
    unpaged: boolean,
    paged: boolean
  }
  last: boolean,
  totalPages: number,
  totalElements: number,
  size: number,
  number: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  first: boolean,
  numberOfElements: number,
  empty: false
}

export interface HttpResponseArray<T> {
  clientMessageId: string;
  error?: string;
  path: string;
  status: number;
  timestamp: string;
  data?: T[];
  originalService?: string;
  soaErrorCode?: string;
  soaErrorDesc?: string;
}

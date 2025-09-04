
export interface IHistorySortParams {
  key: string,
  sort?: string,
  createdAtFrom: string,
  createdAtTo: string,
  createdBy: string
}

export interface IHistory {
  stt?: number,
  id?: number,
  action: string,
  whitelistAccountId?: number,
  bankCode?: string,
  transferChannel?: boolean,
  accountNo?: string,
  reason?: string,
  active: boolean,
  approvalStatus?: string,
  approvalStatusLabel?: string,
  createdAt?: string,
  createdBy?: string,
  updatedAt?: string,
  updatedBy?: string,
  approvedAt?: string,
  approvedBy?: string,
}

export interface IPageable<T> {
  content: T[],
  page: number,
  size: number,
  total: number,
}


export interface IWhitelistContent {
  stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
  id: string;
  accountNo: string;
  bankCode: string;
  transferChannel: string;
  approvalStatus: string;
  approvalStatusLabel: string;
  active: boolean;
}

export interface IDetailHistoryWhitelist {
  id?: number,
  action: string,
  whitelistAccountId?: number,
  transferChannel?: string,
  bankCode?: string,
  accountNo?: string,
  approvalStatus?: string,
  reason?: string,
  active?: boolean,
  createdAt?: string,
  createdBy?: string,
  updatedAt?: string,
  updatedBy?: string,
  approvedAt?: string,
  approvedBy?: string
}

export interface IGetAccountsParams {
  accountNo?: string;
  bankCode?: string;
  channel?: string;
  active?: string;
  page: number;
  size: number;
  sort?: string;
}


export interface IRequestPutAccount {
  accountNo?: string;
  bankCode?: string;
  transferChannel?: string;
  reason?: string;
  active?: boolean;
}


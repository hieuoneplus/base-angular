

export interface IBlacklistContent {
  stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
  id: string;
  accountNo: string;
  bankCode: string;
  transactionType: string;
  type: string;
  active: boolean;
}

export interface IGetAccountsParams {
  accountNo?: string;
  bankCode?: string;
  type?: string;
  transactionType?: string;
  active?: string;
  page: number;
  size: number;
  sort?: string;
}


export interface IRequestPutAccount {
  accountNo?: string;
  bankCode?: string;
  type?: string;
  transactionType?: string;
  reason?: string;
  active?: boolean;
}

export interface IGetBanksParams {
  bankCode?: string;
  cityCode?: string;
  showBranch?: string;
  page: number;
  size: number;
  sort?: string;
}

export interface IBankContent {
  shortName: string;
  fullName: string;
  bankCode: string;
}

export interface IPageable<T> {
  content: T[],
  page: number,
  size: number,
  total: number,
}

export interface IBlacklistHistoryContent {
  stt: number;
  id: number;
  action: string;
  transferChannelBankConfigId: number;
  accountNo: string;
  bankCode: string;
  transactionType: string;
  type: string;
  active: boolean;
  reason: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
export interface IHistorySortParams {
  key: string,
  sort?: string,
  createdAtFrom: string,
  createdAtTo: string,
  createdBy: string
}


export interface IGetBankCodeCardBinParams {

}
export interface IBankCodeCardBinContent {
  stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
  id: string;
  bankCode: string;
  cardBin: string;
  transferChannel: string;
  active: boolean;
  reason: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
export interface IRequestPostBankCodeCardBin {
  bankCode: string;
  cardBin: string;
  transferChannels: IAddTransferChannelModel[];
  reason: string;
}
export interface IRequestPutBankCodeCardBin {
  active?: boolean;
  reason: string;
}
export interface IGetBankCodeCardBinHistoriesParams {
  updatedAtFrom?: string,
  updatedAtTo?: string,
  updatedBy?: string

}
export interface IBankCodeCardBinHistoryContent {
  stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
  id: number;
  action: string;
  transferChannelBankConfigId: number;
  bankCode: string;
  cardBin: string;
  transferChannel: string;
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

export interface IHistory {
  stt?: number,
  id?: number,

  createdAt?: string,
  createdBy?: string,
  updatedAt?: string,
  updatedBy?: string,

}

export interface IPageable<T> {
  content: T[],
  page: number,
  size: number,
  total: number,
}

export interface IAddTransferChannelModel {
  stt?: number;
  transferChannel?: string;
  active?: boolean
}

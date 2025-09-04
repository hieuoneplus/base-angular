
export interface IIntegratedChannelContent {
  stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
  id: string;
  channel: string;
  transactionType:	string;
  reason: string;
  status: string;
}

export interface IGetIntegratedChannelParams {
  channel?: string;
  transactionType?:	string;
  status?: boolean;
  page: number;
  size: number;
  sort?: string;
}

export interface IRequestPostIntegratedChannel {

  channel: string;
  transactionType:	string;
  reason: string;
  status: string;
}

export interface IRequestPutIntegratedChannel {
  channel: string;
  transactionType?:	string;
  reason: string;
  status?: string;
}

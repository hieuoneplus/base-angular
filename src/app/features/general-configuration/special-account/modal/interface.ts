
export interface ISpecialAccountContent {
  stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
  id: string;
  name: string;
  partnerType: string;
  active: boolean;
  partnerAccount: string;
  protocol: string;
  channel: string;
  getNameUrl: string;
  confirmUrl: string;
  regex: string;
  approvalStatus: string;
  minTransLimit?: number;
  maxTransLimit?: number;
  partnerPublicKey?: string;
  mbPrivateKey?: string;
  isRetryConfirm?: boolean;
  reason: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface IAliasAccountHistoryContent {
  stt: number;
  id: string;
  action: string;
  papAliasAccountId: number;
  name: string;
  partnerType: string;
  active: boolean;
  partnerAccount: string;
  protocol: string;
  channel: string;
  getNameUrl: string;
  confirmUrl: string;
  regex: string;
  approvalStatus: string;
  minTransLimit?: number;
  maxTransLimit?: number;
  partnerPublicKey?: string;
  mbPrivateKey?: string;
  isRetryConfirm?: boolean;
  reason: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
}
export interface IGetAliasParams {
  name?: string;
  active?: string;
  page: number;
  size: number;
  sort?: string;
}

export interface IPutAliasBody {
  name?: string;
  partnerType?: string;
  partnerAccount?: string;
  getNameUrl?: string;
  confirmUrl?: string;
  protocol?: string;
  channel?: string;
  regex?: string;
  minTransLimit?: number;
  maxTransLimit?: number;
  partnerPublicKey?: string;
  mbPrivateKey?: string;
  reason?: string;
  active?: boolean;
  isRetryConfirm?: boolean;
}

export interface IGetAliasHistoriesParams {
  page: number;
  size: number;
  sort?: string;
  updatedAtFrom?: string,
  updatedAtTo?: string,
  updatedBy?: string
}

export interface IReasonReject {
  reason?: string;
}

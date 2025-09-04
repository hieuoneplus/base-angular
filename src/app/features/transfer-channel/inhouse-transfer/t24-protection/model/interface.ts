
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
  configId?: number,
  key?: string,
  value?: T24ProtectionValue,
  reason?: string,
  createdAt?: string,
  createdBy?: string,
  updatedBy?: string,
  updatedAt?: string,
  deleted?: boolean,
}

export interface T24ProtectionConfig {
  channel: string;
  waitingTimeSecond: number;
  leaseTimeSecond: number;
  ccuAccountThreshold: number;
  keyExpireTimeSecond: number;
  active?: boolean;
  channelDetail?: string;
}

export interface T24ProtectionValue {
  $type: 't24_protection';
  t24ProtectionConfigs: T24ProtectionConfig[];
}

export interface IT24ProtectionContent {
  id: number
  key: "t24.protection"
  value: {
    $type: "t24_protection";
    t24ProtectionConfigs: T24ProtectionConfig[]
  };
  reason?: string
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}



export interface IPutT24ProtectionBody {
  value: {
    $type: "t24_protection";
    t24ProtectionConfigs: T24ProtectionConfig[]
  };
  reason?: string
}


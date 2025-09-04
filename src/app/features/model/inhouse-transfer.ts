export interface IConfigAuditContent {
  id: number;
  key: string;
  value: IConfigList;
  desciption: string;
}

export interface IConfigList {
  $type: string;
  transferChannelsState: IConfig[];
}

export interface IConfig {
  // stt: number;
  transferChannel?: string;
  reopenTime?: string;
  closeDurationSecond?: string;
  active: boolean;
}

export interface IRequestPutConfig {
  key: string;
  value: IConfigList;
  description: string;
}

export interface IConfig {
    id: number,
    configId: number,
    key: string,
    active: boolean,
    reason: string,
    action: string,
    createdBy: string,
    value: any,
    createdAt: string,
    updatedBy: string,
    updatedAt: string
  }


export interface IHistorySortParams {
  key: string,
  sort?: string,
  createdAtFrom: string,
  createdAtTo: string,
  createdBy: string
}

export interface IDetailHistoryConfig {
  id?: number,
  configId?: number,
  key?: string,
  active?: boolean,
  reason?: string,
  action?: string,
  createdBy?: string,
  value?:
    {$type?: string;} &
    {[key: string]: string[]}
  ;
  createdAt?: string,
  updatedBy?: string,
  updatedAt?: string
}

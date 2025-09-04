export interface ICommonConfig {
  id: number,
  functionCode: string,
  key: string,
  value: string,
  description: string | null,
  isActive: string
}

export interface ICommonConfigDatasource extends ICommonConfig {
  stt: number
}

export interface ICommonConfigRequest extends ICommonConfig {
  reason: string,
}

//INTERMEDIATE ACCOUNT INTERFACE
export interface IIntermediateAccountConfig {
  id: number,
  accountName: string,
  accountNumber: string,
  accountType: string,
  description: string,
  currency: string,
  functionCode: string,
  isActive: string
}

export interface IIntermediateAccountUpdateConfiReq extends IIntermediateAccountConfig {
  newAccountNumber?: string
}

export interface IIntermediateAccountRequest extends Omit<IIntermediateAccountConfig, 'id'> {
  reason: string,
}

export interface IIntermediateAccountConfigDataSource extends IIntermediateAccountConfig {
  stt: number
}


export interface ITktgCreditContent {
  stt: number; // thuộc tính cho stt ở bảng hiển thị trên UI
  id: string;
  creditAccounts: Account;
  transferChannel: string;
  convertAccount?: string;
  reason: string;
}

export interface IGetAccountsParams {
  transferChannel: string;
}

export class Account {
  constructor(arr : string[]) {
    this.accounts = arr
  }

  accounts: string[];
}


export interface IRequestPutAccount {
  creditAccounts: Account;
  transferChannel: string;
  reason: string;
}

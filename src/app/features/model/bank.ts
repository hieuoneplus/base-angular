export interface IBankContent {
    stt: number;
    id: string;
    bankCode: string;
    ibftCode: string;
    shortName: string;
    fullName: string;
    reason: string;
    active: boolean;
  }

  export interface IGetBankParams {
    code?: string;
    active?: string;
    shortName?: string;
    fullName?: string;
    page: number;
    size: number;
    sort?: string;
  }

  export interface IBanksContent {
    bankCode: string;
    shortName: string;
    fullName: string;
    branchList?: IBranchListContent[];
  }

  export interface IBranchListContent {
    branchCode: string,
    branchName: string,
    city: string,
    type: string
  }

  export interface IRequestParamsBank {
    showBranch?: boolean;
    bankCode?: string;
    page: number;
    size: number;
    sort?: string;
  }

export interface IBankContent {
  shortName: string;
  fullName: string;
  bankCode: string;
}

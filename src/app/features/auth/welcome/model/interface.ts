export interface IPageable<T> {
    content: T[],
    page: number,
    size: number,
    total: number,
  }

  export interface ILoginResponse {
    token?: string,
    username?: string,
    expiresIn?: number
  }

  export interface ILoginRequest {
    username?: string,
    password?: string
  }

  export interface IDetailHistoryConfig {
    id?: number,
    action?: string,
    cityCode: string;
    cityName: string;
    description: string;
    active?: boolean,
    reason?: string,
    createdAt?: string,
    createdBy?: string,
    updatedBy?: string,
    updatedAt?: string
  }
  export interface IProvinceContent {
    stt: number;
    id: number;
    cityCode: string;
    cityName: string;
    description: string;
    active: boolean;
    createdBy?: string,
    createdAt?: string,
    updatedBy?: string,
    updatedAt?: string
}

export interface ISearchParams {
  cityCode ?: string;
  cityName?: string;
  active?: boolean;
  page: number;
  size: number;
}

export interface IPostProvinceBody {
  cityCode: string;
  cityName: string;
  description: string;
  active: boolean;
  reason?: string;
}

export interface IPutProvinceBody {
  cityCode?: string;
  cityName?: string;
  description?: string;
  active?: boolean;
  reason?: string;
}

export interface IExportParams {
  cityCode ?: string;
  cityName?: string;
  active?: boolean;
}

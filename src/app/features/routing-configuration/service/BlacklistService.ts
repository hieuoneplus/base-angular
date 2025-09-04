import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { PaginationBaseDto } from 'src/app/shared/models/pagination.base.dto';
import {
  IBankContent,
  IBlacklistContent, IBlacklistHistoryContent,
  IGetAccountsParams,
  IGetBanksParams,
  IHistorySortParams, IPageable,
  IRequestPutAccount
} from '../blacklist/modal/interface';



@Injectable({
  providedIn: 'root',
})
export class BlacklistService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getAccounts(params: IGetAccountsParams): Observable<HttpResponse<PaginationBaseDto<IBlacklistContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.BLACKLIST,
      params
    }
    return this.httpClientService.get(option);
  }

  postAccount(requestPostUser: IRequestPutAccount): Observable<HttpResponse<IBlacklistContent>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.BLACKLIST,
      body: body
    }
    return this.httpClientService.post(option);
  }

  putAccounts(requestPostUser: IRequestPutAccount, id: string): Observable<HttpResponse<IBlacklistContent>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.BLACKLIST + `/${id}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getAccountDetail(id: string): Observable<HttpResponse<IBlacklistContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.BLACKLIST + `/${id}`,
    }
    return this.httpClientService.get(option);
  }

  getBanks(params: IGetBanksParams): Observable<HttpResponse<PaginationBaseDto<IBankContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.BANK.CM,
      params
    }
    return this.httpClientService.get(option);
  }
  getHistory(params: IHistorySortParams, id: string): Observable<HttpResponse<IPageable<IBlacklistHistoryContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.BLACKLIST + `/${id}/history`,
      params,
    }
    return this.httpClientService.get(option);
  }
  getDetailHistory(id: number): Observable<HttpResponse<IBlacklistHistoryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.BLACKLIST + `/history/${id}`,
    }
    return this.httpClientService.get(option);
  }

}

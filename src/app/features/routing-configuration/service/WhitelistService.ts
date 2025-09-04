import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { PaginationBaseDto } from 'src/app/shared/models/pagination.base.dto';
import { IHistorySortParams, IHistory, IPageable, IWhitelistContent, IDetailHistoryWhitelist } from '../whitelist/modal/interface';
import { IGetAccountsParams, IRequestPutAccount } from '../whitelist/modal/interface';



@Injectable({
  providedIn: 'root',
})
export class WhitelistService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getAccounts(params: IGetAccountsParams): Observable<HttpResponse<PaginationBaseDto<IWhitelistContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST,
      params
    }
    return this.httpClientService.get(option);
  }

  rejectAccount(id: string, reason: string): Observable<HttpResponse<String>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST + `/${id}` + `/reject`,
      body: {reason: reason}
    }
    return this.httpClientService.post(option);
  }

  approveAccount(id: number): Observable<HttpResponse<String>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST + `/${id}` + `/approve`,
    }
    return this.httpClientService.post(option);
  }

  postAccount(requestPostUser: IRequestPutAccount): Observable<HttpResponse<IWhitelistContent>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST,
      body: body
    }
    return this.httpClientService.post(option);
  }

  putAccounts(requestPostUser: IRequestPutAccount, id: string): Observable<HttpResponse<IWhitelistContent>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST + `/${id}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getAccountDetail(id: string): Observable<HttpResponse<IWhitelistContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST + `/${id}`,
    }
    return this.httpClientService.get(option);
  }

  getHistoryConfigList(params?: IHistorySortParams, id?: string): Observable<HttpResponse<IPageable<IHistory>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST + `/${id}` + `/history`,
      params: {
        ...params,
        sort: params.sort ? params.sort : 'id:DESC',
      }
    }
    return this.httpClientService.get(option);
  }

  getHistoryDetail(id: string): Observable<HttpResponse<IDetailHistoryWhitelist>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.WHITELIST + `/history` + `/${id}`,
    }
    return this.httpClientService.get(option);
  }

}

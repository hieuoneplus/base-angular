import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { IResponseTransactionLag, IRequestTransactionLag,IHistorySortParams } from '../transaction-flag/modal/interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionFlagService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getTransactionFlag(): Observable<HttpResponse<IResponseTransactionLag>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CONFIG.TRANSACTION_FLAG,
    }
    return this.httpClientService.get(option);
  }

  putTransactionFlag(body: IRequestTransactionLag): Observable<HttpResponse<IResponseTransactionLag>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CONFIG.TRANSACTION_FLAG,
      body
    }
    return this.httpClientService.put(option);
  }

  getHistoryConfigList(params?: IHistorySortParams): Observable<HttpResponse<any>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CONFIG.HISTORY,
      body: {
        ...params,
      }
    }
    return this.httpClientService.post(option);
  }

}

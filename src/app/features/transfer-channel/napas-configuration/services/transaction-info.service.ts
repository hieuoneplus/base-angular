import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { IParamsSearch, IResponseTransactionInfo, PaginationTransactionInfoDto } from '../transaction-info/modal/interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionInfoService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getTransactionInfo(body: IParamsSearch, params: any): Observable<HttpResponse<PaginationTransactionInfoDto<IResponseTransactionInfo>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION_INFO.SEARCH,
      body,
      params
    }
    return this.httpClientService.post(option);
  }
}

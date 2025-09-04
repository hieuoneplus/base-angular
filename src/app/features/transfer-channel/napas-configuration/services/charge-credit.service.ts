import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { ICreateChargeCredit, IParamsSearch, IResponseChargeCredit, PaginationBaseDto, PaginationChargrCreditDto, IResponseTransactionDispute, IParamsSearchTransactionOrigin, PaginationTransactionOriginalDto, IResponseTransactionOriginal, IApproveChargeCredit, IUpdateChargeCredit } from '../charge-credit/modal/interface';

@Injectable({
  providedIn: 'root'
})
export class ChargeCreditService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getChargeCredit(body: IParamsSearch, params: any): Observable<HttpResponse<PaginationChargrCreditDto<IResponseChargeCredit>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.SEARCH,
      body,
      params
    }
    return this.httpClientService.post(option);
  }

  searchDispute(params: IParamsSearch): Observable<HttpResponse<IResponseTransactionDispute>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.SEARCH_TRANSACTION_DISPUTE,
      body: params
    }
    return this.httpClientService.post(option);
  }

  getTransactionOrigin(body: IParamsSearchTransactionOrigin): Observable<HttpResponse<PaginationTransactionOriginalDto<IResponseTransactionOriginal>>> {
    const params = {
      page: 0,
      size: 10
    }

    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_TRANSACTION_ORIGINAL,
      params: params,
      body,
    }
    return this.httpClientService.post(option);
  }


  createChargeCredit(body: ICreateChargeCredit): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.CREATE,
      body
    }
    return this.httpClientService.post(option);
  }

  updateChargeCredit(body: IUpdateChargeCredit, id: string): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.UPDATE + `/${id}`,
      body
    }
    return this.httpClientService.post(option);
  }

  approveChargeCredit(body: IApproveChargeCredit): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.APPROVE,
      body
    }
    return this.httpClientService.post(option);
  }

  downLoadFile(idFile: string) {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.DOWNLOAD_FILE_DISPUTE + `/${idFile}`,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
    };
    return this.httpClientService.download(Verbs.GET, options);
  }
}

import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { PaginationBaseDto, IParamsSearch, IResponseTransactionDispute, IParamsSearchTransactionOrigin, ICreateDispute, PaginationTransactionOriginalDto, IResponseTransactionOriginal, IApproveTransactionDispute, PaginationChargeCreditsDto, PaginationTransactionRefundDto, IResponseChargeCredits, IResponseTransactionRefund, ICreateDisputeResponse, IApproveBatchDispute } from '../search-dispute/modal/interface';

@Injectable({
  providedIn: 'root'
})
export class SearchDisputeService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getTransactionDispute(params: IParamsSearch): Observable<HttpResponse<PaginationBaseDto<IResponseTransactionDispute>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE,
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

  searchDispute(id: string): Observable<HttpResponse<IResponseTransactionDispute>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_TRANSACTION_DISPUTE + `/${id}`,
    }
    return this.httpClientService.get(option);
  }

  createTransactionDispute(body: ICreateDispute): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.CREATE_REQUEST_DISPUTE,
      body
    }
    return this.httpClientService.post(option);
  }

  updateTransactionDispute(body: ICreateDispute): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.UPDATE_REQUEST_DISPUTE,
      body
    }
    return this.httpClientService.post(option);
  }

  approveTransactionDispute(body: IApproveTransactionDispute): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.APPROVE_REQUEST_DISPUTE,
      body
    }
    return this.httpClientService.post(option);
  }

  approveBatchDispute(body: IApproveBatchDispute): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.APPROVE_BATCH_DISPUTE,
      body
    }
    return this.httpClientService.post(option);
  }
  
  exportTransactionDispute(body: IParamsSearch) {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.EXPORT_TRANSACTION_DISPUTE,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
      body: body
    };
    return this.httpClientService.download(Verbs.POST, options);
  }

  downLoadFile(idFile: string) {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.DOWNLOAD_FILE_DISPUTE + `/${idFile}`,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
    };
    return this.httpClientService.download(Verbs.GET, options);
  }

  createReplyTransactionDispute(body: ICreateDisputeResponse): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.CREATE_REPLY_DISPUTE,
      body
    }
    return this.httpClientService.post(option);
  }

  updateReplyTransactionDispute(body: ICreateDisputeResponse): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.UPDATE_REPLY_DISPUTE,
      body
    }
    return this.httpClientService.post(option);
  }

  approveReplyTransactionDispute(body: IApproveTransactionDispute): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.APPROVE_REPLY_DISPUTE,
      body
    }
    return this.httpClientService.post(option);
  }

  getTransactionRefund(params: IParamsSearch): Observable<HttpResponse<PaginationTransactionRefundDto<IResponseTransactionRefund>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_TRANSACTION_REFUND,
      body: params
    }
    return this.httpClientService.post(option);
  }

  getChargecreditInfo(body: IParamsSearch): Observable<HttpResponse<PaginationChargeCreditsDto<IResponseChargeCredits>>> {
    const params = {
      page: 0,
      size: 1000
    }

    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_CHARGECREDIT_INFO,
      body: body,
      params
    }
    return this.httpClientService.post(option);
  }
}

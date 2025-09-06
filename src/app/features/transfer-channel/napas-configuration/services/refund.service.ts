import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import {IApproveTransactionRefund, IParamsSearch, ICreateTransactionRefund, IResponseTransactionRefund, PaginationTransactionRefundDto, IParamsSearchTransactionOrigin, PaginationTransactionOriginalDto, IResponseTransactionOriginal, PaginationBaseDto, IResponseTransactionRefundBatch, IParamsSearchBatch, PaginationTransactionRefundBatchDto, IResponseTransactionDispute, PaginationTransactionDisputeDto } from '../refund/modal/interface';


@Injectable({
  providedIn: 'root'
})
export class RefundService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getTransactionRefund(body: IParamsSearch): Observable<HttpResponse<PaginationTransactionRefundDto<IResponseTransactionRefund>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH,
      body
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
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH_TRANSACTION_ORIGINAL,
      params: params,
      body,
    }
    return this.httpClientService.post(option);
  }
  
  createTransactionRefund(body: ICreateTransactionRefund): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.CREATE_SINGLE,
      body
    }
    return this.httpClientService.post(option);
  }

  updateTransactionRefund(body: ICreateTransactionRefund): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.EDIT_SINGLE,
      body
    }
    return this.httpClientService.post(option);
  }

  importTransactionRefundBatch(body: any){
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.IMPORT_TRANSACTION_REFUND_BATCH,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
      body
    }
    return this.httpClientService.download(Verbs.POST, option);
  }

  getTransactionRefundBatch(body: IParamsSearchBatch): Observable<HttpResponse<PaginationTransactionRefundBatchDto<IResponseTransactionRefundBatch>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH_BATCH,
      body
    }
    return this.httpClientService.post(option);
  }

  getTransactionDispute(params: IParamsSearch): Observable<HttpResponse<PaginationTransactionDisputeDto<IResponseTransactionDispute>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH_TRANSACTION_DISPUTE,
      body: params
    }
    return this.httpClientService.post(option);
  }

  approveTransactionRefund(body: IApproveTransactionRefund): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.REFUND.APPROVE_TRANSACTION_REFUND,
      body
    }
    return this.httpClientService.post(option);
  }

  uploadFile(file: File): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.UPLOAD_FILE,
      body: formData
    }
    return this.httpClientService.post(option);
  }

}

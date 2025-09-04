import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import { PaginationQueryTransactionCitadDto } from "../../../model/citad";
import { IAccountContent } from '../model/account';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from '@shared-sm';

@Injectable({
  providedIn: 'root'
})
export class CitadWhitelistService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getWhitelistAccounts(params): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IAccountContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST,
      params
    }
    return this.httpClientService.get(option);
  }

  getDetailAccount(idAccount: string): Observable<HttpResponse<IAccountContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST + `/${idAccount}`,
    }
    return this.httpClientService.get(option);
  }

  addAccount(accountNo: string, reason: string): Observable<HttpResponse<IAccountContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST,
      body: {
        accountNo,
        reason
      }
    }
    return this.httpClientService.post(option);
  }

  editAccount(idAccount: string, accountNo: string, reason: string): Observable<HttpResponse<IAccountContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST + `/${idAccount}`,
      body: {
        accountNo,
        reason
      }
    }
    return this.httpClientService.put(option);
  }

  deleteAccount(idAccount: string): Observable<HttpResponse<IAccountContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST + `/${idAccount}`,
    }
    return this.httpClientService.delete(option);
  }

  getHistories(params): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IAccountContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  exportWhitelistAccounts() {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST + `/export` ,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
    };
    return this.httpClientService.download(Verbs.GET, options);
  }
}

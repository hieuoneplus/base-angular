import { Injectable } from '@angular/core';
import {HttpClientService, HttpOptions, HttpResponse, IPageable, Verbs} from "@shared-sm";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import {IConfig} from "../../../model/citad";
import {
  IRequestUpdateReplaceSpecialChar, ITransactionReplacement
} from "../transaction-replacement/model/interface";

@Injectable({
  providedIn: 'root'
})
export class TransactionReplacementService {
  configKey = 'transaction.replacement'

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getTransactionReplacement(): Observable<HttpResponse<ITransactionReplacement>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${this.configKey}`,
    }
    return this.httpClientService.get(option);
  }

  getHistoryReplaceSpecialChar(params: any): Observable<HttpResponse<IPageable<IConfig[]>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  updateTransactionReplacement(body: IRequestUpdateReplaceSpecialChar): Observable<HttpResponse<ITransactionReplacement>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${this.configKey}`,
      body
    }
    return this.httpClientService.put(option);
  }

  export() {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/export/${this.configKey}`,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
    };
    return this.httpClientService.download(Verbs.GET, options);
  }
}

import { Injectable } from '@angular/core';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from "@shared-sm";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import { IRequestUpdateHoldReceiverAccount, IResponseHistoryHoldReceiverAccount, IResponseHoldReceiverAccount, PaginationHistoryHoldReceiverAccountDto } from '../hold-receiver-account/modal/interface';
import { KeyConfigCitad } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class HoldReceiverAccountService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getHoldReceiverAccount(): Observable<HttpResponse<IResponseHoldReceiverAccount>> {
    const keys = KeyConfigCitad.hold_receiver_account
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${keys}`,
    }
    return this.httpClientService.get(option);
  }

  exportConfigCitad(key: string) {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.EXPORT_CONFIG_CITAD + `/${key}`,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
    };
    return this.httpClientService.download(Verbs.GET, options);
  }

  getHistoryHoldReceiverAccount(params: any): Observable<HttpResponse<PaginationHistoryHoldReceiverAccountDto<IResponseHistoryHoldReceiverAccount>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  updateHoldReceiverAccount(body: IRequestUpdateHoldReceiverAccount): Observable<HttpResponse<IRequestUpdateHoldReceiverAccount>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${KeyConfigCitad.hold_receiver_account}`,
      body
    }
    return this.httpClientService.put(option);
  }

}

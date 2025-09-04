import { Injectable } from '@angular/core';
import { HttpClientService, HttpOptions, HttpResponse } from "@shared-sm";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import { IRequestUpdateMbsSignal, IResponseHistoryMbsSignal, IResponseMbsSignal, PaginationHistoryMbsSignalDto } from '../mbs-signal/modal/interface';
import { KeyConfigCitad } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class MbsSignalService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getMbsSignal(): Observable<HttpResponse<IResponseMbsSignal>> {
    const keys = KeyConfigCitad.partner_transaction_pattern
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${keys}`,
    }
    return this.httpClientService.get(option);
  }

  getHistoryMbsSignal(params: any): Observable<HttpResponse<PaginationHistoryMbsSignalDto<IResponseHistoryMbsSignal>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  updateMbsSignal(body: IRequestUpdateMbsSignal): Observable<HttpResponse<IRequestUpdateMbsSignal>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${KeyConfigCitad.partner_transaction_pattern}`,
      body
    }
    return this.httpClientService.put(option);
  }

}

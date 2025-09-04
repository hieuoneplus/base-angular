import { Injectable } from '@angular/core';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from "@shared-sm";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import { IRequestUpdateRefundsSignal, IResponseHistoryRefundsSignal, IResponseRefundsSignal, PaginationHistoryRefundsSignalDto } from '../refunds-signal/modal/interface';
import { KeyConfigCitad } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class RefundsSignalService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getRefundsSignal(): Observable<HttpResponse<IResponseRefundsSignal>> {
    const keys = KeyConfigCitad.refund_transaction_pattern
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

  getHistoryRefundsSignal(params: any): Observable<HttpResponse<PaginationHistoryRefundsSignalDto<IResponseHistoryRefundsSignal>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  updateRefundsSignal(body: IRequestUpdateRefundsSignal): Observable<HttpResponse<IRequestUpdateRefundsSignal>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${KeyConfigCitad.refund_transaction_pattern}`,
      body
    }
    return this.httpClientService.put(option);
  }

}

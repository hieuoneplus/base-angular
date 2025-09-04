import { Injectable } from '@angular/core';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from "@shared-sm";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import { IRequestUpdateHoldReceiverName, IResponseHistoryHoldReceiverName, IResponseHoldReceiverName, PaginationHistoryHoldReceiverNameDto } from '../hold-receiver-name/modal/interface';
import { KeyConfigCitad } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class HoldReceiverNameService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getHoldReceiverName(): Observable<HttpResponse<IResponseHoldReceiverName>> {
    const keys = KeyConfigCitad.hold_receiver_name_pattern
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

  getHistoryHoldReceiverName(params: any): Observable<HttpResponse<PaginationHistoryHoldReceiverNameDto<IResponseHistoryHoldReceiverName>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  updateHoldReceiverName(body: IRequestUpdateHoldReceiverName): Observable<HttpResponse<IRequestUpdateHoldReceiverName>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${KeyConfigCitad.hold_receiver_name_pattern}`,
      body
    }
    return this.httpClientService.put(option);
  }

}

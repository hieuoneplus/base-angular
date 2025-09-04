import { Injectable } from '@angular/core';
import { HttpClientService, HttpOptions, HttpResponse } from "@shared-sm";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import { IResponseOnOffGateWay, IRequestUpdateOnOffGateWay, PaginationHistoryOnOffGateWayDto, IResponseHistoryOnOffGateWay } from '../on-off-gate/modal/interface'


@Injectable({
  providedIn: 'root'
})
export class OnOffGateWayService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getOnOffGateWay(): Observable<HttpResponse<IResponseOnOffGateWay>> {
    const keyss = 'citad.gateway.enabled'
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${keyss}`,
    }
    return this.httpClientService.get(option);
  }

  getHistoryOnOfffGateWay(params: any): Observable<HttpResponse<PaginationHistoryOnOffGateWayDto<IResponseHistoryOnOffGateWay>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  updateOnOfffGateWay(body: IRequestUpdateOnOffGateWay): Observable<HttpResponse<IRequestUpdateOnOffGateWay>> {
    const keyss = 'citad.gateway.enabled'
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${keyss}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

}

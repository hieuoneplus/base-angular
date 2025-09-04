import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClientService, HttpOptions, HttpResponse, IPageable} from "@shared-sm";
import {environment} from "@env/environment";

import {PATH} from "../../../../public/constants";
import { IConfig, IDetailHistoryConfig, IHistorySortParams } from './modal/interface';

@Injectable({
  providedIn: 'root'
})
export class HistoryConfigCitadService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  getHistoryConfigList(params?: IHistorySortParams): Observable<HttpResponse<IPageable<IConfig[]>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params: {
        ...params,
        sort: params.sort ? params.sort : 'updatedAt:DESC',
      }
    }
    return this.httpClientService.get(option);
  }

  getDetailHistoryConfigList(id: number,key: string): Observable<HttpResponse<IDetailHistoryConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY +`/${key}` +`/${id}`,
    }
    return this.httpClientService.get(option);
  }
}

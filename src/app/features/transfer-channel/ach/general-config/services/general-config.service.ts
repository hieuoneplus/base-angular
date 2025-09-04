import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClientService, HttpOptions, HttpResponse} from "@shared-sm";
import {ICommonConfig, ICommonConfigRequest} from "../../../../model/ach";
import {environment} from "@env/environment";
import {PATH} from "../../../../../public/constants";

@Injectable({
  providedIn: 'root'
})
export class GeneralConfigService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  getCommonConfig(): Observable<HttpResponse<ICommonConfig[]>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.ACH.LIST_COMMON_CONFIG,
    }
    return this.httpClientService.get(option);
  }

  getDetailCommonConfig(functionCode: string, key: string): Observable<HttpResponse<ICommonConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.ACH.LIST_COMMON_CONFIG +'/get',
      params: { functionCode, key}
    }
    return this.httpClientService.get(option);
  }

  createCommonConfig(body: ICommonConfigRequest): Observable<HttpResponse<ICommonConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.ACH.LIST_COMMON_CONFIG,
      body
    }
    return this.httpClientService.post(option);
  }

  updateCommonConfig(body: ICommonConfigRequest): Observable<HttpResponse<ICommonConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.ACH.LIST_COMMON_CONFIG,
      body
    }
    return this.httpClientService.put(option);
  }
}

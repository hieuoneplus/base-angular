import { Injectable } from '@angular/core';
import {HttpClientService, HttpOptions, HttpResponse, IPageable, Verbs} from "@shared-sm";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { PATH } from "../../../../public/constants";
import { IAccountParameter, IRequestUpdateAccountParameter } from "../account-parameter/model/interface";
import {IConfig} from "../../../model/citad";
import { KeyConfigCitad } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class AccountParameterService {
  configKey = 'account.parameter'

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getAccountParameter(): Observable<HttpResponse<IAccountParameter>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${this.configKey}`,
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

  getHistoryAccountParameter(params: any): Observable<HttpResponse<IPageable<IConfig[]>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }

  updateAccountParameter(body: IRequestUpdateAccountParameter): Observable<HttpResponse<IAccountParameter>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${KeyConfigCitad.account_parameter}`,
      body
    }
    return this.httpClientService.put(option);
  }
}

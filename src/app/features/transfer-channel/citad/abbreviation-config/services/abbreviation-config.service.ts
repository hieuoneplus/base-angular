import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClientService, HttpOptions, HttpResponse, Verbs} from "@shared-sm";
import {IAbbreviationConfig, IConfig} from "../../../../model/citad";
import {environment} from "@env/environment";
import {PATH} from "../../../../../public/constants";
import {UUID} from "angular2-uuid";
import { KeyConfigCitad } from '../../constant';

interface IPageParam {
  page: number,
  size: number
}

@Injectable({
  providedIn: 'root'
})

export class AbbreviationConfigService {

  readonly key = "/transaction.abbreviation"

  constructor(
    private httpClientService: HttpClientService
  ) { }

  // getAbbreviationHConfigList(params: IPageParam): Observable<HttpResponse<IPageable<IAbbreviationHistory[]>>> {
  getAbbreviationHConfigList(params: IPageParam): Observable<HttpResponse<IAbbreviationConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + this.key,
      params
    }
    return this.httpClientService.get(option);
  }

  updateAbbreviationHConfigList(body): Observable<HttpResponse<IConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + `/${KeyConfigCitad.transaction_abbreviation}`,
      body
    }
    return this.httpClientService.put(option);
  }

  exportFile():Observable<HttpResponse<Blob>> {
    const option: HttpOptions = {
      headers: {
        Accept: 'application/vnd.ms-excel',
        clientMessageId: `${UUID.UUID()}`,
        transactionId: `${UUID.UUID()}`,
      },
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.CONFIG + '/export' + this.key,
    }
    // @ts-ignore
    return this.httpClientService.download(Verbs.GET, option);
  }
}

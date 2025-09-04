import { Injectable } from '@angular/core';
import {HttpClientService, HttpOptions, HttpResponse, Verbs} from "@shared-sm";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PATH} from "../../../../public/constants";
import {IConfigAuditContent, IRequestPutConfig} from "../../../model/inhouse-transfer";

@Injectable({
  providedIn: 'root'
})
export class InhouseConfigsService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getConfigs(key: string): Observable<HttpResponse<IConfigAuditContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.INHOUSE_TRANSFER.CONFIG + `/${key}`
    }
    return this.httpClientService.get(option);
  }

  putConfig(body: IRequestPutConfig, key: string): Observable<HttpResponse<IConfigAuditContent>> {

    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.INHOUSE_TRANSFER.CONFIG + `/${key}`,
      body: body
    }
    return this.httpClientService.put(option);
  }
}

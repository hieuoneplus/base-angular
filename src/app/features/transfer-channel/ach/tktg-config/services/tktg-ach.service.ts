import { Injectable } from '@angular/core';
import {HttpClientService, HttpOptions, HttpResponse} from "@shared-sm";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PATH} from "../../../../../public/constants";
import {
  IIntermediateAccountConfig,
  IIntermediateAccountRequest, IIntermediateAccountUpdateConfiReq,
} from "../../../../model/ach";

@Injectable({
  providedIn: 'root'
})
export class TktgAchService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getIntermediateAccountListConfig(): Observable<HttpResponse<IIntermediateAccountConfig[]>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.ACH.LIST_INTERMEDIATE_ACC_CONFIG,
    }
    return this.httpClientService.get(option);
  }

  getIntermediateAccountDetailConfig(way: string, accNo: string): Observable<HttpResponse<IIntermediateAccountConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.ACH.LIST_INTERMEDIATE_ACC_CONFIG + `/${way}/${accNo}`,
    }
    return this.httpClientService.get(option);
  }

   updateIntermediateAccountConfig(body: IIntermediateAccountUpdateConfiReq): Observable<HttpResponse<IIntermediateAccountConfig>>  {
     const option: HttpOptions = {
       url: environment.urlPmpBe,
       path: PATH.TRANSFER_CHANNEL.ACH.LIST_INTERMEDIATE_ACC_CONFIG,
       body
     }
     return this.httpClientService.put(option);
   }

   createIntermediateAccountConfig(body: IIntermediateAccountRequest): Observable<HttpResponse<IIntermediateAccountConfig>> {
     const option: HttpOptions = {
       url: environment.urlPmpBe,
       path: PATH.TRANSFER_CHANNEL.ACH.LIST_INTERMEDIATE_ACC_CONFIG,
       body
     }
     return this.httpClientService.post(option);
   }
}

import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {HttpClientService, HttpOptions, HttpResponse, Verbs} from "@shared-sm";
import { Observable } from 'rxjs';
import { IGetStateTreasuriesHistoriesParams, IGetStateTreasuriesParams, IRequestPostStateTreasury, IRequestPutStateTreasury, IStateTreasuriesHistoryContent, IStateTreasuryContent, PaginationQueryTransactionCitadDto } from 'src/app/features/model/citad';
import { PATH } from 'src/app/public/constants';

@Injectable({
  providedIn: 'root'
})
export class StateTreasuryConfigService {

  
  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getStateTreasuries(params:IGetStateTreasuriesParams): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IStateTreasuryContent>>> {
    console.log(params)
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.STATE_TREASURIES,
      params
    }
    return this.httpClientService.get(option);
  }

  postStateTreasuries(requestPostStateTreasury:IRequestPostStateTreasury ): Observable<HttpResponse<IStateTreasuryContent>> {
    const body = requestPostStateTreasury
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.STATE_TREASURIES,
      body: body
    }
    return this.httpClientService.post(option);
  }

  putStateTreasuries(requestPutStateTreasury: IRequestPutStateTreasury, id: string): Observable<HttpResponse<IStateTreasuryContent>> {
    const body = requestPutStateTreasury
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.STATE_TREASURIES + `/${id}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getStateTreasuryDetail(code: string): Observable<HttpResponse<IStateTreasuryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.STATE_TREASURIES + `/${code}`,
    }
    return this.httpClientService.get(option);
  }
  deleteStateTreasury(code: string): Observable<HttpResponse<IStateTreasuryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.STATE_TREASURIES + `/${code}`,
    }
    return this.httpClientService.delete(option);
  }
  getStateTreasuriesHistory(params: IGetStateTreasuriesHistoriesParams): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IStateTreasuryContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.STATE_TREASURIES_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }
  getStateTreasuriesHistoryDetail(id: string): Observable<HttpResponse<IStateTreasuriesHistoryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.STATE_TREASURIES_HISTORY + `/${id}`,
    }
    return this.httpClientService.get(option);
  }
  exportStateTreasure() {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.EXPORT_STATE_TREASURIES,
      responseType: 'blob',  
    };
    return this.httpClientService.download(Verbs.GET, options);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponseArray } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { ITransferChannelConfigsContent, IGetTransferChannelConfigParams, IPutActive, IPutListPriorities } from '../transfer-channel-config/model/interface';

@Injectable({
  providedIn: 'root'
})
export class TransferChannelConfigService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getTransferChannelConfig(params: IGetTransferChannelConfigParams): Observable<HttpResponseArray<ITransferChannelConfigsContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_CONFIG,
      params
    }
    return this.httpClientService.get(option);
  }

  putPriority(requestPutPriority: IPutListPriorities): Observable<HttpResponseArray<ITransferChannelConfigsContent>> {
    const body = requestPutPriority
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_CONFIG + '/priorities',
      body: body
    }
    return this.httpClientService.put(option);
  }

  putActive(requestPutActive: IPutActive): Observable<HttpResponseArray<ITransferChannelConfigsContent>> {
    const body = requestPutActive
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_CONFIG + '/status',
      body: body
    }
    return this.httpClientService.put(option);
  }
}

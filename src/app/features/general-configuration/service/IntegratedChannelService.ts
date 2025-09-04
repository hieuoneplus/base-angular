import {Injectable} from "@angular/core";
import {HttpClientService, HttpOptions, HttpResponse} from "@shared-sm";
import {Observable} from "rxjs";
import {PaginationBaseDto} from "../../../shared/models/pagination.base.dto";
import {environment} from "@env/environment";
import {PATH} from "../../../public/constants";
import { IGetIntegratedChannelParams, IIntegratedChannelContent, IRequestPostIntegratedChannel, IRequestPutIntegratedChannel } from "../../model/integrated-channel";

@Injectable({
  providedIn: 'root',
})
export class IntegratedChannelService {

  constructor(
    private httpClientService: HttpClientService,
  ) {
  }

  getIntegratedChannel(params: IGetIntegratedChannelParams): Observable<HttpResponse<PaginationBaseDto<IIntegratedChannelContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.INTEGRATED_CHANNEL,
      params
    }
    return this.httpClientService.get(option);
  }

  deleteIntegratedChannel(id: string): Observable<HttpResponse<String>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.INTEGRATED_CHANNEL + `/${id}`,
    }
    return this.httpClientService.delete(option);
  }

  postIntegratedChannel(requestPostIntegratedChannel: IRequestPostIntegratedChannel): Observable<HttpResponse<IIntegratedChannelContent>> {
    const body = requestPostIntegratedChannel
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.INTEGRATED_CHANNEL,
      body: body
    }
    return this.httpClientService.post(option);
  }

  putIntegratedChannel(requestPutIntegratedChannel: IRequestPutIntegratedChannel, id: string): Observable<HttpResponse<IIntegratedChannelContent>> {
    const body = requestPutIntegratedChannel
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.INTEGRATED_CHANNEL + `/${id}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getIntegratedChannelDetail(id: string): Observable<HttpResponse<IIntegratedChannelContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.INTEGRATED_CHANNEL + `/${id}`,
    }
    return this.httpClientService.get(option);
  }
}

import { Injectable } from '@angular/core';
import {HttpClientService, HttpOptions, HttpResponse} from "@shared-sm";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PATH} from "../../../../public/constants";
import {IResponseQueryTransactionCitad, PaginationQueryTransactionCitadDto} from "../../../model/citad";
import { IParamQMessageErrorManage, IResponseMessageErrorManage } from '../message-error-manage/modal/interface';
import { PaginationBaseDto } from 'src/app/shared/models/pagination.base.dto';

@Injectable({
  providedIn: 'root'
})
export class MessageErrorManageService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getMessageErrorManage(params: IParamQMessageErrorManage): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IResponseMessageErrorManage>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.MESSAGE_ERROR,
      params
    }
    return this.httpClientService.get(option);
  }

  getMessageErrorManageDetail(idMessageError: number): Observable<HttpResponse<IResponseMessageErrorManage>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.MESSAGE_ERROR + `/${idMessageError}`,
    }
    return this.httpClientService.get(option);
  }

  retryMessageErrorManage(body: Array<number>): Observable<HttpResponse<string>> {
    const ids = { ids: body }
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.MESSAGE_ERROR,
      body: ids
    }
    return this.httpClientService.post(option);
  }

  deleteMessageErrorManage(id: number): Observable<HttpResponse<any>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.MESSAGE_ERROR + `/${id}`,
    }
    return this.httpClientService.delete(option);
  }
}

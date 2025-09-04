// import { Injectable } from '@angular/core';
// import {HttpClientService, HttpOptions, HttpResponse} from "@shared-sm";
// import {Observable} from "rxjs";
// import {environment} from "@env/environment";
// import {PATH} from "../../../../public/constants";
// import { IRequestUpdateRefundsSignal, IResponseHistoryRefundsSignal, IResponseRefundsSignal,PaginationHistoryRefundsSignalDto } from '../refunds-signal/modal/interface';


// @Injectable({
//   providedIn: 'root'
// })
// export class RefundsSignalService {

//   constructor(
//     private httpClientService: HttpClientService,
//   ) { }

//   getRefundsSignal(key: string): Observable<HttpResponse<IResponseRefundsSignal>> {
//     const option: HttpOptions = {
//       url: environment.urlPmpBe,
//       path: PATH.TRANSFER_CHANNEL.CITAD.REFUNDS_SIGNAL + `/${key}`,
//     }
//     return this.httpClientService.get(option);
//   }

//   getHistoryRefundsSignal(params: any): Observable<HttpResponse<PaginationHistoryRefundsSignalDto<IResponseHistoryRefundsSignal>>> {
//     const option: HttpOptions = {
//       url: environment.urlPmpBe,
//       path: PATH.TRANSFER_CHANNEL.CITAD.HISTORY_REFUNDS_SIGNAL,
//       params
//     }
//     return this.httpClientService.get(option);
//   }

//   updateRefundsSignal(key: string, body: IRequestUpdateRefundsSignal): Observable<HttpResponse<IRequestUpdateRefundsSignal>> {
//     const option: HttpOptions = {
//       url: environment.urlPmpBe,
//       path: PATH.TRANSFER_CHANNEL.CITAD.REFUNDS_SIGNAL,
//       body
//     }
//     return this.httpClientService.put(option);
//   }

// }

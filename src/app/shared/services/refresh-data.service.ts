// import { Injectable } from '@angular/core';
// import { HttpOptions, PATH } from '@core';
// import { HttpClientService } from '@core/service/httpclient.service';
// import { environment } from '@env/environment';
// import { ParamsSearchCustomer } from '@models';

// @Injectable({
//   providedIn: 'root',
// })
// export class RefreshDataService {

//   constructor(private httpClient: HttpClientService) {
//   }

//   // Hàm xử lý chung search customer
//   searchCustomer(paramsSearchCustomer: ParamsSearchCustomer) {
//     const options: HttpOptions = {
//       url: environment.urlCustomer,
//       path: PATH.CUSTOMER.SEARCH_CUSTOMER,
//       params: paramsSearchCustomer
//     };
//     return this.httpClient.get(options);
//   }

//   refreshRMList(paramsClear) {
//     const options: HttpOptions = {
//       url: environment.urlSystem,
//       path: PATH.REDIS.DELETE_KEY,
//       params: paramsClear
//     };
//     return this.httpClient.delete(options);
//   }

//   getCrm(paramGetCrm) {
//     const options: HttpOptions = {
//       url: environment.urlBase,
//       path: PATH.SYSTEM.GET_ALL_RM,
//       params: paramGetCrm
//     };
//     return this.httpClient.get(options);
//   }

// }

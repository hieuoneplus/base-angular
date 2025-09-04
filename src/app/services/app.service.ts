// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core'
// import { environment } from '@env/environment'
// import { orderBy } from 'lodash'
// import { HttpClientService } from '../shared/services/httpclient.service';

// export const PATH = {
 
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AppService {
//   constructor(private httpClient: HttpClientService, private http: HttpClient) {}
//   /**
//    * lấy thông tin + quyền user đang đăng nhập
//    * @param id
//    */
//   getUserInfo() {
//     const options: HttpOptions = {
//       url: environment.hostApi,
//       path: `${environment.services.portalAccess}/mhr-user/info`,
//     }

//     return this.httpClient.get(options)
//   }

//   getMenu() {
//     const options: HttpOptions = {
//       // url: 'https://webportal-uat.mbbank.com.vn/api',
//       url: environment.hostApi,
//       path: `${environment.services.portalCategory}/users/get-menu`,
//       headers: {
//         'keycloakId': environment.keycloakIdIAM,
//       },
//       withCredentials: false
//     };
//     return this.httpClient.get(options)
//   }

// }

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';

import * as _ from 'lodash'

export function initializer(keycloak: KeycloakService, router: Router): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      console.log("initializer");
      try {
        if (checkLoadMFE()) {
          console.log("=====");
          // router.navigate(['/pmp_admin/auth/login-otp'])
          resolve(true);
        } else {

          keycloak.keycloakEvents$.subscribe(async event => {
            switch (event.type) {
              // Update token khi hết hạn
              case KeycloakEventType.OnAuthError:
                break;
              // type token đã logout
              case KeycloakEventType.OnAuthLogout:
                localStorage.clear();
                break;
              // Goi auth bi loi
              case KeycloakEventType.OnAuthRefreshError:
                break;
              // Goi refresh thanh cong
              case KeycloakEventType.OnAuthRefreshSuccess:
                window.dispatchEvent(new Event("storage_change"));
                setToken(keycloak);
                break;
              // Auth thành công
              case KeycloakEventType.OnAuthSuccess:
                keycloak.getToken().then(async token => {
                  localStorage.setItem('token', token);
                });
                keycloak.loadUserProfile().then(async profile => {
                  if (localStorage.getItem('USER_NAME') !== profile.username) {
                    localStorage.setItem('USER_NAME', profile.username);
                  }
                });
                break;
              // Update token khi hết hạn
              case KeycloakEventType.OnTokenExpired:
                console.log('OnTokenExpired')
                keycloak?.updateToken();
                break;
            }
          });

          console.log("initializer keycloak.init");
         // Cấu hình connect đến keycloak của hệ thống tích hợp
          await keycloak.init({
            config: {
              url: environment.keycloak.issuer,
              realm: environment.keycloak.realm,
              clientId: environment.keycloak.client,
            },
            loadUserProfileAtStartUp: true,
            initOptions: {
              onLoad: 'login-required',
              checkLoginIframe: false,
            },
            bearerPrefix: 'Bearer',
          });
          resolve(true);
        }
 
      } catch (error) {
        reject(error);
      }
    });
  };
}
export function checkLoadMFE() {
 //base_url: là đường dẫn truy cập ứng dụng của hệ thống tích hợp.Ví dụ như ở môi trường local thì: base_url: 'http://localhost:3200',
return location.href.includes(environment.base_url) ? false : true
}

export async function setToken(keycloak) {
  const token = await keycloak.getToken()
  if (token) localStorage.setItem('token', token);
}
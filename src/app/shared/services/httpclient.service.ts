import {GENERATE_OTP, REVOKE_TOKEN, URL_BASE, VERIFYOTP} from './../constants';
import {Router} from '@angular/router';
import {HttpClient, HttpParameterCodec} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {LocalStoreManagerService} from './local-store-manager.service';
import {HttpOptions} from '../models/request.base.dto';
import {LocalStoreEnum} from '../enum/local-store.enum';
import {HttpErrorInterface, HttpInterface} from '../models/response.base.dto';
import {GENERATE_TOKEN} from '../constants';
import {UUID} from 'angular2-uuid';

export enum Verbs {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE'
}

export class HttpUrlEncodingCodec implements HttpParameterCodec {
  encodeKey(k: string): string {
    return standardEncoding(k);
  }

  encodeValue(v: string): string {
    return standardEncoding(v);
  }

  decodeKey(k: string): string {
    return decodeURIComponent(k);
  }

  decodeValue(v: string) {
    return decodeURIComponent(v);
  }
}

function standardEncoding(v: string): string {
  return encodeURIComponent(v);
}

@Injectable({providedIn: 'root'})
export class HttpClientService {

  constructor(
    private http: HttpClient,
    private localStore: LocalStoreManagerService,
    private router: Router
  ) {
  }

  get<T>(options: HttpOptions): Observable<T> {

    // remove param null
    for (let key in options.params) {
      if (options.params[key] === null) {
        delete options.params[key];
      }
    }
    return this.httpCall(Verbs.GET, options);
  }

  delete<T>(options: HttpOptions): Observable<T> {
    return this.httpCall(Verbs.DELETE, options);
  }

  post<T>(options: HttpOptions): Observable<T> {
    return this.httpCall(Verbs.POST, options);
  }

  put<T>(options: HttpOptions): Observable<T> {
    return this.httpCall(Verbs.PUT, options);
  }

  httpCall<T>(verb: Verbs, options: HttpOptions): Observable<T> {
    const token = this.localStore.getData(LocalStoreEnum.Token_Jwt);
    const userName = this.localStore.getData(LocalStoreEnum.USER_NAME);

    // Initialize headers
    options.headers = options.headers ?? {};
    
    // Always add client message ID and transaction ID
    options.headers = {
      ...options.headers,
      clientMessageId: `${UUID.UUID()}`,
      transactionId: `${UUID.UUID()}`,
    };

    // Only add authentication headers if isAuthentication is true (default)
    options.isAuthentication = options.isAuthentication ?? true;
    if (options.isAuthentication) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        userName,
      };
    }

    // Debug logging for login requests
    if (options.path?.includes('login')) {
      console.log('Login request details:', {
        url: `${options.url ?? URL_BASE}/${options.path}`,
        method: verb,
        headers: options.headers,
        body: options.body,
        isAuthentication: options.isAuthentication
      });
    }

    return this.http.request<T>(verb, `${options.url ?? URL_BASE}/${options.path}`, {
      body: options.body,
      headers: options.headers,
      params: options.params
    });
  }

  download(verb: Verbs, options: HttpOptions) {
    // if (this.tokenValid(options.path)) {
    //   this.navigateLogin();
    //   return of();
    // }
    const token = this.localStore.getData(LocalStoreEnum.Token_Jwt);
    const userName = this.localStore.getData(LocalStoreEnum.USER_NAME);

    if(options.params) {
      for (let key in options.params) {
        if (options.params[key] === null) {
          delete options.params[key];
        }
      }
    }

    options.body = options.body ?? null;
    options.headers = options.headers ?? {};
    options.isAuthentication = options.isAuthentication ?? true;
    if (options.isAuthentication) {
      options.headers = {
        ...options.headers,
        clientMessageId: `${UUID.UUID()}`,
        Authorization: `Bearer ${token}`,
        userName,
      };
    }
    return this.http.request(verb, `${options.url}/${options.path}`, {
      headers: options.headers,
      observe: 'response',
      responseType: 'blob',
      params: options.params ?? null,
      body: options.body ?? null
    });
  }

  upload(options: HttpOptions) {
    if (this.tokenValid(options.path)) {
      this.navigateLogin();
      return of();
    }
    const token = this.localStore.getData(LocalStoreEnum.Token_Jwt);
    options.body = options.body ?? null;
    options.headers = options.headers ?? {};
    options.isAuthentication = options.isAuthentication ?? true;
    if (options.isAuthentication) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return this.http.post<any>(`${options.url}/${options.path}`, options.body, {
      headers: options.headers,
      observe: 'response',
      params: options.params ?? null
    });
  }

  tokenValid(url: string | undefined): boolean {
    const token = this.localStore.getData(LocalStoreEnum.Token_Jwt);
    return !token && url != GENERATE_TOKEN && url != REVOKE_TOKEN && url != VERIFYOTP && url != GENERATE_OTP;
  }

  navigateLogin() {
    this.router.navigate(['/auth/login']);
  }
}

export declare interface NgOnHttp {
  onSuccess(response: HttpInterface<any>): void;

  onError(error: HttpErrorInterface): void;
}



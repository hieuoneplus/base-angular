import { Component, OnInit, Injector, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityIndicatorSingletonService, LocalStoreEnum, HttpClientService, LocalStoreManagerService } from '@shared-sm';
import { environment } from '@env/environment';
import {OAuthService} from "angular-oauth2-oidc";
import {authConfig} from "./auth.config";

declare const require: any;

export function checkLoadMFE() {
  return location.href.includes(environment.base_url) ? false : true;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // if (checkLoadMFE()) {
    const url = location.href.replace(environment.origin, '');
    console.log("app.component:  onPopState-navigateByUrl", url);

    this.router.navigateByUrl(url);
    // }
  }
  ngVersion = require('../../package.json').dependencies['@angular/core'];
  constructor(private oauthService: OAuthService, private router: Router) {}

  async ngOnInit() {
    // 1. Cấu hình OAuth2 (Google)
    const token = localStorage.getItem(LocalStoreEnum.Token_Jwt);

    // 3. Nếu đã login thì đi thẳng vào home
    if (!token) {
      this.router.navigate(['/pmp_admin/admin/profile']);
    } else {
      // 4. Nếu chưa login thì ở lại màn welcome
      this.router.navigate(['/welcome']);
    }
  }

  ngOnDestroy(): void {
    this.removeStyle();
  }

  addStyle() {
    var cssId = 'pmp-css';
    if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      // link.href là đường dẫn đến file css global của hệ thống tích hợp lên webportal.
      link.href = `${environment.base_url}/cms-style.css?nocache=` + (new Date()).getTime();
      link.media = 'all';
      head.appendChild(link);
    }
  }

  removeStyle() {
    var cssId = 'pmp-css';  // you could encode the css path itself to generate id..
    document.getElementById(cssId)?.remove();
  }
  base64UrlDecode(base64Url: string) {
    // Thay thế các ký tự URL-safe base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Giải mã base64
    const decoded = atob(base64);
    return decoded;
  }

  decodeJWT(token: string) {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    // Giải mã phần Header và Payload
    const header = JSON.parse(this.base64UrlDecode(parts[0]));
    const payload = JSON.parse(this.base64UrlDecode(parts[1]));

    return { header, payload };
  }
}

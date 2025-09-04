import { Component, OnInit, Injector, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityIndicatorSingletonService, LocalStoreEnum, HttpClientService, LocalStoreManagerService } from '@shared-sm';
import { environment } from '@env/environment';

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
  constructor(private router: Router) {
    // this.addStyle();
  }

  ngOnInit(): void {
    console.log("UAT = ", environment.uat);
    const url = location.href?.replace(location.origin, '');
    const pmp_verified_otp = localStorage.getItem(LocalStoreEnum.pmp_verified_otp);
    console.log("app.component: GOTO - OTP", url, pmp_verified_otp);
    if (url.includes(environment.key)) {
      // cần check thêm nếu chưa login OTP
      const sessionState = this.decodeJWT(localStorage.getItem(LocalStoreEnum.Token_Jwt))?.payload?.session_state;

      if (!pmp_verified_otp) {
        this.router.navigateByUrl('/pmp_admin/auth/login-otp');
      } else if (sessionState !== pmp_verified_otp) {
        localStorage.removeItem(LocalStoreEnum.pmp_verified_otp);
        window.postMessage({ key: 'sc-navigation', url: 'login' }, '*');
      }
      else {
        this.router.navigateByUrl(url);
      }
    } else
      this.router.navigateByUrl(url);
    // if (checkLoadMFE()) {
    //   // Khi loading vào ứng dụng nó sẽ trỏ đến url
    //   const url = location.href?.replace(location.origin, '');
    //   const pmp_verified_otp = localStorage.getItem(LocalStoreEnum.pmp_verified_otp);
    //   console.log("app.component: GOTO - OTP", url, pmp_verified_otp);

    //   if (url.includes(environment.key)) {// cần check thêm nếu chưa login OTP
    //     if (!pmp_verified_otp) {
    //       this.router.navigateByUrl('/pmp_admin/auth/login-otp');
    //     }
    //     else {
    //       this.router.navigateByUrl(url);
    //     }
    //   } else
    //     this.router.navigateByUrl(url);

    //   // // Đoạn code window.addEventListener này mục đích để gửi menu sang ứng dụng tích hợp
    //   // // Nếu ứng dụng tự quản lý hợp menu thì không cần đoạn code này
    //   // window.addEventListener('message', (event) => {
    //   //   const urlNavigation = location.href?.replace(location.origin, '');
    //   //   if (event && event.data == environment.key) {
    //   //     this.router.navigateByUrl(urlNavigation);
    //   //   }
    //   // });
    // } else {
    //   const url = location.href?.replace(environment.base_url, '');
    //   const pmp_verified_otp = localStorage.getItem(LocalStoreEnum.pmp_verified_otp);
    //   console.log("app.component: GOTO - OTP", url, pmp_verified_otp);

    //   if (url.includes(environment.key)) {// cần check thêm nếu chưa login OTP
    //     if (!pmp_verified_otp) {
    //       this.router.navigateByUrl('/pmp_admin/auth/login-otp');
    //     }
    //     else {
    //       this.router.navigateByUrl('/pmp_admin/admin/profile');
    //     }
    //   } else
    //     this.router.navigateByUrl(url);
    // }
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

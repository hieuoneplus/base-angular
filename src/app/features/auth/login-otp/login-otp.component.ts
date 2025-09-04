import { Component, ElementRef, Injector, ViewChild, isDevMode } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { environment } from '@env/environment';
import { ComponentAbstract, FormType, LocalStoreEnum, MessageSeverity, TextboxItem } from '@shared-sm';
import { UUID } from 'angular2-uuid';
import { finalize, takeUntil } from 'rxjs/operators';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { AppMenus, MenuService } from 'src/app/shared/services/menu.service';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import Utils from 'src/app/shared/utils/utils';
import { AuthService } from '../service/AuthService';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss']
})

export class LoginOTPComponent extends ComponentAbstract {
  @ViewChild('otp') inputElOtp: ElementRef;
  @ViewChild('formDirective') private formDirective: NgForm;
  @ViewChild('otp') inputElement: any;
  isHide = true;
  isDev = isDevMode();
  private readonly EMPTY = '';
  returnUrl = '/';
  urlBase = environment.base_url;

  $verifyOtp: FormType<string>[] = [
    new TextboxItem({
      key: 'otp',
      required: true,
      value: this.EMPTY,
      minLength: 6,
      maxLength: 8,
    }),
  ];

  otp = ['otp'];

  errorData = '';
  timeExpireOtp;
  newForm: FormGroup = new FormGroup({});
  interval;
  timeOutOtp;
  btnTextContent = 'login.login';
  methodOtpValue = 'NOTIFY';
  sessionState = '';
  messageOtp: string = '';
  errorOtp: boolean = false;
  authentication: string;
  otpKey: string = null;
  constructor(
    protected injector: Injector,
    private authService: AuthService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
  }

  public initData(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.newForm = this.itemControl.toFormGroup(this.$verifyOtp);
    // this.sendOtp();
  }

  sendOtp() {
    this.errorData = '';
    this.otpKey = null;
    this.newForm?.get('otp')?.reset();
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.messageOtp = '';
    this.indicator.showActivityIndicator();
    this.authService.sendOtp().pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status == 200) {
        this.otpKey = res.data.otpKey;
        let messageSuccess = 'Mã OTP đã được gửi về ứng dụng ngân hàng MB của bạn. Vui lòng kiểm tra thông báo trên ứng dụng'
        this.getOtpSuccess(messageSuccess, 120000);
      } else {
        // show lỗi
        this.getOtpFail(res.soaErrorDesc);

      }
    }, (error) => {
      const message = error.error && error?.error?.message ? error?.error?.message : 'Có lỗi xảy ra. Vui lòng liên hệ CNTT để được hỗ trợ.';
      this.getOtpFail(message);
    });
  }

  getOtpSuccess(messageOtp, otpTime) {
    this.messageOtp = messageOtp
    this.errorOtp = false;
    this.btnTextContent = 'Xác nhận';
    this.timeExpireOtp = otpTime / 1000;
    this.startCountDownTimeOTP();
  }

  getOtpFail(messageOtp) {
    this.messageOtp = 'Lấy mã OTP thất bại'
    this.errorOtp = true;
    this.timeExpireOtp = 0;
  }

  verifyOTP() {

    // if (environment.byPassOtp && !this.otpKey) {
    //   this.otpKey = UUID.UUID();
    //   // return this.getUserInfo();
    // }

    this.errorData = '';
    this.validateAllFields(this.newForm);
    if (!this.newForm.valid) {
      this.inputElOtp.nativeElement.focus();
      this.isValidControlOTP();
      return;
    }

    if (!this.otpKey) {
      this.dialogService.error({
        title: 'dialog.notification',
        innerHTML: 'Chưa thực hiện khởi tạo mã OTP'
      }, () => { });
      return;
    }

    this.indicator.showActivityIndicator();
    this.authService.verifyOtp(this.otpKey, this.newForm.getRawValue()?.otp).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status == 200) {
        clearTimeout(this.timeOutOtp);

        this.getUserInfo();
      } else {
        const message = 'OTP không chính xác, Vui lòng kiểm tra lại';
        this.errorData = message;
        // this.dialogService.error({
        //   title: 'dialog.notification',
        //   innerHTML: res?.soaErrorDesc ? `${message} <br> ${res?.soaErrorDesc}` : `${message}`
        // }, result => {
        //   if (result) {
        //     this.inputElOtp.nativeElement.focus();
        //   }
        // });

      }
    }, (error) => {
      // Utils.logger(error, "ERROR VERIFY OTP")
      // // const message = error.error && error?.error?.soaErrorDesc ? error?.error?.soaErrorDesc : 'Có lỗi xảy ra. Vui lòng liên hệ CNTT để được hỗ trợ.';
      // this.errorData = 'Verify OTP thất bại';
      const messsageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messsageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );

    });
  }

  public isValidControlOTP() {
    this.errorData = '';
    for (let element of this.otp) {
      const control = this.newForm.controls[element];
      if (control.hasError('required') && this.errorData === '') {
        this.errorData = 'login.required_' + element;
        break;
      }
      if (control.hasError('minlength') && this.errorData === '') {
        this.errorData = 'login.minlength_' + element;
        break;
      }
      if (control.hasError('maxlength') && this.errorData === '') {
        this.errorData = 'login.maxlength_' + element;
        break;
      }
    }
  }

  byPassRegisterOTP() {
    this.dialogService.confirm({
      title: 'Bỏ qua xác thực OTP',
      message: 'Bạn có chắc chắn muốn bỏ qua xác thực OTP?',
      description: 'Đồng ý'
    }, (result: any) => {
      if (result) {
        this.sendOtp();
      }
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeExpireOtp > 0) {
        this.timeExpireOtp--;
      } else {
        // this.timeLeft = 60;
        clearInterval(this.interval);
      }
    }, 1000)
  }

  /**
   * Đếm ngược time hết hạn OTP
   */
  startCountDownTimeOTP() {
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 0)
    this.newForm?.get('otp')?.reset();
    this.startTimer();
  }


  getUserInfo() {
    // xử lý lưu token mới của pmp_admin và get role và mapping thành menu hiển thị
    localStorage.removeItem(LocalStoreEnum.Menu_List)
    this.indicator.showActivityIndicator();
    this.authService.getUserPermissions().pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status == 200) {
        const permissions = res.data;
        let menuObList = JSON.stringify(MenuService.getMenusByPermissions(permissions));

        console.log("MY MENU PERMISSIONS", menuObList);

        if (environment.showAllMenu) {
          menuObList = JSON.stringify(AppMenus);
        }

        const sessionState = this.decodeJWT(this.localStore.getData(LocalStoreEnum.Token_Jwt))?.payload?.session_state;

        localStorage.setItem(LocalStoreEnum.pmp_permissions, JSON.stringify(permissions));
        localStorage.setItem(LocalStoreEnum.Menu_List, menuObList);
        localStorage.setItem(LocalStoreEnum.pmp_verified_otp, sessionState);
        this.getBilateralUser();

        this.router.navigateByUrl('pmp_admin/admin/profile');
        this.toastr.showToastr(
          `Đăng nhập thành công`,
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
      } else {
        this.toastr.showToastr(
          `Đăng nhập không thành công`,
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    }, (error) => {
      this.toastr.showToastr(
        `Đăng nhập không thành công`,
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

  getBilateralUser() {
    this.authService.getBilateralUser().pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => { })
    ).subscribe((res) => {
      if (res && res.status == 200) {
        console.log("========= GET BILATERAL USER ========", res.data);

        this.localStore.saveSessionData(res.data, LocalStoreEnum.Bilateral_User_Infor);
      } else {

      }
    }, (error) => {
      console.log("error", error);

    });
  }

  goBack() {
    window.history.back();
    window.history.back();
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

import {OAuthService} from "angular-oauth2-oidc";
import {ComponentAbstract, MessageSeverity} from "@shared-sm";
import {Component, Injector} from "@angular/core";
import {AuthService} from "../service/AuthService";
import {PASSWORD, USERNAME} from "./model/constant";
import {DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG} from "../../../public/constants";
import {finalize, takeUntil} from "rxjs/operators";
import ErrorUtils from "../../../shared/utils/ErrorUtils";
import {ILoginRequest} from "./model/interface";

@Component({
  selector: 'app-welcome-component',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent extends ComponentAbstract {
  $username = USERNAME();
  $password = PASSWORD();
  
  hidePassword = true;
  isLoading = false;

  constructor(private oauthService: OAuthService,
              protected injector: Injector,
              private authService: AuthService
  ) {
    super(injector);
  }
  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$username,
      this.$password,
    ]);
  }

  login() {
    if (this.form.valid) {
      const values = this.form.value;
      const body: ILoginRequest = {
        username: values.username,
        password: values.password
      };
      
      console.log('Login request body:', body);
      console.log('API URL:', 'http://localhost:8888/admin-portal/v1/login');
      
      this.isLoading = true;
      this.indicator.showActivityIndicator();
      
      this.authService
              .login(body)
              .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => {
                  this.indicator.hideActivityIndicator();
                  this.isLoading = false;
                })
              )
              .subscribe(
                (res) => {
                  console.log('LOGIN RESPONSE', res);
                  console.log('Response details:', {
                    status: res?.status,
                    data: res?.data,
                    error: res?.error
                  });
                  
                  // Gọi API thành công và có data trả về
                  if (res && res.status === 200) {
                    this.toastr.showToastr(
                      'Đăng nhập thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo('/pmp_admin');
                  } else {
                    // Handle unexpected response status
                    console.warn('Unexpected response status:', res?.status);
                    this.toastr.showToastr(
                      'Phản hồi không mong đợi từ máy chủ',
                      'Cảnh báo',
                      MessageSeverity.warning,
                      TOAST_DEFAULT_CONFIG
                    );
                  }
                },
                (error) => {
                  console.log('ERROR', error);
                  console.log('Error details:', {
                    status: error?.status,
                    statusText: error?.statusText,
                    error: error?.error,
                    message: error?.message
                  });
                  
                  let errorMessage = 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';
                  
                  try {
                    const messageError = ErrorUtils.getErrorMessage(error);
                    if (messageError && messageError.length > 0) {
                      errorMessage = messageError.join('\n');
                    }
                  } catch (parseError) {
                    console.error('Error parsing error message:', parseError);
                    // Fallback error messages based on HTTP status
                    if (error?.status === 401) {
                      errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
                    } else if (error?.status === 403) {
                      errorMessage = 'Tài khoản không có quyền truy cập.';
                    } else if (error?.status === 500) {
                      errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                    } else if (error?.status === 0) {
                      errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
                    }
                  }
                  
                  this.toastr.showToastr(
                    errorMessage,
                    'Lỗi đăng nhập',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              );
    } else {
      this.toastr.showToastr(
        'Vui lòng nhập đúng định dạng',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    }
  }
  register() {
    this.oauthService.initLoginFlow(); // lúc này mới gọi Google login
  }
}

import { Component, Injector } from '@angular/core';
import { ComponentAbstract, LocalStoreEnum, MessageSeverity } from '@shared-sm';
import { AuthService } from '../service/AuthService';
import { IRegisterRequest, IRegisterResponse } from './model/interface';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from '../../../public/constants';
import { finalize, takeUntil } from 'rxjs/operators';
import ErrorUtils from '../../../shared/utils/ErrorUtils';
import { environment } from '@env/environment';
import { AppMenus, MenuService } from '../../../shared/services/menu.service';
import { USERNAME, EMAIL, FULL_NAME, PHONE_NUMBER, PASSWORD, CONFIRM_PASSWORD } from './model/constant';

@Component({
  selector: 'app-register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends ComponentAbstract {
  $username = USERNAME();
  $email = EMAIL();
  $fullName = FULL_NAME();
  $phoneNumber = PHONE_NUMBER();
  $password = PASSWORD();
  $confirmPassword = CONFIRM_PASSWORD();
  
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  showPasswordMismatch = false;

  constructor(
    protected injector: Injector,
    private authService: AuthService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$username,
      this.$email,
      this.$fullName,
      this.$phoneNumber,
      this.$password,
      this.$confirmPassword,
    ]);
  }

  register() {
    if (this.form.valid) {
      const values = this.form.value;
      
      // Check if passwords match
      if (values.password !== values.confirmPassword) {
        this.showPasswordMismatch = true;
        this.toastr.showToastr(
          'Mật khẩu xác nhận không khớp',
          'Lỗi đăng ký',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        return;
      }

      const body: IRegisterRequest = {
        username: values.username,
        email: values.email,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        password: values.password
      };
      
      console.log('Register request body:', body);
      console.log('API URL:', 'http://localhost:8888/admin-portal/v1/register');
      
      this.isLoading = true;
      this.indicator.showActivityIndicator();
      
      this.authService
        .register(body)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => {
            this.indicator.hideActivityIndicator();
            this.isLoading = false;
          })
        )
        .subscribe(
          (res) => {
            console.log('REGISTER RESPONSE', res);
            console.log('Response details:', {
              status: res?.status,
              data: res?.data,
              error: res?.error
            });
            
            if (res && res.status === 200) {
              // Auto login after successful registration
              this.autoLoginAfterRegister(values.username, values.password);
            } else {
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
            console.log('REGISTER ERROR', error);
            console.log('Error details:', {
              status: error?.status,
              statusText: error?.statusText,
              error: error?.error,
              message: error?.message
            });
            
            let errorMessage = 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';
            
            try {
              const messageError = ErrorUtils.getErrorMessage(error);
              if (messageError && messageError.length > 0) {
                errorMessage = messageError.join('\n');
              }
            } catch (parseError) {
              console.error('Error parsing error message:', parseError);
              if (error?.status === 400) {
                errorMessage = 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.';
              } else if (error?.status === 409) {
                errorMessage = 'Tên đăng nhập hoặc email đã tồn tại.';
              } else if (error?.status === 500) {
                errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
              } else if (error?.status === 0) {
                errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
              }
            }
            
            this.toastr.showToastr(
              errorMessage,
              'Lỗi đăng ký',
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

  private autoLoginAfterRegister(username: string, password: string) {
    const loginBody = {
      username: username,
      password: password
    };
    
    this.authService
      .login(loginBody)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          if (res && res.status === 200) {
            localStorage.setItem(LocalStoreEnum.Token_Jwt, res.data.token);
            localStorage.setItem(LocalStoreEnum.USER_NAME, res.data.username);
            this.getUserInfo();
          }
        },
        (error) => {
          console.error('Auto login failed:', error);
          this.toastr.showToastr(
            'Đăng ký thành công nhưng đăng nhập tự động thất bại. Vui lòng đăng nhập thủ công.',
            'Thông báo',
            MessageSeverity.warning,
            TOAST_DEFAULT_CONFIG
          );
          this.goTo('/auth/welcome');
        }
      );
  }

  private getUserInfo() {
    localStorage.removeItem(LocalStoreEnum.Menu_List);
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

        localStorage.setItem(LocalStoreEnum.pmp_permissions, JSON.stringify(permissions));
        localStorage.setItem(LocalStoreEnum.Menu_List, menuObList);

        this.router.navigateByUrl('pmp_admin/admin/profile');
        this.toastr.showToastr(
          `Đăng ký và đăng nhập thành công`,
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
      } else {
        this.toastr.showToastr(
          `Đăng ký thành công nhưng không thể lấy thông tin người dùng`,
          'Cảnh báo',
          MessageSeverity.warning,
          TOAST_DEFAULT_CONFIG
        );
        this.goTo('/auth/welcome');
      }
    }, (error) => {
      this.toastr.showToastr(
        `Đăng ký thành công nhưng không thể lấy thông tin người dùng`,
        'Cảnh báo',
        MessageSeverity.warning,
        TOAST_DEFAULT_CONFIG
      );
      this.goTo('/welcome');
    });
  }

  goToLogin() {
    this.goTo('/welcome');
  }

  onPasswordChange() {
    this.showPasswordMismatch = false;
  }
}

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
      this.indicator.showActivityIndicator();
      this.authService
              .login(body)
              .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.indicator.hideActivityIndicator())
              )
              .subscribe(
                (res) => {
                  console.log('RESPONSE', res);
                  // Gọi API thành công và có data trả về
                  if (res && res.status === 200) {
                    this.toastr.showToastr(
                      'Đăng nhập thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo('/pmp_admin');
                  }
                },
                (error) => {
                  console.log('ERROR', error);
                  const messageError = ErrorUtils.getErrorMessage(error);
                  this.toastr.showToastr(
                    messageError.join('\n'),
                    'Thông báo!',
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

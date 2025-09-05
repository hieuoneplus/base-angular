import {OAuthService} from "angular-oauth2-oidc";
import {ComponentAbstract} from "@shared-sm";
import {Component, Injector} from "@angular/core";

@Component({
  selector: 'app-welcome-component',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent extends ComponentAbstract {


  constructor(private oauthService: OAuthService,
              protected injector: Injector,
  ) {    super(injector);
  }
  protected componentInit(): void {
  }

  login() {
    this.oauthService.initLoginFlow(); // lúc này mới gọi Google login
  }
}

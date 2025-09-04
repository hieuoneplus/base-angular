import { materialProviders } from './material-config';
import { TranslateLangService } from './translate-lang.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivityIndicatorModule } from '@shared-sm';
import { AppComponent } from './app.component';
import { environment } from '@env/environment';
import { SharedSMModule } from '@shared-sm';
import { DformLayoutComponent } from './theme/dform-layout/dform-layout.component';
import { AuthGuard } from './shared/permission/auth.guard';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'
import { initializer } from './keycloak-initializer'
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './features/auth/auth.interceptor';
import { BigIntInterceptor } from './shared/utils/BigInt.interceptor';
import {OAuthModule, OAuthService} from "angular-oauth2-oidc";

export function TranslateLangServiceFactory(translateLangService: TranslateLangService) {
  return () => translateLangService.load();
}

export function TranslateHttpLoaderFactory(http: HttpClient) {
  const assetsUrl = environment.base_url + '/assets/i18n/'
  return new TranslateHttpLoader(http, assetsUrl, '.json?nocache=' + (new Date()).getTime());
}

const routes: Routes = [
  { path: '', redirectTo: 'pmp_admin/auth', pathMatch: 'full' },
  {
    path: 'pmp_admin/auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'pmp_admin',
    component: DformLayoutComponent,
    canActivate:[],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./features/user-management/user-management.module').then(m => m.UserManagementModule),
        // data: { title: 'users', titleI18n: 'users' }
      },
      {
        path: 'transfer-channel',
        loadChildren: () => import('./features/transfer-channel/transfer-channel.module').then(m => m.TransferChannelModule),
      },
      {
        path: 'general-config',
        loadChildren: () => import('./features/general-configuration/general-configuration.module').then(m => m.GeneralConfigurationModule),
      },
      {
        path: 'routing',
        loadChildren: () => import('./features/routing-configuration/routing-configuration.module').then(m => m.RoutingConfigurationModule),
        // data: { title: 'routing', titleI18n: 'routing' }
      },
    ],
  },

];

@NgModule({
  imports: [
    SharedSMModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ActivityIndicatorModule,
    KeycloakAngularModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    OAuthModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: TranslateLangServiceFactory,
      deps: [TranslateLangService],
      multi: true,
    },
    materialProviders,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [OAuthService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true  // Chạy nhiều interceptors cùng lúc
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BigIntInterceptor,
      multi: true
    }
  ],
  bootstrap: []
})

export class AppModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('pmp-admin-app-element', ce);
  }
}

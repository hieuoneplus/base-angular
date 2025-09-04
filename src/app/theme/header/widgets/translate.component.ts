import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-translate',
  template: `
    <button mat-flat-button class="dform-toolbar-translate" [matMenuTriggerFor]="menu">
      <img class="align-middle" [src]="'assets/images/flags/flag_' + currentLang?.lang?.toLowerCase() + '.png'" height="18" width="auto" alt="" />
      <mat-icon class="mbb-icon ic-angle_down text-custom-gray fs-16"></mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      <button mat-menu-item *ngFor="let lang of langs" (click)="useLanguage(lang.key)">
        <img class="align-middle mrr-4" [src]="'assets/images/flags/flag_' + lang?.lang?.toLowerCase() + '.png'" height="24" width="auto" alt="" />
        <span>{{ lang.value }}</span>
      </button>
    </mat-menu>
  `,
  styles: [],
})
export class TranslateComponent {
  langs = [
    {
      value: 'Việt Nam',
      key: 'vi-VN',
      lang: 'vn'
    },
    {
      value: 'English',
      key: 'en-US',
      lang: 'en'
    }
  ];
  currentLang;

  constructor(private translate: TranslateService, private settings: SettingsService) {
    translate.addLangs(['vi-VN', 'en-US']);
    translate.setDefaultLang('vi-VN');
    translate.use('vi-VN');
    this.currentLang = this.langs.find(x => x.key === 'vi-VN');
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.settings.setLanguage(language);
    this.currentLang = this.langs.find(x => x.key === language);
  }
}

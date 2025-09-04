import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AppSettings, defaults} from './settings';

export const USER_KEY = 'usr';

// export interface User {
//   name: string;
//   id: number;
//   avatar: string;
// }

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private options = defaults;

  get notify(): Observable<any> {
    return this.notify$.asObservable();
  }

  private notify$ = new BehaviorSubject<any>({});

  get language() {
    return this.options.language;
  }

  constructor() {
  }

  setLayout(options?: AppSettings): AppSettings {
    this.options = Object.assign(defaults, options);
    return this.options;
  }

  setNavState(type: string, value: boolean) {
    this.notify$.next({type, value} as any);
  }

  getOptions(): AppSettings {
    return this.options;
  }

  setLanguage(lang: string) {
    this.options.language = lang;
    this.notify$.next({lang});
  }
}

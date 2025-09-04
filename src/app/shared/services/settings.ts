export interface AppSettings {
  navPos?: 'side' | 'top';
  dir?: 'ltr' | 'rtl';
  theme?: 'light' | 'dark';
  showHeader?: boolean;
  headerPos?: 'fixed' | 'static' | 'above';
  showUserPanel?: boolean;
  sidenavOpened?: boolean;
  sidenavCollapsed?: boolean;
  language?: string;
  menuMode?: number;
}

export const defaults: AppSettings = {
  navPos: 'side',
  dir: 'ltr',
  theme: 'light',
  showHeader: true,
  // headerPos: 'above',
  headerPos: 'static',
  showUserPanel: true,
  sidenavOpened: true,
  sidenavCollapsed: true,
  language: 'vi-VN',
  menuMode: 0
};

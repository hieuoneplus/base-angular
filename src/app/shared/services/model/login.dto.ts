type HTTPMETHOD = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Right {
  api: string;
  httpMethod: HTTPMETHOD;
  id: string;
  name: string;
  parentId: string | number;
}

interface Menus {
  id: number | string;
  name: string;
  parentId: number;
  url: string;
  position?: number;
  child?: Array<Menus>;
}

interface InfoUser {
  menus: Menus[];
  rights: Right[];
  menusOrs: any[];
}

export interface Login {
  accessToken: string;
  info: InfoUser;
  refreshToken: any;
  timeExpiration: number;
}

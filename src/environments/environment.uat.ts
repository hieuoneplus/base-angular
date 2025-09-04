export const environment = {
  production: true,
  uat: false,
  key: 'pmp_admin',
  logger: false,
  byPassOtp: false,
  showAllMenu: false,
  base_path: 'pmp_admin/',
  origin: 'https://webportal.mbbank.com.vn',

  base_url: 'https://pmp-admin-portal-c03.multidc.mbbank.com.vn:9402',
  urlPmpBe: 'https://pmp-admin-portal-c03.multidc.mbbank.com.vn:9407',
  urlBilateralBE: 'https://pmp-admin-portal-c03.multidc.mbbank.com.vn:9408/bilateral-portal/api',

  keycloak: {
    issuer: 'https://keycloak-internal.mbbank.com.vn/auth/',
    realm: 'internal',
    client: '',
    relationShip: '',
    realmManagement: 'realm-management'
  },
};

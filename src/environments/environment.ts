export const environment = {
  production: true,
  uat: false,
  key: 'pmp_admin',
  logger: false,
  byPassOtp: false,
  showAllMenu: false,
  base_path: 'pmp_admin/',
  origin: 'http://localhost:4200',

  base_url: 'http://localhost:4200',
  urlPmpBe: 'http://localhost:8080',
  urlBilateralBE: 'http://localhost:8080',

  keycloak: {
    issuer: 'https://keycloak-internal.mbbank.com.vn/auth/',
    realm: 'internal',
    client: '',
    relationShip: '',
    realmManagement: 'realm-management'
  },
};

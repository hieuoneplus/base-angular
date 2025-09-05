import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from "@env/environment";

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  clientId: environment.google.clientId,
  redirectUri: window.location.origin,
  scope: 'openid profile email',
};

export const Config = {
  API_URI: process.env.API_URI,
  API_WRITABLE: process.env.API_WRITABLE,
  API_SIGN_PETITION: process.env.API_SIGN_PETITION || '',
  BASE_APP_PATH: process.env.BASE_APP_PATH,
  BASE_URL: process.env.BASE_URL || '',
  ONLY_PROD_ROUTES: process.env.ONLY_PROD_ROUTES || '',
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || '',
  TRACK_SHARE_URL: process.env.TRACK_SHARE_URL || '',
  USE_HASH_BROWSING: !process.env.PROD,
  ENTITY: process.env.ENTITY || window.ENTITY
}
export default Config

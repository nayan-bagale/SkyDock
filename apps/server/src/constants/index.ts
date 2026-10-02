export enum TimeInMs {
  ONE_MINUTE = 60 * 1000,
  TWO_MINUTES = 2 * 60 * 1000,
  FIVE_MINUTES = 5 * 60 * 1000,
  TEN_MINUTES = 10 * 60 * 1000,
  ONE_HOUR = 60 * 60 * 1000,
  THREE_HOURS = 3 * 60 * 60 * 1000,
  ONE_DAY = 24 * 60 * 60 * 1000,
  FIFTEEN_MINUTES = 15 * 60 * 1000, // 15 minutes
}

export const DEFAULT_RATE_LIMIT_WINDOW = TimeInMs.FIVE_MINUTES;
export const DEFAULT_RATE_LIMIT_MAX = 100;

export const OTP_EXPIRATION_TIME = TimeInMs.FIFTEEN_MINUTES;

export const AUTHORIZATION_CODE_TTL_MS = TimeInMs.TWO_MINUTES;
export const CODE_CHALLENGE_METHOD = 'S256';
export const HASH_AUTHORIZATION_CODE_METHOD = 'sha256';
export const BASE64_URL_ENCODING_METHOD = 'base64url';
export const DIGEST_ALGORITHM = 'hex';
export const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 300;

export enum GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
}
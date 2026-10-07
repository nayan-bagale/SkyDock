import { createHash, randomBytes } from 'crypto';
import {
  AUTHORIZATION_CODE_TTL_MS,
  BASE64_URL_ENCODING_METHOD,
  CODE_CHALLENGE_METHOD,
  DIGEST_ALGORITHM,
  HASH_AUTHORIZATION_CODE_METHOD,
} from '../constants';
import cache from '../utils/inMemoryStore';

const PKCE_CACHE_PREFIX = 'pkce:';

export type CreateAuthorizationCodeInput = {
  userId: string;
  codeChallenge: string;
  clientId?: string | null;
  redirectUri?: string | null;
};

export type ConsumedAuthorizationCode = {
  userId: string;
};

type StoredAuthorizationCode = {
  userId: string;
  codeChallenge: string;
  redirectUri: string | null;
};

/** Persists and validates OAuth-style authorization codes with PKCE (RFC 7636). */
class PkceService {
  private static instance: PkceService;

  private constructor() {}

  public static getInstance(): PkceService {
    if (!PkceService.instance) {
      PkceService.instance = new PkceService();
    }
    return PkceService.instance;
  }

  /**
   * Returns true when code_challenge equals BASE64URL(SHA256(code_verifier)).
   * Used at token exchange; the verifier never leaves the client until then.
   */
  verifyPkceS256(codeVerifier: string, codeChallenge: string): boolean {
    if (!codeVerifier || !codeChallenge) return false;
    return this.sha256Base64Url(codeVerifier) === codeChallenge;
  }

  /** Only S256 is supported; plain challenges are rejected at authorize time. */
  assertChallengeMethod(method: string | undefined): boolean {
    return method === CODE_CHALLENGE_METHOD;
  }

  /**
   * Creates a one-time authorization code for the user. Stores codeChallenge and optional
   * redirectUri (null for credential login). Only the hash of the raw code is persisted.
   */
  async createAuthorizationCode(
    input: CreateAuthorizationCodeInput,
  ): Promise<{ code: string; expiresIn: number }> {
    const code = this.base64UrlEncode(randomBytes(32));
    const codeHash = this.hashAuthorizationCode(code);
    const cacheKey = this.cacheKey(codeHash);

    cache.set(
      cacheKey,
      {
        userId: input.userId,
        codeChallenge: input.codeChallenge,
        redirectUri: input.redirectUri ?? null,
      },
      AUTHORIZATION_CODE_TTL_MS,
    );

    return {
      code,
      expiresIn: Math.floor(AUTHORIZATION_CODE_TTL_MS / 1000),
    };
  }

  /**
   * Validates and burns a code: must be unexpired, PKCE-valid, and (if bound) redirect_uri must match.
   */
  async consumeAuthorizationCode(
    code: string,
    codeVerifier: string,
    redirectUri?: string,
  ): Promise<ConsumedAuthorizationCode | null> {
    const codeHash = this.hashAuthorizationCode(code);
    const cacheKey = this.cacheKey(codeHash);

    const record = cache.get<StoredAuthorizationCode>(cacheKey);

    if (!record) {
      return null;
    }

    if (!this.verifyPkceS256(codeVerifier, record.codeChallenge)) {
      return null;
    }

    if (record.redirectUri !== null && record.redirectUri !== redirectUri) {
      return null;
    }

    cache.del(cacheKey);

    return { userId: record.userId };
  }

  /** Encodes random bytes as a URL-safe authorization code string. */
  private base64UrlEncode(buffer: Buffer): string {
    return buffer.toString(BASE64_URL_ENCODING_METHOD);
  }

  /** PKCE S256 transform applied to the code_verifier. */
  private sha256Base64Url(value: string): string {
    return createHash(HASH_AUTHORIZATION_CODE_METHOD)
      .update(value)
      .digest(BASE64_URL_ENCODING_METHOD);
  }

  /** Lookup key for cached codes; raw codes are never stored. */
  private hashAuthorizationCode(code: string): string {
    return createHash(HASH_AUTHORIZATION_CODE_METHOD).update(code).digest(DIGEST_ALGORITHM);
  }

  private cacheKey(codeHash: string): string {
    return `${PKCE_CACHE_PREFIX}${codeHash}`;
  }
}

export default PkceService.getInstance();

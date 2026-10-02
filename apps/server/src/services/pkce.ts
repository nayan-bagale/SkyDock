import { createHash, randomBytes } from 'crypto';
import { prisma } from '../config/db';
import {
  AUTHORIZATION_CODE_TTL_MS,
  BASE64_URL_ENCODING_METHOD,
  CODE_CHALLENGE_METHOD,
  DIGEST_ALGORITHM,
  HASH_AUTHORIZATION_CODE_METHOD,
} from '../constants';


export type CreateAuthorizationCodeInput = {
  userId: string;
  codeChallenge: string;
  clientId?: string | null;
  redirectUri?: string | null;
};

export type ConsumedAuthorizationCode = {
  userId: string;
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
   * clientId/redirectUri (null for credential login). Only the hash of the raw code is persisted.
   */
  async createAuthorizationCode(
    input: CreateAuthorizationCodeInput,
  ): Promise<{ code: string; expiresIn: number }> {
    const code = this.base64UrlEncode(randomBytes(32));
    const codeHash = this.hashAuthorizationCode(code);
    const expiresAt = new Date(Date.now() + AUTHORIZATION_CODE_TTL_MS);

    await prisma.authorizationCode.create({
      data: {
        codeHash,
        userId: input.userId,
        codeChallenge: input.codeChallenge,
        clientId: input.clientId ?? null,
        redirectUri: input.redirectUri ?? null,
        expiresAt,
      },
    });

    return {
      code,
      expiresIn: Math.floor(AUTHORIZATION_CODE_TTL_MS / 1000),
    };
  }

  /**
   * Validates and burns a code: must be unused, unexpired, PKCE-valid, and (if bound) redirect_uri must match.
   * updateMany with usedAt guards against double redemption under concurrent token requests.
   */
  async consumeAuthorizationCode(
    code: string,
    codeVerifier: string,
    redirectUri?: string,
  ): Promise<ConsumedAuthorizationCode | null> {
    const codeHash = this.hashAuthorizationCode(code);

    const record = await prisma.authorizationCode.findUnique({
      where: { codeHash },
    });

    if (!record || record.usedAt || record.expiresAt <= new Date()) {
      return null;
    }

    if (!this.verifyPkceS256(codeVerifier, record.codeChallenge)) {
      return null;
    }

    if (record.redirectUri !== null && record.redirectUri !== redirectUri) {
      return null;
    }

    const updated = await prisma.authorizationCode.updateMany({
      where: {
        codeHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });

    if (updated.count !== 1) {
      return null;
    }

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

  /** Lookup key for AuthorizationCode rows; raw codes are never stored. */
  private hashAuthorizationCode(code: string): string {
    return createHash(HASH_AUTHORIZATION_CODE_METHOD).update(code).digest(DIGEST_ALGORITHM);
  }
}

export default PkceService.getInstance();

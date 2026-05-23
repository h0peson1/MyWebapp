import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

type TokenPayload = {
  userId?: string;
  email?: string;
  role?: string;
} & Record<string, unknown>;

type PasswordResetTokenPayload = {
  purpose: 'password-reset';
  userId: string;
  email: string;
  pwdv: string;
};

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Hash a password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: TokenPayload): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

/**
 * Issue a short-lived password reset token.
 */
export async function signPasswordResetToken(payload: Omit<PasswordResetTokenPayload, 'purpose'>): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
  return new SignJWT({ ...payload, purpose: 'password-reset' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('20m')
    .sign(secret);
}

/**
 * Verify a JWT token using jose.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null; // Invalid or expired token
  }
}

/**
 * Verify and parse a password reset token.
 */
export async function verifyPasswordResetToken(token: string): Promise<PasswordResetTokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jwtVerify(token, secret);

    if (
      payload.purpose !== 'password-reset' ||
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.pwdv !== 'string'
    ) {
      return null;
    }

    return {
      purpose: 'password-reset',
      userId: payload.userId,
      email: payload.email,
      pwdv: payload.pwdv,
    };
  } catch {
    return null;
  }
}

/**
 * Enforce a basic but meaningful password policy.
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

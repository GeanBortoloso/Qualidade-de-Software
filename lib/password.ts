import bcrypt from "bcryptjs";

const ROUNDS = 10;

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, ROUNDS);
}

export function verifyPassword(plain: string, stored: string): boolean {
  if (stored.startsWith("$2")) {
    return bcrypt.compareSync(plain, stored);
  }
  return plain === stored;
}

export function isHashed(stored: string): boolean {
  return stored.startsWith("$2");
}

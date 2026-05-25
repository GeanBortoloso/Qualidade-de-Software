import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "qualidade_session";

export type SessionUser = {
  userId: number;
  nome: string;
  email: string;
  perfil: string;
  perfilId: number;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET ?? "dev-secret-altere-em-producao";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = Number(payload.userId);
    const perfilId = Number(payload.perfilId);
    if (!userId || !payload.email || !payload.perfil) return null;

    return {
      userId,
      nome: String(payload.nome),
      email: String(payload.email),
      perfil: String(payload.perfil),
      perfilId,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function painelPathForPerfil(perfil: string): string {
  switch (perfil) {
    case "Administrador":
      return "/painel/administrador";
    case "Professor":
      return "/painel/professor";
    case "Aluno":
      return "/painel/aluno";
    default:
      return "/painel";
  }
}

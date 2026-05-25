import { NextResponse } from "next/server";
import db from "@lib/db";
import {
  createSessionToken,
  painelPathForPerfil,
  SESSION_COOKIE,
  sessionCookieOptions,
  type SessionUser,
} from "@lib/auth";
import { verifyPassword } from "@lib/password";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const usuario = db
      .prepare(
        `
      SELECT
        usuarios.id,
        usuarios.nome,
        usuarios.email,
        usuarios.senha,
        usuarios.ativo,
        usuarios.perfil_id AS perfilId,
        perfis.nome AS perfil
      FROM usuarios
      INNER JOIN perfis ON usuarios.perfil_id = perfis.id
      WHERE LOWER(usuarios.email) = LOWER(?)
    `
      )
      .get(String(email).trim()) as
      | {
          id: number;
          nome: string;
          email: string;
          senha: string;
          ativo: number;
          perfilId: number;
          perfil: string;
        }
      | undefined;

    if (!usuario || usuario.ativo !== 1) {
      return NextResponse.json(
        { error: "E-mail ou senha inválidos" },
        { status: 401 }
      );
    }

    if (!verifyPassword(senha, usuario.senha)) {
      return NextResponse.json(
        { error: "E-mail ou senha inválidos" },
        { status: 401 }
      );
    }

    const sessionUser: SessionUser = {
      userId: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      perfilId: usuario.perfilId,
    };

    const token = await createSessionToken(sessionUser);
    const redirect = painelPathForPerfil(usuario.perfil);

    const response = NextResponse.json({
      ok: true,
      redirect,
      user: {
        nome: sessionUser.nome,
        email: sessionUser.email,
        perfil: sessionUser.perfil,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar login" },
      { status: 500 }
    );
  }
}

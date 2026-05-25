import { NextResponse } from "next/server";
import db from "@lib/db";
import { hashPassword } from "@lib/password";

export async function GET() {
  const usuarios = db
    .prepare(
      `
    SELECT
      usuarios.id,
      usuarios.nome,
      usuarios.email,
      usuarios.telefone,
      usuarios.ativo,
      perfis.nome AS perfil
    FROM usuarios
    INNER JOIN perfis ON usuarios.perfil_id = perfis.id
  `
    )
    .all();

  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha, perfil_id, telefone } = body;

    if (!nome || !email || !senha || perfil_id == null) {
      return NextResponse.json(
        { error: "Campos nome, email, senha e perfil_id são obrigatórios" },
        { status: 400 }
      );
    }

    const perfil = db
      .prepare("SELECT id FROM perfis WHERE id = ?")
      .get(perfil_id);

    if (!perfil) {
      return NextResponse.json(
        { error: "Perfil informado não existe" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(
      "INSERT INTO usuarios (nome, email, senha, telefone, perfil_id) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(
      nome,
      email,
      hashPassword(senha),
      telefone ?? null,
      perfil_id
    );

    const perfilNome = db
      .prepare("SELECT nome FROM perfis WHERE id = ?")
      .get(perfil_id) as { nome: string };

    return NextResponse.json(
      {
        id: result.lastInsertRowid,
        nome,
        email,
        telefone: telefone ?? null,
        perfil: perfilNome.nome,
      },
      { status: 201 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao cadastrar usuário";
    const status = message.includes("UNIQUE") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

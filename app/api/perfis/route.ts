import { NextResponse } from "next/server";
import db from "@lib/db";

export async function GET() {
  const perfis = db.prepare("SELECT * FROM perfis").all();
  return NextResponse.json(perfis);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, descricao } = body;

    if (!nome || typeof nome !== "string") {
      return NextResponse.json(
        { error: "Campo nome é obrigatório" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(
      "INSERT INTO perfis (nome, descricao) VALUES (?, ?)"
    );
    const result = stmt.run(nome, descricao ?? null);

    return NextResponse.json(
      { id: result.lastInsertRowid, nome, descricao: descricao ?? null },
      { status: 201 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao cadastrar perfil";
    const status = message.includes("UNIQUE") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

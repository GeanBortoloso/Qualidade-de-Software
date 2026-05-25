import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { hashPassword, isHashed } from "./password";

const databaseDir = path.join(process.cwd(), "database");
const dbPath = path.join(databaseDir, "app.db");

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS perfis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    telefone TEXT,
    perfil_id INTEGER NOT NULL,
    ativo INTEGER DEFAULT 1,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id)
  );
`);

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM perfis").get() as {
    count: number;
  };

  if (count > 0) return;

  const insertPerfil = db.prepare(
    "INSERT INTO perfis (nome, descricao) VALUES (?, ?)"
  );

  const perfis = [
    ["Administrador", "Acesso total ao sistema"],
    ["Professor", "Gerencia conteúdo e turmas"],
    ["Aluno", "Acesso às atividades e materiais"],
  ] as const;

  for (const [nome, descricao] of perfis) {
    insertPerfil.run(nome, descricao);
  }

  const perfilIds = db
    .prepare("SELECT id, nome FROM perfis ORDER BY id")
    .all() as { id: number; nome: string }[];

  const idByNome = Object.fromEntries(
    perfilIds.map((p) => [p.nome, p.id])
  ) as Record<string, number>;

  const insertUsuario = db.prepare(
    "INSERT INTO usuarios (nome, email, senha, telefone, perfil_id) VALUES (?, ?, ?, ?, ?)"
  );

  const usuarios = [
    {
      nome: "Ana Administradora",
      email: "ana.admin@escola.edu",
      senha: "admin123",
      telefone: "(65) 99999-0001",
      perfil: "Administrador",
    },
    {
      nome: "Carlos Professor",
      email: "carlos.prof@escola.edu",
      senha: "prof123",
      telefone: "(65) 99999-0002",
      perfil: "Professor",
    },
    {
      nome: "Maria Aluna",
      email: "maria.aluna@escola.edu",
      senha: "aluno123",
      telefone: "(65) 99999-0003",
      perfil: "Aluno",
    },
  ] as const;

  for (const u of usuarios) {
    insertUsuario.run(
      u.nome,
      u.email,
      hashPassword(u.senha),
      u.telefone,
      idByNome[u.perfil]
    );
  }
}

function migratePlainPasswords() {
  const rows = db
    .prepare("SELECT id, senha FROM usuarios")
    .all() as { id: number; senha: string }[];

  const update = db.prepare("UPDATE usuarios SET senha = ? WHERE id = ?");

  for (const row of rows) {
    if (!isHashed(row.senha)) {
      update.run(hashPassword(row.senha), row.id);
    }
  }
}

seedIfEmpty();
migratePlainPasswords();

export default db;

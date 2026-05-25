"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DEMO_ACCOUNTS = [
  { email: "ana.admin@escola.edu", senha: "admin123", perfil: "Administrador" },
  { email: "carlos.prof@escola.edu", senha: "prof123", perfil: "Professor" },
  { email: "maria.aluna@escola.edu", senha: "aluno123", perfil: "Aluno" },
];

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error ?? "Falha no login");
        return;
      }

      const redirect = data.redirect ?? searchParams.get("redirect") ?? "/painel";
      router.push(redirect);
      router.refresh();
    } catch {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[0]) {
    setEmail(account.email);
    setSenha(account.senha);
    setErro("");
  }

  return (
    <div className="login-page">
      <div className="login-card animate-fade-up">
        <div className="login-header">
          <span className="login-logo">⬡</span>
          <h1>Acesso ao sistema</h1>
          <p>Entre com e-mail e senha para acessar seu painel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {erro && (
            <div className="login-erro" role="alert">
              {erro}
            </div>
          )}

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.edu"
              required
              autoComplete="email"
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="login-demo">
          <p>Contas de demonstração (atividade prática):</p>
          <div className="login-demo-btns">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="login-demo-btn"
                onClick={() => fillDemo(acc)}
              >
                {acc.perfil}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

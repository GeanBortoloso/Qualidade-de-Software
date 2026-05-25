"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@lib/auth";

type Props = {
  user: SessionUser;
  badge: string;
  badgeClass: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function PainelShell({
  user,
  badge,
  badgeClass,
  title,
  subtitle,
  children,
}: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cinza-fundo)" }}>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          <span style={{ color: "var(--vermelho-claro)" }}>⬡</span>
          Qualidade<span style={{ color: "var(--vermelho-claro)", fontWeight: 800 }}>SW</span>
        </Link>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span className={`perfil-badge ${badgeClass}`}>{badge}</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
            {user.nome}
          </span>
          <button type="button" onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </nav>

      <main className="painel-main">
        <header className="painel-header animate-fade-up">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>
        {children}
      </main>
    </div>
  );
}

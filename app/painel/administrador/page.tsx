import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@lib/auth";
import PainelShell from "../PainelShell";

export default async function PainelAdministradorPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.perfil !== "Administrador") redirect("/login");

  return (
    <PainelShell
      user={session}
      badge="Administrador"
      badgeClass="perfil-admin"
      title="Painel do Administrador"
      subtitle="Acesso total: usuários, perfis e configurações do sistema."
    >
      <div className="painel-grid">
        <section className="card painel-card animate-fade-up">
          <h2>Gestão de acesso</h2>
          <p>Cadastre e consulte perfis e usuários via API REST.</p>
          <ul>
            <li>Listar e criar perfis</li>
            <li>Listar e criar usuários vinculados</li>
            <li>Auditoria de relacionamento perfil ↔ usuário</li>
          </ul>
          <div className="painel-actions">
            <a href="/api/perfis" target="_blank" rel="noreferrer" className="painel-link">
              API Perfis →
            </a>
            <a href="/api/usuarios" target="_blank" rel="noreferrer" className="painel-link">
              API Usuários →
            </a>
          </div>
        </section>

        <section className="card painel-card animate-fade-up delay-100">
          <h2>ControleMax (estoque)</h2>
          <p>Módulo legado de produtos e backlog de inventário.</p>
          <div className="painel-actions">
            <Link href="/products" className="painel-link">
              Produtos →
            </Link>
            <Link href="/backlog" className="painel-link">
              Backlog →
            </Link>
          </div>
        </section>

        <section className="card painel-card painel-card-highlight animate-fade-up delay-200">
          <h2>Sua sessão</h2>
          <dl className="painel-dl">
            <dt>Nome</dt>
            <dd>{session.nome}</dd>
            <dt>E-mail</dt>
            <dd>{session.email}</dd>
            <dt>Perfil</dt>
            <dd>{session.perfil}</dd>
          </dl>
        </section>
      </div>
    </PainelShell>
  );
}

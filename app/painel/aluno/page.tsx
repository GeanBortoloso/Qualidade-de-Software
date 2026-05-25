import { redirect } from "next/navigation";
import { getSession } from "@lib/auth";
import PainelShell from "../PainelShell";

export default async function PainelAlunoPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.perfil !== "Aluno") redirect("/login");

  return (
    <PainelShell
      user={session}
      badge="Aluno"
      badgeClass="perfil-aluno"
      title="Painel do Aluno"
      subtitle="Acesse atividades, materiais e acompanhe seu progresso."
    >
      <div className="painel-grid">
        <section className="card painel-card animate-fade-up">
          <h2>Atividades</h2>
          <ul>
            <li>Ver trabalhos pendentes</li>
            <li>Enviar entregas</li>
            <li>Consultar notas e feedback</li>
          </ul>
        </section>

        <section className="card painel-card animate-fade-up delay-100">
          <h2>Materiais</h2>
          <p>Slides, listas e referências disponibilizados pelo professor.</p>
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

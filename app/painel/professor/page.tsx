import { redirect } from "next/navigation";
import { getSession } from "@lib/auth";
import PainelShell from "../PainelShell";

export default async function PainelProfessorPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.perfil !== "Professor") redirect("/login");

  return (
    <PainelShell
      user={session}
      badge="Professor"
      badgeClass="perfil-prof"
      title="Painel do Professor"
      subtitle="Gerencie turmas, conteúdos e acompanhe atividades dos alunos."
    >
      <div className="painel-grid">
        <section className="card painel-card animate-fade-up">
          <h2>Turmas e materiais</h2>
          <ul>
            <li>Publicar materiais da disciplina</li>
            <li>Corrigir entregas dos alunos</li>
            <li>Consultar lista de alunos matriculados</li>
          </ul>
        </section>

        <section className="card painel-card animate-fade-up delay-100">
          <h2>Comunicação</h2>
          <p>Canal reservado para avisos e feedback à turma (em breve).</p>
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

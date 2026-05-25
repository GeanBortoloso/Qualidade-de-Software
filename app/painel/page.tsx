import { redirect } from "next/navigation";
import { getSession, painelPathForPerfil } from "@lib/auth";

export default async function PainelIndexPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(painelPathForPerfil(session.perfil));
}

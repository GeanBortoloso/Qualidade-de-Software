import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login · Qualidade de Software",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="login-page">
          <div className="login-card">Carregando…</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

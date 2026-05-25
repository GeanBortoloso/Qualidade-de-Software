import '@/frontend/styles/globals.css';

export const metadata = {
  title: 'ControleMax · Gestão de Estoque',
  description: 'Sistema completo de gerenciamento de produtos e inventário',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

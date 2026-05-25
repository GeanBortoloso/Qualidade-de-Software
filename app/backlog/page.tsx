import { serverGetProducts } from '@/backend/products';
import BacklogList from '@/frontend/components/BacklogList';
import Link from 'next/link';

export const metadata = {
  title: 'Backlog · ControleMax',
  description: 'Produtos com estoque crítico ou baixo que precisam de reposição',
};

export default async function BacklogPage() {
  const allProducts = await serverGetProducts();
  const backlogProducts = allProducts.filter(p => p.stock <= 15);

  const critical = backlogProducts.filter(p => p.stock === 0).length;
  const urgent = backlogProducts.filter(p => p.stock >= 1 && p.stock <= 5).length;
  const warning = backlogProducts.filter(p => p.stock >= 6 && p.stock <= 15).length;
  const pctBacklog = allProducts.length > 0
    ? Math.round((backlogProducts.length / allProducts.length) * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cinza-fundo)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          <span style={{ color: 'var(--vermelho-claro)' }}>⬡</span>
          Controle<span style={{ color: 'var(--vermelho-claro)', fontWeight: 800 }}>Max</span>
        </Link>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Link href="/" className="navbar-link">Início</Link>
          <Link href="/products" className="navbar-link">Produtos</Link>
          <Link href="/backlog" className="navbar-link active">Backlog</Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1015 100%)', padding: '40px 40px 56px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="animate-fade-up" style={{ marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--vermelho-claro)',
            }}>
              Reposição de Estoque
            </span>
          </div>
          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '32px',
          }}>
            Backlog de Estoque
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total em Backlog', val: backlogProducts.length, cls: '' },
              { label: 'Crítico (sem estoque)', val: critical, cls: 'erro' },
              { label: 'Urgente (1–5 un.)', val: urgent, cls: 'ouro' },
              { label: 'Atenção (6–15 un.)', val: warning, cls: 'azul' },
              { label: '% do Inventário', val: `${pctBacklog}%`, cls: '' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`stat-card ${s.cls} animate-fade-up`}
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                <div className="stat-number">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px', transform: 'translateY(-20px)' }}>
        {backlogProducts.length === 0 ? (
          <div className="empty-state animate-fade-up">
            <span className="empty-icon">🎉</span>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem',
              color: 'var(--preto-profundo)',
              marginBottom: '10px',
            }}>
              Estoque em dia!
            </h3>
            <p style={{ color: 'var(--texto-secundario)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Todos os produtos estão com estoque acima de 15 unidades.
            </p>
            <Link href="/products" style={{
              background: 'var(--vermelho)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'inline-block',
            }}>
              ← Voltar para Produtos
            </Link>
          </div>
        ) : (
          <div className="card animate-fade-up delay-200" style={{ padding: '32px' }}>
            <div style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--preto-profundo)',
                  marginBottom: '4px',
                }}>
                  Produtos que precisam de reposição
                </h2>
                <p style={{ color: 'var(--texto-secundario)', fontSize: '0.85rem' }}>
                  Produtos com 15 unidades ou menos em estoque
                </p>
              </div>
              <Link href="/products" style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'var(--vermelho)',
                color: '#ffffff',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ✏️ Gerenciar Produtos
              </Link>
            </div>

            <BacklogList products={backlogProducts} />
          </div>
        )}
      </main>
    </div>
  );
}

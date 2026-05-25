import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cinza-fundo)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          <span style={{ color: 'var(--vermelho-claro)' }}>⬡</span>
          Controle<span style={{ color: 'var(--vermelho-claro)', fontWeight: 800 }}>Max</span>
        </Link>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Link href="/" className="navbar-link active">Início</Link>
          <Link href="/products" className="navbar-link">Produtos</Link>
          <Link href="/backlog" className="navbar-link">Backlog</Link>
          <Link href="/login" className="navbar-link">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #2a1015 100%)',
        padding: '96px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Orbs decorativos */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(192, 57, 43, 0.12)', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(231, 76, 60, 0.08)', filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '24px',
          }}>
            <span style={{ color: 'var(--vermelho-claro)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Sistema de Inventário
            </span>
          </div>

          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}>
            Gerencie seu estoque<br />
            <span style={{ color: 'var(--vermelho-claro)' }}>com precisão</span>
          </h1>

          <p className="animate-fade-up delay-200" style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.1rem',
            lineHeight: 1.7,
            maxWidth: '560px',
            marginBottom: '40px',
          }}>
            Cadastre produtos, controle o inventário e acompanhe seu negócio em tempo real.
            Sistema construído com Next.js SSR para máxima performance.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/products" style={{
              background: 'var(--vermelho)',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}>
              ▶ Acessar Produtos
            </Link>
            <a href="#features" style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              Saiba mais
            </a>
          </div>
        </div>
      </section>

      {/* Barra de stats */}
      <div style={{
        background: 'var(--preto-medio)',
        padding: '18px 40px',
        display: 'flex',
        justifyContent: 'center',
        gap: '48px',
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Categorias', val: '5' },
          { label: 'Renderização', val: 'SSR' },
          { label: 'Banco de dados', val: 'JSON' },
          { label: 'Framework', val: 'Next.js 16' },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.1rem', fontWeight: 500, color: 'var(--vermelho-claro)' }}>
              {item.val}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vermelho)', marginBottom: '12px' }}>
            Funcionalidades
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: 'var(--preto-profundo)',
            letterSpacing: '-0.02em',
          }}>
            Tudo que você precisa
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
          {[
            {
              icon: '📦',
              title: 'Cadastro de Produtos',
              desc: 'Registre produtos com nome, descrição, preço, estoque e categoria. Validação completa no servidor.',
              accent: 'var(--vermelho)',
            },
            {
              icon: '✏️',
              title: 'Edição Inline',
              desc: 'Edite qualquer produto diretamente pela tabela com modal elegante. Alterações salvas instantaneamente.',
              accent: 'var(--vermelho-claro)',
            },
            {
              icon: '🔍',
              title: 'Busca e Filtros',
              desc: 'Encontre qualquer produto rapidamente com busca em tempo real e filtros por categoria.',
              accent: '#3b82f6',
            },
            {
              icon: '📊',
              title: 'Dashboard de Stats',
              desc: 'Visualize total de produtos, valor do estoque, itens sem estoque e categorias de um olhar só.',
              accent: '#8b5cf6',
            },
            {
              icon: '⚡',
              title: 'SSR com Next.js',
              desc: 'Renderização no servidor garante dados sempre atualizados, SEO otimizado e primeiro carregamento rápido.',
              accent: 'var(--preto-profundo)',
            },
            {
              icon: '💾',
              title: 'Persistência em JSON',
              desc: 'Dados salvos em arquivo JSON no servidor. Simples, sem dependências externas ou configuração de banco.',
              accent: '#059669',
            },
          ].map((f, i) => (
            <div key={f.title} className="card animate-fade-up" style={{ padding: '32px', animationDelay: `${i * 0.08}s`, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '3px',
                background: f.accent,
              }} />
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '16px' }}>{f.icon}</span>
              <h3 style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--preto-profundo)',
                marginBottom: '10px',
              }}>{f.title}</h3>
              <p style={{ color: 'var(--texto-secundario)', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'var(--preto-profundo)',
        padding: '72px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'rgba(192, 57, 43, 0.06)', filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1,
        }}>
          Pronto para organizar seu estoque?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '1rem', position: 'relative', zIndex: 1 }}>
          Acesse o gerenciador e comece agora mesmo.
        </p>
        <Link href="/products" style={{
          background: 'var(--vermelho)',
          color: '#ffffff',
          padding: '15px 40px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          display: 'inline-block',
          position: 'relative',
          zIndex: 1,
        }}>
          Ir para Produtos →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#050505',
        padding: '28px 40px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.8rem',
        letterSpacing: '0.03em',
        borderTop: '1px solid rgba(192, 57, 43, 0.3)',
      }}>
        ControleMax · Construído com Next.js 16 SSR + Tailwind CSS · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

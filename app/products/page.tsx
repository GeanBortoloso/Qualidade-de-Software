import { serverGetProducts } from '@/backend/products';
import ProductForm from '@/frontend/components/ProductForm';
import ProductList from '@/frontend/components/ProductList';
import Link from 'next/link';

export const metadata = {
  title: 'Produtos · ControleMax',
  description: 'Gerencie seu inventário de produtos',
};

export default async function ProductsPage() {
  const products = await serverGetProducts();

  const totalProdutos = products.length;
  const totalEstoque = products.reduce((s, p) => s + p.stock, 0);
  const valorTotal = products.reduce((s, p) => s + p.price * p.stock, 0);
  const semEstoque = products.filter(p => p.stock === 0).length;

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
          <Link href="/products" className="navbar-link active">Produtos</Link>
          <Link href="/backlog" className="navbar-link">Backlog</Link>
        </div>
      </nav>

      {/* Header da página */}
      <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1015 100%)', padding: '40px 40px 56px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="animate-fade-up" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vermelho-claro)' }}>
              Gerenciamento de Inventário
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
            Seus Produtos
          </h1>

          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total de Produtos', val: totalProdutos, cls: '', prefix: '' },
              { label: 'Unidades em Estoque', val: totalEstoque, cls: 'azul', prefix: '' },
              { label: 'Valor do Inventário', val: `R$\u00A0${valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, cls: 'ouro', prefix: '' },
              { label: 'Sem Estoque', val: semEstoque, cls: 'erro', prefix: '' },
            ].map((s, i) => (
              <div key={s.label} className={`stat-card ${s.cls} animate-fade-up`} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                <div className="stat-number">{s.prefix}{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px', transform: 'translateY(-20px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '28px', alignItems: 'start' }}>
          <div className="animate-fade-up delay-200">
            <ProductForm />
          </div>
          <div className="animate-fade-up delay-300">
            <ProductList initialProducts={products} />
          </div>
        </div>
      </main>
    </div>
  );
}

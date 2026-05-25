'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

type Filter = 'all' | 'critical' | 'urgent' | 'warning';

const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Eletrônicos',
  clothing: 'Roupas',
  food: 'Alimentos',
  books: 'Livros',
  other: 'Outro',
};

function getPriority(stock: number): { label: string; color: string; bg: string; level: Filter } {
  if (stock === 0) return { label: 'Crítico', color: '#c0392b', bg: '#fef2f2', level: 'critical' };
  if (stock <= 5) return { label: 'Urgente', color: '#d97706', bg: '#fffbeb', level: 'urgent' };
  return { label: 'Atenção', color: '#2563eb', bg: '#eff6ff', level: 'warning' };
}

export default function BacklogList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => ({
    critical: products.filter(p => p.stock === 0).length,
    urgent: products.filter(p => p.stock >= 1 && p.stock <= 5).length,
    warning: products.filter(p => p.stock >= 6 && p.stock <= 15).length,
  }), [products]);

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        if (filter === 'critical') return p.stock === 0;
        if (filter === 'urgent') return p.stock >= 1 && p.stock <= 5;
        if (filter === 'warning') return p.stock >= 6 && p.stock <= 15;
        return true;
      })
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.stock - b.stock);
  }, [products, filter, search]);

  const tabs: { key: Filter | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: products.length },
    { key: 'critical', label: '🔴 Crítico', count: counts.critical },
    { key: 'urgent', label: '🟡 Urgente', count: counts.urgent },
    { key: 'warning', label: '🔵 Atenção', count: counts.warning },
  ];

  return (
    <div>
      {/* Filtros e busca */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as Filter)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: filter === tab.key ? 'none' : '1.5px solid var(--cinza-escuro)',
                background: filter === tab.key ? 'var(--preto-profundo)' : 'var(--branco)',
                color: filter === tab.key ? '#ffffff' : 'var(--texto-secundario)',
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
              <span style={{
                background: filter === tab.key ? 'rgba(255,255,255,0.18)' : 'var(--cinza-escuro)',
                color: filter === tab.key ? '#ffffff' : 'var(--texto-secundario)',
                borderRadius: '10px',
                padding: '1px 7px',
                fontSize: '0.75rem',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="busca-wrapper" style={{ minWidth: '220px', maxWidth: '280px' }}>
          <span className="busca-icon">🔍</span>
          <input
            type="text"
            className="busca-input"
            placeholder="Buscar produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Conteúdo */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.3rem',
            color: 'var(--preto-profundo)',
            marginBottom: '8px',
          }}>
            {filter === 'all' && !search ? 'Nenhum backlog!' : 'Nenhum resultado'}
          </h3>
          <p style={{ color: 'var(--texto-secundario)', fontSize: '0.875rem' }}>
            {filter === 'all' && !search
              ? 'Todos os produtos estão com estoque adequado.'
              : 'Tente ajustar os filtros ou a busca.'}
          </p>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Prioridade</th>
                <th>Reposição Sugerida</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const priority = getPriority(p.stock);
                const suggested = Math.max(20 - p.stock, 5);
                return (
                  <tr key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--texto-principal)', fontSize: '0.9rem' }}>
                        {p.name}
                      </div>
                      {p.description && (
                        <div style={{
                          fontSize: '0.78rem',
                          color: 'var(--texto-secundario)',
                          marginTop: '2px',
                          maxWidth: '220px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${p.category}`}>
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: priority.color,
                      }}>
                        {p.stock}
                        <span style={{ fontSize: '0.75rem', fontWeight: 400, marginLeft: '4px' }}>un.</span>
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: priority.bg,
                        color: priority.color,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: `1.5px solid ${priority.color}33`,
                      }}>
                        {priority.label}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: 'var(--vermelho)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}>
                        +{suggested} un.
                      </span>
                    </td>
                    <td>
                      <Link href="/products" style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: 'var(--vermelho-claro)',
                        border: '1.5px solid var(--vermelho-claro)',
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}>
                        Repor Estoque
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

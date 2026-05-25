'use client';

import { useState, ChangeEvent } from 'react';
import { CreateProductInput } from '@/types/product';

const CATEGORIAS = [
  { value: 'electronics', label: 'Eletrônicos', emoji: '💻' },
  { value: 'clothing', label: 'Roupas', emoji: '👕' },
  { value: 'food', label: 'Alimentos', emoji: '🌿' },
  { value: 'books', label: 'Livros', emoji: '📚' },
  { value: 'other', label: 'Outro', emoji: '📦' },
];

const EMPTY: CreateProductInput = { name: '', description: '', price: 0, stock: 0, category: '' };

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: CreateProductInput & { id?: string };
  modo?: 'criar' | 'editar';
  onCancel?: () => void;
}

export default function ProductForm({ onSuccess, initialData, modo = 'criar', onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [form, setForm] = useState<CreateProductInput>(initialData || EMPTY);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      const isEdit = modo === 'editar' && initialData?.id;
      const response = await fetch('/api/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: initialData!.id, ...form } : form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha na operação');
      }

      if (!isEdit) {
        setSucesso(true);
        setForm(EMPTY);
        setTimeout(() => setSucesso(false), 3500);
      }
      onSuccess?.();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '32px', position: 'sticky', top: '88px' }}>
      {/* Header do formulário */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--preto-profundo)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
          }}>
            {modo === 'editar' ? '✏️' : '＋'}
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--preto-profundo)',
          }}>
            {modo === 'editar' ? 'Editar Produto' : 'Novo Produto'}
          </h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--texto-secundario)', paddingLeft: '46px' }}>
          {modo === 'editar' ? 'Atualize os campos desejados' : 'Preencha os dados do produto'}
        </p>
      </div>

      {/* Alertas */}
      {erro && (
        <div className="alerta alerta-erro animate-fade-up">
          <span>⚠</span> {erro}
        </div>
      )}
      {sucesso && (
        <div className="alerta alerta-sucesso animate-fade-up">
          <span>✓</span> Produto registrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label className="label" htmlFor="name">Nome do Produto *</label>
          <input
            id="name" name="name" type="text" required
            className="input-field"
            value={form.name} onChange={handleChange}
            placeholder="Ex: Notebook Dell XPS 15"
          />
        </div>

        <div>
          <label className="label" htmlFor="description">Descrição</label>
          <textarea
            id="description" name="description"
            className="input-field"
            style={{ resize: 'vertical', minHeight: '80px' }}
            value={form.description} onChange={handleChange}
            placeholder="Descrição opcional do produto..."
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label className="label" htmlFor="price">Preço (R$) *</label>
            <input
              id="price" name="price" type="number" required
              min="0" step="0.01"
              className="input-field"
              value={form.price || ''} onChange={handleChange}
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="label" htmlFor="stock">Estoque *</label>
            <input
              id="stock" name="stock" type="number" required
              min="0"
              className="input-field"
              value={form.stock || ''} onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="category">Categoria *</label>
          <select id="category" name="category" required className="input-field" value={form.category} onChange={handleChange}>
            <option value="">Selecione uma categoria</option>
            {CATEGORIAS.map(c => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          {modo === 'editar' && onCancel && (
            <button type="button" onClick={onCancel} style={{
              flex: 1,
              background: 'transparent',
              color: 'var(--texto-secundario)',
              border: '1.5px solid var(--cinza-escuro)',
              padding: '12px',
              borderRadius: '12px',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: '0.88rem',
            }}>
              Cancelar
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primario" style={{ flex: 1 }}>
            {loading ? (
              <span className="animate-pulse-soft">
                {modo === 'editar' ? 'Salvando...' : 'Registrando...'}
              </span>
            ) : (
              <>{modo === 'editar' ? '✓ Salvar alterações' : '+ Registrar produto'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

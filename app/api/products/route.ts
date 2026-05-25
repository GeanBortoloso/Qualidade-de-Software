import { NextResponse } from 'next/server';
import {
  serverGetProducts,
  serverCreateProduct,
  serverUpdateProduct,
  serverDeleteProduct,
} from '@/backend/products';

export async function GET() {
  const products = await serverGetProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const product = await serverCreateProduct(data);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar produto';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
    const updated = await serverUpdateProduct(id, fields);
    if (!updated) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar produto';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
    const success = await serverDeleteProduct(id);
    if (!success) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir produto';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

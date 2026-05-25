# ControleMax — Gestão de Estoque & Perfis

Sistema de gerenciamento de estoque com autenticação por perfis, construído com **Next.js 16**, **SSR (Server-Side Rendering)** e **TypeScript**.

O projeto é composto por dois módulos:

- **ControleMax** — Cadastro, edição, exclusão e monitoramento de produtos com tela de backlog para controle de reposição de estoque. Dados persistidos em arquivo JSON local.
- **Usuários & Perfis** — Autenticação com JWT, painéis exclusivos por perfil (Administrador, Professor, Aluno) e APIs REST para gerenciamento de acessos. Dados persistidos em SQLite.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Contas de Teste](#contas-de-teste)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [API REST](#api-rest)
- [Modelo de Dados](#modelo-de-dados)
- [Banco de Dados](#banco-de-dados)
- [Arquitetura](#arquitetura)
- [Design System](#design-system)
- [Contribuidores](#contribuidores)

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16.1.6 | Framework principal (SSR + App Router) |
| React | 19.2.3 | Interface do usuário |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Utilitários de CSS |
| better-sqlite3 | 12.10 | Banco de dados SQLite para usuários e perfis |
| bcryptjs | 3.0.3 | Hash de senhas |
| jose | 6.2.3 | JWT para sessões de autenticação |
| Node.js | ≥ 18 | Runtime do servidor |

---

## Funcionalidades

### Produtos (`/products`)

- Cadastrar produtos com nome, descrição, preço, estoque e categoria
- Editar produtos via modal inline
- Excluir produtos com confirmação
- Busca em tempo real por nome ou descrição
- Filtro por categoria
- Indicadores visuais de estoque (esgotado / crítico / urgente / normal)
- Dashboard com 4 métricas: total de produtos, unidades em estoque, valor do inventário e itens sem estoque

### Backlog de Reposição (`/backlog`)

- Lista todos os produtos com estoque igual ou abaixo de 15 unidades
- 3 níveis de prioridade: **Crítico** (0 un.), **Urgente** (1–5 un.) e **Atenção** (6–15 un.)
- Filtro interativo por nível de prioridade
- Busca por nome ou categoria
- Sugestão automática de quantidade para reposição
- Dashboard com 5 métricas: total em backlog, crítico, urgente, atenção e percentual do inventário

### Login & Autenticação (`/login`)

- Tela de login com e-mail e senha
- Botões de preenchimento rápido com contas de teste
- Sessão segura via cookie **httpOnly** (JWT, validade de 7 dias)
- Senhas armazenadas com **bcrypt**
- Seed automático de 3 perfis + 3 usuários na primeira execução

### Painéis por Perfil (`/painel/*`)

- Rotas protegidas pelo `middleware.ts` — redireciona para login se não autenticado
- Acesso restrito ao painel do perfil do usuário logado
- **Administrador** (`/painel/administrador`): gestão de acessos (perfis e usuários), acesso ao ControleMax
- **Professor** (`/painel/professor`): área de turmas e materiais (placeholder)
- **Aluno** (`/painel/aluno`): área de atividades e materiais (placeholder)

---

## Estrutura do Projeto

```
Qualidade-de-Software/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST — autenticação (e-mail + senha → JWT)
│   │   │   ├── logout/route.ts      # POST — encerrar sessão
│   │   │   └── me/route.ts          # GET  — sessão atual do usuário
│   │   ├── perfis/route.ts          # GET / POST — gerenciar perfis
│   │   ├── products/route.ts        # GET / POST / PUT / DELETE — produtos
│   │   └── usuarios/route.ts        # GET / POST — gerenciar usuários
│   ├── backend/
│   │   ├── db.ts                    # Camada de persistência (JSON)
│   │   ├── products.ts              # Server Actions — lógica de negócio
│   │   └── types.ts                 # Interfaces TypeScript (Product)
│   ├── backlog/
│   │   └── page.tsx                 # Tela de backlog de estoque
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── BacklogList.tsx      # Componente interativo do backlog
│   │   │   ├── ProductForm.tsx      # Formulário de criação/edição
│   │   │   └── ProductList.tsx      # Tabela de produtos com busca e filtros
│   │   └── styles/
│   │       └── globals.css          # Estilos globais e design system
│   ├── login/
│   │   ├── LoginForm.tsx            # Formulário de login (Client Component)
│   │   └── page.tsx                 # Página de login
│   ├── painel/
│   │   ├── administrador/page.tsx   # Painel do Administrador
│   │   ├── aluno/page.tsx           # Painel do Aluno
│   │   ├── professor/page.tsx       # Painel do Professor
│   │   ├── PainelShell.tsx          # Shell compartilhado dos painéis
│   │   └── page.tsx                 # Redirect para o painel do perfil
│   ├── products/
│   │   └── page.tsx                 # Tela principal de produtos
│   ├── types/
│   │   └── product.ts              # Interfaces TypeScript (Product)
│   ├── favicon.ico                  # Ícone da aplicação
│   ├── layout.tsx                   # Layout raiz
│   └── page.tsx                     # Landing page
├── database/
│   └── .gitkeep                     # Placeholder para o SQLite (app.db)
├── lib/
│   ├── auth.ts                      # JWT — criação, verificação e sessões
│   ├── db.ts                        # Conexão SQLite — tabelas e seed de dados
│   └── password.ts                  # bcrypt — hash e comparação de senhas
├── .env.example                     # Variáveis de ambiente (SESSION_SECRET)
├── .gitignore
├── eslint.config.mjs
├── middleware.ts                    # Proteção de rotas autenticadas
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## Como Executar

**Pré-requisito:** Node.js 18 ou superior.

```bash
# 1. Clonar o repositório
git clone https://github.com/GeanBortoloso/Qualidade-de-Software.git
cd Qualidade-de-Software

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local e defina um SESSION_SECRET seguro (obrigatório em produção)

# 3. Instalar dependências
npm install

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em: **`http://localhost:3008`**

> Na primeira execução, o banco SQLite (`database/app.db`) e o arquivo de produtos (`.data/products.json`) são criados automaticamente com dados de seed.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 3008, Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Verifica erros de lint |

---

## Contas de Teste

Na primeira execução, 3 contas são criadas automaticamente:

| Perfil | E-mail | Senha | Painel |
|---|---|---|---|
| Administrador | ana.admin@escola.edu | admin123 | `/painel/administrador` |
| Professor | carlos.prof@escola.edu | prof123 | `/painel/professor` |
| Aluno | maria.aluna@escola.edu | aluno123 | `/painel/aluno` |

---

## Rotas da Aplicação

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Server Component | Landing page com visão geral do sistema |
| `/products` | Server Component | Gerenciamento completo de produtos |
| `/backlog` | Server Component | Produtos com estoque crítico ou baixo |
| `/login` | Server + Client | Tela de autenticação |
| `/painel/administrador` | Server + Client | Painel do Administrador |
| `/painel/professor` | Server + Client | Painel do Professor |
| `/painel/aluno` | Server + Client | Painel do Aluno |

---

## API REST

### Produtos

Base URL: `/api/products`

#### `GET /api/products`

Retorna todos os produtos.

**Resposta `200`:**
```json
[
  {
    "id": "1773102081486",
    "name": "Notebook Dell XPS",
    "description": "Notebook premium 15 polegadas",
    "price": 8999.99,
    "stock": 12,
    "category": "electronics",
    "createdAt": "2026-01-10T00:00:00.000Z",
    "updatedAt": "2026-01-10T00:00:00.000Z"
  }
]
```

#### `POST /api/products`

Cria um novo produto.

**Body:**
```json
{
  "name": "Notebook Dell XPS",
  "description": "Opcional",
  "price": 8999.99,
  "stock": 10,
  "category": "electronics"
}
```

**Resposta `201`:** objeto do produto criado.

**Validações:**
- `name` obrigatório e não vazio
- `price` ≥ 0
- `stock` ≥ 0

#### `PUT /api/products`

Atualiza um produto existente.

**Body:**
```json
{
  "id": "1773102081486",
  "name": "Novo nome",
  "price": 7500.00,
  "stock": 5
}
```

**Resposta `200`:** objeto atualizado. | **`404`:** produto não encontrado.

#### `DELETE /api/products`

Remove um produto.

**Body:**
```json
{ "id": "1773102081486" }
```

**Resposta `200`:** `{ "success": true }` | **`404`:** produto não encontrado.

---

### Autenticação

#### `POST /api/auth/login`

Autentica o usuário e cria sessão via cookie JWT.

**Body:**
```json
{
  "email": "ana.admin@escola.edu",
  "senha": "admin123"
}
```

**Resposta `200`:**
```json
{
  "ok": true,
  "redirect": "/painel/administrador",
  "user": {
    "nome": "Ana Administradora",
    "email": "ana.admin@escola.edu",
    "perfil": "Administrador"
  }
}
```

**`401`:** e-mail ou senha inválidos.

#### `POST /api/auth/logout`

Encerra a sessão (limpa o cookie).

**Resposta `200`:** `{ "ok": true }`

#### `GET /api/auth/me`

Retorna os dados do usuário autenticado.

**Resposta `200`:**
```json
{
  "authenticated": true,
  "user": {
    "userId": 1,
    "nome": "Ana Administradora",
    "email": "ana.admin@escola.edu",
    "perfil": "Administrador",
    "perfilId": 1
  }
}
```

**`401`:** não autenticado.

---

### Perfis

Base URL: `/api/perfis`

#### `GET /api/perfis`

Retorna todos os perfis.

#### `POST /api/perfis`

Cria um novo perfil.

**Body:**
```json
{ "nome": "Coordenador", "descricao": "Opcional" }
```

**Resposta `201`:** perfil criado. | **`409`:** nome já existe.

---

### Usuários

Base URL: `/api/usuarios`

#### `GET /api/usuarios`

Retorna todos os usuários (com JOIN no perfil).

#### `POST /api/usuarios`

Cria um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@escola.edu",
  "senha": "senha123",
  "perfil_id": 1,
  "telefone": "(11) 99999-0000"
}
```

**Resposta `201`:** usuário criado. | **`400`:** perfil inexistente ou campos faltando. | **`409`:** e-mail já cadastrado.

---

## Modelo de Dados

### Produto (JSON)

```typescript
interface Product {
  id: string;          // Timestamp em string (Date.now())
  name: string;        // Nome do produto (obrigatório)
  description: string; // Descrição (opcional)
  price: number;       // Preço em reais
  stock: number;       // Quantidade em estoque
  category: string;    // Categoria (ver tabela abaixo)
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}
```

**Categorias disponíveis:**

| Valor | Label |
|---|---|
| `electronics` | Eletrônicos |
| `clothing` | Roupas |
| `food` | Alimentos |
| `books` | Livros |
| `other` | Outro |

### Perfil (SQLite)

```sql
CREATE TABLE perfis (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  nome  TEXT NOT NULL UNIQUE,
  descricao TEXT
);
```

### Usuário (SQLite)

```sql
CREATE TABLE usuarios (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT NOT NULL,
  email     TEXT NOT NULL UNIQUE,
  senha     TEXT NOT NULL,          -- bcrypt hash
  telefone  TEXT,                   -- campo opcional (desafio extra)
  ativo     INTEGER DEFAULT 1,
  perfil_id INTEGER NOT NULL REFERENCES perfis(id)
);
```

---

## Banco de Dados

O projeto utiliza **dois mecanismos de persistência**:

### Produtos — JSON

Arquivo `.data/products.json` na raiz do projeto. Diretório e arquivo criados automaticamente na primeira escrita.

Camada de acesso em `app/backend/db.ts`:

```typescript
readFromDatabase<T>(file: string): Promise<T[]>
writeToDatabase<T>(file: string, data: T[]): Promise<void>
```

### Usuários & Perfis — SQLite

Banco `database/app.db` criado automaticamente na primeira execução via `lib/db.ts`.

Inclui seed automático com:
- 3 perfis (Administrador, Professor, Aluno)
- 3 usuários de teste (1 por perfil)
- Auto-migração de senhas em texto puro para bcrypt

---

## Arquitetura

O projeto segue uma separação clara entre frontend e backend dentro do App Router do Next.js:

```
Requisição do usuário
        │
        ▼
  Server Component (page.tsx)
        │  chama Server Actions
        ▼
  app/backend/products.ts   ←── lógica de negócio, validação
        │
        ▼
  app/backend/db.ts         ←── leitura/escrita no JSON
        │
        ▼
   .data/products.json
```

Para autenticação:

```
Requisição do usuário → /login
        │
        ▼
  LoginForm.tsx (Client Component)
        │  POST /api/auth/login
        ▼
  lib/db.ts (SQLite)  ←── consulta usuário + perfil
  lib/auth.ts         ←── cria token JWT
  lib/password.ts     ←── verifica bcrypt hash
        │
        ▼
  Cookie httpOnly com JWT (7 dias)
        │
        ▼
  middleware.ts  ←── protege rotas /painel/*
```

### Fluxo de renderização

- As páginas (`/products`, `/backlog`) são **Server Components**: buscam os dados no servidor antes de enviar o HTML ao navegador.
- Os componentes interativos (`ProductList`, `ProductForm`, `BacklogList`, `LoginForm`, `PainelShell`) são **Client Components**: recebem os dados via props e gerenciam estado local.

---

## Design System

### Paleta de cores

| Variável CSS | Valor | Uso |
|---|---|---|
| `--preto-profundo` | `#0a0a0a` | Navbar, headers, fundos muito escuros |
| `--preto-medio` | `#141414` | Fundos secundários escuros |
| `--preto-claro` | `#1e1e1e` | Cartões e modais em seções escuras |
| `--vermelho` | `#c0392b` | Botão primário, acentos principais |
| `--vermelho-claro` | `#e74c3c` | Marca ControleMax, destaques visuais |
| `--vermelho-brilho` | `#ff4444` | Detalhes de interação |
| `--cinza-fundo` | `#f5f5f5` | Background central da aplicação |
| `--cinza-escuro` | `#e0e0e0` | Bordas e delimitadores sutis |
| `--erro` | `#c0392b` | Alertas, botão de exclusão |
| `--sucesso` | `#27ae60` | Mensagens de sucesso |

### Tipografia

| Fonte | Uso |
|---|---|
| Playfair Display | Títulos e headings premium |
| IBM Plex Sans | Corpo de texto, labels e tabelas |
| IBM Plex Mono | Valores estatísticos e preços numéricos |

### Indicadores de estoque

| Estoque | Cor | Status |
|---|---|---|
| 0 | Vermelho Escuro | Esgotado |
| 1–5 | Vermelho | Crítico |
| 6–15 | Laranja Escuro | Urgente / Atenção |
| 16+ | Verde Bandeira | Normal |

---

## Contribuidores

- **Gean Bortoloso** — Desenvolvimento e arquitetura

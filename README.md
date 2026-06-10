# 🏠 Imobiliária CRUD

> **BootCamp — Entrega Final Etapa 3:** Trabalho em Equipe, Banco de Dados e Code Review


---

## 🔗 Deploy

**Acesse a aplicação:** [https://imobiliaria-crude.vercel.app/](https://imobiliaria-crude.vercel.app/)

---

## 📋 Sobre o Projeto

Aplicação web de gerenciamento de imóveis desenvolvida como entrega final da **Etapa 3** do BootCamp de Engenharia de Software do **CEUB (Centro Universitário de Brasília)**. O projeto foi desenvolvido em equipe com foco em trabalho colaborativo, integração com banco de dados e práticas de code review.

A aplicação implementa as quatro operações fundamentais de persistência de dados (CRUD), permitindo o cadastro, consulta, edição e remoção de imóveis através de uma interface web moderna.

---

## 🚀 Tecnologias

| Tecnologia | Função |
|---|---|
| **React** | Biblioteca de interface (componentes e estado) |
| **Vite** | Build tool e servidor de desenvolvimento |
| **Supabase** | Backend as a Service (banco de dados PostgreSQL + API REST) |
| **JavaScript** | Linguagem principal |
| **CSS** | Estilização da interface |
| **ESLint** | Linting e padronização de código |

---

## ⚙️ Funcionalidades

- ✅ **Cadastrar** imóveis com informações detalhadas
- ✅ **Listar** todos os imóveis cadastrados
- ✅ **Editar** dados de um imóvel existente
- ✅ **Excluir** imóveis do sistema
- ✅ **Integração em tempo real** com banco de dados via Supabase

---

## 🗂️ Estrutura do Projeto

```
imobiliaria-crud/
├── public/               # Arquivos estáticos
├── src/                  # Código-fonte da aplicação
│   ├── components/       # Componentes React reutilizáveis
│   ├── services/         # Integração com Supabase
│   └── main.jsx          # Entry point da aplicação
├── index.html            # HTML raiz
├── vite.config.js        # Configuração do Vite
├── eslint.config.js      # Configuração do ESLint
└── package.json          # Dependências e scripts
```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Conta no [Supabase](https://supabase.com/) com projeto configurado

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/DeyversonLima/imobiliaria-crud.git
   cd imobiliaria-crud
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_SUPABASE_URL=sua_url_do_projeto_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. Acesse em `http://localhost:5173`

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint |

---

## 🌐 Deploy (Vercel)

O projeto está configurado para deploy automático na **Vercel**. Ao fazer push na branch `main`, o deploy é acionado automaticamente.

Para fazer seu próprio deploy:

1. Importe o repositório na [Vercel](https://vercel.com/)
2. Configure as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
3. Clique em **Deploy**

---

## 👥 Equipe

Projeto desenvolvido em equipe como parte da Etapa 3 do BootCamp — CEUB.

| Membro | Responsabilidade |
|---|---|
| **Gabriel Gomes** | Deploy na Vercel.
Atualização da documentação.
Organização da entrega final. |
| **Deyverson Lima** | Configuração inicial do projeto.
Integração com Supabase.
Implementação do CRUD.
Estrutura de serviços e comunicação com banco de dados. |
| **Leonel Martins Linhares**| Desenvolvimento do formulário de cadastro.
Validação de campos.
Integração do cadastro com o sistema. |
| **Gabriel Antônio de Oliveira** | Desenvolvimento da interface.
Criação dos cards de imóveis.
Responsividade.
Estilização da página principal. |

---

## 📚 Contexto Acadêmico

Este projeto faz parte do **BootCamp de Engenharia de Software** do Centro Universitário de Brasília (CEUB), Etapa 3 — com foco em:

- Trabalho colaborativo em equipe
- Integração com banco de dados real
- Práticas de code review via Pull Requests e Issues
- Deploy de aplicações em produção

---

## 📄 Licença

Projeto acadêmico — CEUB BootCamp 2025.

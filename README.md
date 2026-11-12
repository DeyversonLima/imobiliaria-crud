# Imobiliária Control

[![CI](https://github.com/DeyversonLima/imobiliaria-crud/actions/workflows/ci.yml/badge.svg)](https://github.com/DeyversonLima/imobiliaria-crud/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)

Aplicação web responsiva para cadastrar, consultar, editar e excluir imóveis. O projeto foi desenvolvido em equipe no Bootcamp de Engenharia de Software do CEUB e exercita integração com banco de dados, validação de formulários, testes e revisão de código.

**Aplicação:** [imobiliaria-crud.vercel.app](https://imobiliaria-crud.vercel.app/)

## Funcionalidades

- CRUD completo de imóveis;
- validação de título, preço, cidade, descrição e URL de imagem;
- formatação monetária em real brasileiro;
- confirmação antes de exclusões;
- mensagens acessíveis de sucesso e erro;
- modo Supabase para persistência remota;
- modo demonstração com `localStorage` quando não há credenciais configuradas;
- catálogo local inicial com 15 imóveis detalhados;
- identidade visual consistente na listagem, cadastro e edição.

O modo demonstração torna a interface navegável logo após o clone. Ele começa com 15 registros variados e permite executar todo o CRUD. Os dados permanecem somente no navegador e são identificados como demonstração; imóveis cadastrados pelo usuário são preservados nas atualizações da base de exemplos. Se houver credenciais, mas o projeto Supabase estiver pausado ou inacessível, o serviço adota automaticamente o modo local.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, JavaScript e CSS |
| Build | Vite 8 |
| Dados | Supabase/PostgreSQL ou `localStorage` |
| Qualidade | ESLint, Vitest e Testing Library |
| Entrega | GitHub Actions e Vercel |

## Executar localmente

Requisitos: Node.js 22 ou superior e npm.

```bash
git clone https://github.com/DeyversonLima/imobiliaria-crud.git
cd imobiliaria-crud
npm ci
npm run dev
```

Acesse o endereço exibido pelo Vite. Sem arquivo `.env`, a aplicação inicia automaticamente em modo demonstração.

### Conectar ao Supabase

Copie o arquivo de exemplo e preencha somente as chaves públicas do projeto:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publicavel
```

A tabela `imoveis` deve possuir as colunas `id`, `titulo`, `preco`, `cidade`, `descricao` e `imagem`. Políticas de Row Level Security devem ser definidas no Supabase conforme o ambiente; nunca coloque uma chave `service_role` no front-end.

### Modos de dados

O serviço escolhe a fonte de dados sem alterar a API usada pelos componentes:

1. com credenciais e Supabase acessível, as operações usam a tabela `imoveis`;
2. sem credenciais, a aplicação usa imediatamente o `localStorage`;
3. com credenciais, mas Supabase pausado ou indisponível, a operação adota o modo local automaticamente.

A interface mostra a fonte ativa. Na primeira execução local são criados 15 imóveis demonstrativos detalhados. A versão da base de exemplos é controlada separadamente, permitindo incluir novos exemplos sem apagar registros cadastrados pelo usuário.

## Scripts

| Comando | Ação |
| --- | --- |
| `npm run dev` | inicia o servidor de desenvolvimento |
| `npm test` | executa os testes uma vez |
| `npm run lint` | analisa o código com ESLint |
| `npm run build` | gera o pacote de produção |
| `npm run preview` | serve o build localmente |

## Arquitetura

```text
src/
├── hooks/       # validação e comportamento dos formulários
├── pages/       # cadastro, edição e interface auxiliar
├── services/    # Supabase e fallback local
├── App.jsx      # listagem e coordenação das telas
└── main.jsx     # ponto de entrada
```

As operações de dados ficam concentradas em `services/imoveisService.js`. Assim, a interface usa a mesma API interna tanto no modo Supabase quanto no modo demonstração.

Listagem, cadastro e edição usam os mesmos tokens e componentes visuais definidos em `src/index.css`. O projeto evita bibliotecas de componentes para preservar o escopo acadêmico e deixar evidente o trabalho da equipe com React, CSS e integração de dados.

## Testes e CI

```bash
npm test
npm run lint
npm run build
```

O GitHub Actions executa instalação reproduzível com `npm ci`, testes, lint e build em cada push ou pull request para `main`. A suíte também confirma que o modo demonstração inicia com 15 imóveis e migra dados antigos sem remover registros do usuário.

## Participação

Projeto acadêmico colaborativo do CEUB. Deyverson Lima atuou na configuração inicial, integração com Supabase, implementação das operações CRUD e organização da camada de serviços. A equipe também trabalhou em interface, validação, testes, documentação, code review e deploy.

## Escopo

Este é um projeto educacional. Antes de uso comercial seriam necessários autenticação, perfis de acesso, políticas RLS revisadas, observabilidade e testes end-to-end.

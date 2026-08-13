# Spec — Arquitetura e Contratos

**Modelo:** Terra Médio

## Objetivo

Definir a arquitetura técnica base para que os módulos sejam implementados de forma compatível.

## Arquitetura

- Frontend e camada de aplicação: Next.js, React e TypeScript.
- Renderização: App Router, Server Components por padrão.
- Mutações: Server Actions quando apropriado.
- Endpoints externos ou integrações: Route Handlers.
- Backend gerenciado: Supabase Auth, PostgreSQL, Storage e Realtime quando necessário.
- Deploy: Vercel.
- Organização: monólito modular por domínio.

## Domínios

- `auth`
- `catalog`
- `collection`
- `binders`
- `pulls`
- `friends`
- `notifications`

## Decisões

- O frontend não acessa tabelas de terceiros sem políticas RLS.
- Regras de negócio ficam em serviços/actions do domínio, não apenas em componentes.
- Componentes visuais reutilizáveis ficam em `components/ui`; componentes específicos ficam no domínio correspondente.
- Não criar um backend Express/Nest separado no MVP.

## Contratos de dados

### Carta do catálogo

Identifica uma versão específica de uma carta, incluindo coleção, número, idioma e variante.

### Entrada da coleção

Representa cartas pertencentes a um usuário. Pode ter origem manual ou Pull. Cartas com características diferentes podem ser registros distintos.

### Alocação em fichário

Relaciona uma entrada da coleção a um espaço do fichário e informa a quantidade alocada.

### Pull

Representa uma compra com vários itens. A entrada na coleção só ocorre após confirmação do usuário quando o Pull está entregue.

## Critérios de aceite

- Estrutura de pastas documentada.
- Tipos compartilhados definidos.
- Convenções de erro, datas, IDs e valores registradas.
- Nenhum módulo depende de detalhes internos de outro sem contrato explícito.

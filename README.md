# PokeBinder

Aplicação mobile-first para organizar coleções e fichários digitais de cartas Pokémon.

## Desenvolvimento

1. Instale Node.js 20+.
2. Copie `.env.example` para `.env.local` quando for configurar o Supabase.
3. Execute `npm install` e depois `npm run dev`.

Validações disponíveis: `npm run typecheck`, `npm run lint` e `npm run build`.

## Estrutura

- `src/app`: rotas e layouts do App Router.
- `src/components`: componentes compartilhados de interface.
- `src/features`: módulos organizados por domínio.
- `src/lib`: infraestrutura e utilitários.
- `src/types`: contratos compartilhados.
- `supabase/migrations`: migrações do banco.

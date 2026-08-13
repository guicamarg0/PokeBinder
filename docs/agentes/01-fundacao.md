# Spec — Fundação do Projeto

**Modelo:** Terra Médio

## Objetivo

Criar a base executável do PokeBinder.

## Escopo

- Inicializar Next.js com TypeScript e App Router.
- Configurar Tailwind, lint e formatação.
- Criar estrutura por domínio.
- Criar layouts público, autenticado e compartilhado.
- Criar navegação mobile-first.
- Criar `.env.example` sem segredos.
- Criar README de desenvolvimento.

## Estrutura esperada

```text
src/app
src/components/ui
src/features
src/lib
src/types
supabase/migrations
public
docs
```

## Fora do escopo

- Implementar regras de coleção, fichários ou Pulls.
- Configurar produção com segredos reais.

## Critérios de aceite

- Projeto instala e inicia localmente.
- `typecheck`, lint e build passam.
- Rotas-base possuem estados vazios ou páginas provisórias.
- Layout funciona em viewport mobile.

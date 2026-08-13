# Spec — Banco de Dados e Segurança

**Modelo:** Terra Médio

## Objetivo

Criar o modelo PostgreSQL e as políticas de acesso do MVP.

## Tabelas principais

- `profiles`
- `card_catalog`
- `collection_entries`
- `binders`
- `binder_members`
- `binder_pages`
- `binder_slots`
- `binder_placements`
- `pulls`
- `pull_items`
- `sellers`
- `friendships`
- `notifications`

## Regras essenciais

- Usuários só leem e alteram seus dados privados.
- Pulls e vendedores são privados.
- Fichários públicos podem ser visualizados anonimamente.
- Membros podem visualizar fichários compartilhados.
- Cada membro só altera suas próprias cartas alocadas.
- O proprietário gerencia membros.
- Quantidades são inteiros positivos.
- Valores monetários são centavos inteiros.

## Integridade

- Chaves estrangeiras e índices para relações frequentes.
- Unicidade adequada para usuário, coleção e carta/variante.
- Constraint para impedir quantidade alocada negativa.
- Transações para adicionar, mover e remover alocações.
- Timestamps `created_at` e `updated_at`.

## Critérios de aceite

- Migrations reproduzíveis.
- RLS habilitado nas tabelas expostas.
- Testes ou queries de validação para isolamento entre usuários.
- Seed somente com dados fictícios.

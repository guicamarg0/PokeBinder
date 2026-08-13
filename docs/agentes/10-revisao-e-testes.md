# Spec — Revisão e Testes

**Modelo:** Luna Leve

## Objetivo

Verificar se a implementação atende aos requisitos sem introduzir regressões.

## Checklist técnico

- TypeScript sem erros.
- Lint sem erros novos.
- Build de produção passa.
- Migrations executam de forma limpa.
- RLS impede acesso cruzado entre usuários.
- Pulls permanecem privados.
- Fichários públicos expõem somente o conteúdo previsto.
- Quantidade alocada nunca supera a coleção.
- Usuário não edita cartas de outro membro.

## Testes funcionais

- Cadastro e login.
- Adição manual de carta.
- Edição e remoção.
- Alocação, movimentação e desalocação.
- Cópias empilhadas.
- Criação de Pull e rateio de frete.
- Confirmação de entrega.
- Compartilhamento por link.
- Entrada e saída de membro.
- Solicitação de amizade.

## Resultado esperado

O agente não deve corrigir grandes problemas sem autorização. Deve registrar evidências, classificar problemas por severidade e, quando possível, corrigir pequenos problemas de teste ou documentação dentro do escopo.

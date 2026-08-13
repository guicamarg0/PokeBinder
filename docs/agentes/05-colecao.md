# Spec — Coleção do Usuário

**Modelo:** Terra Médio

## Objetivo

Representar todas as cartas que pertencem ao usuário, independentemente de fichários.

## Escopo

- Listar, pesquisar e filtrar cartas.
- Adicionar manualmente.
- Adicionar após confirmação de Pull entregue.
- Editar quantidade e características.
- Remover cartas.
- Mostrar total, alocado e disponível.
- Marcar desejo, troca e venda.
- Registrar origem manual ou Pull.

## Regras

- Carta pode existir sem fichário.
- Características diferentes podem gerar entradas distintas.
- Quantidade deve ser positiva.
- Não remover uma quantidade já alocada sem primeiro desalocar.
- Usuário só acessa sua própria coleção.

## Critérios de aceite

- CRUD completo da coleção.
- Quantidade disponível é calculada corretamente.
- Usuário não consegue alocar mais cartas que possui.
- Estados vazio, carregando e erro existem.

# Spec — Fichários

**Modelo:** Terra Médio

## Objetivo

Organizar cartas da coleção em fichários digitais com páginas 3x3.

## Escopo

- Criar, editar e excluir fichário.
- Nome, descrição, capa e visibilidade.
- Páginas configuráveis.
- Grade padrão 3x3.
- Espaços vazios.
- Inserir quantidade de cópias iguais em um espaço.
- Mover entre espaços, páginas e fichários próprios.
- Visualização em grade e lista.

## Regras

- Um espaço contém apenas uma variante de carta.
- A mesma carta pode estar em vários fichários.
- A soma das alocações não pode superar a coleção.
- Movimentação deve ser atômica.
- Excluir uma alocação devolve a quantidade à disponibilidade.

## Critérios de aceite

- Fichário novo abre com páginas 3x3.
- Carta pode ser adicionada, movida e removida.
- Quantidade `xN` aparece visualmente.
- Conflitos e quantidade insuficiente são tratados sem perda de dados.

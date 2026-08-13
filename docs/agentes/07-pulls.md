# Spec — Pulls e Compras

**Modelo:** Terra Médio

## Objetivo

Registrar compras de cartas e acompanhar sua entrega.

## Escopo

- Criar Pull com vários itens.
- Cadastro rápido de vendedor.
- Valor individual dos itens.
- Frete total com rateio igual no MVP.
- Código de rastreamento.
- Observações.
- Status: comprado, aguardando envio, enviado, entregue e cancelado.
- Editar compra após entrega.
- Confirmar entrada dos itens na coleção.

## Regras

- Pull é privado.
- Um Pull pode possuir vários itens.
- Valor final do item deve considerar o frete rateado.
- Entrega não adiciona cartas automaticamente: exige confirmação.
- Histórico de origem deve permanecer quando uma carta for posteriormente trocada ou vendida.

## Critérios de aceite

- Compra pode ser criada e editada.
- Status pode ser alterado.
- Frete é distribuído corretamente.
- Confirmação cria ou atualiza entradas da coleção.
- Vendedores podem ser reutilizados pelo usuário.

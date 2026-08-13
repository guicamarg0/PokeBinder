# Specs de Agentes — PokeBinder

Este diretório contém as especificações para implementação, revisão e testes do PokeBinder.

## Convenção de modelos

- **Terra Médio:** implementação de funcionalidades, decisões técnicas e alterações estruturais.
- **Luna Leve:** revisão, testes, validações, documentação e inspeções sem mudanças amplas.

## Ordem recomendada

1. `01-fundacao.md`
2. `02-banco-e-seguranca.md`
3. `03-autenticacao.md`
4. `04-catalogo.md`
5. `05-colecao.md`
6. `06-ficharios.md`
7. `07-pulls.md`
8. `08-compartilhamento.md`
9. `09-interface-mobile.md`
10. `10-revisao-e-testes.md`
11. `11-documentacao.md`

Banco e autenticação devem estar disponíveis antes dos módulos que acessam dados do usuário. Catálogo, coleção e Pulls podem evoluir parcialmente em paralelo. Compartilhamento depende de coleção e fichários.

## Regras para todos os agentes

- Ler `REQUISITOS.md` antes de trabalhar.
- Preservar alterações existentes e não executar comandos destrutivos.
- Trabalhar somente dentro do escopo da spec recebida.
- Não alterar contratos ou nomes de entidades sem registrar a decisão.
- Validar tipos, lint e testes relacionados antes de concluir.
- Não expor segredos, chaves privadas ou valores reais de ambiente.
- Atualizar documentação quando uma decisão afetar outros módulos.
- Entregar resumo, arquivos alterados, validações executadas e pendências.

## Contrato entre módulos

- IDs devem ser UUIDs.
- Todas as entidades pertencentes a usuário devem ter `owner_id` ou relação equivalente.
- Datas devem ser armazenadas em UTC.
- Valores monetários devem usar inteiro em centavos, nunca `float`.
- Quantidades devem ser inteiros positivos.
- Permissões devem ser aplicadas no banco com RLS, além da validação na aplicação.
- Operações de movimentação e alocação devem ser atômicas.
- Erros de validação devem ser apresentados sem expor detalhes internos.

## Formato de entrega do agente

```md
## Resultado

## Arquivos alterados

## Validações executadas

## Decisões tomadas

## Pendências ou riscos
```

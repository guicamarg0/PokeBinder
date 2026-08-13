# Spec — Catálogo de Cartas

**Modelo:** Terra Médio

## Objetivo

Permitir pesquisa e identificação de cartas, com cadastro manual como fallback.

## Escopo MVP

- Modelo de carta e variante.
- Busca por nome, número, coleção e idioma.
- Cadastro manual.
- Imagem de catálogo opcional.
- Suporte a cartas brasileiras e internacionais.
- Diferenciação de edição, idioma, holográfica e promocional.

## Integrações

Preparar uma interface de provider para APIs externas. Não acoplar telas diretamente a uma API específica. A fonte e seus termos de uso ainda precisam ser validados.

## Critérios de aceite

- Usuário consegue encontrar uma carta ou cadastrá-la manualmente.
- Versões distintas não são misturadas.
- Falha da API externa não impede cadastro manual.
- Imagens são tratadas com fallback e otimização.

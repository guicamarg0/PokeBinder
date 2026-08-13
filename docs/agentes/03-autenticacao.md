# Spec — Autenticação e Perfil

**Modelo:** Terra Médio

## Escopo

- Cadastro com nome, nome de usuário, e-mail e senha.
- Login, logout e recuperação de senha.
- Proteção de rotas autenticadas.
- Perfil com nome de usuário, nome e foto.
- Exclusão de conta com confirmação.

## Regras

- Nome de usuário deve ser único.
- Dados de autenticação não devem ser armazenados manualmente na aplicação.
- Perfil é criado após cadastro autenticado.
- Rotas privadas redirecionam usuários não autenticados.

## Critérios de aceite

- Usuário consegue completar o fluxo de cadastro e login.
- Sessão permanece válida conforme configuração do Supabase.
- Usuário não acessa dados de outro usuário.
- Erros de credencial são tratados de forma segura.

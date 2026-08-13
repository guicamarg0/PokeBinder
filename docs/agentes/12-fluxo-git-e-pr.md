# Spec — Fluxo Git, Commits e Pull Requests

## Objetivo

Garantir que subagentes trabalhem de forma isolada, rastreável e revisável, evitando alterações diretas na branch principal.

## Branch principal

- A branch `main` representa o estado integrado e validado.
- Nenhum subagente deve fazer commit diretamente em `main`.
- A `main` deve permanecer funcional após cada integração.
- A branch `main` deve ser protegida no GitHub quando possível.

## Branches de trabalho

Cada tarefa deve começar em uma branch própria criada a partir da `main` atualizada.

Padrões:

```text
feat/nome-da-funcionalidade
fix/nome-do-problema
refactor/nome-da-mudanca
test/nome-da-validacao
docs/nome-da-documentacao
chore/nome-da-tarefa
```

Exemplos:

```text
feat/autenticacao
feat/colecao-cartas
fix/quantidade-alocada
test/regras-fichario
```

## Responsabilidade do agente implementador

O agente Terra Médio deve:

1. Atualizar a branch antes de começar.
2. Ler as specs aplicáveis.
3. Implementar apenas o escopo definido.
4. Criar commits pequenos e coerentes.
5. Executar testes, lint, typecheck e build aplicáveis.
6. Fazer push da branch.
7. Abrir um Pull Request quando tiver integração GitHub disponível.
8. Entregar a descrição do PR e os resultados das validações.

O implementador não deve aprovar o próprio PR.

## Padrão de commits

Usar Conventional Commits:

```text
feat: adiciona cadastro de cartas
fix: impede alocação acima da quantidade disponível
test: cobre permissões de fichário
docs: documenta fluxo de Pull Requests
refactor: separa serviço de coleção
chore: configura validação do projeto
```

Regras:

- Um commit deve representar uma mudança lógica.
- Não misturar refatoração ampla com funcionalidade sem necessidade.
- Não incluir arquivos temporários, segredos ou `.env` real.
- Mensagens devem ser objetivas e no infinitivo.

## Responsabilidade do agente revisor

O agente Luna Leve deve:

1. Ler a spec da tarefa e o diff completo.
2. Verificar regras de negócio, segurança e regressões.
3. Executar as validações disponíveis.
4. Conferir migrations e políticas RLS quando aplicável.
5. Classificar achados como bloqueadores, importantes ou sugestões.
6. Aprovar somente quando não houver bloqueadores.

O revisor não deve aprovar com base apenas na descrição do implementador.

## Pull Request

Todo PR deve conter:

```md
## Objetivo

## Escopo implementado

## Fora do escopo

## Como testar

## Validações executadas

## Riscos ou decisões

## Checklist

- [ ] Li a spec relacionada
- [ ] Não incluí segredos
- [ ] Testes executados
- [ ] Typecheck executado
- [ ] Lint executado
- [ ] Build executado ou justificativa registrada
- [ ] RLS revisado, quando aplicável
- [ ] Documentação atualizada, quando necessário
```

## Aprovação e merge

- PR de implementação deve ser revisado por um agente Luna Leve ou pelo responsável do projeto.
- O agente que implementou não aprova o próprio PR.
- PR com bloqueador não pode ser integrado.
- Após aprovação, o responsável pelo projeto faz o merge.
- Preferir squash merge para manter a `main` organizada.
- Após o merge, apagar a branch remota quando não for mais necessária.
- Se não houver acesso a PR no ambiente, o agente deve entregar a branch, commits e texto sugerido do PR; não deve simular aprovação.

## Sequência padrão

```text
main atualizada
   ↓
branch de tarefa
   ↓
implementação Terra Médio
   ↓
testes locais
   ↓
push da branch
   ↓
Pull Request
   ↓
revisão Luna Leve
   ↓
correções, se necessário
   ↓
aprovação humana ou do revisor designado
   ↓
merge em main
```

## Política para alterações urgentes

Correções críticas ainda devem usar branch e PR. Alteração direta em `main` só é aceitável para recuperação operacional expressamente autorizada pelo responsável do projeto, com justificativa registrada.

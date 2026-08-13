# PokeBinder — Documento de Requisitos

## 1. Visão do produto

O PokeBinder será uma aplicação mobile-first para organizar, consultar e compartilhar coleções de cartas Pokémon.

O sistema terá dois conceitos principais:

- **Coleção:** conjunto de cartas que pertencem ao usuário.
- **Fichário:** forma visual de organizar cartas da coleção em páginas e espaços.

Também haverá o módulo **Pulls**, destinado ao controle privado de cartas adquiridas em compras.

## 2. Objetivos

- Permitir que o usuário registre sua coleção.
- Organizar cartas em fichários digitais 3x3.
- Permitir várias cópias da mesma carta.
- Permitir que uma carta apareça em mais de um fichário.
- Compartilhar fichários e coleções.
- Criar fichários colaborativos.
- Controlar compras e cartas adquiridas.
- Preparar a aplicação para consulta de catálogo e preços por APIs externas.

## 3. Escopo do MVP

### 3.1 Conta e autenticação

- Cadastro com nome de usuário, nome, e-mail e senha.
- Login e logout.
- Recuperação de senha.
- Foto de perfil.
- Exclusão da conta com confirmação.
- Perfil privado por padrão.

### 3.2 Catálogo de cartas

O catálogo deverá armazenar, quando disponível:

- Nome da carta.
- Número da carta.
- Coleção e edição.
- Idioma.
- Tipo.
- Raridade.
- Imagem.
- Identificação de versões, como holográfica, promocional ou reimpressão.

O usuário poderá cadastrar uma carta manualmente quando ela não for encontrada nas fontes externas.

### 3.3 Coleção do usuário

O usuário poderá:

- Adicionar cartas manualmente.
- Adicionar cartas originadas de um Pull entregue.
- Registrar a quantidade de cópias.
- Editar ou remover cartas.
- Manter cartas sem colocá-las em um fichário.
- Consultar onde cada carta está organizada.
- Ver quantidade total, quantidade em fichários e quantidade disponível.
- Marcar cartas como desejadas.
- Marcar cartas para troca ou venda.

Cada cópia poderá possuir características próprias, como:

- Idioma.
- Estado de conservação.
- Valor pago.
- Observações.

### 3.4 Fichários

O usuário poderá:

- Criar, editar e excluir fichários.
- Definir nome, descrição e capa.
- Usar páginas no formato padrão 3x3.
- Personalizar a quantidade de páginas.
- Adicionar cartas a espaços vazios.
- Empilhar cópias iguais em um mesmo espaço.
- Mover cartas entre espaços e páginas.
- Mover cartas entre fichários próprios.
- Deixar espaços vazios.
- Visualizar o fichário em grade ou lista.

Regras:

- Um espaço aceita apenas cópias da mesma carta.
- A mesma carta pode aparecer em mais de um fichário.
- O sistema não pode alocar mais cópias do que o usuário possui.
- O fichário organiza a coleção, mas não é o proprietário da carta.

### 3.5 Compartilhamento

- Coleção privada por padrão.
- Compartilhamento da coleção inteira ou de fichários específicos.
- Fichários compartilhados por link.
- Visitantes poderão visualizar sem login.
- O proprietário poderá tornar o fichário privado novamente.
- Visitantes poderão ver quantidades e proprietários das cartas.

### 3.6 Fichários compartilhados

- O criador será o proprietário.
- O proprietário poderá convidar e remover membros.
- Apenas o proprietário poderá convidar novos membros.
- Membros poderão sair livremente.
- Todos os membros terão a mesma permissão de edição.
- Cada usuário poderá alterar somente suas próprias cartas.
- O dono de cada carta será identificado.
- Ao sair, as cartas do usuário retornarão para sua coleção pessoal.

### 3.7 Amigos e notificações

- Adicionar amigos por nome de usuário ou e-mail.
- Enviar e aceitar solicitações.
- Remover ou bloquear usuários.
- Amigos não terão acesso automático à coleção.
- Notificações para solicitações de amizade.
- Notificações para convites de fichários.
- Notificações para alterações em fichários compartilhados.

### 3.8 Pulls

Um Pull representa uma compra com vários itens.

Cada compra poderá conter:

- Vendedor.
- Data da compra.
- Lista de cartas.
- Quantidade de cada carta.
- Valor individual.
- Frete.
- Descontos e taxas futuras.
- Código de rastreamento.
- Observações.
- Status da compra.

Status iniciais:

- Comprado.
- Aguardando envio.
- Enviado.
- Entregue.
- Cancelado.

Ao marcar um Pull como entregue, o usuário deverá confirmar se deseja adicionar as cartas à coleção.

O frete será dividido igualmente entre as cartas no MVP.

O usuário poderá editar compras mesmo depois de entregues.

O vendedor poderá ser cadastrado rapidamente durante o cadastro de uma compra.

## 4. Regras de negócio

1. Uma carta pode existir na coleção sem estar em nenhum fichário.
2. Uma carta pode aparecer em vários fichários do mesmo usuário.
3. A quantidade alocada nos fichários não pode exceder a quantidade existente na coleção.
4. Cópias iguais podem ser agrupadas em um único espaço.
5. Um espaço não pode conter cartas diferentes.
6. O fichário compartilhado identifica o proprietário de cada carta.
7. Usuários não podem editar cartas pertencentes a outros membros.
8. A saída de um membro não exclui suas cartas da coleção pessoal.
9. A coleção e os Pulls são privados por padrão.
10. O catálogo externo é uma fonte de consulta; o cadastro manual deve funcionar como alternativa.

## 5. Fluxos principais

### Fluxo A — Adicionar carta manualmente

1. Usuário acessa a Coleção.
2. Pesquisa uma carta.
3. Caso não encontre, escolhe cadastro manual.
4. Informa quantidade e características.
5. Salva a carta na coleção.
6. Opcionalmente adiciona a carta a um fichário.

### Fluxo B — Organizar carta no fichário

1. Usuário abre um fichário.
2. Seleciona um espaço vazio.
3. Escolhe uma carta disponível na coleção.
4. Define a quantidade de cópias.
5. Salva a posição.
6. Pode mover a carta posteriormente.

### Fluxo C — Registrar Pull

1. Usuário cria uma compra.
2. Seleciona ou cadastra um vendedor.
3. Adiciona os itens e seus valores.
4. Informa frete e rastreamento.
5. Atualiza o status da compra.
6. Ao receber, confirma a entrada das cartas na coleção.

### Fluxo D — Criar fichário compartilhado

1. Usuário cria um fichário.
2. Ativa o compartilhamento.
3. Convida usuários.
4. Membros visualizam o conteúdo.
5. Cada membro adiciona e organiza suas próprias cartas.
6. O sistema identifica o proprietário de cada carta.

## 6. Entidades principais

- Usuário.
- Perfil.
- Carta do catálogo.
- Carta da coleção.
- Fichário.
- Membro do fichário.
- Página do fichário.
- Espaço do fichário.
- Carta alocada no fichário.
- Pull ou compra.
- Item do Pull.
- Vendedor.
- Amizade.
- Notificação.

## 7. Telas iniciais

- Login.
- Cadastro.
- Recuperação de senha.
- Tela inicial/dashboard.
- Minha coleção.
- Detalhes da carta.
- Adicionar carta.
- Meus fichários.
- Visualização do fichário.
- Criar e editar fichário.
- Compartilhamento e membros.
- Pulls.
- Detalhes da compra.
- Cadastro rápido de vendedor.
- Amigos.
- Notificações.
- Perfil e configurações.

## 8. Requisitos não funcionais

- Desenvolvimento mobile-first.
- Responsividade para telas maiores em uma etapa posterior.
- Carregamento otimizado de imagens.
- Boa utilização em conexões móveis lentas.
- Autenticação segura.
- Controle de acesso por usuário e por fichário.
- Armazenamento seguro de imagens.
- Interface preparada para português inicialmente.
- Suporte a cartas brasileiras e internacionais.
- Arquitetura preparada para integração com APIs externas.

## 9. Infraestrutura prevista

- **Frontend e hospedagem:** Vercel.
- **Autenticação:** Supabase Auth.
- **Banco de dados:** Supabase/PostgreSQL.
- **Imagens:** Supabase Storage.
- **Integrações externas:** APIs de catálogo e preços, a validar posteriormente.

## 10. Funcionalidades futuras

- Rateio proporcional de frete.
- Histórico detalhado de alterações.
- Comentários em fichários.
- Importação por CSV ou planilha.
- Leitura de cartas por imagem ou código.
- Estatísticas e progresso por coleção.
- Valor estimado da coleção.
- Trocas entre usuários.
- Marketplace.
- Empréstimo de cartas.
- Outros formatos de fichário.
- Notificações de alteração de preços.
- Aplicação instalável ou suporte offline.

## 11. Pontos para validação técnica posterior

- APIs disponíveis para catálogo e preços.
- Permissão de uso e armazenamento das imagens das cartas.
- Limites e custos das APIs.
- Estratégia para versões, idiomas e reimpressões.
- Modelo definitivo de controle de cópias nos fichários.
- Política de privacidade e exclusão de dados.

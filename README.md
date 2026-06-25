# API Adocao de Pets

API RESTful desenvolvida em Node.js, Express e MySQL para gerenciamento de usuarios, pets e adocoes de animais de estimacao. O projeto usa arquitetura em camadas, autenticacao com JWT, criptografia de senhas com bcrypt, middlewares de autorizacao e testes via REST Client.

## Funcionalidades

- Cadastro e login de usuarios com perfis `admin` e `adopter`.
- CRUD de usuarios com controle de permissao.
- CRUD de pets com acesso restrito a administradores.
- Listagem publica de pets disponiveis para adocao.
- Registro de adocoes por usuarios adotantes.
- Atualizacao do status do pet para `adopted` apos a adocao.
- Bloqueio para readocao de pet indisponivel.
- Bloqueio para remover pets com status `adopted`.
- Testes de API com arquivos `.rest`.

## Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- mysql2
- bcrypt
- jsonwebtoken
- dotenv
- cors
- helmet
- ESLint
- Prettier
- REST Client

## Requisitos

- Node.js instalado.
- MySQL instalado e em execucao.
- Extensao REST Client no VS Code, caso queira executar os testes `.rest`.

## Instalacao e Uso

Clone o repositorio e instale as dependencias:

```bash
git clone https://github.com/Itaalmeida6629/api_adocao.git
cd api_adocao
npm install
```

Crie um arquivo `.env` na raiz do projeto com as variaveis abaixo:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=pets_db
JWT_SECRET=sua_chave_secreta
```

Crie o banco de dados e as tabelas:

```bash
mysql -u root -p < src/database/create_database.sql
mysql -u root -p pets_db < src/database/create_tables.sql
mysql -u root -p pets_db < src/database/create_trigger.sql
```

Inicie a aplicacao:

```bash
npm run dev
```

A API ficara disponivel em:

```text
http://localhost:3000
```

## Scripts Disponiveis

```bash
npm run dev
npm start
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Endpoints

### Rotas Publicas

| Metodo | Rota              | Descricao                             |
| ------ | ----------------- | ------------------------------------- |
| POST   | `/login`          | Autentica usuario e retorna token JWT |
| POST   | `/users`          | Cadastra novo usuario                 |
| GET    | `/pets/available` | Lista pets disponiveis para adocao    |

### Usuarios

| Metodo | Rota         | Acesso                   | Descricao               |
| ------ | ------------ | ------------------------ | ----------------------- |
| GET    | `/users`     | admin                    | Lista todos os usuarios |
| GET    | `/users/:id` | admin ou proprio usuario | Busca usuario por ID    |
| PUT    | `/users/:id` | admin ou proprio usuario | Atualiza usuario        |
| DELETE | `/users/:id` | admin                    | Remove usuario          |

### Pets

| Metodo | Rota        | Acesso | Descricao                        |
| ------ | ----------- | ------ | -------------------------------- |
| GET    | `/pets`     | admin  | Lista todos os pets              |
| GET    | `/pets/:id` | admin  | Busca pet por ID                 |
| POST   | `/pets`     | admin  | Cadastra novo pet                |
| PUT    | `/pets/:id` | admin  | Atualiza pet                     |
| DELETE | `/pets/:id` | admin  | Remove pet se estiver disponivel |

### Adocoes

| Metodo | Rota             | Acesso  | Descricao                 |
| ------ | ---------------- | ------- | ------------------------- |
| GET    | `/adoptions`     | admin   | Lista todas as adocoes    |
| POST   | `/adoptions`     | adopter | Realiza adocao de um pet  |
| DELETE | `/adoptions/:id` | admin   | Remove registro de adocao |

## Regras de Negocio

- O role padrao ao cadastrar usuario e `adopter`.
- Senhas sao criptografadas com bcrypt.
- Senhas nao sao retornadas nas respostas JSON.
- O token JWT contem `userId` e `role` e expira em 1 hora.
- Apenas administradores podem cadastrar, editar, listar e remover pets.
- Pets sao cadastrados com status `available` por padrao.
- Pets com status `adopted` nao podem ser removidos.
- Apenas usuarios com role `adopter` podem adotar pets.
- O pet precisa estar com status `available` para ser adotado.
- Apos a adocao, o status do pet muda para `adopted`.
- Um usuario nao pode adotar o mesmo pet mais de uma vez.

## Estrutura do Projeto

```text
src/
  config/        Configuracao do banco de dados
  controllers/   Controle das requisicoes e respostas
  database/      Scripts SQL de criacao do banco, tabelas e triggers
  middlewares/   Middlewares de erro, autenticacao e autorizacao
  models/        Acesso aos dados no MySQL
  routes/        Definicao das rotas da API
  services/      Regras de negocio
  utils/         Funcoes auxiliares de validacao
tests/           Testes REST Client
```

## Banco de Dados

Database: `pets_db`

Tabela `users`:

| Campo    | Tipo    | Descricao            |
| -------- | ------- | -------------------- |
| id       | INT     | Identificador unico  |
| name     | VARCHAR | Nome completo        |
| email    | VARCHAR | E-mail unico         |
| password | VARCHAR | Senha criptografada  |
| phone    | VARCHAR | Telefone             |
| role     | ENUM    | `admin` ou `adopter` |

Tabela `pets`:

| Campo       | Tipo    | Descricao                    |
| ----------- | ------- | ---------------------------- |
| id          | INT     | Identificador unico          |
| name        | VARCHAR | Nome do pet                  |
| age         | INT     | Idade aproximada             |
| species     | VARCHAR | Especie                      |
| size        | ENUM    | `small`, `medium` ou `large` |
| status      | ENUM    | `available` ou `adopted`     |
| description | VARCHAR | Informacoes adicionais       |

Tabela `adoptions`:

| Campo         | Tipo     | Descricao              |
| ------------- | -------- | ---------------------- |
| id            | INT      | Identificador unico    |
| user_id       | INT      | ID do usuario adotante |
| pet_id        | INT      | ID do pet adotado      |
| adoption_date | DATETIME | Data da adocao         |

## Testes

Os testes podem ser executados pelo REST Client no VS Code usando os arquivos:

- `tests/user_tests.rest`
- `tests/pets_tests.rest`
- `tests/adoption_tests.rest`

Antes de executar rotas protegidas, rode as requisicoes de login para preencher automaticamente os tokens `tokenAdmin` e `tokenAdopter`.

## Padronizacao

O projeto possui ESLint e Prettier configurados. Para verificar o codigo:

```bash
npm run lint
npm run format:check
```

Para corrigir automaticamente quando possivel:

```bash
npm run lint:fix
npm run format
```

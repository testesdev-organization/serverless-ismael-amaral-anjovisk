# serverless-dev-test

Avaliação prática de candidatos inscritos à vaga de dev backend.

## Estrutura do repositório

``` h
.
|-- README.md
|-- data // pasta com massas de dados
|   `-- orders.json // massa de dados de pedidos
|-- docs // pasta com documentações diversas
|   `-- bff-orders-v1.yaml // documentação das APIs do bff orders
|-- lambda // code base do microsserviço serverless
|   |-- __tests__ // código fonte e demais artefatos necessários para execução dos testes de unidade de todas as camadas da aplicação
|   |       `-- index.test.ts // testes da lógica presente no arquivo index.ts
|   |-- layer
|   |       `-- nodejs // diretório padrão definido pela aws para conter as dependências nodejs
|   |           `-- package.json // dependências comuns - lambda
|   |-- src // código fonte
|   |   `-- index.ts // ponto de entrada das lambdas
|   |-- .eslintrc.json // configurações de lint
|   |-- jest.config.ts // configurações da biblioteca de testes jest
|   |-- package.json // metadados da aplicação
|   `-- tsconfig.json // configurações do typescript
|-- webapp // aplicação web para auxiliar candidato durante teste - https://appdev.testedev.click
|-- .gitignore // configuração de 'não rastreamento' do git
|-- amplify.yml // especificação de build do webapp no amplify
|-- buildspec-CD.yml // especificação de build do microsserviço serverless
|-- template-parameters.json // parâmetros do microsserviço serverless
`-- template.yaml // template IaC do microsserviço serverless
```

## Pré-requisitos

- `VSCode` (ou outra IDE de preferência do candidato)
- `git`
- `nodejs 18.x`
- Conexão com a internet

## Comandos úteis

```bash
# Lint
npm run eslint # Executar checagem
npm run lint -- --fix # Executar checagem e permitir que biblioteca de lint aplique recomendações automaticamente

# Teste
npm run test # Rodar testes
npm run test:nocoverage # Rodar testes sem verificar percentual de cobertura

# Compilação
npm run compile
```

## Preparar e validar ambiente de desenvolvimento

Após a instalação/configuração dos [pŕe-requisitos](#pré-requisitos), basta:

1. clonar o repositório [`https://github.com/investplay-dev/serverless-dev-test-{código do candidato}`](https://github.com/investplay-dev/serverless-dev-test-{código do candidato});
1. instalar as dependências do microsserviço serverless;

    ```bash
    cd ./lambda
    npm install
    ```

1. executar os comandos de compilação e teste;

    ```bash
    cd ./lambda
    npm run compile
    npm run test
    ```

    Output esperado:

    ```bash
    # compilação

    > serverless-dev-test@0.0.1 compile
    > tsc -p tsconfig.json

    # teste

    > serverless-dev-test@0.0.1 test
    > jest --coverage --watchAll=false

    PASS  __tests__/index.test.ts
      handleRestAPI
        ✓ should return 200 (2 ms)

    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ----------|---------|----------|---------|---------|-------------------
    All files |     100 |      100 |     100 |     100 |                   
    index.ts  |     100 |      100 |     100 |     100 |                   
    ----------|---------|----------|---------|---------|-------------------
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        2.303 s
    Ran all test suites.
    ```

# NLW Journey

Backend para aplicação de gestão de viagens desenvolvida durante o
acompanhamento do evento Next Level Week organizado pela empresa Rocketseat
em Julho de 2024.

![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)

## Executando o projeto

Para executar esse projeto você irá precisar do [Node.js 20](https://nodejs.org/en) instalado em sua máquina.

1. Faça download do repositório

2. Renomeie o arquivo `.env.example` como `.env`

3. Instale as dependências com o comando a seguir via terminal:

    ```bash
    npm i
    ```

4. Ainda no terminal, execute as migrações do prisma:

    ```bash
    npx prisma migrate dev
    ```

5. Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

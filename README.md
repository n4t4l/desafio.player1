# Aplicação de Votos Alex Natalino
Esta aplicação é uma aplicação de votos para web, cuja permite além de votar, a inserção edição e exclusão de opções, sendo essas mudanças refletidas automaticamente no(s) cliente(s) conectados. Aplicação feita em Javascript (NodeJS + Express + Knex + Axios). A aplicação permite a inserção de imagens para cada opção
## Features
- Login, Logout e registro de administradores
- Modificar nome, imagem e quantidade de votos >:) de cada opção
- Autenticação de usuário para adição,edição e remoção de opções por meio de cookies no request
- Atualização Instantânea de votos e edições de opções para os clientes
- Frontend feio pra caramba
## Requisições API:
### POST /insert para inserção de opções 
- recebe: FormData{name(string),img(imagefile)} & cookie["Player1"], retorna: codigo de status 201
### PUT /insert para edição de opções 
- recebe: FormData{name(string),img(imagefile)} & cookie["Player1"], retorna: codigo de status 200
### DELETE /insert para remoção de opções 
- recebe: query.id & cookie["Player1"], retorna: codigo de status 200
### POST /login para logar no sistema de administradores 
- recebe: req.body.name & req.body.password, retorna: codigo de status 200 & body.acessToken
### PUT /login para registrar um administrador
- recebe: req.body.name & req.body.password, retorna: codigo de status 201
### GET /refresh para atualizar os clientes após edições as opções
- recebe: cookie["Player1"], retorna: codigo de status 200
## Endereços Front-End
- "/": Tela de votação
- "/login/": Tela de login/registro
- "/insert/": Tela de adição e remoção de opções
- "/insert/edit?id=": Tela de edição de opções
## Quick-start
- Instale o NodeJS
- Instale NPM ou Yarn
- No seu terminal, vá até a pasta do projeto e execute um dos seguintes comandos, de acordo com o programa escolhido no passo acima
`npm install`
`yarn install`
- Execute o arquivo player1.sql no seu banco de dados para criar o banco e as tabelas necessárias
- Modifique o arquivo .env para apontar para seu banco de dados
- No seu terminal, vá até a pasta do projeto e execute o comando
`node server.js`
-Pronto! Agora é só acessar a pagina "http//localhost:8080" ou então começar a fazer chamadas a API
> A aplicação vem com um login de administrador incluso{login:321,senha:321}

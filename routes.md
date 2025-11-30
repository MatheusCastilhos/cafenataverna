# Rotas de Cadastro, atualização e deleção de usuário. Bem como Login

BASE_URL = http://localhost:3000/users

#############################################################################
🧩 1. Criar Usuário
POST /users

Cria um novo usuário no MongoDB Atlas.

Body (JSON)
{
  "name": "Ryan",
  "email": "ryan@example.com",
  "password": "minhaSenha123"
}

RESPOSTA
{
  "message": "Usuário registrado com sucesso!",
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e",
    "name": "Ryan",
    "email": "ryan@example.com"
  }
}

#############################################################################
🔑 2. Login do Usuário (Gerar Token)
POST /users/login

Autentica o usuário e retorna um token JWT obrigatório para rotas protegidas (Rotas de atualização e deleção de usuário).

Body (JSON)
{
  "email": "ryan@example.com",
  "password": "minhaSenha123"
}

RESPOSTAS
{
  "message": "Login OK",
  "token": "JWT_TOKEN_AQUI"
}

#############################################################################
✏️ 3. Atualizar Usuário
PUT /users/<ID_USUARIO>

Atualiza os dados de um usuário existente.
⚠️ Requer autenticação. (Utilizar o Token retornado na rota de users/login --> Authorization: Bearer <TOKEN>)

Headers obrigatórios
Authorization: Bearer JWT_TOKEN_AQUI
Content-Type: application/json

Body (JSON)
{
  "name": "Ryan Silva",
  "password": "novaSenha123"
}

RESPOSTAS
{
  "message": "Usuário atualizado",
  "user": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e",
    "name": "Ryan Silva",
    "email": "ryan@example.com"
  }
}

#############################################################################
🗑️ 4. Deletar Usuário
DELETE /users/<ID_USUARIO>

Remove um usuário do banco.
⚠️ Requer autenticação. (Utilizar o Token retornado na rota de users/login --> Authorization: Bearer <TOKEN>)

Headers obrigatórios
Authorization: Bearer JWT_TOKEN_AQUI

------------------------------------------------------------------------------

# Rotas dos episódios

BASE_URL = http://localhost:3000

#############################################################################
📌 1. GET /episodes
Descrição

Retorna todos os episódios cadastrados no banco, ordenados pela data de publicação (pubDate) do mais recente para o mais antigo.

#############################################################################
📌 2. GET /episodes/<guid>
Descrição

Retorna um único episódio usando o campo guid como identificador.

#############################################################################
📌 3. GET /episodes/<guid>/fields?fields=campo1,campo2
Descrição

Retorna um episódio filtrando apenas os campos especificados.
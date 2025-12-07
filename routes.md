# 📘 **ROUTES.md — API Backend Café na Taverna**

---

# 👤 **Rotas de Usuário (Cadastro, Login, Update, Delete)**

**BASE_URL:** `http://localhost:3000/users`

---

## 🧩 **1. Criar Usuário**

### `POST /users`

Cria um novo usuário no MongoDB.

### **Body (JSON)**

```json
{
  "name": "Ryan",
  "email": "ryan@example.com",
  "password": "minhaSenha123"
}
```

### **Resposta**

```json
{
  "message": "Usuário registrado com sucesso!",
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e",
    "name": "Ryan",
    "email": "ryan@example.com"
  }
}
```

---

## 🔑 **2. Login (Gera Token JWT)**

### `POST /users/login`

Autentica o usuário e devolve um token JWT usado em rotas protegidas.

### **Body (JSON)**

```json
{
  "email": "ryan@example.com",
  "password": "minhaSenha123"
}
```

### **Resposta**

```json
{
  "message": "Login OK",
  "token": "JWT_TOKEN_AQUI"
}
```

---

## ✏️ **3. Atualizar Usuário**

### `PUT /users/:id`

⚠️ **Rota protegida** — requer header:

```
Authorization: Bearer JWT_TOKEN_AQUI
```

### **Body (JSON)**

```json
{
  "name": "Ryan Silva",
  "password": "novaSenha123"
}
```

### **Resposta**

```json
{
  "message": "Usuário atualizado",
  "user": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e",
    "name": "Ryan Silva",
    "email": "ryan@example.com"
  }
}
```

---

## 🗑️ **4. Deletar Usuário**

### `DELETE /users/:id`

⚠️ **Rota protegida**

### **Resposta**

```json
{ "message": "Usuário removido" }
```

---

# 🎙️ **Rotas dos Episódios — Café na Taverna**

**BASE_URL:** `http://localhost:3000/episodes`

As rotas abaixo são baseadas no backend atualizado, usando:

* `episodeNumber` → número contínuo extraído do título (#58)
* `season` + `episode` → valores originais do feed (Apple Podcasts)
* `guid` → identificador interno do RSS
* `_id` → ObjectId do MongoDB (uso ADMIN)

---

## 📌 **1. GET /episodes**

Retorna **todos os episódios** do banco, ordenados pelo número contínuo (`episodeNumber`) do mais recente para o mais antigo.
Usado no painel **Admin**.

---

## 📌 **2. GET /episodes/published**

Lista **somente episódios publicados**, ordenados do mais recente para o mais antigo.
Usado no **site público**.

---

## 📊 **3. GET /episodes/stats**

Retorna estatísticas do painel administrativo:

```json
{
  "total": 87,
  "published": 70,
  "draft": 17,
  "lastEdited": [
    {
      "_id": "65...",
      "title": "Café na Taverna #58 - A Jornada",
      "pubDate": "2024-05-01T...",
      "published": true,
      "updatedAt": "2024-05-02T..."
    }
  ]
}
```

---

## 🔄 **4. POST /episodes/sync**

Baixa o **RSS** do Café na Taverna e sincroniza com o banco:

* Cria novos episódios
* Atualiza dados vindos do feed
* Extrai automaticamente o número do episódio (#58 → 58)
* Não sobrescreve título/descrição editados manualmente
* Não publica automaticamente

Resposta:

```json
{
  "message": "Sincronização concluída",
  "imported": 2,
  "updated": 5,
  "totalFeed": 87
}
```

---

## 🌐 **5. GET /episodes/by-number/:episodeNumber**

Rota pública oficial para acessar episódios individualmente:

### Exemplo:

```
GET /episodes/by-number/58
```

### Resposta:

```json
{
  "_id": "65...",
  "episodeNumber": 58,
  "title": "Café na Taverna #58 - A Jornada",
  "season": 3,
  "episode": 12,
  "audioUrl": "...",
  "published": true
}
```

---

## 🧾 **6. GET /episodes/id/:id**

Busca episódio por **ObjectId** do MongoDB.
Usado no painel **Admin** para edição.

---

## ✏️ **7. PUT /episodes/id/:id**

Atualiza **apenas**:

* title
* description
* published

Usado no Admin.

---

## 📤 **8. PUT /episodes/publish-all**

Marca **todos** os episódios como `published: true`.

---

## 📥 **9. PUT /episodes/unpublish-all**

Marca **todos** como `published: false`.

---

## 🎧 **10. GET /episodes/download/:id**

Realiza download direto do arquivo de áudio (`audioUrl`).

O backend faz streaming e retorna:

```
attachment; filename="cafe-na-taverna-58.mp3"
```
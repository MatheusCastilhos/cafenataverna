# Backend - Node.js + Express + MongoDB

API REST construída com Node.js, Express e MongoDB.

## Tecnologias

- Node.js 20
- Express
- MongoDB
- Mongoose
- CORS
- Helmet (segurança)
- Morgan (logging)
- Dotenv (variáveis de ambiente)

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Variáveis de ambiente:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fullstack-app
```

## Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em http://localhost:5000

## Produção

```bash
npm start
```

## Estrutura

```
src/
├── config/
│   └── database.js    # Configuração MongoDB
├── models/
│   └── Item.js        # Modelo de exemplo
├── routes/
│   └── api.js         # Rotas da API
└── index.js           # Servidor Express
```

## Endpoints

### Health Check
```
GET /health
```

### Items (Exemplos)
```
GET    /api/items      # Lista todos
GET    /api/items/:id  # Busca por ID
POST   /api/items      # Cria novo
PUT    /api/items/:id  # Atualiza
DELETE /api/items/:id  # Remove
```

## Modelo de Dados (Exemplo)

```javascript
{
  name: String,
  description: String,
  status: String, // 'active' ou 'inactive'
  createdAt: Date,
  updatedAt: Date
}
```

## Adicionar Novas Rotas

1. Crie o modelo em `src/models/`
2. Adicione as rotas em `src/routes/`
3. Importe e use no `src/index.js`

Exemplo:

```javascript
// src/routes/users.js
import express from 'express';
const router = express.Router();

router.get('/users', async (req, res) => {
  // Sua lógica aqui
});

export default router;
```

```javascript
// src/index.js
import userRoutes from './routes/users.js';
app.use('/api', userRoutes);
```

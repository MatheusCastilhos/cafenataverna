import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import episodesRouter from "./routes/episodes.js";
import usersRouter from "./routes/users.js";
import feedRouter from "./routes/rss.js";


dotenv.config(); // Carrega variáveis do .env

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
const MONGO_URI = process.env.MONGODB_URI || "mongodb://mongodb:27017/fullstack-app";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🔥 MongoDB conectado com sucesso"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

// Rotas
app.use("/episodes", episodesRouter);
app.use("/users", usersRouter);
app.use("/rss", feedRouter);


// Porta do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
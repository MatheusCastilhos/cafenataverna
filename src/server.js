import express from "express";
import mongoose from "mongoose";
import episodesRouter from "./routes/episodes.js";
import usersRouter from "./routes/users.js"; // <-- IMPORTANTE

const app = express();

// JSON middleware
app.use(express.json());

// MongoDB Atlas
const MONGO_URI = "mongodb+srv://cafenataverna:c4fen4t4vern4@cafenataverna.sxzygzb.mongodb.net/cafenataverna?appName=cafenataverna";

// Conexão com o banco
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🔥 MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar MongoDB", err));

// Rotas
app.use("/episodes", episodesRouter);
app.use("/users", usersRouter);  // <-- AQUI

// Porta
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server rodando na porta ${PORT}`));

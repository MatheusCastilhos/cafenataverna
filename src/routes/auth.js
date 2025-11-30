import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// 📌 Registrar novo usuário
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Preencha todos os campos" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email já registrado" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({ message: "Usuário criado com sucesso", user });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// 📌 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login realizado", token });
  } catch (error) {
    res.status(500).json({ error: "Erro no login" });
  }
});

export default router;

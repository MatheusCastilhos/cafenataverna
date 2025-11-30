import { Router } from "express";
import Episode from "../models/Episode.js";

const router = Router();

/* ============================================================
   GET /episodes - Retorna todos os episódios
   ============================================================ */
router.get("/", async (req, res) => {
  try {
    const episodes = await Episode.find().sort({ pubDate: -1 });
    res.json(episodes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar episódios" });
  }
});

/* ============================================================
   GET /episodes/:guid - Retorna um episódio específico
   ============================================================ */
router.get("/:guid", async (req, res) => {
  try {
    const episode = await Episode.findOne({ guid: req.params.guid });

    if (!episode) {
      return res.status(404).json({ error: "Episódio não encontrado" });
    }

    res.json(episode);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar episódio" });
  }
});

/* ============================================================
   GET /episodes/by-guid/:guid?fields=
   Retorna campos específicos dinamicamente
   ============================================================ */
router.get("/by-guid/:guid", async (req, res) => {
  try {
    const { guid } = req.params;
    const { fields } = req.query;

    let projection = {};

    if (fields) {
      fields.split(",").forEach((f) => {
        projection[f.trim()] = 1;
      });
    }

    const episode = await Episode.findOne({ guid }, projection);

    if (!episode) {
      return res.status(404).json({ error: "Episódio não encontrado" });
    }

    res.json(episode);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar episódio por GUID" });
  }
});

export default router;

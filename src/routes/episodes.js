import { Router } from "express";
import axios from "axios";
import xml2js from "xml2js";
import Episode from "../models/Episode.js";

const router = Router();

// URL oficial do RSS do Café na Taverna
const RSS_URL = "https://anchor.fm/s/10c47204/podcast/rss";

/* ============================================================
   Função para extrair número do episódio do título (#58)
   Ex.: "Guia para o Oscar 2024 | Café na Taverna #58"
   ============================================================ */
function extractEpisodeNumber(title) {
  if (!title) return null;
  const match = title.match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

/* ============================================================
   GET /episodes  → lista completa (ADMIN)
   ============================================================ */
router.get("/", async (req, res) => {
  try {
    const episodes = await Episode.find().sort({ episodeNumber: -1 });
    res.json(episodes);
  } catch (err) {
    console.error("Erro ao buscar episódios:", err);
    res.status(500).json({ error: "Erro ao buscar episódios" });
  }
});

/* ============================================================
   GET /episodes/published  → episódios publicados (PÚBLICO)
   ============================================================ */
router.get("/published", async (req, res) => {
  try {
    const episodes = await Episode.find({ published: true }).sort({
      episodeNumber: -1,
    });
    res.json(episodes);
  } catch (err) {
    console.error("Erro ao buscar episódios publicados:", err);
    res.status(500).json({ error: "Erro ao buscar episódios publicados" });
  }
});

/* ============================================================
   GET /episodes/stats  → métricas do painel ADMIN
   ============================================================ */
router.get("/stats", async (req, res) => {
  try {
    const total = await Episode.countDocuments();
    const published = await Episode.countDocuments({ published: true });
    const draft = await Episode.countDocuments({ published: false });

    const lastEdited = await Episode.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title pubDate published updatedAt image episodeNumber");

    res.json({
      total,
      published,
      draft,
      lastEdited,
    });
  } catch (err) {
    console.error("Erro ao calcular estatísticas:", err);
    res.status(500).json({ error: "Erro ao calcular estatísticas" });
  }
});

/* ============================================================
   POST /episodes/sync - baixa e sincroniza RSS com banco
   ============================================================ */
router.post("/sync", async (req, res) => {
  try {
    console.log("⏳ Baixando RSS…");
    const { data: xml } = await axios.get(RSS_URL);

    const json = await xml2js.parseStringPromise(xml, {
      explicitArray: false,
    });

    const items = json?.rss?.channel?.item || [];
    const episodesArray = Array.isArray(items) ? items : [items];

    let imported = 0;
    let updated = 0;

    for (const item of episodesArray) {
      const guid = item.guid?._ || item.guid;
      if (!guid) continue;

      const episodeNumber = extractEpisodeNumber(item.title);

      const feedData = {
        guid,
        episodeNumber,
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: item.pubDate ? new Date(item.pubDate) : null,
        audioUrl: item.enclosure?.$?.url || null,
        duration: item["itunes:duration"] || null,

        season: item["itunes:season"]
          ? parseInt(item["itunes:season"], 10)
          : null,
        episode: item["itunes:episode"]
          ? parseInt(item["itunes:episode"], 10)
          : null,

        image: item["itunes:image"]?.$?.href || null,
      };

      const existing = await Episode.findOne({ guid });

      if (!existing) {
        await Episode.create({
          ...feedData,
          published: false,
        });
        imported++;
      } else {
        // Atualiza dados vindos do feed
        existing.link = feedData.link;
        existing.pubDate = feedData.pubDate;
        existing.audioUrl = feedData.audioUrl;
        existing.duration = feedData.duration;
        existing.image = feedData.image;
        existing.episodeNumber = feedData.episodeNumber;

        // 🔥 garante que season/episode também sejam atualizados
        existing.season = feedData.season;
        existing.episode = feedData.episode;

        // Mantém título e descrição se já editados
        if (!existing.title) existing.title = feedData.title;
        if (!existing.description) existing.description = feedData.description;

        await existing.save();
        updated++;
      }
    }

    res.json({
      message: "Sincronização concluída",
      imported,
      updated,
      totalFeed: episodesArray.length,
    });
  } catch (err) {
    console.error("Erro na sincronização:", err);
    res.status(500).json({ error: "Erro ao sincronizar" });
  }
});


/* ============================================================
   PUT /episodes/publish-all  → publicar todos
   ============================================================ */
router.put("/publish-all", async (req, res) => {
  try {
    const result = await Episode.updateMany({}, { $set: { published: true } });
    res.json({ success: true, modified: result.modifiedCount });
  } catch (err) {
    console.error("Erro ao publicar todos:", err);
    res.status(500).json({ error: "Erro ao publicar todos" });
  }
});

/* ============================================================
   PUT /episodes/unpublish-all  → despublicar todos
   ============================================================ */
router.put("/unpublish-all", async (req, res) => {
  try {
    const result = await Episode.updateMany({}, { $set: { published: false } });
    res.json({ success: true, modified: result.modifiedCount });
  } catch (err) {
    console.error("Erro ao despublicar todos:", err);
    res.status(500).json({ error: "Erro ao despublicar todos" });
  }
});

/* ============================================================
   GET /episodes/download/:id  → download direto do áudio
   ============================================================ */
router.get("/download/:id", async (req, res) => {
  try {
    const ep = await Episode.findById(req.params.id);
    if (!ep?.audioUrl) {
      return res.status(404).json({ error: "Áudio não encontrado" });
    }

    const audio = await axios.get(ep.audioUrl, { responseType: "stream" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cafe-na-taverna-${ep.episodeNumber || "episodio"
      }.mp3"`
    );
    res.setHeader("Content-Type", "audio/mpeg");

    audio.data.pipe(res);
  } catch (err) {
    console.error("Erro no download:", err);
    res.status(500).json({ error: "Erro ao realizar download" });
  }
});

/* ============================================================
   GET /episodes/id/:id  → rota ADMIN (busca por ObjectId)
   ============================================================ */
router.get("/id/:id", async (req, res) => {
  try {
    const ep = await Episode.findById(req.params.id);
    if (!ep) {
      return res.status(404).json({ error: "Episódio não encontrado" });
    }
    res.json(ep);
  } catch (err) {
    console.error("Erro ao buscar episódio por id:", err);
    res.status(500).json({ error: "Erro ao buscar episódio" });
  }
});

/* ============================================================
   PUT /episodes/id/:id  → atualização ADMIN (título/descrição/published)
   ============================================================ */
router.put("/id/:id", async (req, res) => {
  try {
    const { title, description, published } = req.body;

    const updated = await Episode.findByIdAndUpdate(
      req.params.id,
      { title, description, published },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Episódio não encontrado" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar episódio:", err);
    res.status(500).json({ error: "Erro ao atualizar episódio" });
  }
});

/* ============================================================
   GET /episodes/by-number/:episodeNumber  → rota pública
   Usada pela página /episodio/:numero no front
   ============================================================ */
router.get("/by-number/:episodeNumber", async (req, res) => {
  try {
    const episodeNumber = Number(req.params.episodeNumber);

    if (isNaN(episodeNumber)) {
      return res.status(400).json({ error: "Número de episódio inválido" });
    }

    const ep = await Episode.findOne({
      episodeNumber,
      published: true,
    });

    if (!ep) {
      return res.status(404).json({ error: "Episódio não encontrado" });
    }

    res.json(ep);
  } catch (err) {
    console.error("Erro ao buscar episódio por número:", err);
    res.status(500).json({ error: "Erro ao buscar episódio" });
  }
});

export default router;
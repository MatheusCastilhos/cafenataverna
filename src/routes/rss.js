import express from "express";
import axios from "axios";
import xml2js from "xml2js";

const router = express.Router();

// URL do feed RSS do Café na Taverna
const RSS_URL = "https://anchor.fm/s/10c47204/podcast/rss";

router.get("/", async (req, res) => {
  try {
    // Baixa o XML do feed
    const { data: xml } = await axios.get(RSS_URL);

    // Converte XML -> JS
    const json = await xml2js.parseStringPromise(xml, { explicitArray: false });

    const channel = json.rss.channel;
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    // Mapeia itens do feed para um formato mais limpo
    const episodes = items.map((item) => {
      const enclosure = item.enclosure?.$ || {};
      return {
        guid: item.guid?._ || item.guid || enclosure.url,
        title: item.title || "Episódio sem título",
        description: item.description || "",
        link: item.link || "",
        pubDate: item.pubDate || null,
        audioUrl: enclosure.url || "",
        duration: item["itunes:duration"] || null,
        season: item["itunes:season"]
          ? parseInt(item["itunes:season"])
          : null,
        episode: item["itunes:episode"]
          ? parseInt(item["itunes:episode"])
          : null,
        image:
          item["itunes:image"]?.$.href ||
          channel["itunes:image"]?.$.href ||
          null,
      };
    });

    res.json(episodes);
  } catch (error) {
    console.error("Erro ao buscar/parsing o feed RSS:", error);
    res.status(500).json({ message: "Erro ao buscar feed RSS do podcast." });
  }
});

export default router;
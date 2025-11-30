import axios from "axios";
import xml2js from "xml2js";
import mongoose from "mongoose";

// URL da API RSS
const RSS_URL = "https://anchor.fm/s/10c47204/podcast/rss";

// SUA CONNECTION STRING DO MONGO ATLAS
const MONGO_URI = "mongodb+srv://cafenataverna:c4fen4t4vern4@cafenataverna.sxzygzb.mongodb.net/cafenataverna?appName=cafenataverna";

// Modelo da coleção
const EpisodeSchema = new mongoose.Schema(
  {
    guid: { type: String, unique: true },
    title: String,
    description: String,
    link: String,
    pubDate: Date,
    audioUrl: String,
    duration: String,
    season: Number,
    episode: Number,
    image: String,
  },
  { timestamps: true }
);

const Episode = mongoose.model("Episode", EpisodeSchema);

// Função principal
async function run() {
  try {
    console.log("🔌 Conectando ao MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);

    console.log("⏳ Baixando RSS...");
    const { data: xml } = await axios.get(RSS_URL);

    console.log("🔄 Convertendo XML para JSON...");
    const json = await xml2js.parseStringPromise(xml, { explicitArray: false });

    const items = json.rss.channel.item;

    console.log(`📌 Encontrados ${items.length} episódios`);

    for (const item of items) {
      const episode = {
        guid: item.guid._ || item.guid,
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: new Date(item.pubDate),
        audioUrl: item.enclosure?.$.url,
        duration: item["itunes:duration"],
        season: parseInt(item["itunes:season"]) || null,
        episode: parseInt(item["itunes:episode"]) || null,
        image: item["itunes:image"]?.$.href || null,
      };

      // Upsert evita duplicados
      await Episode.updateOne(
        { guid: episode.guid },
        { $set: episode },
        { upsert: true }
      );
    }

    console.log("✅ Episódios salvos/atualizados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

run();

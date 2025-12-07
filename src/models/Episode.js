import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema(
  {
    guid: { type: String, unique: true },

    // Número contínuo (#58)
    episodeNumber: {
      type: Number,
      unique: true,
      sparse: true, // evita erro se algum episódio vier sem número
      index: true,
    },

    // Campos editáveis (admin pode alterar)
    title: { type: String },
    description: { type: String },

    // Campos oriundos do feed
    link: { type: String },
    pubDate: { type: Date },
    audioUrl: { type: String },
    duration: { type: String },

    // Metadados secundários (não usados para URL)
    season: { type: Number },
    episode: { type: Number },
    image: { type: String },

    // Controle interno
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Episode", EpisodeSchema);
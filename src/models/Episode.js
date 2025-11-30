import mongoose from "mongoose";

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

export default mongoose.model("Episode", EpisodeSchema);

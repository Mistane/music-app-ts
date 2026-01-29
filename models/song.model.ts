import mongoose from "mongoose";
const songSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    topicId: String,
    singerId: String,
    likeCount: Number,
    lyrics: String,
    status: String,
    slug: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const Song = mongoose.model("Song", songSchema, "songs");
export default Song;

import mongoose from "mongoose";
const likeSchema = new mongoose.Schema(
  {
    userId: String,
    songId: String,
  },
  { timestamps: true },
);

likeSchema.index({ userId: 1, songId: 1 });
const Like = mongoose.model("Like", likeSchema, "likes");
export default Like;

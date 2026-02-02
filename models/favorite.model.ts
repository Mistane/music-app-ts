import mongoose from "mongoose";
const favoriteSchema = new mongoose.Schema(
  {
    userId: String,
    songId: String,
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, songId: 1 });
const Favorite = mongoose.model("Favorite", favoriteSchema, "favorites");
export default Favorite;

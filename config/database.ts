import mongoose from "mongoose";
const urlString: string = process.env.MONGO_URL;

export async function connect(): Promise<void> {
  try {
    await mongoose.connect(urlString);
    console.log("Ket noi toi db thanh cong!");
  } catch (err) {
    console.log("Failed to connect to db");
  }
}

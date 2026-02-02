import { Express } from "express";
import topicRoute from "./topic.route";
import songRoute from "./song.route";
import userRoute from "./user.route";
import authMiddleware from "../../middlewares/auth.middleware";
import checkLoginMiddleware from "../../middlewares/checkLogin.middleware";

export default function (app: Express) {
  app.use(checkLoginMiddleware);
  app.use("/topics", topicRoute);
  app.use("/songs", songRoute);
  app.use("/users", userRoute);
  app.get("/test", authMiddleware, (req, res) => {
    res.json("hello");
  });
}

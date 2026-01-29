import { Express } from "express";
import topicRoute from "./topic.route";
import songRoute from "./song.route";

export default function (app: Express) {
  app.use("/topics", topicRoute);
  app.use("/songs", songRoute);
}

import { Request, Response } from "express";
import Topic from "../.././models/topic.model";

class Controller {
  //[GET] /topics
  async topic(req: Request, res: Response) {
    const topics = await Topic.find({ deleted: false, status: "active" });
    res.render("./client/pages/topic/index", {
      pageTitle: "Trang chủ đề bài hát",
      topics,
    });
  }
}

export default new Controller();

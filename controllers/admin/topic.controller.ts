import Topic from "../../models/topic.model";
import { Request, Response } from "express";

class Controller {
  // [GET] /admin/topics
  async topic(req: Request, res: Response) {
    const topics = await Topic.find({ deleted: false });
    res.render("./admin/pages/topics/index", {
      pageTitle: "Quan li chu de",
      topics,
    });
  }
}

export default new Controller();

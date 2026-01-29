import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";

class Controller {
  //[GET] /songs
  async list(req: Request, res: Response) {
    const songs = await Song.find({ deleted: false, status: "active" });
    for (const song of songs) {
      const singerInfo = await Singer.findOne({ _id: song.singerId });
      song["singerInfo"] = singerInfo;
    }
    res.render("./client/pages/songs/list", {
      pageTitle: "Danh sách bài hát",
      songs,
    });
  }

  //[GET] /songs/:slugTopic
  async listTopic(req: Request, res: Response) {
    const slugTopic = req.params.slugTopic;
    console.log(slugTopic);
    const topic = await Topic.findOne({ slug: slugTopic });
    const songs = await Song.find({
      deleted: false,
      status: "active",
      topicId: topic.id,
    }).select("-lyrics");
    for (const song of songs) {
      const singerInfo = await Singer.findOne({ _id: song.singerId });
      song["singerInfo"] = singerInfo;
    }
    console.log(songs);
    res.render("./client/pages/songs/list", {
      pageTitle: `Danh sách bài hát thuộc ${topic.title}`,
      songs,
    });
  }
}

export default new Controller();

import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Like from "../../models/like.model";
import Favorite from "../../models/favorite.model";
import User from "../../models/user.model";
import convertToSlug from "../../helpers/convertToSlug";

class Controller {
  // [GET] /search/:type
  async search(req: Request, res: Response) {
    let keyword = `${req.query.keyword}`;
    let slug = convertToSlug(keyword);
    const slugRegex = new RegExp(slug, "i");
    const songs = await Song.find({ slug: slugRegex });
    const records = [];
    for (const song of songs) {
      const singerInfo = await Singer.findOne({ _id: song.singerId });
      const songObject = {
        title: song.title,
        likeCount: song.likeCount,
        slug: song.slug,
        avatar: song.avatar,
        singerInfo,
      };
      records.push(songObject);
    }
    console.log(records);

    const type = req.params.type;
    switch (type) {
      case "result":
        res.render("./client/pages/search/index", {
          keyword,
          songs: records,
        });
        break;
      case "suggest":
        res.json({
          songs: records,
        });
        break;
    }
  }
}

export default new Controller();

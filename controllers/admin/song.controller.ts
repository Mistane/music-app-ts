import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import cloudinary from "../../helpers/uploadToCloudinary";

class Controller {
  // [GET] /admin/songs
  async index(req: Request, res: Response) {
    const songs = await Song.find({ deleted: false });
    res.render("./admin/pages/songs/index", {
      pageTitle: "Trang quan li bai hat",
      songs,
    });
  }

  //[GET] /admin/songs/create
  async create(req: Request, res: Response) {
    const topics = await Topic.find({ deleted: false });
    const singers = await Singer.find({ deleted: false });
    res.render("./admin/pages/songs/create", {
      pageTitle: "Tao moi bai hat",
      topics,
      singers,
    });
  }

  // [POST] /admin/songs/create
  async createPost(req: Request, res: Response) {
    const newSong = new Song(req.body);
    await newSong.save();
    res.redirect("/admin/songs");
  }
}

export default new Controller();

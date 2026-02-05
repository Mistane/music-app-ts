import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Like from "../../models/like.model";
import Favorite from "../../models/favorite.model";
import User from "../../models/user.model";

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
    res.render("./client/pages/songs/list", {
      pageTitle: `Danh sách bài hát thuộc ${topic.title}`,
      songs,
    });
  }

  // [GET] /songs/detail/:slugSong
  async detail(req: Request, res: Response) {
    const slugSong = req.params.slugSong;
    const song = await Song.findOne({ deleted: false, slug: slugSong });
    const singerInfo = await Singer.findOne({
      deleted: false,
      _id: song.singerId,
    });

    let checkUserLiked = false;
    let checkUserFavorite = false;
    const user = res.locals.user;
    if (user) {
      const liked = await Like.findOne({ userId: user.id, songId: song.id });
      if (liked) {
        checkUserLiked = true;
      }

      const favorite = await Favorite.findOne({
        userId: user.id,
        songId: song.id,
      });
      if (favorite) {
        checkUserFavorite = true;
      }
    }

    console.log("user like hay chua : " + checkUserLiked);
    const topic = await Topic.findOne({
      deleted: false,
      _id: song.topicId,
    }).select("title");

    song["topic"] = topic;
    song["singerInfo"] = singerInfo;
    res.render("./client/pages/songs/detail", {
      pageTitle: song.title,
      song,
      singerInfo,
      checkUserLiked,
      checkUserFavorite,
    });
  }

  // [GEt] /songs/like/:likeType/:songId
  async likeCount(req: Request, res: Response) {
    const user = req["user"];
    const likeType = req.params.likeType;
    const songId = req.params.songId;
    const song = await Song.findOne({ deleted: false, _id: songId }).select(
      "-lyrics",
    );
    const currentSongLikeCount = song.likeCount;
    let newLikeCount = 0;
    if (likeType === "no") {
      newLikeCount = currentSongLikeCount - 1;
      await Like.deleteOne({ userId: user.userId, songId: songId });
    } else {
      newLikeCount = currentSongLikeCount + 1;
      const newLike = new Like({ userId: user.userId, songId: songId });
      await newLike.save();
    }
    song["likeCount"] = newLikeCount;
    await song.save();
    return res.json({ currentSongLikeCount, newLikeCount });
  }

  //[GET] /songs/favorite/:type/:songId
  async favoriteCheck(req: Request, res: Response) {
    const user = req["user"];
    const type = req.params.type;
    const songId = req.params.songId;
    if (type === "no") {
      await Favorite.deleteOne({ userId: user.userId, songId: songId });
    } else {
      const newFavorite = new Favorite({ userId: user.userId, songId: songId });
      await newFavorite.save();
    }
    return res.json({ msg: "ADDED_TO_FAVORITE" });
  }

  // [GET] /songs/user/favorite
  async favorite(req: Request, res: Response) {
    const refreshToken = req.cookies["refreshToken"]
    const user = await User.findOne({refreshTokens: refreshToken})
    if (!user) return res.redirect("/users/login");
    const favoriteSongs = await Favorite.find({
      userId: user.id
    });

    const songs = [];
    for(const favoriteRecord of favoriteSongs){
	const song = await Song.findOne({_id : favoriteRecord.songId})
	const singerInfo = await Singer.findOne({_id : song.singerId});
      const liked = await Like.findOne({ userId: user.id, songId: song.id });
	song["singerInfo"] = singerInfo;
	if(liked) song["checkUserLiked"] = true;
	songs.push(song)
    }
    res.render("./client/pages/songs/favorite", {
      pageTitle: "Trang bài hát yêu thích",
      songs: songs,
    });
  }
}

export default new Controller();

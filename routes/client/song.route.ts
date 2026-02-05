import { Router } from "express";
import songController from "../../controllers/client/song.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkLoginMiddleware from "../../middlewares/checkLogin.middleware";
const router: Router = Router();

router.get("/:slugTopic", songController.listTopic);
router.get("/", songController.list);
router.get("/detail/:slugSong", checkLoginMiddleware, songController.detail);
router.get("/like/:likeType/:songId", authMiddleware, songController.likeCount);
router.get("/favorite/:type/:songId", authMiddleware, songController.favorite);
export default router;

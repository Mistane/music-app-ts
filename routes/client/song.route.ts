import { Router } from "express";
import songController from "../../controllers/client/song.controller";
const router: Router = Router();

router.get("/:slugTopic", songController.listTopic);
router.get("/", songController.list);
export default router;

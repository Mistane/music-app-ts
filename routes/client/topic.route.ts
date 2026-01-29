import { Router } from "express";
import topicController from "../../controllers/client/topic.controller";
const router: Router = Router();

router.get("/", topicController.topic);

export default router;

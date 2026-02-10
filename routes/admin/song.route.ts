import { Router } from "express";
import songController from "../../controllers/admin/song.controller";
import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10,
  },
});
import cloudinaryHelper from "../../helpers/uploadToCloudinary";

const router: Router = Router();

router.get("/", songController.index);
router.get("/create", songController.create);
router.post(
  "/create",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  cloudinaryHelper.uploadMany,
  songController.createPost,
);

export default router;

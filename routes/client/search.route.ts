import { Router } from "express";
import searchController from "../../controllers/client/search.controller";
const router: Router = Router();

router.get("/:type", searchController.search);

export default router;

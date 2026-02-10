import { Router } from "express";
import dashboardController from "../../controllers/admin/dashboard.controller";
const router: Router = Router();

router.get("/", dashboardController.index);

export default router;

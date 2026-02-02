import { Router } from "express";
import userController from "../../controllers/client/user.controller";
import { userMiddleware } from "../../middlewares/user.middleware";
const router: Router = Router();

router.get("/register", userController.register);
router.post(
  "/register",
  userMiddleware.registerValidationRules,
  userController.registerPost,
);
router.get("/login", userController.login);
router.post(
  "/login",
  userMiddleware.loginValidationRules,
  userController.loginPost,
);
router.get("/logout", userController.logout);
router.post("/token/refresh", userController.refresh);
export default router;

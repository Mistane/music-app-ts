import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const checkLoginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.cookies["refreshToken"]) {
    const refreshToken = req.cookies["refreshToken"];
    const user = await User.findOne({ refreshTokens: refreshToken }).select(
      "-password",
    );
    if (user) {
      res.locals.user = user;
    }
  }
  next();
};

export default checkLoginMiddleware;

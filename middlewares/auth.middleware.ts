import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Data } from "../helpers/tokenHelper";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_KEY, (error: unknown, user: Data) => {
    if (error) return res.sendStatus(403);
    else {
      console.log("token hop le");
      req["user"] = user;
      next();
    }
  });
};

export default authMiddleware;

import { Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import {
  generateAccessToken,
  genrateRefreshToken,
} from "../../helpers/tokenHelper";
import User from "../../models/user.model";
import bcrypt from "bcrypt";
const saltRounds = 10;

type InfoField = {
  fullName: string;
  email: string;
  password: string;
};

class Controller {
  // [GET] /users/register
  async register(req: Request, res: Response) {
    res.render("./client/pages/user/register", {
      pageTitle: "Trang đăng kí tài khoản",
    });
  }

  // [POST] /users/register
  async registerPost(req: Request, res: Response) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Không nhập đủ thông tin yêu cầu!" });
    }

    type registerField = InfoField;
    const { fullName, email, password }: registerField = req.body;
    const user = await User.findOne({ fullName, email });
    if (user) return res.status(409).json({ error: "User đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      msg: "Đăng kí tài khoản thành công!",
    });
  }

  // [GET] /users/login
  async login(req: Request, res: Response) {
    res.render("./client/pages/user/login", {
      pageTitle: "Trang đăng nhập",
    });
  }

  // [POST] /users/login
  async loginPost(req: Request, res: Response) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Không nhập đủ thông tin yêu cầu!" });
    }

    type loginField = Pick<InfoField, "email" | "password">;

    const { email, password }: loginField = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(409).json({ error: "Nhập sai email hoặc mật khẩu!" });
    let checkPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!checkPasswordCorrect)
      return res.status(409).json({ error: "Nhập sai email hoặc mật khẩu!" });

    const data = {
      userId: user.id,
      username: user.fullName,
    };

    const accessToken = generateAccessToken(data);
    const refreshToken = genrateRefreshToken(data);

    user.refreshTokens.push(refreshToken);
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
    });

    return res.status(201).json({
      msg: "Đăng nhập thành công",
      accessToken,
    });
  }

  // [GEt] /users/logout
  async logout(req: Request, res: Response) {
    const token = req.cookies["refreshToken"];
    if (!token) return res.sendStatus(204);

    const user = await User.findOne({ refreshTokens: token });
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      await user.save();
    }

    res.clearCookie("refreshToken");
    console.log(req.cookies["refreshToken"]);
    res.redirect("/users/login");
  }

  // [POST] /users/token/refresh
  async refresh(req: Request, res: Response) {
    const token = req.cookies["refreshToken"];
    if (!token) return res.sendStatus(401);

    const user = await User.findOne({ refreshTokens: token });
    if (!user) return res.sendStatus(403);

    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    const data = {
      userId: user.id,
      username: user.fullName,
    };

    const newAccessToken = generateAccessToken(data);
    const newRefreshToken = genrateRefreshToken(data);

    user.refreshTokens.push(newRefreshToken);
    await user.save();
    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json({ accessToken: newAccessToken });
  }
}

export default new Controller();

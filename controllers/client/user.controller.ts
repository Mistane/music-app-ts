import { Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import User from "../../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { hash } from "node:crypto";
const saltRounds = 10;

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

    type registerField = {
      fullName: string;
      email: string;
      password: string;
    };

    const { fullName, email, password }: registerField = req.body;
    const userExist = await User.findOne({ fullName, email });
    if (userExist) return res.status(409).json({ error: "User đã tồn tại!" });

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

    type loginField = {
      email: string;
      password: string;
    };

    const { email, password }: loginField = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist)
      return res.status(409).json({ error: "Nhập sai email hoặc mật khẩu!" });
    let checkPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password,
    );
    if (!checkPasswordCorrect)
      return res.status(409).json({ error: "Nhập sai email hoặc mật khẩu!" });

    const token = jwt.sign(
      {
        userId: userExist.id,
        fullName: userExist.fullName,
      },
      process.env.SECRET_KEY,
    );
    return res.status(201).json({
      msg: "Đăng nhập thành công",
      token,
    });
  }
}

export default new Controller();

import { Request, Response } from "express";
class Controller {
  // [GET] /admin/dashboard
  async index(req: Request, res: Response) {
    res.render("./admin/pages/dashboard/index", {
      pageTitle: "Trang chu",
    });
  }
}

export default new Controller();

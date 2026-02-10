import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.set("views ", "views");
app.set("view engine", "pug");

//connect to db
import * as database from "./config/database";
database.connect();

//routes
import clientRoutes from "./routes/client/index";
import adminRoutes from "./routes/admin/index";

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
  console.log("Server running at port " + port);
});

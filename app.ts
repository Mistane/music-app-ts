import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views ", "views");
app.set("view engine", "pug");

//connect to db
import * as database from "./config/database";
database.connect();

//routes
import clientRoutes from "./routes/client/index";

clientRoutes(app);

app.listen(port, () => {
  console.log("Server running at port " + port);
});

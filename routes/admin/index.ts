import systemVariables from "../../config/system";
import { Express } from "express";

import dashboardRoute from "./dashboard.route";
import topicRoute from "./topic.route";
import songRoute from "./song.route"

const adminPath = systemVariables.prefix_admin;
const route = (app: Express) => {
  app.locals.prefixAdmin = adminPath;
  app.use(`${adminPath}/dashboard`, dashboardRoute);
  app.use(`${adminPath}/topics`, topicRoute);
  app.use(`${adminPath}/songs`, songRoute)
};

export default route;

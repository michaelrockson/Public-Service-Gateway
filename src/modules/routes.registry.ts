import { Router } from "express";
import { createWeatherRouter } from "./weather/weather.routes.js";
import { createNewsRouter } from "./news/news.routes.js";
import { createCurrencyRouter } from "./currency/currency.routes.js";
import { createHolidayRouter } from "./holidays/holiday.routes.js";
import { createSportsRouter } from "./sports/sports.routes.js";
import { GatewayControllers } from "../shared/config/config.types.js";

export function createGatewayRouter(controllers: GatewayControllers): Router {
  const apiRouter = Router();

  apiRouter.use("/weather", createWeatherRouter(controllers.weatherController));
  apiRouter.use("/news", createNewsRouter(controllers.newsController));
  apiRouter.use(
    "/currency",
    createCurrencyRouter(controllers.currencyController),
  );
  apiRouter.use("/holiday", createHolidayRouter(controllers.holidayController));
  apiRouter.use("/sports", createSportsRouter(controllers.sportsController));

  return apiRouter;
}

import { Router } from "express";
import { provideWeatherRouter } from "./weather/weather.routes.js";
import { provideNewsRouter } from "./news/news.routes.js";
import { provideCurrencyRouter } from "./currency/currency.routes.js";
import { provideHolidayRouter } from "./holidays/holiday.routes.js";
import { provideSportsRouter } from "./sports/sports.routes.js";
import { GatewayControllers } from "../shared/boostrap/bootstrap.types.js";

export function useGatewayRouters(controllers: GatewayControllers): Router {
  const apiRouter = Router();

  apiRouter.use(
    "/weather",
    provideWeatherRouter(controllers.weatherController),
  );
  apiRouter.use("/news", provideNewsRouter(controllers.newsController));
  apiRouter.use(
    "/currency",
    provideCurrencyRouter(controllers.currencyController),
  );
  apiRouter.use(
    "/holiday",
    provideHolidayRouter(controllers.holidayController),
  );
  apiRouter.use("/sports", provideSportsRouter(controllers.sportsController));

  return apiRouter;
}

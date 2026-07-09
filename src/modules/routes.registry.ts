import { Router } from "express";
import { createWeatherRouter } from "./weather/weather.routes.js";
import { createNewsRouter } from "./news/news.routes.js";
import { NewsController } from "./news/news.controller.js";
import { WeatherController } from "./weather/weather.controller.js";
import { createCurrencyRouter } from "./currency/currency.routes.js";
import { CurrencyController } from "./currency/currency.controller.js";

interface ApiControllers {
  weatherController: WeatherController;
  newsController: NewsController;
  currencyController: CurrencyController;
}

/**
 * Assembles and returns the top-level Gateway router with all module
 * sub-routers mounted at their respective paths.
 *
 * @param controllers - The fully initialized module controllers.
 * @returns The configured Express router mounted under `/api`.
 */
export function createGatewayRouter(controllers: ApiControllers): Router {
  const apiRouter = Router();

  apiRouter.use("/weather", createWeatherRouter(controllers.weatherController));
  apiRouter.use("/news", createNewsRouter(controllers.newsController));
  apiRouter.use(
    "/currency",
    createCurrencyRouter(controllers.currencyController),
  );

  return apiRouter;
}

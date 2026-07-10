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

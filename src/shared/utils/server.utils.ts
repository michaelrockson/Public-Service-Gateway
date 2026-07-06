import { WeatherService } from "../../modules/weather/weather.service.js";
import { WeatherController } from "../../modules/weather/weather.controller.js";
import { NewsService } from "../../modules/news/news.service.js";
import { NewsController } from "../../modules/news/news.controller.js";
import { logBootstrapError, logBootstrapStep } from "./logger.utils.js";
import { CurrencyService } from "../../modules/currency/currency.service.js";
import { CurrencyController } from "../../modules/currency/currency.controller.js";

export function bootServices() {
  try {
    const weatherService = new WeatherService();
    const weatherController = new WeatherController(weatherService);

    const newsService = new NewsService();
    const newsController = new NewsController(newsService);

    const currencyService = new CurrencyService();
    const currencyController = new CurrencyController(currencyService);

    if (weatherService || weatherController || newsService || newsController) {
      logBootstrapStep("Module Services and Controllers were booted");
    }

    return { weatherController, newsController, currencyController };
  } catch (error) {
    logBootstrapError("Booting module services & controllers", error);
    throw new Error();
  }
}

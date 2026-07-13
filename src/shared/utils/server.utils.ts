import { WeatherService } from "../../modules/weather/weather.service.js";
import { WeatherController } from "../../modules/weather/weather.controller.js";
import { NewsService } from "../../modules/news/news.service.js";
import { NewsController } from "../../modules/news/news.controller.js";
import { logBootstrapError, logBootstrapStep } from "./logger.utils.js";
import { CurrencyService } from "../../modules/currency/currency.service.js";
import { CurrencyController } from "../../modules/currency/currency.controller.js";
import { HolidayService } from "../../modules/holidays/holiday.service.js";
import { HolidayController } from "../../modules/holidays/holiday.controller.js";
import { SportsService } from "../../modules/sports/sports.service.js";
import { SportsController } from "../../modules/sports/sports.controller.js";
import { validateGatewayResources } from "./config/config.utils.js";
import { GatewayControllers, GatewayServices } from "./config/config.types.js";

export function bootServices() {
  try {
    const weatherService = new WeatherService();
    const weatherController = new WeatherController(weatherService);

    const newsService = new NewsService();
    const newsController = new NewsController(newsService);

    const currencyService = new CurrencyService();
    const currencyController = new CurrencyController(currencyService);

    const holidayService = new HolidayService();
    const holidayController = new HolidayController(holidayService);

    const sportsService = new SportsService();
    const sportsController = new SportsController(sportsService);

    const bootedServices: GatewayServices = {
      "Weather Service": weatherService,
      "News Service": newsService,
      "Currency Service": currencyService,
      "Holiday Service": holidayService,
      "Sports Service": sportsService,
    };

    const bootedControllers: GatewayControllers = {
      "Weather Controller": weatherController,
      "News Controller": newsController,
      "Currency Controller": currencyController,
      "Holiday Controller": holidayController,
      "Sports Controller": sportsController,
    };

    validateGatewayResources(bootedControllers, bootedServices);

    return {
      weatherController,
      newsController,
      currencyController,
      holidayController,
      sportsController,
    };
  } catch (error) {
    logBootstrapError("Booting module services & controllers", error);
    throw new Error();
  }
}

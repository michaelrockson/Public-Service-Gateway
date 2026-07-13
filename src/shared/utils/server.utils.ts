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
import {
  unpackResourceControllers,
  validateGatewayResources,
} from "./config/config.utils.js";
import { GatewayControllers, GatewayServices } from "./config/config.types.js";
import { registerGatewayResources } from "../../modules/resource.registry.js";

export function bootGatewayResources() {
  try {
    const registeredResources = registerGatewayResources();

    return unpackResourceControllers(registeredResources);
  } catch (error) {
    logBootstrapError("Booting module services & controllers", error);
    throw new Error();
  }
}

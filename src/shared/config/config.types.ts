import { WeatherController } from "../../modules/weather/weather.controller.js";
import { NewsController } from "../../modules/news/news.controller.js";
import { CurrencyController } from "../../modules/currency/currency.controller.js";
import { HolidayController } from "../../modules/holidays/holiday.controller.js";
import { SportsController } from "../../modules/sports/sports.controller.js";
import { WeatherService } from "../../modules/weather/weather.service.js";
import { NewsService } from "../../modules/news/news.service.js";
import { CurrencyService } from "../../modules/currency/currency.service.js";
import { HolidayService } from "../../modules/holidays/holiday.service.js";
import { SportsService } from "../../modules/sports/sports.service.js";
import { IConfig } from "../interfaces/config.interface.js";
import { ILogger } from "../interfaces/logger.interface.js";
import { IResponseHandler } from "../interfaces/response-handler.interface.js";

export type SharedDependencies = {
  config: IConfig;
  logger: ILogger;
  responseHandler: IResponseHandler;
};

export type GatewayControllers = {
  weatherController: WeatherController;
  newsController: NewsController;
  currencyController: CurrencyController;
  holidayController: HolidayController;
  sportsController: SportsController;
};

export type GatewayServices = {
  weatherService: WeatherService;
  newsService: NewsService;
  currencyService: CurrencyService;
  holidayService: HolidayService;
  sportsService: SportsService;
};

export type ModuleResourcesProvider =
  | { name: "weather"; service: WeatherService; controller: WeatherController }
  | { name: "news"; service: NewsService; controller: NewsController }
  | {
      name: "currency";
      service: CurrencyService;
      controller: CurrencyController;
    }
  | { name: "holiday"; service: HolidayService; controller: HolidayController }
  | { name: "sports"; service: SportsService; controller: SportsController };

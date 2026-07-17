import { WeatherController } from "../modules/weather/weather.controller.js";
import { NewsController } from "../modules/news/news.controller.js";
import { CurrencyController } from "../modules/currency/currency.controller.js";
import { HolidayController } from "../modules/holidays/holiday.controller.js";
import { SportsController } from "../modules/sports/sports.controller.js";
import { ILogger } from "../app/interfaces/infrastructure/logger.interface.js";
import { IResponseHandler } from "../app/interfaces/infrastructure/response.handler.interface.js";
import {
  IModuleSecretsRegistry,
  ISystemSecretsRegistry,
} from "../app/interfaces/config/index.interface.js";

export type SharedDependencies = {
  systemEnvs: ISystemSecretsRegistry;
  moduleEnvs: IModuleSecretsRegistry;
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

export type ModuleControllersProvider =
  | { name: "weather"; controller: WeatherController }
  | { name: "news"; controller: NewsController }
  | {
      name: "currency";
      controller: CurrencyController;
    }
  | { name: "holiday"; controller: HolidayController }
  | { name: "sports"; controller: SportsController };

import { WeatherController } from "../../../modules/weather/weather.controller.js";
import { NewsController } from "../../../modules/news/news.controller.js";
import { CurrencyController } from "../../../modules/currency/currency.controller.js";
import { HolidayController } from "../../../modules/holidays/holiday.controller.js";
import { SportsController } from "../../../modules/sports/sports.controller.js";
import { WeatherService } from "../../../modules/weather/weather.service.js";
import { NewsService } from "../../../modules/news/news.service.js";
import { CurrencyService } from "../../../modules/currency/currency.service.js";
import { HolidayService } from "../../../modules/holidays/holiday.service.js";
import { SportsService } from "../../../modules/sports/sports.service.js";

export type GatewayControllers = {
  "Weather Controller": WeatherController;
  "News Controller": NewsController;
  "Currency Controller": CurrencyController;
  "Holiday Controller": HolidayController;
  "Sports Controller": SportsController;
};

export type GatewayServices = {
  "Weather Service": WeatherService;
  "News Service": NewsService;
  "Currency Service": CurrencyService;
  "Holiday Service": HolidayService;
  "Sports Service": SportsService;
};

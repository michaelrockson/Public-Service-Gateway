import { provideWeatherResources } from "./weather/weather.provider.js";
import { provideCurrencyResources } from "./currency/currency.provider.js";
import { provideNewsResources } from "./news/news.provider.js";
import { provideHolidayResources } from "./holidays/holiday.provider.js";
import { provideSportsResources } from "./sports/sports.provider.js";
import { validateGatewayResources } from "../shared/utils/config/config.utils.js";
import {
  GatewayControllers,
  GatewayServices,
} from "../shared/utils/config/config.types.js";

export function registerGatewayResources(): GatewayControllers {
  const weather = provideWeatherResources();
  const news = provideNewsResources();
  const currency = provideCurrencyResources();
  const holiday = provideHolidayResources();
  const sports = provideSportsResources();

  const gatewayServicesRegistry: GatewayServices = {
    weatherService: weather.service,
    newsService: news.service,
    currencyService: currency.service,
    holidayService: holiday.service,
    sportsService: sports.service,
  };

  const gatewayControllerRegistry: GatewayControllers = {
    weatherController: weather.controller,
    newsController: news.controller,
    currencyController: currency.controller,
    holidayController: holiday.controller,
    sportsController: sports.controller,
  };

  validateGatewayResources(gatewayControllerRegistry, gatewayServicesRegistry);

  return gatewayControllerRegistry;
}

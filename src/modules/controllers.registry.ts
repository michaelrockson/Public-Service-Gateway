import {
  GatewayControllers,
  SharedDependencies,
} from "../bootstrap/bootstrap.types.js";
import { validateGatewayControllers } from "../bootstrap/bootstrap.utils.js";
import { provideWeatherController } from "./weather/weather.provider.js";
import { provideNewsController } from "./news/news.provider.js";
import { provideCurrencyController } from "./currency/currency.provider.js";
import { provideHolidayController } from "./holidays/holiday.provider.js";
import { provideSportsController } from "./sports/sports.provider.js";

export function registerGatewayControllers(
  deps: SharedDependencies,
): GatewayControllers {
  const weather = provideWeatherController(deps);
  const news = provideNewsController(deps);
  const currency = provideCurrencyController(deps);
  const holiday = provideHolidayController(deps);
  const sports = provideSportsController(deps);

  const gatewayControllerRegistry: GatewayControllers = {
    weatherController: weather.controller,
    newsController: news.controller,
    currencyController: currency.controller,
    holidayController: holiday.controller,
    sportsController: sports.controller,
  };

  validateGatewayControllers(deps.logger, gatewayControllerRegistry);

  return gatewayControllerRegistry;
}

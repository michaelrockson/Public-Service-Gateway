import { provideWeatherResources } from "./weather/weather.provider.js";
import { provideCurrencyResources } from "./currency/currency.provider.js";
import { provideNewsResources } from "./news/news.provider.js";
import { provideHolidayResources } from "./holidays/holiday.provider.js";
import { provideSportsResources } from "./sports/sports.provider.js";
import {
  GatewayControllers,
  SharedDependencies,
} from "../shared/boostrap/gateway.types.js";
import { validateGatewayControllers } from "../shared/boostrap/bootstrap.utils.js";

export function registerGatewayControllers(
  deps: SharedDependencies,
): GatewayControllers {
  const weather = provideWeatherResources(deps);
  const news = provideNewsResources(deps);
  const currency = provideCurrencyResources(deps);
  const holiday = provideHolidayResources(deps);
  const sports = provideSportsResources(deps);

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

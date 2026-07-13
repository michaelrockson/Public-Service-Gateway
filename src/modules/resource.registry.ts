import { provideWeatherResources } from "./weather/weather.provider.js";
import { provideCurrencyResources } from "./currency/currency.provider.js";
import { provideNewsResources } from "./news/news.provider.js";
import { provideHolidayResources } from "./holidays/holiday.provider.js";
import { provideSportsResources } from "./sports/sports.provider.js";
import { validateGatewayResources } from "../shared/utils/config/config.utils.js";

export function registerGatewayResources() {
  const gatewayServicesRegistry = {
    weather: provideWeatherResources().service,
    news: provideNewsResources().service,
    currency: provideCurrencyResources().service,
    holiday: provideHolidayResources().service,
    sports: provideSportsResources().service,
  };

  const gatewayControllerRegistry = {
    weather: provideWeatherResources().controller,
    news: provideNewsResources().controller,
    currency: provideCurrencyResources().controller,
    holiday: provideHolidayResources().controller,
    sports: provideSportsResources().controller,
  };

  validateGatewayResources(gatewayControllerRegistry, gatewayServicesRegistry);

  return gatewayControllerRegistry;
}

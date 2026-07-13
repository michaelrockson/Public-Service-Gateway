import { WeatherService } from "./weather.service.js";
import { WeatherController } from "./weather.controller.js";
import { ModuleResourcesProvider } from "../../shared/utils/config/config.types.js";

export function provideWeatherResources(): ModuleResourcesProvider {
  const weatherService = new WeatherService();
  const weatherController = new WeatherController(weatherService);

  return {
    name: "weather",
    service: weatherService,
    controller: weatherController,
  };
}

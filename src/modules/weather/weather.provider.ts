import { WeatherService } from "./weather.service.js";
import { WeatherController } from "./weather.controller.js";
import {
  ModuleResourcesProvider,
  SharedDependencies,
} from "../../shared/boostrap/gateway.types.js";
import { AxiosHttpClient } from "../../shared/http/axios.client.js";

export function provideWeatherResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "weather" }> {
  const weatherHttpClient = new AxiosHttpClient(
    deps.config.weatherApiUrl,
    deps.config.weatherApiKey,
    "appid",
  );
  const weatherService = new WeatherService(weatherHttpClient);
  const weatherController = new WeatherController(
    weatherService,
    deps.responseHandler,
  );

  return {
    name: "weather",
    service: weatherService,
    controller: weatherController,
  };
}

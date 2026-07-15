import { WeatherService } from "./weather.service.js";
import { WeatherController } from "./weather.controller.js";
import {
  ModuleControllersProvider,
  SharedDependencies,
} from "../../shared/boostrap/bootstrap.types.js";
import { AxiosHttpClient } from "../../shared/http/axios.client.js";

export function provideWeatherController(
  deps: SharedDependencies,
): Extract<ModuleControllersProvider, { name: "weather" }> {
  const weatherHttpClient = new AxiosHttpClient(
    deps.moduleConfig.weatherApiUrl,
    deps.moduleConfig.weatherApiKey,
    "appid",
  );
  const weatherService = new WeatherService(weatherHttpClient);
  const weatherController = new WeatherController(
    weatherService,
    deps.responseHandler,
  );

  return {
    name: "weather",
    controller: weatherController,
  };
}

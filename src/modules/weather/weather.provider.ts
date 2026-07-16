import { WeatherService } from "./weather.service.js";
import { WeatherController } from "./weather.controller.js";
import {
  ModuleControllersProvider,
  SharedDependencies,
} from "../../shared/bootstrap/bootstrap.types.js";
import { AxiosHttpClient } from "../../shared/http/clients/axios.client.js";

export function provideWeatherController(
  deps: SharedDependencies,
): Extract<ModuleControllersProvider, { name: "weather" }> {
  const currentHttpClient = new AxiosHttpClient(
    deps.moduleConfig.weatherApiUrl,
    deps.moduleConfig.weatherApiKey,
    "appid",
  );
  const weatherService = new WeatherService(currentHttpClient);
  const weatherController = new WeatherController(
    weatherService,
    deps.responseHandler,
  );

  return {
    name: "weather",
    controller: weatherController,
  };
}

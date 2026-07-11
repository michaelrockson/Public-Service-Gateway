import { CurrentWeatherParams } from "./weather.types.js";
import { envProvider } from "../../shared/env.config.js";
import { BaseService } from "../../shared/services/base.service.js";

export class WeatherService extends BaseService {
  constructor() {
    super(envProvider.weatherApiUrl, envProvider.weatherApiKey, "appid");
  }

  async getCurrentWeather(weatherParams: CurrentWeatherParams) {
    return this.executeRequest("weather", weatherParams);
  }

  async getWeatherForecast(weatherParams: CurrentWeatherParams) {
    return this.executeRequest("forecast", weatherParams);
  }
}

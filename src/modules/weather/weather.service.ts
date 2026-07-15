import { CurrentWeatherParams } from "./weather.types.js";
import { BaseService } from "../../shared/http/base.service.js";
import { IHttpClient } from "../../shared/interfaces/infrastructure/http.interface.js";

export class WeatherService extends BaseService {
  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  async getCurrentWeather(weatherParams: CurrentWeatherParams) {
    return this.executeRequest("weather", weatherParams);
  }

  async getWeatherForecast(weatherParams: CurrentWeatherParams) {
    return this.executeRequest("forecast", weatherParams);
  }
}

import { CurrentWeatherParams } from "./weather.types.js";
import { BaseService } from "../../shared/services/base.service.js";
import { IHttpClient } from "../../shared/interfaces/http.interface.js";

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

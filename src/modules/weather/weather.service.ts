import { CurrentWeatherParams } from "./weather.types.js";
import { HttpService } from "../../shared/http.service.js";
import { envProvider } from "../../shared/env.config.js";

export class WeatherService {
  private readonly weatherApiUrl: string;
  private readonly weatherApiKey: string;
  private readonly httpService: HttpService;

  constructor() {
    this.weatherApiKey = envProvider.weatherApiKey;
    this.weatherApiUrl = envProvider.weatherApiUrl;
    this.httpService = new HttpService(
      this.weatherApiUrl,
      this.weatherApiKey,
      "appid",
    );
  }

  async getCurrentWeather(weatherParams: CurrentWeatherParams) {
    try {
      const response = await this.httpService.makeApiRequest(
        "weather",
        weatherParams,
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  async getWeatherForecast(weatherParams: CurrentWeatherParams) {
    try {
      const response = await this.httpService.makeApiRequest(
        "forecast",
        weatherParams,
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }
}

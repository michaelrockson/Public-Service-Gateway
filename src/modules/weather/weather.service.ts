import { CurrentWeatherParams } from "./weather.model";
import { HttpService } from "../../shared/http.service";
import { config } from "../../env.config";

export class WeatherService {
  private readonly weatherApiUrl: string;
  private readonly weatherApiKey: string;
  private readonly httpService: HttpService;

  constructor() {
    this.weatherApiKey = config.weatherApiKey;
    this.weatherApiUrl = config.weatherApiUrl;
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

let weatherService: WeatherService = new WeatherService();

export default weatherService;

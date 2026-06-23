import dotenv from "dotenv";
import { CurrentWeatherParams } from "./weather.model";
import { HttpService } from "../../shared/http.service";

dotenv.config();

export class WeatherService {
  private readonly weatherApiUrl: string;
  private readonly weatherApiKey: string;
  private readonly httpService: HttpService;

  constructor() {
    const { WEATHER_API_KEY, WEATHER_API_URL } = process.env;

    if (!WEATHER_API_KEY || !WEATHER_API_URL) {
      throw new Error("Missing weather module environment variables");
    }

    this.weatherApiKey = WEATHER_API_KEY;
    this.weatherApiUrl = WEATHER_API_URL;
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
      this.httpService.handleServiceErrors(error);
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
      this.httpService.handleServiceErrors(error);
    }
  }
}

let weatherService: WeatherService = new WeatherService();

export default weatherService;

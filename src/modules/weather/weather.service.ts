import dotenv from "dotenv";
import { CurrentWeatherParams } from "./weather.model";
import {
  handleRequestErrors,
  makeCurrentWeatherRequest,
} from "./weather.utils";

dotenv.config();

export class WeatherService {
  private readonly weatherApiUrl: string;
  private readonly weatherApiKey: string;

  constructor() {
    const { WEATHER_API_KEY, WEATHER_API_URL } = process.env;

    if (!WEATHER_API_KEY || !WEATHER_API_URL) {
      throw new Error("Missing weather module environment variables");
    }

    this.weatherApiKey = WEATHER_API_KEY;
    this.weatherApiUrl = WEATHER_API_URL;
  }

  async getCurrentWeather(weatherParams: CurrentWeatherParams) {
    try {
      const response = await makeCurrentWeatherRequest(
        weatherParams,
        this.weatherApiUrl,
        this.weatherApiKey,
      );
      return response.data;
    } catch (error) {
      handleRequestErrors(error);
    }
  }
}

let weatherService: WeatherService = new WeatherService();

export default weatherService;

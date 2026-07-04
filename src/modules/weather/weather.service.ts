import { CurrentWeatherParams } from "./weather.model.js";
import { HttpService } from "../../shared/http.service.js";
import { envProvider } from "../../shared/env.config.js";

/**
 * Handles all outbound requests to the OpenWeatherMap API.
 *
 * Reads `weatherApiUrl` and `weatherApiKey` from the env provider at
 * construction time, instantiates only after `populateEnvProvider()`
 * has been called in `server.ts`.
 */
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

  /**
   * Fetches the current weather for a given location.
   *
   * @param weatherParams - Query parameters including `lat` and `lon`.
   * @returns The current weather data from OpenWeatherMap.
   * @throws {Error} If the API request fails.
   */
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

  /**
   * Fetches a multi-day weather forecast for a given location.
   *
   * @param weatherParams - Query parameters including `lat` and `lon`.
   * @returns The forecast data from OpenWeatherMap.
   * @throws {Error} If the API request fails.
   */
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

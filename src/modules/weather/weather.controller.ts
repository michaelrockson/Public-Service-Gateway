import weatherService, { WeatherService } from "./weather.service";
import {
  parseWeatherParams,
  validateWeatherParams,
  validateWeatherResponse,
} from "./utils/weather.controller.utils";
import { CurrentWeatherParams } from "./weather.model";

export class WeatherController {
  private readonly httpClient: WeatherService;

  constructor() {
    this.httpClient = weatherService;
  }

  async handleCurrentWeatherRequest(req: any, res: any) {
    return this.handleWeatherRequest(
      req,
      res,
      (params) => this.httpClient.getCurrentWeather(params),
      "currentWeather",
    );
  }

  async handleForecastWeatherRequest(req: any, res: any) {
    return this.handleWeatherRequest(
      req,
      res,
      (params) => this.httpClient.getWeatherForecast(params),
      "forecastWeather",
    );
  }

  private async handleWeatherRequest(
    req: any,
    res: any,
    fetchFunction: (params: CurrentWeatherParams) => Promise<any>,
    responseKey: string,
  ) {
    const weatherParams = parseWeatherParams(req);
    validateWeatherParams(weatherParams, res);

    const weatherResponse = await fetchFunction(weatherParams);

    validateWeatherResponse(weatherResponse, res);
    return res.status(200).json({ [responseKey]: weatherResponse });
  }
}

let weatherController: WeatherController = new WeatherController();

export default weatherController;

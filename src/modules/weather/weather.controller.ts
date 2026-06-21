import weatherService, { WeatherService } from "./weather.service";
import {
  parseWeatherParams,
  validateWeatherParams,
  validateWeatherResponse,
} from "./weather.utils";

export class WeatherController {
  private readonly httpClient: WeatherService;

  constructor() {
    this.httpClient = weatherService;
  }

  async handleCurrentWeatherRequest(req: any, res: any) {
    const weatherParams = parseWeatherParams(req);

    validateWeatherParams(weatherParams, res);

    const weatherResponse =
      await this.httpClient.getCurrentWeather(weatherParams);

    validateWeatherResponse(weatherResponse, res);
    return res.status(200).json({ currentWeather: weatherResponse });
  }
}

let weatherController: WeatherController = new WeatherController();

export default weatherController;

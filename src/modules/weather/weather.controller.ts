import weatherService, { WeatherService } from "./weather.service";
import {
  parseWeatherParams,
  validateWeatherParams,
  validateWeatherResponse,
} from "./utils/weather.controller.utils";
import { CurrentWeatherParams } from "./weather.model";
import { ControllerResponseHandler } from "../../shared/controller.handler";

export class WeatherController {
  private readonly httpClient: WeatherService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor() {
    this.httpClient = weatherService;
    this.responseHandler = new ControllerResponseHandler();
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
    try {
      const weatherParams = parseWeatherParams(req);
      validateWeatherParams(weatherParams, res);

      const weatherResponse = await fetchFunction(weatherParams);

      validateWeatherResponse(weatherResponse, res);
      return this.responseHandler.successResponse(
        res,
        "Weather data fetched successfully",
        { [responseKey]: weatherResponse },
      );
    } catch (error) {
      console.log(error);
      this.responseHandler.internalServerError(
        res,
        "Failed to process weather request",
      );
    }
  }
}

let weatherController: WeatherController = new WeatherController();

export default weatherController;

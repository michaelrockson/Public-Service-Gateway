import { Request, Response } from "express";
import { WeatherService } from "./weather.service.js";
import responseHandler, {
  ControllerResponseHandler,
} from "../../shared/http.controller.js";

export class WeatherController {
  private readonly httpClient: WeatherService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor(weatherService: WeatherService) {
    this.httpClient = weatherService;
    this.responseHandler = responseHandler;
  }

  async handleCurrentWeatherRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getCurrentWeather(params),
      "currentWeather",
      ["lat", "lon"],
    );
  }

  async handleForecastWeatherRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getWeatherForecast(params),
      "forecastWeather",
      ["lat", "lon"],
    );
  }
}

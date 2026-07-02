import { Request, Response } from "express";
import weatherService, { WeatherService } from "./weather.service";
import { ControllerResponseHandler } from "../../shared/routes.controller";

export class WeatherController {
  private readonly httpClient: WeatherService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor() {
    this.httpClient = weatherService;
    this.responseHandler = new ControllerResponseHandler();
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

let weatherController: WeatherController = new WeatherController();

export default weatherController;

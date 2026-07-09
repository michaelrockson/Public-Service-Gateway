import { Request, Response } from "express";
import { WeatherService } from "./weather.service.js";
import { ControllerResponseHandler } from "../../shared/http.controller.js";

export class WeatherController {
  private readonly httpClient: WeatherService;
  private readonly responseHandler: ControllerResponseHandler;

  /**
   * @param weatherService - The initialized weather service instance,
   *   provided by `bootServices()` in `server.ts`.
   */
  constructor(weatherService: WeatherService) {
    this.httpClient = weatherService;
    this.responseHandler = new ControllerResponseHandler();
  }

  /**
   * Handles `GET /weather/current`.
   * Required query params: `lat`, `lon`.
   */
  async handleCurrentWeatherRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getCurrentWeather(params),
      "currentWeather",
      ["lat", "lon"],
    );
  }

  /**
   * Handles `GET /weather/forecast`.
   * Required query params: `lat`, `lon`.
   */
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

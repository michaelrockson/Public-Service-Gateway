import { Request, Response, Router } from "express";
import weatherController, { WeatherController } from "./weather.controller";

export const weatherRouter = Router();
const weatherRequestHandler: WeatherController = weatherController;

weatherRouter.get(
  "/current",
  async (req: Request, res: Response): Promise<void> => {
    await weatherRequestHandler.handleCurrentWeatherRequest(req, res);
  },
);

weatherRouter.get(
  "/forecast",
  async (req: Request, res: Response): Promise<void> => {
    await weatherRequestHandler.handleForecastWeatherRequest(req, res);
  },
);

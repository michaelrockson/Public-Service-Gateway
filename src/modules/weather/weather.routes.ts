import { Request, Response, Router } from "express";
import weatherController, { WeatherController } from "./weather.controller";

export const weatherRouter = Router();
const requestHandler: WeatherController = weatherController;

weatherRouter.get("/current", async (req: Request, res: Response) => {
  await requestHandler.handleCurrentWeatherRequest(req, res);
});

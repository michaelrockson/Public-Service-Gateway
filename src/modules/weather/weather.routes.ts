import { Request, Response, Router } from "express";
import { WeatherController } from "./weather.controller.js";

/**
 * Creates and returns the weather module router with all routes mounted.
 *
 * @param weatherController - The initialized weather controller instance.
 * @returns The configured Express router for the `/weather` prefix.
 */
export function createWeatherRouter(
  weatherController: WeatherController,
): Router {
  const weatherRouter = Router();

  weatherRouter.get(
    "/current",
    async (req: Request, res: Response): Promise<void> => {
      await weatherController.handleCurrentWeatherRequest(req, res);
    },
  );

  weatherRouter.get(
    "/forecast",
    async (req: Request, res: Response): Promise<void> => {
      await weatherController.handleForecastWeatherRequest(req, res);
    },
  );

  return weatherRouter;
}

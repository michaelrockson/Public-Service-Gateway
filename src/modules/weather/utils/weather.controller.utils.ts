import { Request, Response } from "express";
import { CurrentWeatherParams } from "../weather.model";

/**
 * Parses latitude and longitude from the request query string.
 *
 * @param req - Incoming Express request.
 */
export function parseWeatherParams(req: Request) {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  return { lat, lon };
}

/**
 * Validates that weather query parameters are present and numeric.
 *
 * @param weatherParams - Parsed weather query parameters.
 * @param res - Express response object.
 */
export function validateWeatherParams(
  weatherParams: CurrentWeatherParams,
  res: Response,
) {
  if (!weatherParams.lat || !weatherParams.lon) {
    res.status(400).json({
      error: "lat and lon query params are required and must be numbers",
    });
    return;
  }
}

/**
 * Validates that the weather response exists before sending it.
 *
 * @param weatherResponse - Response data from the weather API.
 * @param res - Express response object.
 */
export function validateWeatherResponse(
  weatherResponse: unknown,
  res: Response,
) {
  if (!weatherResponse) {
    res.status(404).json({
      message: "current weather is unavailable",
    });
    return;
  }
}

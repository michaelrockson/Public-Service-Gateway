import { Request, Response } from "express";
import { CurrentWeatherParams } from "../weather.model";
import responseHandler from "../../../shared/controller.handler";

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
 * @param res
 */
export function validateWeatherParams(
  weatherParams: CurrentWeatherParams,
  res: Response,
) {
  if (!weatherParams.lat || !weatherParams.lon) {
    responseHandler.badRequest(
      res,
      "Missing required query parameters: lat and lon",
    );
  }
}

/**
 * Validates that the weather response exists before sending it.
 *
 * @param weatherResponse - Response data from the weather API.
 * @param res
 */
export function validateWeatherResponse(
  weatherResponse: unknown,
  res: Response,
) {
  if (!weatherResponse) {
    responseHandler.notFound(res, "current weather is unavailable");
  }
}

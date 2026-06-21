import axios from "axios";
import { Request, Response } from "express";
import { CurrentWeatherParams } from "./weather.model";

/**
 * Fetches current weather data from the external weather API.
 *
 * @param weatherParams - Coordinates to request weather for.
 * @param weatherApiUrl - Base URL for the weather API.
 * @param weatherApiKey - API key for authenticating the request.
 */
export async function makeCurrentWeatherRequest(
  weatherParams: CurrentWeatherParams,
  weatherApiUrl: string,
  weatherApiKey: string,
) {
  return await axios.get(`${weatherApiUrl}`, {
    params: {
      lat: weatherParams.lat,
      lon: weatherParams.lon,
      appid: weatherApiKey,
    },
  });
}

/**
 * Normalizes errors from Axios requests and throws a readable Error.
 *
 * @param error - The caught error from an API request.
 */
export function handleRequestErrors(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(
        `Weather API error: ${error.response.status} ${JSON.stringify(error.response.data)}`,
      );
    }

    if (error.request) {
      throw new Error("Weather API did not respond (network/timeout)");
    }
  }
  throw new Error(
    `Unexpected error fetching weather: ${(error as Error).message}`,
  );
}

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

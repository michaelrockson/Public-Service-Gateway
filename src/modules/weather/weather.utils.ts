import axios from "axios";
import { Request, Response } from "express";
import { CurrentWeatherParams } from "./weather.model";

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

export function parseWeatherParams(req: Request) {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  return { lat, lon };
}

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

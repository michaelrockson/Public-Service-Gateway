import axios from "axios";
import { CurrentWeatherParams } from "../weather.model";

/**
 * Fetches data from a weather API endpoint using coordinates.
 *
 * @param endpoint - API path segment, example: "weather" or "forecast".
 * @param weatherParams - Coordinates to request weather for.
 * @param weatherApiUrl - Base URL for the weather API.
 * @param weatherApiKey - API key for authenticating the request.
 */
async function makeWeatherApiRequest(
  endpoint: string,
  weatherParams: CurrentWeatherParams,
  weatherApiUrl: string,
  weatherApiKey: string,
) {
  return await axios.get(`${weatherApiUrl}/${endpoint}`, {
    params: {
      lat: weatherParams.lat,
      lon: weatherParams.lon,
      appid: weatherApiKey,
    },
  });
}

/**
 * Fetches current weather data from the external weather API.
 */
export async function makeCurrentWeatherRequest(
  weatherParams: CurrentWeatherParams,
  weatherApiUrl: string,
  weatherApiKey: string,
) {
  return makeWeatherApiRequest(
    "weather",
    weatherParams,
    weatherApiUrl,
    weatherApiKey,
  );
}

/**
 * Fetches 5-day weather forecast from the external weather API.
 */
export async function makeWeatherForecastRequest(
  weatherParams: CurrentWeatherParams,
  weatherApiUrl: string,
  weatherApiKey: string,
) {
  return makeWeatherApiRequest(
    "forecast",
    weatherParams,
    weatherApiUrl,
    weatherApiKey,
  );
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

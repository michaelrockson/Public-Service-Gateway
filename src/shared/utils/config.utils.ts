import dotenv from "dotenv";
import path from "path";
import { WeatherService } from "../../modules/weather/weather.service.js";
import { WeatherController } from "../../modules/weather/weather.controller.js";
import { NewsService } from "../../modules/news/news.service.js";
import { NewsController } from "../../modules/news/news.controller.js";

export const envPath = path.join(process.cwd(), ".env");

dotenv.config({
  path: envPath,
});

export function validateSecrets(secrets: Record<string, unknown>) {
  let missingSecrets: string[] = [];

  for (const [key, value] of Object.entries(secrets)) {
    if (value === undefined || value === null || value === "") {
      missingSecrets.push(key);
    }
  }

  if (missingSecrets.length > 0) {
    throw new Error(
      `${missingSecrets.length} missing environment variable(s): 
      ${missingSecrets.join(", ")}`,
    );
  }
}

export function getEnvVar(key: string, fallback?: string): string {
  const value: string | undefined = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getEnvNumber(key: string, fallback?: number): number {
  const raw: string | undefined = process.env[key];
  if (raw === undefined) {
    if (fallback === undefined) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return fallback;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} must be a number, got: ${raw}`,
    );
  }
  return parsed;
}
export function validateInfisicalCredentials(
  clientId: string,
  clientSecret: string,
) {
  if (!clientId || !clientSecret) {
    throw new Error("Missing infisical credentials for authentication");
  }
}

export function bootServices() {
  const weatherService = new WeatherService();
  const weatherController = new WeatherController(weatherService);

  const newsService = new NewsService();
  const newsController = new NewsController(newsService);

  return { weatherController, newsController };
}

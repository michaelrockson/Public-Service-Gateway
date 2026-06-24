import dotenv from "dotenv";

dotenv.config();

function getEnvVar(key: string, fallback?: string): string {
  const value: string | undefined = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvNumber(key: string, fallback?: number): number {
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

export const config = {
  environment: getEnvVar("ENVIRONMENT", "dev"),
  isProduction: getEnvVar("ENVIRONMENT", "dev") === "prod",
  port: getEnvNumber("PORT", 3000),
  logLevel: getEnvVar("LOG_LEVEL", "info"),
  weatherApiUrl: getEnvVar("WEATHER_API_URL"),
  weatherApiKey: getEnvVar("WEATHER_API_KEY"),
  newsApiUrl: getEnvVar("NEWS_API_URL"),
  newsApiKey: getEnvVar("NEWS_API_KEY"),
} as const;

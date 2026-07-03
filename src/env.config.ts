import {
  getEnvNumber,
  getEnvVar,
  validateSecrets,
} from "./shared/utils/config.utils";

export const config = {
  environment: getEnvVar("ENVIRONMENT", "dev"),
  isProduction: getEnvVar("ENVIRONMENT", "dev") === "prod",
  port: getEnvNumber("PORT", 3000),
  logLevel: getEnvVar("LOG_LEVEL", "info"),
  weatherApiUrl: getEnvVar("WEATHER_API_URL", ""),
  weatherApiKey: getEnvVar("WEATHER_API_KEY", ""),
  newsApiUrl: getEnvVar("NEWS_API_URL", ""),
  newsApiKey: getEnvVar("NEWS_API_KEY", ""),
} as const;

validateSecrets(config);

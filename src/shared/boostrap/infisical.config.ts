import { InfisicalSDK } from "@infisical/sdk";
import dotenv from "dotenv";
import path from "path";
import {
  logProcess,
  logProcessError,
  consoleLogger,
} from "../logger/logger.utils.js";
import {
  getEnvNumber,
  getEnvVar,
  validateEnvs,
  validateInfisicalCredentials,
  validateInfisicalSecrets,
} from "./bootstrap.utils.js";

export async function injectSecretsFromInfisical() {
  dotenv.config({ path: path.join(process.cwd(), ".env") });

  try {
    const siteUrl = getEnvVar("INFISICAL_SITE_URL");
    const clientId = getEnvVar("INFISICAL_CLIENT_ID");
    const clientSecret = getEnvVar("INFISICAL_CLIENT_SECRET");
    const environment = getEnvVar("INFISICAL_ENVIRONMENT");
    const projectId = getEnvVar("INFISICAL_PROJECT_ID");

    validateEnvs({ siteUrl, clientId, clientSecret, environment, projectId });
    validateInfisicalCredentials(clientId, clientSecret);

    logProcess(consoleLogger, "Authenticating Infisical Client.....");
    const client = new InfisicalSDK({ siteUrl });
    const infisicalClient = await client.auth().universalAuth.login({
      clientId,
      clientSecret,
    });
    if (infisicalClient) {
      logProcess(consoleLogger, "Infisical Client Authenticated!");
    }

    logProcess(consoleLogger, "Fetching Secrets from Infisical.....");
    await client.secrets().listSecrets({
      environment,
      projectId,
      attachToProcessEnv: true,
    });

    const config = {
      environment: getEnvVar("ENVIRONMENT", "dev"),
      port: getEnvNumber("PORT", 3000),
      logLevel: getEnvVar("LOG_LEVEL", "info"),
      weatherApiUrl: getEnvVar("WEATHER_API_URL", ""),
      weatherApiKey: getEnvVar("WEATHER_API_KEY", ""),
      newsApiUrl: getEnvVar("NEWS_API_URL", ""),
      newsApiKey: getEnvVar("NEWS_API_KEY", ""),
      currencyApiUrl: getEnvVar("CURRENCY_API_URL", ""),
      currencyApiKey: getEnvVar("CURRENCY_API_KEY", ""),
      holidayApiUrl: getEnvVar("HOLIDAY_API_URL", ""),
      sportsApiUrl: getEnvVar("SPORTS_API_URL", ""),
      sportsApiKey: getEnvVar("SPORTS_API_KEY", ""),
    } as const;

    validateInfisicalSecrets(config);
    return config;
  } catch (error) {
    logProcessError(consoleLogger, "injectSecretsFromInfisical", error);
    throw new Error(`Error fetching secrets from Infisical: ${error}`);
  }
}

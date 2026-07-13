import { InfisicalSDK } from "@infisical/sdk";
import {
  getEnvNumber,
  getEnvVar,
  validateEnvs,
  validateInfisicalCredentials,
  validateInfisicalSecrets,
} from "../utils/config/config.utils.js";
import { logProcess, logProcessError } from "../utils/logger.utils.js";

export class InfisicalService {
  private readonly client: InfisicalSDK;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly environment: string;
  private readonly projectId: string;
  private readonly infisicalConfig;

  constructor() {
    this.infisicalConfig = this.getInfisicalConfig();
    this.client = new InfisicalSDK({
      siteUrl: this.infisicalConfig.siteUrl,
    });
    this.clientId = this.infisicalConfig.clientId;
    this.clientSecret = this.infisicalConfig.clientSecret;
    this.environment = this.infisicalConfig.environment;
    this.projectId = this.infisicalConfig.projectId;
  }

  async authenticate_infisical_client() {
    validateInfisicalCredentials(this.clientId, this.clientSecret);

    try {
      logProcess("Authenticating Infisical Client.....");

      const infisicalClient = await this.client.auth().universalAuth.login({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      });

      if (infisicalClient) {
        logProcess("Infisical Client Authenticated!");
      }
    } catch (error) {
      logProcessError(`Authenticating Infisical Client:`, error);
    }
  }

  async injectInfisicalSecrets() {
    try {
      logProcess("Fetching Secrets from Infisical.....");

      await this.client.secrets().listSecrets({
        environment: this.environment,
        projectId: this.projectId,
        attachToProcessEnv: true,
      });
    } catch (error) {
      logProcessError(`Fetching Infisical Secrets:`, error);
    }
  }

  private getInfisicalConfig() {
    const config = {
      siteUrl: getEnvVar("INFISICAL_SITE_URL"),
      clientId: getEnvVar("INFISICAL_CLIENT_ID"),
      clientSecret: getEnvVar("INFISICAL_CLIENT_SECRET"),
      environment: getEnvVar("INFISICAL_ENVIRONMENT"),
      projectId: getEnvVar("INFISICAL_PROJECT_ID"),
    } as const;

    validateEnvs(config);
    return config;
  }
}

export async function injectSecretsFromInfisical() {
  try {
    let infisicalEnvs = new InfisicalService();

    await infisicalEnvs.authenticate_infisical_client();
    await infisicalEnvs.injectInfisicalSecrets();

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
    throw new Error(`Error fetching secrets from infisical ${error}`);
  }
}

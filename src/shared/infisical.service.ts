import { InfisicalSDK } from "@infisical/sdk";
import {
  getEnvNumber,
  getEnvVar,
  validateInfisicalCredentials,
  validateSecrets,
} from "./utils/config.utils";

export const infisicalConfig = {
  siteUrl: getEnvVar("INFISICAL_SITE_URL"),
  clientId: getEnvVar("INFISICAL_CLIENT_ID"),
  clientSecret: getEnvVar("INFISICAL_CLIENT_SECRET"),
  environment: getEnvVar("INFISICAL_ENVIRONMENT"),
  projectId: getEnvVar("INFISICAL_PROJECT_ID"),
} as const;

validateSecrets(infisicalConfig);

export class InfisicalService {
  private readonly client: InfisicalSDK;
  private readonly siteUrl: string = infisicalConfig.siteUrl;
  private readonly clientId: string = infisicalConfig.clientId;
  private readonly clientSecret: string = infisicalConfig.clientSecret;
  private readonly environment: string = infisicalConfig.environment;
  private readonly projectId: string = infisicalConfig.projectId;

  constructor() {
    this.client = new InfisicalSDK({
      siteUrl: this.siteUrl,
    });
  }

  async authenticate_infisical_client() {
    validateInfisicalCredentials(this.clientId, this.clientSecret);

    try {
      await this.client.auth().universalAuth.login({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      });
    } catch (error) {
      throw new Error(`Error authenticating Infisical Client: ${error}`);
    }
  }

  async injectInfisicalSecrets() {
    try {
      const { secrets } = await this.client.secrets().listSecrets({
        environment: this.environment,
        projectId: this.projectId,
      });

      for (const secret of secrets) {
        process.env[secret.secretKey] = secret.secretValue;
      }
    } catch (error) {
      throw new Error(`Error fetching Infisical Secrets: ${error}`);
    }
  }
}

let infisicalEnvs = new InfisicalService();

export async function injectSecretsFromInfisical() {
  try {
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
    } as const;

    validateSecrets(config);

    return config;
  } catch (error) {
    throw new Error(`Error fetching secrets from infisical`);
  }
}

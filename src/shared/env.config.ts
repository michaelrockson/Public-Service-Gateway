interface AppConfig {
  environment: string;
  port: number;
  logLevel: string;
  weatherApiUrl: string;
  weatherApiKey: string;
  newsApiUrl: string;
  newsApiKey: string;
}

export const envProvider = {} as AppConfig;

/**
 * Populates the shared `envProvider` with the resolved application config.
 *
 * @param config - The fully resolved and validated `AppConfig` returned
 * by `injectSecretsFromInfisical()`.
 *
 * Must be called exactly once during server startup, after
 * `injectSecretsFromInfisical()` returns and before `setServices()` runs.
 * Calling it more than once will silently overwrite existing values.
 */
export function populateEnvProvider(config: AppConfig) {
  Object.assign(envProvider, config);
}

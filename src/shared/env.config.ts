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

export function populateEnvProvider(config: AppConfig) {
  Object.assign(envProvider, config);
}

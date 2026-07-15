import { IConfig } from "./interfaces/config.interface.js";

export class ConfigService implements IConfig {
  public readonly environment: string;
  public readonly port: number;
  public readonly logLevel: string;
  public readonly weatherApiUrl: string;
  public readonly weatherApiKey: string;
  public readonly newsApiUrl: string;
  public readonly newsApiKey: string;
  public readonly currencyApiUrl: string;
  public readonly currencyApiKey: string;
  public readonly holidayApiUrl: string;
  public readonly sportsApiUrl: string;
  public readonly sportsApiKey: string;

  constructor(config: IConfig) {
    this.environment = config.environment;
    this.port = config.port;
    this.logLevel = config.logLevel;
    this.weatherApiUrl = config.weatherApiUrl;
    this.weatherApiKey = config.weatherApiKey;
    this.newsApiUrl = config.newsApiUrl;
    this.newsApiKey = config.newsApiKey;
    this.currencyApiUrl = config.currencyApiUrl;
    this.currencyApiKey = config.currencyApiKey;
    this.holidayApiUrl = config.holidayApiUrl;
    this.sportsApiUrl = config.sportsApiUrl;
    this.sportsApiKey = config.sportsApiKey;
  }
}

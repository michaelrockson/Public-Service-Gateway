import { IModuleConfig } from "../interfaces/config/config.interface.js";

export class ModuleConfigService implements IModuleConfig {
  public readonly weatherApiUrl: string;
  public readonly weatherApiKey: string;
  public readonly newsApiUrl: string;
  public readonly newsApiKey: string;
  public readonly currencyApiUrl: string;
  public readonly currencyApiKey: string;
  public readonly holidayApiUrl: string;
  public readonly sportsApiUrl: string;
  public readonly sportsApiKey: string;

  constructor(config: IModuleConfig) {
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

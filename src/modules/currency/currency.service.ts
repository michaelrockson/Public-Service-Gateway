import { envProvider } from "../../shared/env.config.js";
import { BaseService } from "../../shared/services/base.service.js";

export class CurrencyService extends BaseService {
  constructor() {
    super(envProvider.currencyApiUrl, envProvider.currencyApiKey, "access_key");
  }

  async getLiveRates(currencyParams: Record<string, string>): Promise<any> {
    return this.executeRequest("live", currencyParams);
  }

  async getHistoricalRates(
    currencyParams: Record<string, string>,
  ): Promise<any> {
    return this.executeRequest("historical", currencyParams);
  }

  async getConversionRates(
    currencyParams: Record<string, string>,
  ): Promise<any> {
    return this.executeRequest("convert", currencyParams);
  }

  async getTimeframeRates(
    currencyParams: Record<string, string>,
  ): Promise<any> {
    return this.executeRequest("timeframe", currencyParams);
  }

  async getChangeRates(currencyParams: Record<string, string>): Promise<any> {
    return this.executeRequest("change", currencyParams);
  }

  async getAllSupportedCurrencies(
    currencyParams: Record<string, string>,
  ): Promise<any> {
    return this.executeRequest("list", currencyParams);
  }
}

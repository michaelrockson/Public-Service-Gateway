import { BaseService } from "../../shared/http/base.service.js";
import { IHttpClient } from "../../shared/interfaces/infrastructure/http.interface.js";

export class CurrencyService extends BaseService {
  constructor(httpClient: IHttpClient) {
    super(httpClient);
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

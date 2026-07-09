import { HttpService } from "../../shared/http.service.js";
import { envProvider } from "../../shared/env.config.js";

export class CurrencyService {
  private readonly currencyApiUrl: string;
  private readonly currencyApiKey: string;
  private readonly httpService: HttpService;

  constructor() {
    this.currencyApiKey = envProvider.currencyApiKey;
    this.currencyApiUrl = envProvider.currencyApiUrl;
    this.httpService = new HttpService(
      this.currencyApiUrl,
      this.currencyApiKey,
      "access_key",
    );
  }

  async getLiveRates(currencyParams: Record<string, string>): Promise<void> {
    try {
      const response = await this.httpService.makeApiRequest(
        "live",
        currencyParams,
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }
}

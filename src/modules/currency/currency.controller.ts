import { Request, Response } from "express";
import { CurrencyService } from "./currency.service.js";
import { ControllerResponseHandler } from "../../shared/http.controller.js";

export class CurrencyController {
  private readonly httpClient: CurrencyService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor(currencyService: CurrencyService) {
    this.httpClient = currencyService;
    this.responseHandler = new ControllerResponseHandler();
  }

  async handleLiveRateRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getLiveRates(params),
      "Live Currency Rates",
      ["symbols"],
    );
  }

  async handleHistoricalRateRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getLiveRates(params),
      "Historical Rates",
      ["date"],
    );
  }
}

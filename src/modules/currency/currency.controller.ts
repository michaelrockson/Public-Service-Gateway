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
      (params) => this.httpClient.getHistoricalRates(params),
      "Historical Rates",
      ["date"],
    );
  }

  async handleConversionRateRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getConversionRates(params),
      "Conversion Rates",
      ["from", "to", "amount"],
    );
  }

  async handleTimeFrameRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getTimeframeRates(params),
      "Timeframe Rates",
      ["start_date", "end_date"],
    );
  }

  async handleChangeRateRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getChangeRates(params),
      "Changed Rates",
      ["start_date", "end_date"],
    );
  }

  async handleAllCurrenciesRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params) => this.httpClient.getAllSupportedCurrencies(params),
      "All Supported Currencies",
    );
  }
}

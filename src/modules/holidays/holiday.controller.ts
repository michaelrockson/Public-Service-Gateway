import { Request, Response } from "express";
import { HolidayService } from "./holiday.service.js";
import { ControllerResponseHandler } from "../../shared/http.controller.js";
import { PublicHolidaysParams } from "./holiday.types.js";

export class HolidayController {
  private readonly httpClient: HolidayService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor(holidayService: HolidayService) {
    this.httpClient = holidayService;
    this.responseHandler = new ControllerResponseHandler();
  }

  async handlePublicHolidaysRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: PublicHolidaysParams) =>
        this.httpClient.getPublicHolidays(params),
      "Public Holidays",
      ["year", "countryCode"],
    );
  }

  async handleNextPublicHolidaysRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: PublicHolidaysParams) =>
        this.httpClient.getNextPublicHolidays(params),
      "Next Public Holidays",
      ["countryCode"],
    );
  }

  async handleNextPublicHolidaysWorldwideRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: PublicHolidaysParams) =>
        this.httpClient.getNextPublicHolidaysWorldwide(params),
      "Next Public Holidays Worldwide",
    );
  }

  async handleAvailableCountriesRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: PublicHolidaysParams) =>
        this.httpClient.getAvailableCountries(params),
      "Available Countries",
    );
  }

  async handleCountryInfoRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: PublicHolidaysParams) => this.httpClient.getCountryInfo(params),
      "Country Info",
      ["countryCode"],
    );
  }

  async handleLongWeekendRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: PublicHolidaysParams) => this.httpClient.getLongWeekend(params),
      "Long Weekend",
      ["year", "countryCode"],
    );
  }

  async handleIsTodayPublicHolidayRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: PublicHolidaysParams) =>
        this.httpClient.IsTodayPublicHoliday(params),
      "Is Today Public Holiday",
      ["countryCode"],
    );
  }
}

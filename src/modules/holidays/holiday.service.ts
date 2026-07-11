import { HttpService } from "../../shared/http.service.js";
import { envProvider } from "../../shared/env.config.js";
import { HolidayResponse, PublicHolidaysParams } from "./holiday.types.js";

export class HolidayService {
  private readonly holidayApiUrl: string;
  private readonly httpService: HttpService;

  constructor() {
    this.holidayApiUrl = envProvider.holidayApiUrl;
    this.httpService = new HttpService(this.holidayApiUrl, "", "");
  }

  async getPublicHolidays(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    try {
      const response = await this.httpService.makeApiRequest(
        "PublicHolidays",
        "",
        [`${holidayParams.year}`, `${holidayParams.countryCode}`],
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  async getNextPublicHolidays(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    try {
      const response = await this.httpService.makeApiRequest(
        "NextPublicHolidays",
        "",
        [`${holidayParams.countryCode}`],
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  async getNextPublicHolidaysWorldwide(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    try {
      const response = await this.httpService.makeApiRequest(
        "NextPublicHolidaysWorldwide",
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  async getAvailableCountries(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    try {
      const response =
        await this.httpService.makeApiRequest("AvailableCountries");
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  async getCountryInfo(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    try {
      const response = await this.httpService.makeApiRequest(
        "CountryInfo",
        "",
        [`${holidayParams.countryCode}`],
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  async getLongWeekend(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    try {
      const response = await this.httpService.makeApiRequest(
        "LongWeekend",
        "",
        [`${holidayParams.year}`, `${holidayParams.countryCode}`],
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  async IsTodayPublicHoliday(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined | boolean> {
    try {
      const response = await this.httpService.makeApiRequest(
        "IsTodayPublicHoliday",
        "",
        [`${holidayParams.countryCode}`],
      );
      if (response.status === 200) return true;
      if (response.status === 204) return false;
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }
}

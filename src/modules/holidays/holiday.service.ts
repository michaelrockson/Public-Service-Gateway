import { HolidayResponse, PublicHolidaysParams } from "./holiday.types.js";
import { BaseService } from "../../shared/http/base.service.js";
import { IHttpClient } from "../../shared/interfaces/infrastructure/http.interface.js";

export class HolidayService extends BaseService {
  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  async getPublicHolidays(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    return this.executeRequest("PublicHolidays", "", [
      `${holidayParams.year}`,
      `${holidayParams.countryCode}`,
    ]);
  }

  async getNextPublicHolidays(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    return this.executeRequest("NextPublicHolidays", "", [
      `${holidayParams.countryCode}`,
    ]);
  }

  async getNextPublicHolidaysWorldwide(): Promise<HolidayResponse | undefined> {
    return this.executeRequest("NextPublicHolidaysWorldwide");
  }

  async getAvailableCountries(): Promise<HolidayResponse | undefined> {
    return this.executeRequest("AvailableCountries");
  }

  async getCountryInfo(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    return this.executeRequest("CountryInfo", "", [
      `${holidayParams.countryCode}`,
    ]);
  }

  async getLongWeekend(
    holidayParams: PublicHolidaysParams,
  ): Promise<HolidayResponse | undefined> {
    return this.executeRequest("LongWeekend", "", [
      `${holidayParams.year}`,
      `${holidayParams.countryCode}`,
    ]);
  }

  async IsTodayPublicHoliday(
    holidayParams: PublicHolidaysParams,
  ): Promise<unknown> {
    const response = await this.executeRawRequest("IsTodayPublicHoliday", "", [
      `${holidayParams.countryCode}`,
    ]);
    if (response) {
      if (response.status === 200) return true;
      if (response.status === 204) return false;
      return response.data;
    }
  }
}

import { IHttpClient } from "../../app/interfaces/infrastructure/http.interface.js";
import {
  AccumulatedPrecipitationParams,
  AccumulatedTempParams,
  CoordParams,
  GetPolygonParams,
  NdviHistoryParams,
  UviForecastParams,
  UviHistoryParams,
} from "./agro.types.js";

export class AgroService {
  private readonly httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async postPolygons() {
    try {
      const response = await this.httpClient.makeApiRequest(`polygons`);
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getPolygons() {
    try {
      const response = await this.httpClient.makeApiRequest(
        "polygons",
        undefined,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getSpecificPolygons(polygonsParams: GetPolygonParams) {
    try {
      const response = await this.httpClient.makeApiRequest(
        `polygons/${polygonsParams.polygonId}`,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async deletePolygons(polygonsParams: GetPolygonParams) {
    try {
      const response = await this.httpClient.makeApiRequest(
        `polygons/${polygonsParams.polygonId}`,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getPolygonWeather() {
    try {
      const response = await this.httpClient.makeApiRequest(
        "weather/forcast",
        undefined,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getPolygonWeatherHistory() {
    try {
      const response = await this.httpClient.makeApiRequest(
        "weather/history",
        undefined,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getPolygonCurrentHistory() {
    try {
      const response = await this.httpClient.makeApiRequest("soil", undefined);
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getCurrentUvi(params: CoordParams) {
    try {
      const response = await this.httpClient.makeApiRequest("uvi", params);
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getUviForecast(params: UviForecastParams) {
    try {
      const response = await this.httpClient.makeApiRequest(
        "uvi/forecast",
        params,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getUviHistory(params: UviHistoryParams) {
    try {
      const response = await this.httpClient.makeApiRequest(
        "uvi/history",
        params,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getAccumulatedTemperature(params: AccumulatedTempParams) {
    try {
      const response = await this.httpClient.makeApiRequest("temp", params);
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getAccumulatedPrecipitation(params: AccumulatedPrecipitationParams) {
    try {
      const response = await this.httpClient.makeApiRequest(
        "precipitation",
        params,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }

  async getNdviHistory(params: NdviHistoryParams) {
    try {
      const response = await this.httpClient.makeApiRequest(
        "ndvi/history",
        params,
      );
      return response.data;
    } catch (error) {
      this.httpClient.handleApiErrors(error);
    }
  }
}

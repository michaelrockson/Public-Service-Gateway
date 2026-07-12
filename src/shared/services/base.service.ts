import { HttpService } from "./http.service.js";
import { AxiosResponse } from "axios";

export abstract class BaseService {
  protected readonly httpService: HttpService;

  protected constructor(
    apiUrl: string,
    apiKey: string = "",
    apiKeyQueryParamName: string = "",
  ) {
    this.httpService = new HttpService(apiUrl, apiKey, apiKeyQueryParamName);
  }

  /**
   * Wrapper for making API requests to automatically handle try-catch
   * and generic error reporting. Returns the `data` of the response.
   */
  protected async executeRequest<T = unknown>(
    endpoint?: string,
    queryParams?: any,
    pathParams?: string[],
  ): Promise<T | undefined> {
    try {
      const response = await this.httpService.makeApiRequest(
        endpoint,
        queryParams,
        pathParams,
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  /**
   * Wrapper for making API requests to automatically handle try-catch
   * and generic error reporting. Returns the full Axios response object.
   * Useful when the status code is needed.
   */
  protected async executeRawRequest<T = unknown>(
    endpoint?: string,
    queryParams?: any,
    pathParams?: string[],
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.httpService.makeApiRequest(
        endpoint,
        queryParams,
        pathParams,
      );
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }
}

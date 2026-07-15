import { IHttpClient } from "../interfaces/http.interface.js";

export abstract class BaseService {
  protected readonly httpService: IHttpClient;

  protected constructor(httpService: IHttpClient) {
    this.httpService = httpService;
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
      const response = await this.httpService.makeApiRequest<T>(
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
   * and generic error reporting. Returns the full response object.
   * Useful when the status code is needed.
   */
  protected async executeRawRequest<T = unknown>(
    endpoint?: string,
    queryParams?: any,
    pathParams?: string[],
  ): Promise<{ data: T; status?: number } | undefined> {
    try {
      return await this.httpService.makeApiRequest<T>(
        endpoint,
        queryParams,
        pathParams,
      );
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }
}

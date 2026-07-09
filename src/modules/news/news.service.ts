import { HttpService } from "../../shared/http.service.js";
import { envProvider } from "../../shared/env.config.js";
import { NewsSearchParams } from "./news.types.js";

export class NewsService {
  private readonly newsApiUrl: string;
  private readonly newsApiKey: string;
  private readonly httpService: HttpService;

  constructor() {
    this.newsApiKey = envProvider.newsApiKey;
    this.newsApiUrl = envProvider.newsApiUrl;
    this.httpService = new HttpService(
      this.newsApiUrl,
      this.newsApiKey,
      "apiKey",
    );
  }

  /**
   * Fetches news articles matching a search query.
   *
   * @param newsParams - Query parameters including `q` (search term).
   * @returns Matching articles from the NewsAPI `/everything` endpoint.
   * @throws {Error} If the API request fails.
   */
  async getNewsArticles(newsParams: NewsSearchParams) {
    try {
      const response = await this.httpService.makeApiRequest(
        "/everything",
        newsParams,
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }

  /**
   * Fetches current top headlines, optionally filtered by country.
   *
   * @param newsParams - Query parameters including `country`.
   * @returns Top headlines from the NewsAPI `/top-headlines` endpoint.
   * @throws {Error} If the API request fails.
   */
  async getTopHeadlines(newsParams: NewsSearchParams) {
    try {
      const response = await this.httpService.makeApiRequest(
        "/top-headlines",
        newsParams,
      );
      return response.data;
    } catch (error) {
      this.httpService.handleApiErrors(error);
    }
  }
}

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

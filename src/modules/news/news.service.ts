import { HttpService } from "../../shared/http.service";
import { config } from "../../env.config";
import { NewsSearchParams } from "./news.model";

export class NewsService {
  private readonly newsApiUrl: string;
  private readonly newsApiKey: string;
  private readonly httpService: HttpService;

  constructor() {

    this.newsApiKey =  config.newsApiKey;
    this.newsApiUrl = config.newsApiUrl;
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

let newsService: NewsService = new NewsService();
export default newsService;

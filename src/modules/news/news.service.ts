import { HttpService } from "../../shared/http.service";
import { config } from "../../env.config";
import { NewsSearchParams } from "./news.model";

export class NewsService {
  private readonly newsApiUrl: string;
  private readonly newsApiKey: string;
  private readonly httpService: HttpService;

  constructor() {
    const NEWS_API_KEY = config.newsApiKey;
    const NEWS_API_URL = config.newsApiUrl;

    if (!NEWS_API_KEY || !NEWS_API_URL) {
      throw new Error("Missing news module environment variables");
    }

    this.newsApiKey = NEWS_API_KEY;
    this.newsApiUrl = NEWS_API_URL;
    this.httpService = new HttpService(
      this.newsApiUrl,
      this.newsApiKey,
      "apiKey",
    );
  }

  async getAllNewsArticles(newsParams: NewsSearchParams) {
    try {
      const response = await this.httpService.makeApiRequest(
        "v2/everything",
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

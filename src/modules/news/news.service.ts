import { envProvider } from "../../shared/env.config.js";
import { NewsSearchParams } from "./news.types.js";
import { BaseService } from "../../shared/services/base.service.js";

export class NewsService extends BaseService {
  constructor() {
    super(envProvider.newsApiUrl, envProvider.newsApiKey, "apiKey");
  }

  async getNewsArticles(newsParams: NewsSearchParams) {
    return this.executeRequest("everything", newsParams);
  }

  async getTopHeadlines(newsParams: NewsSearchParams) {
    return this.executeRequest("top-headlines", newsParams);
  }
}

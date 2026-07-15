import { NewsSearchParams } from "./news.types.js";
import { BaseService } from "../../shared/services/base.service.js";
import { IHttpClient } from "../../shared/interfaces/http.interface.js";

export class NewsService extends BaseService {
  constructor(httpClient: IHttpClient) {
    super(httpClient);
  }

  async getNewsArticles(newsParams: NewsSearchParams) {
    return this.executeRequest("everything", newsParams);
  }

  async getTopHeadlines(newsParams: NewsSearchParams) {
    return this.executeRequest("top-headlines", newsParams);
  }
}

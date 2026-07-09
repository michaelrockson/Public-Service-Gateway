import { Request, Response } from "express";
import { NewsService } from "./news.service.js";
import { ControllerResponseHandler } from "../../shared/http.controller.js";
import { NewsSearchParams } from "./news.types.js";

export class NewsController {
  private readonly httpClient: NewsService;
  private readonly responseHandler: ControllerResponseHandler;

  /**
   * @param newsService - The initialized news service instance,
   *   provided by `setServices()` in `server.ts`.
   */
  constructor(newsService: NewsService) {
    this.httpClient = newsService;
    this.responseHandler = new ControllerResponseHandler();
  }

  /**
   * Handles `GET /news/topic`.
   * Required query params: `q`.
   */
  async handleGetNewsArticlesRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: NewsSearchParams) => this.httpClient.getNewsArticles(params),
      "Related Article(s)",
      ["q"],
    );
  }

  /**
   * Handles `GET /news/top-headlines`.
   * Required query params: `country`.
   */
  async handleGetTopHeadlines(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: NewsSearchParams) => this.httpClient.getTopHeadlines(params),
      "Top Headlines",
      ["country"],
    );
  }
}

import { Request, Response } from "express";
import newsService, { NewsService } from "./news.service";
import { ControllerResponseHandler } from "../../shared/http.controller";
import { NewsSearchParams } from "./news.model";

export class NewsController {
  private readonly httpClient: NewsService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor() {
    this.httpClient = newsService;
    this.responseHandler = new ControllerResponseHandler();
  }

  async handleGetNewsArticlesRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: NewsSearchParams) => this.httpClient.getNewsArticles(params),
      "Related Article(s)",
      ["q"],
    );
  }

  async handleGetTopHeadlines(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
        req,
        res,
        (params: NewsSearchParams) => this.httpClient.getTopHeadlines(params),
        "Top Headlines",
        ["country"],
    )
  }

}

let newsController = new NewsController();

export default newsController;

import { Request, Response } from "express";
import newsService, { NewsService } from "./news.service";
import { ControllerResponseHandler } from "../../shared/controller.handler";
import { NewsSearchParams } from "./news.model";

export class NewsController {
  private readonly httpClient: NewsService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor() {
    this.httpClient = newsService;
    this.responseHandler = new ControllerResponseHandler();
  }

  async handleGetAllNewsArticlesRequest(req: Request, res: Response) {}

  private async handleNewsRequest(
    req: Request,
    res: Response,
    fetchFunction: (params: NewsSearchParams) => Promise<any>,
    responseKey: string,
  ) {}
}

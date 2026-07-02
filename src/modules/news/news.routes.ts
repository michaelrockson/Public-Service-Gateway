import { Request, Response, Router } from "express";
import newsController, { NewsController } from "./news.controller";

export const newsRouter = Router();
const newsRequestHandler: NewsController = newsController;

newsRouter.get("/topic", async (req: Request, res: Response): Promise<void> => {
  await newsRequestHandler.handleGetAllNewsArticlesRequest(req, res);
});

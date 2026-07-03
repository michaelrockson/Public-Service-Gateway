import { Request, Response, Router } from "express";
import newsController, { NewsController } from "./news.controller";

export const newsRouter = Router();
const newsRequestHandler: NewsController = newsController;

newsRouter.get("/topic", async (req: Request, res: Response): Promise<void> => {
  await newsRequestHandler.handleGetNewsArticlesRequest(req, res);
});

newsRouter.get(
  "/top-headlines",
  async (req: Request, res: Response): Promise<void> => {
    await newsRequestHandler.handleGetTopHeadlines(req, res);
  },
);

import { Request, Response, Router } from "express";
import { NewsController } from "./news.controller.js";

/**
 * Creates and returns the news module router with all routes mounted.
 *
 * @param newsController - The initialized news controller instance.
 * @returns The configured Express router for the `/news` prefix.
 */
export function createNewsRouter(newsController: NewsController): Router {
  const newsRouter = Router();

  newsRouter.get(
    "/topic",
    async (req: Request, res: Response): Promise<void> => {
      await newsController.handleGetNewsArticlesRequest(req, res);
    },
  );

  newsRouter.get(
    "/top-headlines",
    async (req: Request, res: Response): Promise<void> => {
      await newsController.handleGetTopHeadlines(req, res);
    },
  );

  return newsRouter;
}

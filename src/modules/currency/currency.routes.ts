import { Request, Response, Router } from "express";
import { CurrencyController } from "./currency.controller.js";

export function createCurrencyRouter(
  currencyController: CurrencyController,
): Router {
  const currencyRouter = Router();

  currencyRouter.get(
    "/live",
    async (req: Request, res: Response): Promise<void> => {
      await currencyController.handleLiveRateRequest(req, res);
    },
  );

  return currencyRouter;
}

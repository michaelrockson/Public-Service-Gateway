import { Request, Response, Router } from "express";
import { CurrencyController } from "./currency.controller.js";

export function createCurrencyRouter(
  currencyController: CurrencyController,
): Router {
  const currencyRouter = Router();

  currencyRouter.get(
    "/latest",
    async (req: Request, res: Response): Promise<void> => {
      await currencyController.handleCurrencyRateRequest(req, res);
    },
  );

  return currencyRouter;
}

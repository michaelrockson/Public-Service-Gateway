import { Request, Response, Router } from "express";
import { SportsController } from "./sports.controller.js";

export function createSportsRouter(sportsController: SportsController): Router {
  const sportsRouter = Router();

  sportsRouter.get(
    "/searchTeams",
    async (req: Request, res: Response): Promise<void> => {
      await sportsController.handleSearchedTeamsRequest(req, res);
    },
  );

  sportsRouter.get(
    "/searchEvents",
    async (req: Request, res: Response): Promise<void> => {
      await sportsController.handleSearchedEventsRequest(req, res);
    },
  );

  sportsRouter.get(
    "/searchPlayers",
    async (req: Request, res: Response): Promise<void> => {
      await sportsController.handleSearchedPlayersRequest(req, res);
    },
  );

  sportsRouter.get(
    "/searchVenues",
    async (req: Request, res: Response): Promise<void> => {
      await sportsController.handleSearchVenuesRequest(req, res);
    },
  );

  return sportsRouter;
}

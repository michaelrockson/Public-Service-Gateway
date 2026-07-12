import { Request, Response } from "express";
import { SportsService } from "./sports.service.js";
import { ControllerResponseHandler } from "../../shared/http.controller.js";
import {
  SearchEventsParams,
  SearchPlayersParams,
  SearchTeamsParams,
  SearchVenuesParams,
} from "./sports.types.js";

export class SportsController {
  private readonly httpClient: SportsService;
  private readonly responseHandler: ControllerResponseHandler;

  constructor(sportsService: SportsService) {
    this.httpClient = sportsService;
    this.responseHandler = new ControllerResponseHandler();
  }

  async handleSearchedTeamsRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: SearchTeamsParams) => this.httpClient.getSearchedTeams(params),
      "Sports Teams",
      ["t"],
    );
  }

  async handleSearchedEventsRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: SearchEventsParams) => this.httpClient.getSearchedEvents(params),
      "Sports Events",
      ["events", "seasons"],
    );
  }

  async handleSearchedPlayersRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: SearchPlayersParams) =>
        this.httpClient.getSearchedPlayers(params),
      "Team Players",
      ["player(s)"],
    );
  }

  async handleSearchVenuesRequest(req: Request, res: Response) {
    return this.responseHandler.handleRequest(
      req,
      res,
      (params: SearchVenuesParams) => this.httpClient.getSearchedVenues(params),
      "Sports Venues",
      ["Venue(s)"],
    );
  }
}

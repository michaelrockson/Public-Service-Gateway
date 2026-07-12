import { BaseService } from "../../shared/services/base.service.js";
import { envProvider } from "../../shared/env.config.js";
import {
  EventsResponse,
  PlayersResponse,
  SearchEventsParams,
  SearchPlayersParams,
  SearchTeamsParams,
  SearchVenuesParams,
  TeamsResponse,
  VenuesResponse,
} from "./sports.types.js";

export class SportsService extends BaseService {
  constructor() {
    super(envProvider.sportsApiUrl, envProvider.sportsApiKey);
  }

  async getSearchedTeams(
    sportsParams: SearchTeamsParams,
  ): Promise<TeamsResponse | undefined> {
    return this.executeRequest("searchteams.php", sportsParams.t, [
      envProvider.sportsApiKey,
    ]);
  }

  async getSearchedEvents(
    sportsParams: SearchEventsParams,
  ): Promise<EventsResponse | undefined> {
    return this.executeRequest("searchevents.php", sportsParams, [
      envProvider.sportsApiKey,
    ]);
  }

  async getSearchedPlayers(
    sportsParams: SearchPlayersParams,
  ): Promise<PlayersResponse | undefined> {
    return this.executeRequest("searchplayers.php", sportsParams, [
      envProvider.sportsApiKey,
    ]);
  }

  async getSearchedVenues(
    sportsParams: SearchVenuesParams,
  ): Promise<VenuesResponse | undefined> {
    return this.executeRequest("searchvenues.php", sportsParams, [
      envProvider.sportsApiKey,
    ]);
  }
}

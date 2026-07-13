import { BaseService } from "../../shared/services/base.service.js";
import { envProvider } from "../../shared/env.config.js";
import {
  EventsResponse,
  LeaguesResponse,
  LookupByIdParams,
  LookupTableParams,
  PlayersResponse,
  SearchEventsParams,
  SearchPlayersParams,
  SearchTeamsParams,
  SearchVenuesParams,
  TableResponse,
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
    return this.executeRequest(
      `${envProvider.sportsApiKey}/searchteams.php`,
      sportsParams,
    );
  }

  async getSearchedEvents(
    sportsParams: SearchEventsParams,
  ): Promise<EventsResponse | undefined> {
    return this.executeRequest(
      `${envProvider.sportsApiKey}/searchevents.php`,
      sportsParams,
    );
  }

  async getSearchedPlayers(
    sportsParams: SearchPlayersParams,
  ): Promise<PlayersResponse | undefined> {
    return this.executeRequest(
      `${envProvider.sportsApiKey}/searchplayers.php`,
      sportsParams,
    );
  }

  async getSearchedVenues(
    sportsParams: SearchVenuesParams,
  ): Promise<VenuesResponse | undefined> {
    return this.executeRequest(
      `${envProvider.sportsApiKey}/searchvenues.php`,
      sportsParams,
    );
  }

  async getLookupLeague(
    sportsParams: LookupByIdParams,
  ): Promise<LeaguesResponse | undefined> {
    return this.executeRequest(
      `${envProvider.sportsApiKey}/lookupleague.php`,
      sportsParams,
    );
  }

  async getLookupTable(
    sportsParams: LookupTableParams,
  ): Promise<TableResponse | undefined> {
    return this.executeRequest(
      `${envProvider.sportsApiKey}/lookuptable.php`,
      sportsParams,
    );
  }
}

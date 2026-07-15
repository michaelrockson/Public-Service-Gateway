import { BaseService } from "../../shared/services/base.service.js";
import { IHttpClient } from "../../shared/interfaces/http.interface.js";
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
  private readonly apiKey: string;

  constructor(httpClient: IHttpClient, apiKey: string) {
    super(httpClient);
    this.apiKey = apiKey;
  }

  async getSearchedTeams(
    sportsParams: SearchTeamsParams,
  ): Promise<TeamsResponse | undefined> {
    return this.executeRequest(
      `${this.apiKey}/searchteams.php`,
      sportsParams,
    );
  }

  async getSearchedEvents(
    sportsParams: SearchEventsParams,
  ): Promise<EventsResponse | undefined> {
    return this.executeRequest(
      `${this.apiKey}/searchevents.php`,
      sportsParams,
    );
  }

  async getSearchedPlayers(
    sportsParams: SearchPlayersParams,
  ): Promise<PlayersResponse | undefined> {
    return this.executeRequest(
      `${this.apiKey}/searchplayers.php`,
      sportsParams,
    );
  }

  async getSearchedVenues(
    sportsParams: SearchVenuesParams,
  ): Promise<VenuesResponse | undefined> {
    return this.executeRequest(
      `${this.apiKey}/searchvenues.php`,
      sportsParams,
    );
  }

  async getLookupLeague(
    sportsParams: LookupByIdParams,
  ): Promise<LeaguesResponse | undefined> {
    return this.executeRequest(
      `${this.apiKey}/lookupleague.php`,
      sportsParams,
    );
  }

  async getLookupTable(
    sportsParams: LookupTableParams,
  ): Promise<TableResponse | undefined> {
    return this.executeRequest(
      `${this.apiKey}/lookuptable.php`,
      sportsParams,
    );
  }
}

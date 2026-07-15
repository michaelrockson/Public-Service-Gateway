import { SportsService } from "./sports.service.js";
import { SportsController } from "./sports.controller.js";
import {
  ModuleResourcesProvider,
  SharedDependencies,
} from "../../shared/config/config.types.js";
import { AxiosHttpClient } from "../../shared/services/http.service.js";

export function provideSportsResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "sports" }> {
  const sportsHttpClient = new AxiosHttpClient(
    deps.config.sportsApiUrl,
    deps.config.sportsApiKey,
    "",
  );
  const sportsService = new SportsService(
    sportsHttpClient,
    deps.config.sportsApiKey,
  );
  const sportsController = new SportsController(
    sportsService,
    deps.responseHandler,
  );

  return {
    name: "sports",
    service: sportsService,
    controller: sportsController,
  };
}

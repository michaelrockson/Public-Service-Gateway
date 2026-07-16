import { SportsService } from "./sports.service.js";
import { SportsController } from "./sports.controller.js";
import {
  ModuleControllersProvider,
  SharedDependencies,
} from "../../shared/bootstrap/bootstrap.types.js";
import { AxiosHttpClient } from "../../shared/http/clients/axios.client.js";

export function provideSportsController(
  deps: SharedDependencies,
): Extract<ModuleControllersProvider, { name: "sports" }> {
  const currentHttpClient = new AxiosHttpClient(
    deps.moduleConfig.sportsApiUrl,
    deps.moduleConfig.sportsApiKey,
    "",
  );
  const sportsService = new SportsService(
    currentHttpClient,
    deps.moduleConfig.sportsApiKey,
  );
  const sportsController = new SportsController(
    sportsService,
    deps.responseHandler,
  );

  return {
    name: "sports",
    controller: sportsController,
  };
}

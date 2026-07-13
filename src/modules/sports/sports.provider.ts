import { SportsService } from "./sports.service.js";
import { SportsController } from "./sports.controller.js";
import { ModuleResourcesProvider } from "../../shared/utils/config/config.types.js";

export function provideSportsResources(): ModuleResourcesProvider {
  const sportsService = new SportsService();
  const sportsController = new SportsController(sportsService);

  return {
    name: "sports",
    service: sportsService,
    controller: sportsController
  }
}
import { HolidayService } from "./holiday.service.js";
import { HolidayController } from "./holiday.controller.js";
import {
  ModuleResourcesProvider,
  SharedDependencies,
} from "../../shared/boostrap/gateway.types.js";
import { AxiosHttpClient } from "../../shared/http/axios.client.js";

export function provideHolidayResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "holiday" }> {
  const holidayHttpClient = new AxiosHttpClient(
    deps.config.holidayApiUrl,
    "",
    "",
  );
  const holidayService = new HolidayService(holidayHttpClient);
  const holidayController = new HolidayController(
    holidayService,
    deps.responseHandler,
  );

  return {
    name: "holiday",
    service: holidayService,
    controller: holidayController,
  };
}

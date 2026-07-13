import { HolidayService } from "./holiday.service.js";
import { HolidayController } from "./holiday.controller.js";
import { ModuleResourcesProvider } from "../../shared/utils/config/config.types.js";

export function provideHolidayResources(): Extract<ModuleResourcesProvider, { name: "holiday" }> {
  const holidayService = new HolidayService();
  const holidayController = new HolidayController(holidayService);

  return {
    name: "holiday",
    service: holidayService,
    controller: holidayController
  };
}
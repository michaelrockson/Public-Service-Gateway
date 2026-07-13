import { HolidayService } from "./holiday.service.js";
import { HolidayController } from "./holiday.controller.js";
import { ModuleResourcesProvider } from "../../shared/utils/config/config.types.js";

export function provideHolidayResources(): ModuleResourcesProvider {
  const holidayService = new HolidayService();
  const holidayController = new HolidayController(holidayService);

  return {
    name: "Holiday",
    service: holidayService,
    controller: holidayController
  };
}
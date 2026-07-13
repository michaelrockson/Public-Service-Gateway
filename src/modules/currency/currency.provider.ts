import { CurrencyService } from "./currency.service.js";
import { CurrencyController } from "./currency.controller.js";
import { ModuleResourcesProvider } from "../../shared/utils/config/config.types.js";

export function provideCurrencyResources(): ModuleResourcesProvider {
  const currencyService = new CurrencyService();
  const currencyController = new CurrencyController(currencyService);

  return {
    name: "Currency",
    service: currencyService,
    controller: currencyController
  };
}
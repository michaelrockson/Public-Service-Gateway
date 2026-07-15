import { CurrencyService } from "./currency.service.js";
import { CurrencyController } from "./currency.controller.js";
import {
  ModuleResourcesProvider,
  SharedDependencies,
} from "../../shared/boostrap/gateway.types.js";
import { AxiosHttpClient } from "../../shared/http/axios.client.js";

export function provideCurrencyResources(
  deps: SharedDependencies,
): Extract<ModuleResourcesProvider, { name: "currency" }> {
  const currencyHttpClient = new AxiosHttpClient(
    deps.config.currencyApiUrl,
    deps.config.currencyApiKey,
    "access_key",
  );
  const currencyService = new CurrencyService(currencyHttpClient);
  const currencyController = new CurrencyController(
    currencyService,
    deps.responseHandler,
  );

  return {
    name: "currency",
    service: currencyService,
    controller: currencyController,
  };
}

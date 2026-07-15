import { CurrencyService } from "./currency.service.js";
import { CurrencyController } from "./currency.controller.js";
import {
  ModuleControllersProvider,
  SharedDependencies,
} from "../../shared/boostrap/gateway.types.js";
import { AxiosHttpClient } from "../../shared/http/axios.client.js";

export function provideCurrencyController(
  deps: SharedDependencies,
): Extract<ModuleControllersProvider, { name: "currency" }> {
  const currencyHttpClient = new AxiosHttpClient(
    deps.moduleConfig.currencyApiUrl,
    deps.moduleConfig.currencyApiKey,
    "access_key",
  );
  const currencyService = new CurrencyService(currencyHttpClient);
  const currencyController = new CurrencyController(
    currencyService,
    deps.responseHandler,
  );

  return {
    name: "currency",
    controller: currencyController,
  };
}

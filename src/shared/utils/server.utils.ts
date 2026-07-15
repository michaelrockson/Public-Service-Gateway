import { logBootstrapError } from "./logger.utils.js";
import {
  GatewayControllers,
  SharedDependencies,
} from "../config/config.types.js";
import { registerGatewayResources } from "../../modules/resource.registry.js";

export function bootGatewayResources(
  deps: SharedDependencies,
): GatewayControllers {
  try {
    return registerGatewayResources(deps);
  } catch (error) {
    logBootstrapError(
      deps.logger,
      "Booting module services & controllers",
      error,
    );
    throw new Error();
  }
}

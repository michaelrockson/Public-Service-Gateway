import { logBootstrapError } from "./logger.utils.js";
import { unpackResourceControllers } from "./config/config.utils.js";
import { GatewayControllers, SharedDependencies } from "./config/config.types.js";
import { registerGatewayResources } from "../../modules/resource.registry.js";

export function bootGatewayResources(deps: SharedDependencies): GatewayControllers {
  try {
    const registeredResources = registerGatewayResources(deps);
    return unpackResourceControllers(registeredResources);
  } catch (error) {
    logBootstrapError(deps.logger, "Booting module services & controllers", error);
    throw new Error();
  }
}

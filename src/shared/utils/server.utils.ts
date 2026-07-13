import { logBootstrapError } from "./logger.utils.js";
import { unpackResourceControllers } from "./config/config.utils.js";
import { GatewayControllers } from "./config/config.types.js";
import { registerGatewayResources } from "../../modules/resource.registry.js";

export function bootGatewayResources(): GatewayControllers {
  try {
    const registeredResources = registerGatewayResources();
    return unpackResourceControllers(registeredResources);
  } catch (error) {
    logBootstrapError("Booting module services & controllers", error);
    throw new Error();
  }
}

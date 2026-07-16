import express, { type Express } from "express";
import morgan from "morgan";
import { useGatewayRouters } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/bootstrap/secrets/infisical.secrets.js";
import {
  consoleLogger,
  createMorganStream,
  logProcess,
} from "./shared/logger/logger.utils.js";
import { bootGatewayControllers } from "./shared/bootstrap/bootstrap.utils.js";
import { SystemConfig } from "./shared/bootstrap/configs/system.config.js";
import { ModuleConfig } from "./shared/bootstrap/configs/module.config.js";
import { WinstonLogger } from "./shared/logger/winston.logger.js";
import { ControllerResponseHandler } from "./shared/http/handlers/response.handler.js";
import { SharedDependencies } from "./shared/bootstrap/bootstrap.types.js";

async function startServer(): Promise<void> {
  const serverSecrets = await injectSecretsFromInfisical();

  const systemConfig = new SystemConfig(serverSecrets.systemConfig);
  const moduleConfig = new ModuleConfig(serverSecrets.moduleConfig);
  const logger = new WinstonLogger(systemConfig);
  const responseHandler = new ControllerResponseHandler(
    systemConfig.environment,
  );

  const sharedDependencies: SharedDependencies = {
    systemConfig,
    moduleConfig,
    logger,
    responseHandler,
  };

  const controllers = bootGatewayControllers(sharedDependencies);

  const server: Express = express();

  const port: number = Number(systemConfig.port) || 3000;
  const environment: string = systemConfig.environment ?? "dev";
  const gatewayRouter = useGatewayRouters(controllers);

  server.use(morgan("combined", { stream: createMorganStream(logger) }));
  server.use(express.json());
  server.use("/v1", gatewayRouter);

  server.listen(port, (): void => {
    logProcess(logger, `Server running on ${port}`);
    logProcess(logger, `Server environment: ${environment}`);
  });
}

await startServer().catch((error) => {
  consoleLogger.error(`Error starting Server: ${error}`);
});

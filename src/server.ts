import express, { type Express } from "express";
import morgan from "morgan";
import { createGatewayRouter } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/boostrap/infisical.config.js";
import {
  createMorganStream,
  logProcess,
  consoleLogger,
} from "./shared/logger/logger.utils.js";
import { bootGatewayControllers } from "./shared/boostrap/bootstrap.utils.js";
import { ServerConfigService } from "./shared/boostrap/server.config.service.js";
import { ModuleConfigService } from "./shared/boostrap/module.config.service.js";
import { WinstonLogger } from "./shared/logger/winston.logger.js";
import { ControllerResponseHandler } from "./shared/http/response.handler.js";
import { SharedDependencies } from "./shared/boostrap/gateway.types.js";

async function startServer(): Promise<void> {
  const serverSecrets = await injectSecretsFromInfisical();

  const systemConfig = new ServerConfigService(serverSecrets.systemConfig);
  const moduleConfig = new ModuleConfigService(serverSecrets.moduleConfig);
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
  const gatewayRouter = createGatewayRouter(controllers);

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

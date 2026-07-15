import express, { type Express } from "express";
import morgan from "morgan";
import { createGatewayRouter } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/services/infisical.service.js";
import {
  createMorganStream,
  logProcess,
  consoleLogger,
} from "./shared/utils/logger.utils.js";
import { bootGatewayResources } from "./shared/utils/server.utils.js";
import { ConfigService } from "./shared/config/env.config.js";
import { WinstonLogger } from "./shared/logger/server.logger.js";
import { ControllerResponseHandler } from "./shared/http/http.controller.js";
import { SharedDependencies } from "./shared/config/config.types.js";

async function startServer(): Promise<void> {
  const serverSecrets = await injectSecretsFromInfisical();

  const config = new ConfigService(serverSecrets);
  const logger = new WinstonLogger(config);
  const responseHandler = new ControllerResponseHandler(config.environment);

  const sharedDependencies: SharedDependencies = {
    config,
    logger,
    responseHandler,
  };

  const controllers = bootGatewayResources(sharedDependencies);

  const server: Express = express();

  const port: number = Number(config.port) || 3000;
  const environment: string = config.environment ?? "dev";
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
